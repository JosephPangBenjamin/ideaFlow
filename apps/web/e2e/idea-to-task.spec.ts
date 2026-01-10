import { test, expect } from '@playwright/test';

test.describe('Idea to Task Conversion', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication by setting localStorage
    // In a real scenario, we might go through the login page or use an auth fixture.
    // For this test, we assume we can set the token directly or mock the auth state if needed.
    // However, since we don't have a backend running in this isolated environment (or do we?),
    // we should rely on the actual app running.

    // Assuming the dev server is running with the text backend.

    // First, go to the page to set local storage context
    await page.goto('/');

    // We might need to login first if the app is protected.
    // For now, let's try to simulate a logged-in state or just login.
    // Ideally we'd use a shared auth state, but I'll write a quick login flow.
    await page.goto('/login');
    await page.fill('input[placeholder="用户名"]', 'testuser');
    await page.fill('input[placeholder="密码"]', 'password123'); // Assuming test creds
    await page.click('button:has-text("登录")');
    await page.waitForURL('/');
  });

  test('should convert an idea to a task', async ({ page }) => {
    // 1. Create a new Idea
    await page.goto('/ideas');
    await page.click('button:has-text("记录想法")'); // Assuming there's a button to create idea or efficient input
    // The "Easy Input" might be a text area on the dashboard or ideas page.
    // Let's assume there's a quick input on the Ideas page or Dashboard.

    // Adjusting based on standard UI for this project:
    // If there is an input area at the top "有什么新想法..."
    const ideaContent = `E2E Test Idea ${Date.now()}`;
    await page.fill('textarea[placeholder*="输入想法"]', ideaContent);
    await page.keyboard.press('Control+Enter'); // Or click save

    // Wait for the idea to appear
    await expect(page.getByText(ideaContent)).toBeVisible();

    // 2. Open Idea Detail
    await page.getByText(ideaContent).click();

    // 3. Click "Convert to Task"
    await page.getByRole('button', { name: '转为任务' }).click();

    // 4. Fill Task Modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByDisplayValue(ideaContent)).toBeVisible(); // Title should be pre-filled

    const taskTitle = `Task from ${ideaContent}`;
    await page.fill('input[placeholder="输入任务标题..."]', taskTitle);
    await page.click('button:has-text("创建任务")');

    // 5. Verify Success and Navigation
    await expect(page.getByText('任务创建成功')).toBeVisible();

    // Should navigate to task detail
    await expect(page).toHaveURL(/\/tasks\//);
    await expect(page.getByText(taskTitle)).toBeVisible();

    // 6. Verify Back Link
    await expect(page.getByText('查看来源想法')).toBeVisible(); // Assuming there's a link/button

    // 7. Verify Badge on Idea
    await page.goto('/ideas');
    await page.getByText(ideaContent).click(); // Open detail again
    await expect(page.getByText('已转任务')).toBeVisible();
  });
});
