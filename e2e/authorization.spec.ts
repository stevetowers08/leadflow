import { test, expect } from '@playwright/test';

// Test data for different user roles
const testUsers = {
  owner: {
    id: 'owner-user-id',
    email: 'owner@example.com',
    user_metadata: { role: 'owner', full_name: 'Owner User' }
  },
  admin: {
    id: 'admin-user-id',
    email: 'admin@example.com',
    user_metadata: { role: 'admin', full_name: 'Admin User' }
  },
  recruiter: {
    id: 'recruiter-user-id',
    email: 'recruiter@example.com',
    user_metadata: { role: 'recruiter', full_name: 'Recruiter User' }
  },
  viewer: {
    id: 'viewer-user-id',
    email: 'viewer@example.com',
    user_metadata: { role: 'viewer', full_name: 'Viewer User' }
  }
};

const testData = {
  companies: [
    { id: 'company-1', name: 'Acme Corp', owner_id: 'recruiter-user-id' },
    { id: 'company-2', name: 'Beta Inc', owner_id: 'admin-user-id' },
    { id: 'company-3', name: 'Gamma LLC', owner_id: 'owner-user-id' }
  ],
  people: [
    { id: 'person-1', name: 'John Doe', owner_id: 'recruiter-user-id', company_id: 'company-1' },
    { id: 'person-2', name: 'Jane Smith', owner_id: 'admin-user-id', company_id: 'company-2' },
    { id: 'person-3', name: 'Bob Wilson', owner_id: 'owner-user-id', company_id: 'company-3' }
  ],
  jobs: [
    { id: 'job-1', title: 'Software Engineer', owner_id: 'recruiter-user-id', company_id: 'company-1' },
    { id: 'job-2', title: 'Product Manager', owner_id: 'admin-user-id', company_id: 'company-2' }
  ]
};

// Helper function to mock authenticated state
async function mockAuthState(page: any, user: any) {
  await page.addInitScript((userData: any) => {
    window.localStorage.setItem('sb-jedfundfhzytpnbjkspn-auth-token', JSON.stringify({
      access_token: 'mock-token',
      user: userData,
    }));
  }, user);
}

// Helper function to mock API responses based on user role
async function mockApiResponses(page: any, user: any) {
  const userRole = user.user_metadata.role;
  
  // Mock companies API
  await page.route('**/rest/v1/companies*', route => {
    let filteredCompanies = testData.companies;
    
    if (userRole === 'owner' || userRole === 'admin') {
      // Owner/Admin can see all companies
      filteredCompanies = testData.companies;
    } else {
      // Others can only see assigned companies
      filteredCompanies = testData.companies.filter(c => c.owner_id === user.id);
    }
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filteredCompanies),
    });
  });

  // Mock people API
  await page.route('**/rest/v1/people*', route => {
    let filteredPeople = testData.people;
    
    if (userRole === 'owner' || userRole === 'admin') {
      filteredPeople = testData.people;
    } else {
      filteredPeople = testData.people.filter(p => p.owner_id === user.id);
    }
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filteredPeople),
    });
  });

  // Mock jobs API
  await page.route('**/rest/v1/jobs*', route => {
    let filteredJobs = testData.jobs;
    
    if (userRole === 'owner' || userRole === 'admin') {
      filteredJobs = testData.jobs;
    } else {
      filteredJobs = testData.jobs.filter(j => j.owner_id === user.id);
    }
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filteredJobs),
    });
  });

  // Mock user profiles API
  await page.route('**/rest/v1/user_profiles*', route => {
    const userProfiles = [
      { id: 'owner-user-id', email: 'owner@example.com', role: 'owner', is_active: true },
      { id: 'admin-user-id', email: 'admin@example.com', role: 'admin', is_active: true },
      { id: 'recruiter-user-id', email: 'recruiter@example.com', role: 'recruiter', is_active: true },
      { id: 'viewer-user-id', email: 'viewer@example.com', role: 'viewer', is_active: true }
    ];
    
    let filteredProfiles = userProfiles;
    
    if (userRole === 'owner' || userRole === 'admin') {
      filteredProfiles = userProfiles;
    } else {
      filteredProfiles = userProfiles.filter(p => p.id === user.id);
    }
    
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(filteredProfiles),
    });
  });
}

