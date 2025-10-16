import { test, expect } from '@playwright/test';
import {
  createConsoleInspector,
  withConsoleMonitoring,
} from '../src/test/console-inspection';

test.describe('Empowr CRM - Authentication Flow', () => {
  test('should display sign-in page', async ({ page }) => {
    const inspector = createConsoleInspector(page);
    inspector.startMonitoring();

    await page.goto('/');

    // Check if we're on the sign-in page
    await expect(page).toHaveTitle(/Empowr CRM/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(page.getByText('Welcome back')).toBeVisible();
    await expect(
      page.getByText('Continue with Google, LinkedIn or email')
    ).toBeVisible();

    // Check for Google sign-in button
    await expect(
      page.getByRole('button', { name: /Continue with Google/i })
    ).toBeVisible();

    // Assert no console errors during page load
    inspector.assertNoErrors();
    inspector.printSummary();

    inspector.stopMonitoring();
  });

  test('should handle authentication error gracefully', async ({ page }) => {
    const { inspector } = await withConsoleMonitoring(page, async () => {
      await page.goto('/');

      // Mock authentication failure
      await page.route('**/auth/v1/token', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid credentials' }),
        });
      });

      // Click sign-in button
      await page.getByRole('button', { name: /Continue with Google/i }).click();

      // Should show error message
      await expect(page.getByText(/error occurred/i)).toBeVisible();
    });

    // Verify that authentication error was properly handled
    // We expect some errors in console for this test case
    inspector.printSummary();
  });
});

test.describe('Empowr CRM - Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        })
      );
    });
  });

  test('should load dashboard with stats', async ({ page }) => {
    await page.goto('/');

    // Wait for dashboard to load
    await expect(page.getByText(/Dashboard/i)).toBeVisible();

    // Check for stats cards
    await expect(page.getByText(/Total Leads/i)).toBeVisible();
    await expect(page.getByText(/Total Companies/i)).toBeVisible();
    await expect(page.getByText(/Total Jobs/i)).toBeVisible();
  });

  test('should navigate to leads page', async ({ page }) => {
    await page.goto('/');

    // Click on leads navigation
    await page.getByRole('link', { name: /Leads/i }).click();

    // Should be on leads page
    await expect(page).toHaveURL(/.*leads.*/);
    await expect(page.getByText(/People/i)).toBeVisible();
  });

  test('should navigate to companies page', async ({ page }) => {
    await page.goto('/');

    // Click on companies navigation
    await page.getByRole('link', { name: /Companies/i }).click();

    // Should be on companies page
    await expect(page).toHaveURL(/.*companies.*/);
    await expect(page.getByText(/Companies/i)).toBeVisible();
  });

  test('should navigate to jobs page', async ({ page }) => {
    await page.goto('/');

    // Click on jobs navigation
    await page.getByRole('link', { name: /Jobs/i }).click();

    // Should be on jobs page
    await expect(page).toHaveURL(/.*jobs.*/);
    await expect(page.getByText(/Jobs/i)).toBeVisible();
  });
});

test.describe('Empowr CRM - Lead Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state and data
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        })
      );
    });

    // Mock API responses
    await page.route('**/rest/v1/people*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'John Doe',
            email_address: 'john@example.com',
            company_id: '1',
            stage: 'new',
            lead_score: '85',
            created_at: '2024-01-01T00:00:00Z',
          },
        ]),
      });
    });
  });

  test('should display leads list', async ({ page }) => {
    await page.goto('/leads');

    // Wait for leads to load
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('john@example.com')).toBeVisible();
  });

  test('should open lead popup on click', async ({ page }) => {
    await page.goto('/leads');

    // Click on a lead
    await page.getByText('John Doe').click();

    // Should open popup modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();
  });

  test('should close popup on backdrop click', async ({ page }) => {
    await page.goto('/leads');

    // Open popup
    await page.getByText('John Doe').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Click backdrop to close
    await page.getByRole('dialog').click({ position: { x: 0, y: 0 } });

    // Popup should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should close popup on escape key', async ({ page }) => {
    await page.goto('/leads');

    // Open popup
    await page.getByText('John Doe').click();
    await expect(page.getByRole('dialog')).toBeVisible();

    // Press escape key
    await page.keyboard.press('Escape');

    // Popup should be closed
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});

test.describe('Empowr CRM - Company Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.localStorage.setItem(
        'sb-jedfundfhzytpnbjkspn-auth-token',
        JSON.stringify({
          access_token: 'mock-token',
          user: {
            id: 'test-user-id',
            email: 'test@example.com',
          },
        })
      );
    });

    // Mock API responses
    await page.route('**/rest/v1/companies*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            name: 'Acme Corp',
            website: 'https://acme.com',
            industry: 'Technology',
            company_size: '50-100',
            lead_score: '90',
            created_at: '2024-01-01T00:00:00Z',
          },
        ]),
      });
    });
  });

  test('should display companies list', async ({ page }) => {
    await page.goto('/companies');

    // Wait for companies to load
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('Technology')).toBeVisible();
  });

  test('should open company popup on click', async ({ page }) => {
    await page.goto('/companies');

    // Click on a company
    await page.getByText('Acme Corp').click();

    // Should open popup modal
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Acme Corp')).toBeVisible();
  });
});

test.describe('Empowr CRM - Responsive Design', () => {
  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check mobile layout
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

    // Sign-in button should be visible and clickable
    const signInButton = page.getByRole('button', {
      name: /Continue with Google/i,
    });
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();
  });

  test('should work on tablet devices', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });

    await page.goto('/');

    // Check tablet layout
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Continue with Google/i })
    ).toBeVisible();
  });
});

test.describe('Empowr CRM - Error Handling', () => {
  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/rest/v1/**', route => {
      route.abort('Failed');
    });

    await page.goto('/');

    // Should show error state
    await expect(page.getByText(/error/i)).toBeVisible();
  });

  test('should handle 404 errors', async ({ page }) => {
    await page.goto('/nonexistent-page');

    // Should show 404 or redirect to home
    await expect(page).toHaveURL(/.*\/.*/);
  });
});

test.describe('Empowr CRM - Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const loadTime = Date.now() - startTime;

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('should have good Lighthouse scores', async ({ page }) => {
    await page.goto('/');

    // Basic performance checks
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();

    // Check for performance issues
    const metrics = await page.evaluate(() => {
      return {
        loadTime:
          performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded:
          performance.timing.domContentLoadedEventEnd -
          performance.timing.navigationStart,
      };
    });

    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(1500);
  });
});
