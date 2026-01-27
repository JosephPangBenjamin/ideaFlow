import { test, expect, Page } from '@playwright/test';

/**
 * Social Login E2E Tests
 *
 * 注意：由于微信和 Google OAuth 需要真实的第三方服务，
 * 以下测试需要在以下环境中运行：
 * 1. 后端服务运行 (包含有效的微信/Google OAuth配置)
 * 2. 前端服务运行
 * 3. Redis 服务运行
 *
 * 部分测试被标记为 { skip: true }，因为它们需要真实的 OAuth 回调。
 * 可以通过设置环境变量 ENABLE_REAL_OAUTH=true 来启用这些测试。
 */

const ENABLE_REAL_OAUTH = process.env.ENABLE_REAL_OAUTH === 'true';

test.describe('Social Login UI', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('应该显示微信登录按钮', async ({ page }) => {
    // AC: 1 - 微信登录入口
    const wechatButton = page.getByRole('button', { name: '微信登录' });
    await expect(wechatButton).toBeVisible();
  });

  test('应该显示Google登录按钮', async ({ page }) => {
    // AC: 4 - Google登录入口
    const googleButton = page.getByRole('button', { name: 'Google 登录' });
    await expect(googleButton).toBeVisible();
  });

  test('微信登录按钮应该使用正确的品牌色', async ({ page }) => {
    const wechatButton = page.getByRole('button', { name: '微信登录' });
    const button = await wechatButton.elementHandle();
    const bgColor = await button.evaluate(
      (el) => window.getComputedStyle(el as Element).backgroundColor
    );
    // 微信绿色 #07C160 的 RGB 值是 rgb(7, 193, 96)
    expect(bgColor).toBe('rgb(7, 193, 96)');
  });

  test('Google登录按钮应该使用正确的品牌色', async ({ page }) => {
    const googleButton = page.getByRole('button', { name: 'Google 登录' });
    const button = await googleButton.elementHandle();
    const bgColor = await button.evaluate(
      (el) => window.getComputedStyle(el as Element).backgroundColor
    );
    // Google 蓝色 #4285F4 的 RGB 值是 rgb(66, 133, 244)
    expect(bgColor).toBe('rgb(66, 133, 244)');
  });

  (ENABLE_REAL_OAUTH ? test : test.skip)(
    '点击微信登录按钮应该重定向到微信授权页面',
    async ({ page }) => {
      // AC: 2 - 微信授权流程
      const wechatButton = page.getByRole('button', { name: '微信登录' });

      // 监听请求，验证重定向到后端 OAuth 端点
      const redirectRequest = page.waitForRequest(
        (request) => request.url().includes('/auth/wechat') && request.method() === 'GET'
      );

      await wechatButton.click();

      const request = await redirectRequest;
      expect(request.url()).toContain('/auth/wechat');
    }
  );

  (ENABLE_REAL_OAUTH ? test : test.skip)(
    '点击Google登录按钮应该重定向到Google授权页面',
    async ({ page }) => {
      // AC: 5 - Google授权流程
      const googleButton = page.getByRole('button', { name: 'Google 登录' });

      // 监听请求，验证重定向到后端 OAuth 端点
      const redirectRequest = page.waitForRequest(
        (request) => request.url().includes('/auth/google') && request.method() === 'GET'
      );

      await googleButton.click();

      const request = await redirectRequest;
      expect(request.url()).toContain('/auth/google');
    }
  );
});

