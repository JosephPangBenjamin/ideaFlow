import { Test, TestingModule } from '@nestjs/testing';
import { OAuthStateService } from './oauth-state.service';
import { OAuthConfigService } from './oauth-config.service';

// 创建mock Redis实例
const mockRedisInstance = {
  status: 'ready',
  setex: jest.fn().mockResolvedValue('OK'),
  get: jest.fn(),
  getdel: jest.fn(), // Redis 6.2+ 原子操作
  del: jest.fn().mockResolvedValue(1),
  keys: jest.fn().mockResolvedValue([]),
  quit: jest.fn().mockResolvedValue('OK'),
  on: jest.fn(),
  multi: jest.fn().mockReturnThis(),
  exec: jest.fn(),
};

// Mock ioredis - 支持 default 和直接导入两种方式
jest.mock('ioredis', () => {
  const MockRedis = jest.fn().mockImplementation(() => mockRedisInstance);
  return {
    __esModule: true,
    default: MockRedis,
  };
});

describe('OAuthStateService', () => {
  let service: OAuthStateService;

  const mockRedisConfig = {
    host: 'localhost',
    port: 6379,
    password: undefined,
  };

  beforeEach(async () => {
    // 重置所有mock
    jest.clearAllMocks();
    mockRedisInstance.get.mockReset();
    mockRedisInstance.getdel.mockReset();
    mockRedisInstance.del.mockReset().mockResolvedValue(1);
    mockRedisInstance.setex.mockReset().mockResolvedValue('OK');
    mockRedisInstance.keys.mockReset().mockResolvedValue([]);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuthStateService,
        {
          provide: OAuthConfigService,
          useValue: {
            getRedisConfig: jest.fn().mockReturnValue(mockRedisConfig),
          },
        },
      ],
    }).compile();

    service = module.get<OAuthStateService>(OAuthStateService);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('isAvailable', () => {
    it('Redis连接就绪时应该返回true', () => {
      mockRedisInstance.status = 'ready';
      expect(service.isAvailable()).toBe(true);
    });
  });

  describe('storeState', () => {
    it('应该成功存储state到Redis', async () => {
      const state = 'test-uuid-123:1234567890';
      const provider = 'google';

      const result = await service.storeState(state, provider);

      expect(result).toBe(true);
      expect(mockRedisInstance.setex).toHaveBeenCalledWith(
        `oauth:state:${state}`,
        600, // TTL 10分钟
        expect.stringContaining('"provider":"google"')
      );
    });

    it('应该存储正确的数据结构', async () => {
      const state = 'test-state';
      const provider = 'wechat';

      await service.storeState(state, provider);

      const callArgs = mockRedisInstance.setex.mock.calls[0];
      const storedData = JSON.parse(callArgs[2]);

      expect(storedData.provider).toBe('wechat');
      expect(storedData.timestamp).toBeDefined();
      expect(typeof storedData.timestamp).toBe('number');
    });

    it('应该支持存储userId用于绑定场景', async () => {
      const state = 'binding-state';
      const provider = 'google';
      const userId = 'user-123';

      const result = await service.storeState(state, provider, userId);

      expect(result).toBe(true);
      const callArgs = mockRedisInstance.setex.mock.calls[0];
      const storedData = JSON.parse(callArgs[2]);

      expect(storedData.provider).toBe('google');
      expect(storedData.userId).toBe(userId);
      expect(storedData.timestamp).toBeDefined();
    });
  });

  describe('validateAndConsumeState', () => {
    it('应该成功验证有效的state', async () => {
      const state = 'valid-state';
      const provider = 'google';
      const storedData = JSON.stringify({
        provider: 'google',
        timestamp: Date.now(),
      });

      mockRedisInstance.getdel.mockResolvedValueOnce(storedData);

      const result = await service.validateAndConsumeState(state, provider);

      expect(result.valid).toBe(true);
      expect(result.error).toBeUndefined();
      // 验证后应该使用 getdel 原子操作
      expect(mockRedisInstance.getdel).toHaveBeenCalledWith(`oauth:state:${state}`);
    });

    it('state不存在时应该返回错误', async () => {
      mockRedisInstance.getdel.mockResolvedValueOnce(null);

      const result = await service.validateAndConsumeState('non-existent-state', 'google');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('不存在或已过期');
    });

    it('state参数缺失时应该返回错误', async () => {
      const result = await service.validateAndConsumeState('', 'google');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('参数缺失');
    });

    it('provider不匹配时应该返回错误', async () => {
      const storedData = JSON.stringify({
        provider: 'wechat',
        timestamp: Date.now(),
      });

      mockRedisInstance.getdel.mockResolvedValueOnce(storedData);

      const result = await service.validateAndConsumeState('some-state', 'google');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('provider不匹配');
    });

    it('验证成功后应该立即删除state防止重放攻击', async () => {
      const state = 'one-time-state';
      const storedData = JSON.stringify({
        provider: 'google',
        timestamp: Date.now(),
      });

      mockRedisInstance.getdel.mockResolvedValueOnce(storedData);

      await service.validateAndConsumeState(state, 'google');

      // 验证 getdel 被调用（原子操作）
      expect(mockRedisInstance.getdel).toHaveBeenCalledWith(`oauth:state:${state}`);
      expect(mockRedisInstance.getdel).toHaveBeenCalledTimes(1);
    });

    it('验证成功时应该返回userId（绑定场景）', async () => {
      const state = 'binding-state';
      const userId = 'user-123';
      const storedData = JSON.stringify({
        provider: 'google',
        timestamp: Date.now(),
        userId: userId,
      });

      mockRedisInstance.getdel.mockResolvedValueOnce(storedData);

      const result = await service.validateAndConsumeState(state, 'google');

      expect(result.valid).toBe(true);
      expect(result.userId).toBe(userId);
      expect(result.error).toBeUndefined();
    });

    it('Redis不可用应该返回服务不可用错误', async () => {
      // 模拟Redis不可用
      mockRedisInstance.status = 'end';

      const result = await service.validateAndConsumeState('test-state', 'google');

      expect(result.valid).toBe(false);
      expect(result.error).toContain('OAuth服务不可用');

      // 恢复Redis状态
      mockRedisInstance.status = 'ready';
    });
  });

  describe('cleanup', () => {
    it('应该删除所有oauth:state:*键', async () => {
      const mockKeys = ['oauth:state:state1', 'oauth:state:state2', 'oauth:state:state3'];
      mockRedisInstance.keys.mockResolvedValueOnce(mockKeys);
      mockRedisInstance.del.mockResolvedValueOnce(3);

      const deleted = await service.cleanup();

      expect(deleted).toBe(3);
      expect(mockRedisInstance.keys).toHaveBeenCalledWith('oauth:state:*');
      expect(mockRedisInstance.del).toHaveBeenCalledWith(...mockKeys);
    });

    it('没有键时应该返回0', async () => {
      mockRedisInstance.keys.mockResolvedValueOnce([]);

      const deleted = await service.cleanup();

      expect(deleted).toBe(0);
    });
  });

  describe('onModuleDestroy', () => {
    it('应该关闭Redis连接', async () => {
      await service.onModuleDestroy();

      expect(mockRedisInstance.quit).toHaveBeenCalled();
    });
  });
});
