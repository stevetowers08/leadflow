import { test, expect } from '@playwright/test';

test('homepage loads', async ({ page }) => {
  await page.goto('/');
  
  // Wait for page to load
  await page.waitForLoadState('networkidle');
  
  // Check for console errors
  const errors: string[] = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  
  // Take screenshot for debugging
  await page.screenshot({ path: 'tests/e2e/screenshots/homepage.png' });
  
  // Assert no console errors
  expect(errors).toHaveLength(0);
});


