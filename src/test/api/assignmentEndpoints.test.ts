import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { AssignmentService } from '@/services/assignmentService';

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock Supabase admin functions
const mockSupabaseAdmin = {
  listUsers: vi.fn().mockResolvedValue({ 
    data: { users: [] }, 
    error: null 
  }),
  deleteUser: vi.fn().mockResolvedValue({ error: null }),
  createUser: vi.fn().mockResolvedValue({ 
    data: { user: { id: 'test-user-id', email: 'test@example.com' } }, 
    error: null 
  }),
};

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';
const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://empowr-crm.vercel.app/api'
    : 'http://localhost:3000/api';

const supabase = createClient(supabaseUrl, supabaseKey);

// Mock the admin functions
supabase.auth.admin = mockSupabaseAdmin as any;

describe('Assignment API Endpoint Tests', () => {
  let testUserId1: string;
  let testUserId2: string;
  let adminUserId: string;
  let testEntityId1: string;
  let testEntityId2: string;
  let authToken: string;

  beforeEach(async () => {
    vi.clearAllMocks();

    // Mock fetch responses
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue({ success: true, data: [] }),
    } as any);

    // Clean up test data
    await cleanupTestData();

    // Create test users
    const { data: user1 } = await supabase.auth.admin.createUser({
      email: 'testuser1@example.com',
      password: 'testpassword123',
      email_confirm: true,
    });

    const { data: user2 } = await supabase.auth.admin.createUser({
      email: 'testuser2@example.com',
      password: 'testpassword123',
      email_confirm: true,
    });

    const { data: adminUser } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'testpassword123',
      email_confirm: true,
    });

    testUserId1 = user1.user.id;
    testUserId2 = user2.user.id;
    adminUserId = adminUser.user.id;

    // Create user profiles
    await supabase.from('user_profiles').insert([
      {
        id: testUserId1,
        full_name: 'Test User 1',
        email: 'testuser1@example.com',
        role: 'user',
        is_active: true,
      },
      {
        id: testUserId2,
        full_name: 'Test User 2',
        email: 'testuser2@example.com',
        role: 'user',
        is_active: true,
      },
      {
        id: adminUserId,
        full_name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        is_active: true,
      },
    ]);

    // Create test entities
    const { data: entity1 } = await supabase
      .from('people')
      .insert({
        name: 'Test Lead 1',
        email: 'lead1@example.com',
        owner_id: null,
      })
      .select()
      .single();

    const { data: entity2 } = await supabase
      .from('people')
      .insert({
        name: 'Test Lead 2',
        email: 'lead2@example.com',
        owner_id: null,
      })
      .select()
      .single();

    testEntityId1 = entity1.id;
    testEntityId2 = entity2.id;

    // Get auth token for API calls
    const { data: authData } = await supabase.auth.signInWithPassword({
      email: 'admin@example.com',
      password: 'testpassword123',
    });

    authToken = authData.session?.access_token || '';
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  async function cleanupTestData() {
    await supabase.from('assignment_logs').delete().like('entity_id', 'test-%');
    await supabase.from('people').delete().like('name', 'Test Lead%');
    await supabase.from('companies').delete().like('name', 'Test Company%');
    await supabase.from('jobs').delete().like('title', 'Test Job%');
    await supabase
      .from('user_profiles')
      .delete()
      .like('email', '%@example.com');

    const { data: users } = await supabase.auth.admin.listUsers();
    for (const user of users.users) {
      if (user.email?.includes('@example.com')) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    }
  }

  describe('GET /api/assignments/team-members', () => {
    it('should return team members successfully', async () => {
      const response = await fetch(`${baseUrl}/assignments/team-members`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(3);

      const userIds = data.map((member: { id: string }) => member.id);
      expect(userIds).toContain(testUserId1);
      expect(userIds).toContain(testUserId2);
      expect(userIds).toContain(adminUserId);
    });

    it('should return 401 without authentication', async () => {
      const response = await fetch(`${baseUrl}/assignments/team-members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should exclude inactive users', async () => {
      // Deactivate a user
      await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', testUserId1);

      const response = await fetch(`${baseUrl}/assignments/team-members`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      const userIds = data.map((member: { id: string }) => member.id);
      expect(userIds).not.toContain(testUserId1);
    });
  });

  describe('POST /api/assignments/assign', () => {
    it('should assign entity to user successfully', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: testEntityId1,
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toContain('assigned to Test User 1');
      expect(data.data.entityId).toBe(testEntityId1);
      expect(data.data.newOwnerId).toBe(testUserId1);
    });

    it('should unassign entity successfully', async () => {
      // First assign the entity
      await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId1,
        adminUserId
      );

      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: testEntityId1,
          newOwnerId: null,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toContain('unassigned');
      expect(data.data.newOwnerId).toBeNull();
    });

    it('should return 400 for invalid entity type', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'invalid',
          entityId: testEntityId1,
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: testEntityId1,
          // Missing newOwnerId and assignedBy
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 404 for non-existent entity', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: 'non-existent-id',
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(404);
    });

    it('should return 400 for invalid user', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: testEntityId1,
          newOwnerId: 'invalid-user-id',
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('POST /api/assignments/bulk-assign', () => {
    it('should perform bulk assignment successfully', async () => {
      const response = await fetch(`${baseUrl}/assignments/bulk-assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds: [testEntityId1, testEntityId2],
          entityType: 'people',
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.updated_count).toBe(2);
      expect(data.total_requested).toBe(2);
      expect(data.invalid_entities).toHaveLength(0);
    });

    it('should handle partial bulk assignment failure', async () => {
      const response = await fetch(`${baseUrl}/assignments/bulk-assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds: [testEntityId1, 'non-existent-id', testEntityId2],
          entityType: 'people',
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.updated_count).toBe(2);
      expect(data.total_requested).toBe(3);
      expect(data.invalid_entities).toContain('non-existent-id');
    });

    it('should return 400 for empty entity list', async () => {
      const response = await fetch(`${baseUrl}/assignments/bulk-assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds: [],
          entityType: 'people',
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing new owner ID', async () => {
      const response = await fetch(`${baseUrl}/assignments/bulk-assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds: [testEntityId1, testEntityId2],
          entityType: 'people',
          newOwnerId: '',
          assignedBy: adminUserId,
        }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/assignments/history/{entityType}/{entityId}', () => {
    it('should return assignment history', async () => {
      // Create some assignment history
      await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId1,
        adminUserId
      );
      await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId2,
        adminUserId
      );

      const response = await fetch(
        `${baseUrl}/assignments/history/people/${testEntityId1}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThanOrEqual(2);

      // Most recent assignment should be first
      expect(data[0].new_owner_id).toBe(testUserId2);
      expect(data[1].new_owner_id).toBe(testUserId1);
    });

    it('should return empty array for entity with no history', async () => {
      const response = await fetch(
        `${baseUrl}/assignments/history/people/${testEntityId2}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(0);
    });

    it('should return 404 for non-existent entity', async () => {
      const response = await fetch(
        `${baseUrl}/assignments/history/people/non-existent-id`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/assignments/stats', () => {
    it('should return assignment statistics', async () => {
      // Create some assignments
      await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId1,
        adminUserId
      );
      await AssignmentService.assignEntity(
        'people',
        testEntityId2,
        testUserId2,
        adminUserId
      );

      const response = await fetch(`${baseUrl}/assignments/stats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.totalAssigned).toBeGreaterThanOrEqual(2);
      expect(data.unassigned).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(data.byUser)).toBe(true);
      expect(data.byUser.length).toBeGreaterThanOrEqual(2);

      const user1Stats = data.byUser.find((u: { userId: string }) => u.userId === testUserId1);
      const user2Stats = data.byUser.find((u: { userId: string }) => u.userId === testUserId2);

      expect(user1Stats).toBeDefined();
      expect(user2Stats).toBeDefined();
      expect(user1Stats.count).toBeGreaterThanOrEqual(1);
      expect(user2Stats.count).toBeGreaterThanOrEqual(1);
    });

    it('should require admin permissions', async () => {
      // Sign in as regular user
      const { data: userAuth } = await supabase.auth.signInWithPassword({
        email: 'testuser1@example.com',
        password: 'testpassword123',
      });

      const userToken = userAuth.session?.access_token || '';

      const response = await fetch(`${baseUrl}/assignments/stats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/assignments/reassign-orphaned', () => {
    it('should reassign orphaned records successfully', async () => {
      // Assign entity to user
      await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId1,
        adminUserId
      );

      // Deactivate user to simulate deletion
      await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', testUserId1);

      const response = await fetch(`${baseUrl}/assignments/reassign-orphaned`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedUserId: testUserId1,
          newOwnerId: testUserId2,
        }),
      });

      expect(response.status).toBe(200);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.message).toContain('Successfully reassigned');
    });

    it('should return 400 for missing parameters', async () => {
      const response = await fetch(`${baseUrl}/assignments/reassign-orphaned`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedUserId: testUserId1,
          // Missing newOwnerId
        }),
      });

      expect(response.status).toBe(400);
    });

    it('should require admin permissions', async () => {
      // Sign in as regular user
      const { data: userAuth } = await supabase.auth.signInWithPassword({
        email: 'testuser1@example.com',
        password: 'testpassword123',
      });

      const userToken = userAuth.session?.access_token || '';

      const response = await fetch(`${baseUrl}/assignments/reassign-orphaned`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deletedUserId: testUserId1,
          newOwnerId: testUserId2,
        }),
      });

      expect(response.status).toBe(403);
    });
  });

  describe('Rate Limiting and Performance', () => {
    it('should handle multiple concurrent requests', async () => {
      const requests = Array.from({ length: 10 }, (_, i) =>
        fetch(`${baseUrl}/assignments/team-members`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should handle large bulk assignments efficiently', async () => {
      // Create multiple test entities
      const entities = [];
      for (let i = 0; i < 50; i++) {
        const { data } = await supabase
          .from('people')
          .insert({
            name: `Test Lead ${i}`,
            email: `lead${i}@example.com`,
            owner_id: null,
          })
          .select()
          .single();
        entities.push(data.id);
      }

      const startTime = Date.now();

      const response = await fetch(`${baseUrl}/assignments/bulk-assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityIds: entities,
          entityType: 'people',
          newOwnerId: testUserId1,
          assignedBy: adminUserId,
        }),
      });

      const endTime = Date.now();
      const duration = endTime - startTime;

      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds

      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.updated_count).toBe(50);
    });
  });

  describe('Error Handling', () => {
    it('should return proper error format for validation errors', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'people',
          entityId: testEntityId1,
          newOwnerId: testUserId1,
          // Missing assignedBy
        }),
      });

      expect(response.status).toBe(400);
      const data = await response.json();

      expect(data.error).toBeDefined();
      expect(data.code).toBeDefined();
    });

    it('should handle database connection errors gracefully', async () => {
      // Mock database error by using invalid token
      const invalidToken = 'invalid-token';

      const response = await fetch(`${baseUrl}/assignments/team-members`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${invalidToken}`,
          'Content-Type': 'application/json',
        },
      });

      expect(response.status).toBe(401);
    });

    it('should handle malformed JSON requests', async () => {
      const response = await fetch(`${baseUrl}/assignments/assign`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      expect(response.status).toBe(400);
    });
  });
});
