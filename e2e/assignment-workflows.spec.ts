import { test, expect, Page } from '@playwright/test';

// Test configuration
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

// Test data
const testUsers = [
  { name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
  { name: 'Bob Wilson', email: 'bob@example.com', role: 'user' }
];

const testLeads = [
  { name: 'Alice Johnson', email: 'alice@company.com', company: 'Tech Corp' },
  { name: 'Charlie Brown', email: 'charlie@startup.io', company: 'Startup Inc' },
  { name: 'Diana Prince', email: 'diana@enterprise.com', company: 'Enterprise Ltd' }
];

const testCompanies = [
  { name: 'Tech Corp', website: 'https://techcorp.com', industry: 'Technology' },
  { name: 'Startup Inc', website: 'https://startup.io', industry: 'Software' },
  { name: 'Enterprise Ltd', website: 'https://enterprise.com', industry: 'Consulting' }
];

// Helper functions
async function loginAsAdmin(page: Page) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('[data-testid="email-input"]', TEST_EMAIL);
  await page.fill('[data-testid="password-input"]', TEST_PASSWORD);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('**/dashboard');
}

async function createTestUsers(page: Page) {
  await page.goto(`${BASE_URL}/admin/users`);
  
  for (const user of testUsers) {
    await page.click('[data-testid="add-user-button"]');
    await page.fill('[data-testid="user-name-input"]', user.name);
    await page.fill('[data-testid="user-email-input"]', user.email);
    await page.selectOption('[data-testid="user-role-select"]', user.role);
    await page.click('[data-testid="save-user-button"]');
    await page.waitForSelector('[data-testid="user-success-message"]');
  }
}

async function createTestLeads(page: Page) {
  await page.goto(`${BASE_URL}/leads`);
  
  for (const lead of testLeads) {
    await page.click('[data-testid="add-lead-button"]');
    await page.fill('[data-testid="lead-name-input"]', lead.name);
    await page.fill('[data-testid="lead-email-input"]', lead.email);
    await page.fill('[data-testid="lead-company-input"]', lead.company);
    await page.click('[data-testid="save-lead-button"]');
    await page.waitForSelector('[data-testid="lead-success-message"]');
  }
}

async function createTestCompanies(page: Page) {
  await page.goto(`${BASE_URL}/companies`);
  
  for (const company of testCompanies) {
    await page.click('[data-testid="add-company-button"]');
    await page.fill('[data-testid="company-name-input"]', company.name);
    await page.fill('[data-testid="company-website-input"]', company.website);
    await page.fill('[data-testid="company-industry-input"]', company.industry);
    await page.click('[data-testid="save-company-button"]');
    await page.waitForSelector('[data-testid="company-success-message"]');
  }
}

