import { test, expect } from '@playwright/test';

test.describe('Empowr CRM - User Journey Tests', () => {
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

    // Mock API responses for complete user journey
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
          {
            id: '2',
            name: 'Jane Smith',
            email_address: 'jane@example.com',
            company_id: '2',
            stage: 'messaged',
            lead_score: '92',
            created_at: '2024-01-02T00:00:00Z',
          },
        ]),
      });
    });

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
          {
            id: '2',
            name: 'TechStart Inc',
            website: 'https://techstart.com',
            industry: 'Software',
            company_size: '10-50',
            lead_score: '88',
            created_at: '2024-01-02T00:00:00Z',
          },
        ]),
      });
    });

    await page.route('**/rest/v1/jobs*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            title: 'Senior Developer',
            company_id: '1',
            location: 'San Francisco, CA',
            salary_min: 120000,
            salary_max: 150000,
            description: 'Looking for a senior developer...',
            created_at: '2024-01-01T00:00:00Z',
          },
          {
            id: '2',
            title: 'Product Manager',
            company_id: '2',
            location: 'New York, NY',
            salary_min: 100000,
            salary_max: 130000,
            description: 'Seeking a product manager...',
            created_at: '2024-01-02T00:00:00Z',
          },
        ]),
      });
    });
  });

  test('complete lead management workflow', async ({ page }) => {
    // Start from dashboard
    await page.goto('/');
    await expect(page.getByText(/Dashboard/i)).toBeVisible();

    // Navigate to leads
    await page.getByRole('link', { name: /Leads/i }).click();
    await expect(page).toHaveURL(/.*leads.*/);

    // View leads list
    await expect(page.getByText('John Doe')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();

    // Open first lead popup
    await page.getByText('John Doe').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('John Doe')).toBeVisible();

    // Close popup
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();

    // Open second lead popup
    await page.getByText('Jane Smith').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Jane Smith')).toBeVisible();

    // Close popup by clicking backdrop
    await page.getByRole('dialog').click({ position: { x: 0, y: 0 } });
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('complete company management workflow', async ({ page }) => {
    // Start from dashboard
    await page.goto('/');
    await expect(page.getByText(/Dashboard/i)).toBeVisible();

    // Navigate to companies
    await page.getByRole('link', { name: /Companies/i }).click();
    await expect(page).toHaveURL(/.*companies.*/);

    // View companies list
    await expect(page.getByText('Acme Corp')).toBeVisible();
    await expect(page.getByText('TechStart Inc')).toBeVisible();

    // Open company popup
    await page.getByText('Acme Corp').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Acme Corp')).toBeVisible();

    // Close popup
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('complete job management workflow', async ({ page }) => {
    // Start from dashboard
    await page.goto('/');
    await expect(page.getByText(/Dashboard/i)).toBeVisible();

    // Navigate to jobs
    await page.getByRole('link', { name: /Jobs/i }).click();
    await expect(page).toHaveURL(/.*jobs.*/);

    // View jobs list
    await expect(page.getByText('Senior Developer')).toBeVisible();
    await expect(page.getByText('Product Manager')).toBeVisible();

    // Open job popup
    await page.getByText('Senior Developer').click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByText('Senior Developer')).toBeVisible();

    // Close popup
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('navigation between all pages', async ({ page }) => {
    await page.goto('/');

    // Test navigation to all main pages
    const pages = [
      { name: 'Dashboard', url: '/' },
      { name: 'Leads', url: '/leads' },
      { name: 'Companies', url: '/companies' },
      { name: 'Jobs', url: '/jobs' },
      { name: 'Pipeline', url: '/pipeline' },
    ];

    for (const pageInfo of pages) {
      await page
        .getByRole('link', { name: new RegExp(pageInfo.name, 'i') })
        .click();
      await expect(page).toHaveURL(new RegExp(pageInfo.url.replace('/', '.*')));

      // Wait for page to load
      await page.waitForLoadState('networkidle');
    }
  });

  test('search functionality across pages', async ({ page }) => {
    await page.goto('/leads');

    // Test search functionality
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('John');
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('Jane Smith')).not.toBeVisible();

      await searchInput.fill('Jane');
      await expect(page.getByText('Jane Smith')).toBeVisible();
      await expect(page.getByText('John Doe')).not.toBeVisible();
    }
  });

  test('filtering and sorting functionality', async ({ page }) => {
    await page.goto('/leads');

    // Test stage filtering if available
    const stageFilter = page.getByRole('button', { name: /filter/i });
    if (await stageFilter.isVisible()) {
      await stageFilter.click();

      // Look for stage options
      const newStageOption = page.getByText(/new/i);
      if (await newStageOption.isVisible()) {
        await newStageOption.click();
        await expect(page.getByText('John Doe')).toBeVisible();
      }
    }
  });

  test('responsive navigation on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    // Check if mobile menu exists
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();

      // Check if navigation items are visible
      await expect(page.getByRole('link', { name: /Leads/i })).toBeVisible();
      await expect(
        page.getByRole('link', { name: /Companies/i })
      ).toBeVisible();
    }
  });

  test('accessibility features', async ({ page }) => {
    await page.goto('/');

    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check if focus is visible
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();

    // Test ARIA labels
    const buttons = page.getByRole('button');
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();

      // Should have either aria-label or text content
      expect(ariaLabel || textContent).toBeTruthy();
    }
  });

  test('error recovery workflow', async ({ page }) => {
    // First, cause an error
    await page.route('**/rest/v1/people*', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal server error' }),
      });
    });

    await page.goto('/leads');

    // Should show error state
    await expect(page.getByText(/error/i)).toBeVisible();

    // Restore normal functionality
    await page.unroute('**/rest/v1/people*');
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

    // Refresh page
    await page.reload();

    // Should now show data
    await expect(page.getByText('John Doe')).toBeVisible();
  });
});