test.describe('Authorization E2E Tests', () => {
  test.describe('Owner Role Tests', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthState(page, testUsers.owner);
      await mockApiResponses(page, testUsers.owner);
    });

    test('should have full access to all features', async ({ page }) => {
      await page.goto('/');
      
      // Should see all navigation items
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('People')).toBeVisible();
      await expect(page.getByText('Companies')).toBeVisible();
      await expect(page.getByText('Jobs')).toBeVisible();
      await expect(page.getByText('Settings')).toBeVisible();
    });

    test('should see all companies regardless of ownership', async ({ page }) => {
      await page.goto('/companies');
      
      await expect(page.getByText('Acme Corp')).toBeVisible();
      await expect(page.getByText('Beta Inc')).toBeVisible();
      await expect(page.getByText('Gamma LLC')).toBeVisible();
    });

    test('should see all people regardless of ownership', async ({ page }) => {
      await page.goto('/people');
      
      await expect(page.getByText('John Doe')).toBeVisible();
      await expect(page.getByText('Jane Smith')).toBeVisible();
      await expect(page.getByText('Bob Wilson')).toBeVisible();
    });

    test('should see all jobs regardless of ownership', async ({ page }) => {
      await page.goto('/jobs');
      
      await expect(page.getByText('Software Engineer')).toBeVisible();
      await expect(page.getByText('Product Manager')).toBeVisible();
    });

    test('should be able to assign entities to any user', async ({ page }) => {
      await page.goto('/companies');
      
      // Click on a company
      await page.getByText('Acme Corp').click();
      
      // Should see assignment controls
      const assignButton = page.getByRole('button', { name: /assign/i });
      await expect(assignButton).toBeVisible();
      
      // Should be able to assign to any user
      await assignButton.click();
      
      // Should see all users in assignment dropdown
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('Recruiter User')).toBeVisible();
      await expect(page.getByText('Viewer User')).toBeVisible();
    });

    test('should have access to user management', async ({ page }) => {
      await page.goto('/settings');
      
      // Should see user management section
      await expect(page.getByText(/user management/i)).toBeVisible();
      
      // Should be able to view all users
      await expect(page.getByText('Owner User')).toBeVisible();
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('Recruiter User')).toBeVisible();
      await expect(page.getByText('Viewer User')).toBeVisible();
    });
  });

  test.describe('Admin Role Tests', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthState(page, testUsers.admin);
      await mockApiResponses(page, testUsers.admin);
    });

    test('should have access to most features', async ({ page }) => {
      await page.goto('/');
      
      // Should see most navigation items
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('People')).toBeVisible();
      await expect(page.getByText('Companies')).toBeVisible();
      await expect(page.getByText('Jobs')).toBeVisible();
      await expect(page.getByText('Settings')).toBeVisible();
    });

    test('should see all companies regardless of ownership', async ({ page }) => {
      await page.goto('/companies');
      
      await expect(page.getByText('Acme Corp')).toBeVisible();
      await expect(page.getByText('Beta Inc')).toBeVisible();
      await expect(page.getByText('Gamma LLC')).toBeVisible();
    });

    test('should be able to assign entities to any user', async ({ page }) => {
      await page.goto('/companies');
      
      // Click on a company
      await page.getByText('Acme Corp').click();
      
      // Should see assignment controls
      const assignButton = page.getByRole('button', { name: /assign/i });
      await expect(assignButton).toBeVisible();
      
      // Should be able to assign to any user
      await assignButton.click();
      
      // Should see all users in assignment dropdown
      await expect(page.getByText('Owner User')).toBeVisible();
      await expect(page.getByText('Recruiter User')).toBeVisible();
      await expect(page.getByText('Viewer User')).toBeVisible();
    });

    test('should have access to user management', async ({ page }) => {
      await page.goto('/settings');
      
      // Should see user management section
      await expect(page.getByText(/user management/i)).toBeVisible();
      
      // Should be able to view all users
      await expect(page.getByText('Owner User')).toBeVisible();
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('Recruiter User')).toBeVisible();
      await expect(page.getByText('Viewer User')).toBeVisible();
    });
  });

  test.describe('Recruiter Role Tests', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthState(page, testUsers.recruiter);
      await mockApiResponses(page, testUsers.recruiter);
    });

    test('should have access to CRM features', async ({ page }) => {
      await page.goto('/');
      
      // Should see CRM navigation items
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('People')).toBeVisible();
      await expect(page.getByText('Companies')).toBeVisible();
      await expect(page.getByText('Jobs')).toBeVisible();
      await expect(page.getByText('Settings')).toBeVisible();
    });

    test('should only see assigned companies', async ({ page }) => {
      await page.goto('/companies');
      
      // Should only see Acme Corp (assigned to recruiter)
      await expect(page.getByText('Acme Corp')).toBeVisible();
      
      // Should not see other companies
      await expect(page.getByText('Beta Inc')).not.toBeVisible();
      await expect(page.getByText('Gamma LLC')).not.toBeVisible();
    });

    test('should only see assigned people', async ({ page }) => {
      await page.goto('/people');
      
      // Should only see John Doe (assigned to recruiter)
      await expect(page.getByText('John Doe')).toBeVisible();
      
      // Should not see other people
      await expect(page.getByText('Jane Smith')).not.toBeVisible();
      await expect(page.getByText('Bob Wilson')).not.toBeVisible();
    });

    test('should only see assigned jobs', async ({ page }) => {
      await page.goto('/jobs');
      
      // Should only see Software Engineer (assigned to recruiter)
      await expect(page.getByText('Software Engineer')).toBeVisible();
      
      // Should not see other jobs
      await expect(page.getByText('Product Manager')).not.toBeVisible();
    });

    test('should be able to assign entities they own', async ({ page }) => {
      await page.goto('/companies');
      
      // Click on assigned company
      await page.getByText('Acme Corp').click();
      
      // Should see assignment controls
      const assignButton = page.getByRole('button', { name: /assign/i });
      await expect(assignButton).toBeVisible();
      
      // Should be able to assign to other users
      await assignButton.click();
      
      // Should see other users in assignment dropdown
      await expect(page.getByText('Admin User')).toBeVisible();
      await expect(page.getByText('Owner User')).toBeVisible();
    });

    test('should not have access to user management', async ({ page }) => {
      await page.goto('/settings');
      
      // Should not see user management section
      await expect(page.getByText(/user management/i)).not.toBeVisible();
    });
  });

  test.describe('Viewer Role Tests', () => {
    test.beforeEach(async ({ page }) => {
      await mockAuthState(page, testUsers.viewer);
      await mockApiResponses(page, testUsers.viewer);
    });

    test('should have read-only access', async ({ page }) => {
      await page.goto('/');
      
      // Should see navigation items
      await expect(page.getByText('Dashboard')).toBeVisible();
      await expect(page.getByText('People')).toBeVisible();
      await expect(page.getByText('Companies')).toBeVisible();
      await expect(page.getByText('Jobs')).toBeVisible();
    });

    test('should not see any companies (none assigned)', async ({ page }) => {
      await page.goto('/companies');
      
      // Should not see any companies
      await expect(page.getByText('Acme Corp')).not.toBeVisible();
      await expect(page.getByText('Beta Inc')).not.toBeVisible();
      await expect(page.getByText('Gamma LLC')).not.toBeVisible();
      
      // Should see empty state message
      await expect(page.getByText(/no companies found/i)).toBeVisible();
    });

    test('should not see any people (none assigned)', async ({ page }) => {
      await page.goto('/people');
      
      // Should not see any people
      await expect(page.getByText('John Doe')).not.toBeVisible();
      await expect(page.getByText('Jane Smith')).not.toBeVisible();
      await expect(page.getByText('Bob Wilson')).not.toBeVisible();
      
      // Should see empty state message
      await expect(page.getByText(/no people found/i)).toBeVisible();
    });

    test('should not see any jobs (none assigned)', async ({ page }) => {
      await page.goto('/jobs');
      
      // Should not see any jobs
      await expect(page.getByText('Software Engineer')).not.toBeVisible();
      await expect(page.getByText('Product Manager')).not.toBeVisible();
      
      // Should see empty state message
      await expect(page.getByText(/no jobs found/i)).toBeVisible();
    });

    test('should not have assignment controls', async ({ page }) => {
      // First assign a company to viewer for testing
      await page.route('**/rest/v1/companies*', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'company-1', name: 'Acme Corp', owner_id: 'viewer-user-id' }]),
        });
      });

      await page.goto('/companies');
      
      // Click on assigned company
      await page.getByText('Acme Corp').click();
      
      // Should not see assignment controls
      const assignButton = page.getByRole('button', { name: /assign/i });
      await expect(assignButton).not.toBeVisible();
    });

    test('should not have access to user management', async ({ page }) => {
      await page.goto('/settings');
      
      // Should not see user management section
      await expect(page.getByText(/user management/i)).not.toBeVisible();
    });
  });

  test.describe('Cross-Role Authorization Tests', () => {
    test('should prevent unauthorized data access', async ({ page }) => {
      // Test as recruiter trying to access admin data
      await mockAuthState(page, testUsers.recruiter);
      await mockApiResponses(page, testUsers.recruiter);

      await page.goto('/companies');
      
      // Should only see assigned companies
      await expect(page.getByText('Acme Corp')).toBeVisible();
      await expect(page.getByText('Beta Inc')).not.toBeVisible();
    });

    test('should prevent unauthorized assignment operations', async ({ page }) => {
      // Test as viewer trying to assign entities
      await mockAuthState(page, testUsers.viewer);
      await mockApiResponses(page, testUsers.viewer);

      // Mock API to return assignment error
      await page.route('**/rest/v1/companies*', route => {
        if (route.request().method() === 'PATCH') {
          route.fulfill({
            status: 403,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Forbidden: Viewers cannot assign entities' }),
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([]),
          });
        }
      });

      await page.goto('/companies');
      
      // Should not see any companies
      await expect(page.getByText('Acme Corp')).not.toBeVisible();
    });

    test('should handle role changes during session', async ({ page }) => {
      // Start as recruiter
      await mockAuthState(page, testUsers.recruiter);
      await mockApiResponses(page, testUsers.recruiter);

      await page.goto('/companies');
      
      // Should only see assigned companies
      await expect(page.getByText('Acme Corp')).toBeVisible();
      await expect(page.getByText('Beta Inc')).not.toBeVisible();

      // Change to admin role
      await mockAuthState(page, testUsers.admin);
      await mockApiResponses(page, testUsers.admin);

      // Refresh page
      await page.reload();
      
      // Should now see all companies
      await expect(page.getByText('Acme Corp')).toBeVisible();
      await expect(page.getByText('Beta Inc')).toBeVisible();
      await expect(page.getByText('Gamma LLC')).toBeVisible();
    });
  });

  test.describe('Edge Cases', () => {
    test('should handle deleted user assignments gracefully', async ({ page }) => {
      // Mock company owned by deleted user
      await page.route('**/rest/v1/companies*', route => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([{ id: 'company-1', name: 'Acme Corp', owner_id: 'deleted-user-id' }]),
        });
      });

      await mockAuthState(page, testUsers.recruiter);
      await mockApiResponses(page, testUsers.recruiter);

      await page.goto('/companies');
      
      // Should not see company owned by deleted user
      await expect(page.getByText('Acme Corp')).not.toBeVisible();
    });

    test('should handle concurrent assignment attempts', async ({ page }) => {
      await mockAuthState(page, testUsers.admin);
      await mockApiResponses(page, testUsers.admin);

      // Mock assignment conflict
      await page.route('**/rest/v1/companies*', route => {
        if (route.request().method() === 'PATCH') {
          route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Entity already assigned to another user' }),
          });
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(testData.companies),
          });
        }
      });

      await page.goto('/companies');
      
      // Click on a company
      await page.getByText('Acme Corp').click();
      
      // Try to assign
      const assignButton = page.getByRole('button', { name: /assign/i });
      await assignButton.click();
      
      // Should show error message
      await expect(page.getByText(/already assigned/i)).toBeVisible();
    });

    test('should handle session expiration gracefully', async ({ page }) => {
      // Mock expired session
      await page.route('**/auth/v1/user*', route => {
        route.fulfill({
          status: 401,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Invalid token' }),
        });
      });

      await page.goto('/companies');
      
      // Should be redirected to sign-in page
      await expect(page.getByText(/sign in/i)).toBeVisible();
    });
  });
});
