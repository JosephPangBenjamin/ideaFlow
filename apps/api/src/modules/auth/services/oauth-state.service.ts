import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { OAuthConfigService } from './oauth-config.service';
import Redis from 'ioredis';

/**
 * OAuth State 存储数据结构
 */
interface OAuthStateData {
  provider: 'wechat' | 'google';
  timestamp: number;
  userId?: string; // 用于绑定场景，存储发起绑定的用户ID
}

/**
 * OAuth State 服务
 * 使用 Redis 存储和验证 OAuth state 参数，防止 CSRF 攻击
 *
 * State 格式: uuid:timestamp
 * Redis Key 格式: oauth:state:{state}
 * TTL: 600秒 (10分钟)
 */
@Injectable()
export class OAuthStateService implements OnModuleDestroy {
  private redis: Redis | null = null;
  private readonly STATE_TTL = 600; // 10分钟过期
  private readonly KEY_PREFIX = 'oauth:state:';

  constructor(private readonly oauthConfigService: OAuthConfigService) {
    this.initRedis();
  }

  /**
   * 初始化 Redis 连接
   */
  private initRedis(): void {
    try {
      const config = this.oauthConfigService.getRedisConfig();
      this.redis = new Redis({
        host: config.host,
        port: config.port,
        password: config.password,
        // 连接失败时不自动重试，避免阻塞应用启动
        retryStrategy: (times: number) => {
          if (times > 3) {
            console.warn('Redis连接失败，OAuth state验证将被跳过');
            return null; // 停止重试
          }
          return Math.min(times * 100, 3000);
        },
        // 启用离线队列，在连接恢复后执行
        enableOfflineQueue: true,
        // 连接超时
        connectTimeout: 5000,
      });

      this.redis.on('error', (err) => {
        console.error('Redis连接错误:', err.message);
      });

      this.redis.on('connect', () => {
        console.log('Redis连接成功');
      });
    } catch (error) {
      console.warn('Redis初始化失败，OAuth state验证将被跳过:', error);
      this.redis = null;
    }
  }

  /**
   * 检查 Redis 是否可用
   */
  isAvailable(): boolean {
    return this.redis !== null && this.redis.status === 'ready';
  }

  /**
   * 存储 OAuth state 到 Redis
   * @param state state 参数值
   * @param provider OAuth 提供商
   * @param userId 可选的用户ID，用于绑定场景
   * @returns 是否存储成功
   */
  async storeState(
    state: string,
    provider: 'wechat' | 'google',
    userId?: string
  ): Promise<boolean> {
    if (!this.redis) {
      console.warn('Redis不可用，跳过state存储');
      return false;
    }

    try {
      const key = `${this.KEY_PREFIX}${state}`;
      const data: OAuthStateData = {
        provider,
        timestamp: Date.now(),
        userId,
      };

      await this.redis.setex(key, this.STATE_TTL, JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('存储OAuth state失败:', error);
      return false;
    }
  }

  /**
   * 验证并消费 OAuth state
   * 验证成功后立即删除，防止重放攻击
   *
   * @param state state 参数值
   * @param expectedProvider 期望的 OAuth 提供商
   * @returns 验证结果: { valid: boolean, error?: string, userId?: string }
   */
  async validateAndConsumeState(
    state: string,
    expectedProvider: 'wechat' | 'google'
  ): Promise<{ valid: boolean; error?: string; userId?: string }> {
    if (!this.isAvailable()) {
      // Redis 不可用时，拒绝 OAuth 请求（安全优先）
      return { valid: false, error: 'OAuth服务不可用，请稍后重试' };
    }

    if (!state) {
      return { valid: false, error: 'state参数缺失' };
    }

    try {
      const key = `${this.KEY_PREFIX}${state}`;

      // 使用原子操作获取并删除（防止重放攻击）
      // Redis 6.2+ 支持 getdel()，低版本使用事务
      const dataStr = (await this.redis!.getdel?.(key)) || (await this.getAndDel(key));

      if (!dataStr) {
        return { valid: false, error: 'state不存在或已过期' };
      }

      // 解析并验证数据
      const data: OAuthStateData = JSON.parse(dataStr);

      // 验证 provider 匹配
      if (data.provider !== expectedProvider) {
        return {
          valid: false,
          error: `provider不匹配: 期望${expectedProvider}，实际${data.provider}`,
        };
      }

      // 验证时间戳（双重检查，虽然 Redis TTL 已经处理了过期）
      const elapsed = Date.now() - data.timestamp;
      if (elapsed > this.STATE_TTL * 1000) {
        return { valid: false, error: 'state已过期' };
      }

      return { valid: true, userId: data.userId };
    } catch (error) {
      console.error('验证OAuth state失败:', error);
      // 验证失败时返回错误，而不是静默通过
      return { valid: false, error: 'state验证失败' };
    }
  }

  /**
   * 清理过期的 state（可选，Redis TTL 会自动处理）
   * 用于手动清理或测试
   */
  async cleanup(): Promise<number> {
    if (!this.redis) {
      return 0;
    }

    try {
      // 获取所有 oauth:state:* 键
      const keys = await this.redis.keys(`${this.KEY_PREFIX}*`);
      if (keys.length === 0) {
        return 0;
      }

      // 删除所有键
      const deleted = await this.redis.del(...keys);
      return deleted;
    } catch (error) {
      console.error('清理OAuth state失败:', error);
      return 0;
    }
  }

  /**
   * 模块销毁时关闭 Redis 连接
   */
  async onModuleDestroy(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }

  /**
   * 兼容低版本 Redis 的原子获取并删除操作
   * 使用 MULTI/EXEC 事务保证原子性
   */
  private async getAndDel(key: string): Promise<string | null> {
    if (!this.redis) {
      return null;
    }

    // 使用事务保证原子性
    const multi = this.redis.multi();
    multi.get(key);
    multi.del(key);
    const results = await multi.exec();

    if (!results || results[0][0] || results[1][0]) {
      // 事务执行失败
      return null;
    }

    return results[0][1] as string | null;
  }
}