test.describe('User Assignment E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    await createTestUsers(page);
    await createTestLeads(page);
    await createTestCompanies(page);
  });

  test.describe('Single Lead Assignment', () => {
    test('should assign a lead to a user', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // Find the first unassigned lead
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('Unassigned');
      
      // Click assign button
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      
      // Select user from dropdown
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      
      // Confirm assignment
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Verify assignment
      await expect(page.locator('[data-testid="assignment-success-message"]')).toBeVisible();
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('John Doe');
    });

    test('should reassign a lead to another user', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // First assign a lead
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Wait for assignment to complete
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('John Doe');
      
      // Reassign to another user
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-jane-smith"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Verify reassignment
      await expect(page.locator('[data-testid="assignment-success-message"]')).toBeVisible();
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('Jane Smith');
    });

    test('should unassign a lead', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // First assign a lead
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Wait for assignment to complete
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('John Doe');
      
      // Unassign the lead
      await leadRow.locator('[data-testid="unassign-lead-button"]').click();
      await page.click('[data-testid="confirm-unassignment-button"]');
      
      // Verify unassignment
      await expect(page.locator('[data-testid="unassignment-success-message"]')).toBeVisible();
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('Unassigned');
    });

    test('should show assignment history', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // Assign and reassign a lead to create history
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      
      // First assignment
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Second assignment
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-jane-smith"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // View assignment history
      await leadRow.locator('[data-testid="view-history-button"]').click();
      
      // Verify history is displayed
      await expect(page.locator('[data-testid="assignment-history-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="history-entry"]')).toHaveCount(2);
      
      // Most recent should be first
      const firstEntry = page.locator('[data-testid="history-entry"]').first();
      await expect(firstEntry).toContainText('Jane Smith');
      
      const secondEntry = page.locator('[data-testid="history-entry"]').nth(1);
      await expect(secondEntry).toContainText('John Doe');
    });
  });

  test.describe('Bulk Lead Assignment', () => {
    test('should assign multiple leads to a user', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // Select multiple leads
      await page.check('[data-testid="lead-checkbox-0"]');
      await page.check('[data-testid="lead-checkbox-1"]');
      await page.check('[data-testid="lead-checkbox-2"]');
      
      // Click bulk assign button
      await page.click('[data-testid="bulk-assign-button"]');
      
      // Verify bulk assignment dialog
      await expect(page.locator('[data-testid="bulk-assignment-dialog"]')).toBeVisible();
      await expect(page.locator('[data-testid="selected-count"]')).toContainText('3 leads');
      
      // Select user for bulk assignment
      await page.click('[data-testid="bulk-user-select-trigger"]');
      await page.click(`[data-testid="bulk-user-option-john-doe"]`);
      
      // Confirm bulk assignment
      await page.click('[data-testid="confirm-bulk-assignment-button"]');
      
      // Verify bulk assignment success
      await expect(page.locator('[data-testid="bulk-assignment-success"]')).toBeVisible();
      await expect(page.locator('[data-testid="bulk-assignment-success"]')).toContainText('Successfully assigned 3 of 3 leads');
      
      // Verify all leads are assigned
      await expect(page.locator('[data-testid="lead-row"]').first().locator('[data-testid="lead-owner"]')).toContainText('John Doe');
      await expect(page.locator('[data-testid="lead-row"]').nth(1).locator('[data-testid="lead-owner"]')).toContainText('John Doe');
      await expect(page.locator('[data-testid="lead-row"]').nth(2).locator('[data-testid="lead-owner"]')).toContainText('John Doe');
    });

    test('should handle partial bulk assignment failure', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // Select leads including one that might fail
      await page.check('[data-testid="lead-checkbox-0"]');
      await page.check('[data-testid="lead-checkbox-1"]');
      
      // Simulate one lead being deleted by another user
      await page.evaluate(() => {
        // This would simulate a race condition
        const leadRow = document.querySelector('[data-testid="lead-row"]:nth-child(2)');
        if (leadRow) {
          leadRow.remove();
        }
      });
      
      // Click bulk assign button
      await page.click('[data-testid="bulk-assign-button"]');
      
      // Select user for bulk assignment
      await page.click('[data-testid="bulk-user-select-trigger"]');
      await page.click(`[data-testid="bulk-user-option-john-doe"]`);
      
      // Confirm bulk assignment
      await page.click('[data-testid="confirm-bulk-assignment-button"]');
      
      // Verify partial success
      await expect(page.locator('[data-testid="bulk-assignment-warning"]')).toBeVisible();
      await expect(page.locator('[data-testid="bulk-assignment-warning"]')).toContainText('1 leads could not be assigned');
    });

    test('should show progress indicator during bulk assignment', async ({ page }) => {
      await page.goto(`${BASE_URL}/leads`);
      
      // Select multiple leads
      await page.check('[data-testid="lead-checkbox-0"]');
      await page.check('[data-testid="lead-checkbox-1"]');
      await page.check('[data-testid="lead-checkbox-2"]');
      
      // Click bulk assign button
      await page.click('[data-testid="bulk-assign-button"]');
      
      // Select user for bulk assignment
      await page.click('[data-testid="bulk-user-select-trigger"]');
      await page.click(`[data-testid="bulk-user-option-john-doe"]`);
      
      // Start assignment and verify progress indicator
      await page.click('[data-testid="confirm-bulk-assignment-button"]');
      
      // Verify progress indicator is shown
      await expect(page.locator('[data-testid="bulk-assignment-progress"]')).toBeVisible();
      await expect(page.locator('[data-testid="bulk-assignment-progress"]')).toContainText('Assigning leads...');
      
      // Wait for completion
      await expect(page.locator('[data-testid="bulk-assignment-success"]')).toBeVisible();
    });
  });

  test.describe('Company Assignment', () => {
    test('should assign a company to a user', async ({ page }) => {
      await page.goto(`${BASE_URL}/companies`);
      
      // Find the first unassigned company
      const companyRow = page.locator('[data-testid="company-row"]').first();
      await expect(companyRow.locator('[data-testid="company-owner"]')).toContainText('Unassigned');
      
      // Click assign button
      await companyRow.locator('[data-testid="assign-company-button"]').click();
      
      // Select user from dropdown
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      
      // Confirm assignment
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Verify assignment
      await expect(page.locator('[data-testid="assignment-success-message"]')).toBeVisible();
      await expect(companyRow.locator('[data-testid="company-owner"]')).toContainText('John Doe');
    });

    test('should require admin permissions for company assignment', async ({ page }) => {
      // Login as regular user
      await page.goto(`${BASE_URL}/logout`);
      await page.goto(`${BASE_URL}/login`);
      await page.fill('[data-testid="email-input"]', 'jane@example.com');
      await page.fill('[data-testid="password-input"]', TEST_PASSWORD);
      await page.click('[data-testid="login-button"]');
      
      await page.goto(`${BASE_URL}/companies`);
      
      // Try to assign a company
      const companyRow = page.locator('[data-testid="company-row"]').first();
      await companyRow.locator('[data-testid="assign-company-button"]').click();
      
      // Should show permission denied message
      await expect(page.locator('[data-testid="permission-denied-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="permission-denied-message"]')).toContainText('Only administrators can assign company ownership');
    });
  });

  test.describe('Assignment Management Panel', () => {
    test('should display assignment statistics', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Verify statistics cards are displayed
      await expect(page.locator('[data-testid="total-assigned-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="unassigned-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="team-members-card"]')).toBeVisible();
      
      // Verify statistics values
      await expect(page.locator('[data-testid="total-assigned-count"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="unassigned-count"]')).toContainText(/\d+/);
      await expect(page.locator('[data-testid="team-members-count"]')).toContainText(/\d+/);
    });

    test('should display assignments by user table', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Verify table headers
      await expect(page.locator('[data-testid="assignments-table"]')).toBeVisible();
      await expect(page.locator('[data-testid="table-header-user"]')).toContainText('User');
      await expect(page.locator('[data-testid="table-header-role"]')).toContainText('Role');
      await expect(page.locator('[data-testid="table-header-count"]')).toContainText('Assigned Items');
      await expect(page.locator('[data-testid="table-header-actions"]')).toContainText('Actions');
      
      // Verify user rows are displayed
      await expect(page.locator('[data-testid="user-row"]')).toHaveCount(testUsers.length);
    });

    test('should reassign user records', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // First assign some leads to create data
      await page.goto(`${BASE_URL}/leads`);
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Go back to assignment management
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Click reassign button for John Doe
      const johnRow = page.locator('[data-testid="user-row"]').filter({ hasText: 'John Doe' });
      await johnRow.locator('[data-testid="reassign-button"]').click();
      
      // Verify reassignment dialog
      await expect(page.locator('[data-testid="reassignment-dialog"]')).toBeVisible();
      await expect(page.locator('[data-testid="from-user-display"]')).toContainText('John Doe');
      
      // Select new owner
      await page.click('[data-testid="new-owner-select-trigger"]');
      await page.click(`[data-testid="new-owner-option-jane-smith"]`);
      
      // Confirm reassignment
      await page.click('[data-testid="confirm-reassignment-button"]');
      
      // Verify reassignment success
      await expect(page.locator('[data-testid="reassignment-success-message"]')).toBeVisible();
    });

    test('should refresh assignment data', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Get initial count
      const initialCount = await page.locator('[data-testid="total-assigned-count"]').textContent();
      
      // Assign a lead
      await page.goto(`${BASE_URL}/leads`);
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      await leadRow.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Go back to assignment management
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Click refresh button
      await page.click('[data-testid="refresh-button"]');
      
      // Verify data is refreshed
      await expect(page.locator('[data-testid="total-assigned-count"]')).not.toContainText(initialCount || '');
    });

    test('should show permission denied for non-admin users', async ({ page }) => {
      // Login as regular user
      await page.goto(`${BASE_URL}/logout`);
      await page.goto(`${BASE_URL}/login`);
      await page.fill('[data-testid="email-input"]', 'jane@example.com');
      await page.fill('[data-testid="password-input"]', TEST_PASSWORD);
      await page.click('[data-testid="login-button"]');
      
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Should show permission denied message
      await expect(page.locator('[data-testid="permission-denied-message"]')).toBeVisible();
      await expect(page.locator('[data-testid="permission-denied-message"]')).toContainText('You don\'t have permission to manage assignments');
    });
  });

  test.describe('Assignment Workflow Integration', () => {
    test('should complete full assignment workflow', async ({ page }) => {
      // Step 1: Assign leads to different users
      await page.goto(`${BASE_URL}/leads`);
      
      // Assign first lead to John
      const lead1 = page.locator('[data-testid="lead-row"]').first();
      await lead1.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Assign second lead to Jane
      const lead2 = page.locator('[data-testid="lead-row"]').nth(1);
      await lead2.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-jane-smith"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Step 2: Assign companies
      await page.goto(`${BASE_URL}/companies`);
      
      const company1 = page.locator('[data-testid="company-row"]').first();
      await company1.locator('[data-testid="assign-company-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      await page.click('[data-testid="confirm-assignment-button"]');
      
      // Step 3: Verify assignments in management panel
      await page.goto(`${BASE_URL}/admin/assignments`);
      
      // Verify John has assignments
      const johnRow = page.locator('[data-testid="user-row"]').filter({ hasText: 'John Doe' });
      await expect(johnRow.locator('[data-testid="assignment-count"]')).toContainText('2');
      
      // Verify Jane has assignments
      const janeRow = page.locator('[data-testid="user-row"]').filter({ hasText: 'Jane Smith' });
      await expect(janeRow.locator('[data-testid="assignment-count"]')).toContainText('1');
      
      // Step 4: Reassign John's records to Bob
      await johnRow.locator('[data-testid="reassign-button"]').click();
      await page.click('[data-testid="new-owner-select-trigger"]');
      await page.click(`[data-testid="new-owner-option-bob-wilson"]`);
      await page.click('[data-testid="confirm-reassignment-button"]');
      
      // Step 5: Verify reassignment
      await expect(page.locator('[data-testid="reassignment-success-message"]')).toBeVisible();
      
      // Verify Bob now has John's assignments
      const bobRow = page.locator('[data-testid="user-row"]').filter({ hasText: 'Bob Wilson' });
      await expect(bobRow.locator('[data-testid="assignment-count"]')).toContainText('2');
      
      // Verify John has no assignments
      await expect(johnRow.locator('[data-testid="assignment-count"]')).toContainText('0');
    });

    test('should handle concurrent assignment attempts', async ({ page, context }) => {
      // Create a second browser context to simulate concurrent users
      const secondContext = await context.browser()?.newContext();
      const secondPage = await secondContext?.newPage();
      
      if (!secondPage) return;
      
      // Login as admin in both contexts
      await loginAsAdmin(page);
      await loginAsAdmin(secondPage);
      
      await page.goto(`${BASE_URL}/leads`);
      await secondPage.goto(`${BASE_URL}/leads`);
      
      // Both users try to assign the same lead
      const leadRow1 = page.locator('[data-testid="lead-row"]').first();
      const leadRow2 = secondPage.locator('[data-testid="lead-row"]').first();
      
      // User 1 assigns to John
      await leadRow1.locator('[data-testid="assign-lead-button"]').click();
      await page.click('[data-testid="user-select-trigger"]');
      await page.click(`[data-testid="user-option-john-doe"]`);
      
      // User 2 assigns to Jane (simultaneously)
      await leadRow2.locator('[data-testid="assign-lead-button"]').click();
      await secondPage.click('[data-testid="user-select-trigger"]');
      await secondPage.click(`[data-testid="user-option-jane-smith"]`);
      
      // Both confirm assignments
      await page.click('[data-testid="confirm-assignment-button"]');
      await secondPage.click('[data-testid="confirm-assignment-button"]');
      
      // One should succeed, one might show a conflict message
      const successMessages = await Promise.all([
        page.locator('[data-testid="assignment-success-message"]').count(),
        secondPage.locator('[data-testid="assignment-success-message"]').count()
      ]);
      
      const conflictMessages = await Promise.all([
        page.locator('[data-testid="assignment-conflict-message"]').count(),
        secondPage.locator('[data-testid="assignment-conflict-message"]').count()
      ]);
      
      // At least one should succeed
      expect(successMessages[0] + successMessages[1]).toBeGreaterThanOrEqual(1);
      
      await secondContext?.close();
    });
  });

  test.describe('Mobile Assignment Workflow', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await loginAsAdmin(page);
      await page.goto(`${BASE_URL}/leads`);
      
      // Mobile-specific interactions
      const leadRow = page.locator('[data-testid="lead-row"]').first();
      
      // Tap assign button (mobile-friendly)
      await leadRow.locator('[data-testid="assign-lead-button"]').tap();
      
      // Select user from mobile dropdown
      await page.tap('[data-testid="user-select-trigger"]');
      await page.tap(`[data-testid="user-option-john-doe"]`);
      
      // Confirm assignment
      await page.tap('[data-testid="confirm-assignment-button"]');
      
      // Verify assignment on mobile
      await expect(page.locator('[data-testid="assignment-success-message"]')).toBeVisible();
      await expect(leadRow.locator('[data-testid="lead-owner"]')).toContainText('John Doe');
    });

    test('should handle mobile bulk assignment', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await loginAsAdmin(page);
      await page.goto(`${BASE_URL}/leads`);
      
      // Select multiple leads on mobile
      await page.tap('[data-testid="lead-checkbox-0"]');
      await page.tap('[data-testid="lead-checkbox-1"]');
      
      // Open mobile bulk assignment
      await page.tap('[data-testid="mobile-bulk-assign-button"]');
      
      // Select user
      await page.tap('[data-testid="bulk-user-select-trigger"]');
      await page.tap(`[data-testid="bulk-user-option-john-doe"]`);
      
      // Confirm assignment
      await page.tap('[data-testid="confirm-bulk-assignment-button"]');
      
      // Verify success
      await expect(page.locator('[data-testid="bulk-assignment-success"]')).toBeVisible();
    });
  });
});