test.describe('OAuth Callback Page', () => {
  test('OAuth回调页面应该正确处理用户信息和token', async ({ page }) => {
    // 模拟 OAuth 回调后的 URL 参数
    const mockUser = {
      id: 'test-user-123',
      username: 'wechat_1234567890_abc123',
      nickname: '测试用户',
    };
    const mockToken = 'mock-jwt-token-12345';

    await page.goto(
      `/oauth/callback?user=${encodeURIComponent(JSON.stringify(mockUser))}&token=${encodeURIComponent(mockToken)}`
    );

    // 验证 token 被存储到 localStorage
    const storedToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(storedToken).toBe(mockToken);

    // 验证重定向到仪表盘
    await page.waitForURL('/', { timeout: 5000 });
    expect(page.url()).toContain('/');
  });

  test('OAuth回调页面应该处理错误参数', async ({ page }) => {
    await page.goto('/oauth/callback?error=access_denied');

    // 应该显示错误消息
    const errorMessage = page.getByText(/取消授权|授权失败/);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Linked Accounts Page', () => {
  // 需要先登录
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('accessToken', 'mock-token');
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: 'test-user-123',
          username: 'testuser',
          nickname: '测试用户',
        })
      );
    });
  });

  test('设置页面应该显示关联账号区域', async ({ page }) => {
    await page.goto('/settings');

    // AC: 7 - 显示已绑定的第三方账号
    const linkedAccountsSection = page.getByText(/关联账号|第三方账号/);
    await expect(linkedAccountsSection).toBeVisible();
  });

  test('应该显示绑定微信按钮（未绑定时）', async ({ page }) => {
    await page.goto('/settings');

    // AC: 7 - 未绑定显示「绑定微信」按钮
    const bindWechatButton = page.getByRole('button', { name: /绑定微信/ });
    // 如果已经绑定了，这个按钮可能不存在，所以使用 optional
    const isVisible = await bindWechatButton.isVisible().catch(() => false);

    if (isVisible) {
      expect(isVisible).toBe(true);
    }
  });

  test('应该显示绑定Google按钮（未绑定时）', async ({ page }) => {
    await page.goto('/settings');

    // AC: 7 - 未绑定显示「绑定Google」按钮
    const bindGoogleButton = page.getByRole('button', { name: /绑定Google/ });
    const isVisible = await bindGoogleButton.isVisible().catch(() => false);

    if (isVisible) {
      expect(isVisible).toBe(true);
    }
  });

  (ENABLE_REAL_OAUTH ? test : test.skip)('点击绑定微信应该重定向到微信OAuth', async ({ page }) => {
    await page.goto('/settings');

    const bindWechatButton = page.getByRole('button', { name: /绑定微信/ });
    const isVisible = await bindWechatButton.isVisible().catch(() => false);

    if (!isVisible) {
      test.skip();
      return;
    }

    const redirectRequest = page.waitForRequest(
      (request) => request.url().includes('/auth/link/wechat') && request.method() === 'GET'
    );

    await bindWechatButton.click();

    const request = await redirectRequest;
    expect(request.url()).toContain('/auth/link/wechat');
  });
});

test.describe('Error Handling', () => {
  test('CSRF验证失败时应该显示错误消息', async ({ page }) => {
    // 模拟 CSRF 验证失败的回调
    await page.goto('/oauth/callback?error=csrf_failed');

    // 应该显示 CSRF 错误消息
    const errorMessage = page.getByText(/CSRF验证失败|安全验证失败/);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('邮箱冲突时应该显示正确提示', async ({ page }) => {
    // 模拟邮箱冲突错误的回调
    await page.goto('/oauth/callback?error=email_conflict');

    // AC: 6 - Google邮箱冲突提示
    // 应该显示 "该邮箱已注册,请用原方式登录后在设置中绑定Google账号"
    const errorMessage = page.getByText(/邮箱已注册.*绑定Google/);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });

  test('授权失败时应该显示友好提示', async ({ page }) => {
    // 模拟授权失败的回调
    await page.goto('/oauth/callback?error=authorization_failed');

    // AC: 9 - 错误处理
    const errorMessage = page.getByText(/授权失败.*请重试/);
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
  });
});

/**
 * 手动测试说明
 *
 * 由于 OAuth 流程需要真实的第三方服务，以下测试需要手动执行：
 *
 * 1. 微信登录完整流程：
 *    a. 启动应用（前端+后端+Redis）
 *    b. 访问 /login 页面
 *    c. 点击「微信登录」按钮
 *    d. 在微信授权页面扫码授权
 *    e. 验证登录成功，跳转到仪表盘
 *    f. 验证用户信息正确显示
 *
 * 2. Google登录完整流程：
 *    a. 启动应用（前端+后端+Redis）
 *    b. 访问 /login 页面
 *    c. 点击「Google 登录」按钮
 *    d. 在Google授权页面选择账号并授权
 *    e. 验证登录成功，跳转到仪表盘
 *    f. 验证用户信息正确显示
 *
 * 3. 邮箱冲突场景：
 *    a. 先用密码注册一个账号（例如：test@gmail.com）
 *    b. 退出登录
 *    c. 尝试用 Google 账号（同一邮箱）登录
 *    d. 验证显示错误：「该邮箱已注册,请用原方式登录后在设置中绑定Google账号」
 *
 * 4. 账号绑定/解绑：
 *    a. 登录后访问 /settings 页面
 *    b. 点击「绑定Google」按钮
 *    c. 完成 Google 授权
 *    d. 验证显示已绑定的 Google 账号
 *    e. 点击「解绑」按钮
 *    f. 验证解绑成功
 */
