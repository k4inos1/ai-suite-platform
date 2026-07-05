import { test, expect } from '@playwright/test';

test.describe('AI Agent Sandbox - AI Suite Platform', () => {
  test('Should verify the frontend and backend connectivity', async ({ page, request }) => {
    // Sandbox test for AI agents to interact with the platform
    // Frontend check
    await page.goto('http://localhost:3000/');
    
    // Backend check
    const health = await request.get('http://localhost:3000/api/health');
    expect(health.ok()).toBeTruthy();
  });
});
