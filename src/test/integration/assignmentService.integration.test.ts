import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { AssignmentService } from '@/services/assignmentService';

// Test database configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';

// Create test client
const supabase = createClient(supabaseUrl, supabaseKey);

describe('AssignmentService Integration Tests', () => {
  let testUserId1: string;
  let testUserId2: string;
  let testEntityId1: string;
  let testEntityId2: string;
  let adminUserId: string;

  beforeEach(async () => {
    // Clean up any existing test data
    await cleanupTestData();
    
    // Create test users
    const { data: user1 } = await supabase.auth.admin.createUser({
      email: 'testuser1@example.com',
      password: 'testpassword123',
      email_confirm: true
    });
    
    const { data: user2 } = await supabase.auth.admin.createUser({
      email: 'testuser2@example.com',
      password: 'testpassword123',
      email_confirm: true
    });
    
    const { data: adminUser } = await supabase.auth.admin.createUser({
      email: 'admin@example.com',
      password: 'testpassword123',
      email_confirm: true
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
        is_active: true
      },
      {
        id: testUserId2,
        full_name: 'Test User 2',
        email: 'testuser2@example.com',
        role: 'user',
        is_active: true
      },
      {
        id: adminUserId,
        full_name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
        is_active: true
      }
    ]);

    // Create test entities
    const { data: entity1 } = await supabase.from('people').insert({
      name: 'Test Lead 1',
      email: 'lead1@example.com',
      owner_id: null
    }).select().single();

    const { data: entity2 } = await supabase.from('people').insert({
      name: 'Test Lead 2',
      email: 'lead2@example.com',
      owner_id: null
    }).select().single();

    testEntityId1 = entity1.id;
    testEntityId2 = entity2.id;
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  async function cleanupTestData() {
    // Clean up test data in reverse order of dependencies
    await supabase.from('assignment_logs').delete().like('entity_id', 'test-%');
    await supabase.from('people').delete().like('name', 'Test Lead%');
    await supabase.from('companies').delete().like('name', 'Test Company%');
    await supabase.from('jobs').delete().like('title', 'Test Job%');
    await supabase.from('user_profiles').delete().like('email', '%@example.com');
    
    // Clean up auth users
    const { data: users } = await supabase.auth.admin.listUsers();
    for (const user of users.users) {
      if (user.email?.includes('@example.com')) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    }
  }

  describe('User Validation', () => {
    it('should validate active users correctly', async () => {
      const isValid = await AssignmentService.validateUser(testUserId1);
      expect(isValid).toBe(true);
    });

    it('should reject inactive users', async () => {
      // Deactivate user
      await supabase.from('user_profiles')
        .update({ is_active: false })
        .eq('id', testUserId1);

      const isValid = await AssignmentService.validateUser(testUserId1);
      expect(isValid).toBe(false);
    });

    it('should reject non-existent users', async () => {
      const isValid = await AssignmentService.validateUser('non-existent-id');
      expect(isValid).toBe(false);
    });
  });

  describe('Team Member Retrieval', () => {
    it('should retrieve all active team members', async () => {
      const members = await AssignmentService.getTeamMembers();
      
      expect(members).toHaveLength(3);
      expect(members.map(member => member.id)).toContain(testUserId1);
      expect(members.map(member => member.id)).toContain(testUserId2);
      expect(members.map(member => member.id)).toContain(adminUserId);
    });

    it('should exclude inactive users from team members', async () => {
      // Deactivate one user
      await supabase.from('user_profiles')
        .update({ is_active: false })
        .eq('id', testUserId1);

      const members = await AssignmentService.getTeamMembers();
      
      expect(members).toHaveLength(2);
      expect(members.map(member => member.id)).not.toContain(testUserId1);
    });
  });

  describe('Single Entity Assignment', () => {
    it('should assign entity to user successfully', async () => {
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('assigned to Test User 1');
      expect(result.data?.entityId).toBe(testEntityId1);
      expect(result.data?.newOwnerId).toBe(testUserId1);

      // Verify assignment in database
      const { data: entity } = await supabase.from('people')
        .select('owner_id')
        .eq('id', testEntityId1)
        .single();

      expect(entity.owner_id).toBe(testUserId1);
    });

    it('should unassign entity successfully', async () => {
      // First assign the entity
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);

      // Then unassign it
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        null,
        adminUserId
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('unassigned');

      // Verify unassignment in database
      const { data: entity } = await supabase.from('people')
        .select('owner_id')
        .eq('id', testEntityId1)
        .single();

      expect(entity.owner_id).toBeNull();
    });

    it('should fail when assigning to invalid user', async () => {
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityId1,
        'invalid-user-id',
        adminUserId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Target user does not exist');
    });

    it('should fail when assigning non-existent entity', async () => {
      const result = await AssignmentService.assignEntity(
        'people',
        'non-existent-entity',
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    it('should handle different entity types', async () => {
      // Create test company
      const { data: company } = await supabase.from('companies').insert({
        name: 'Test Company',
        owner_id: null
      }).select().single();

      const result = await AssignmentService.assignEntity(
        'companies',
        company.id,
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('assigned to Test User 1');
    });
  });

  describe('Bulk Assignment', () => {
    it('should perform bulk assignment successfully', async () => {
      const entityIds = [testEntityId1, testEntityId2];
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(2);
      expect(result.total_requested).toBe(2);
      expect(result.invalid_entities).toHaveLength(0);

      // Verify assignments in database
      const { data: entities } = await supabase.from('people')
        .select('owner_id')
        .in('id', entityIds);

      entities.forEach(entity => {
        expect(entity.owner_id).toBe(testUserId1);
      });
    });

    it('should handle partial bulk assignment failure', async () => {
      const entityIds = [testEntityId1, 'non-existent-entity', testEntityId2];
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(2);
      expect(result.total_requested).toBe(3);
      expect(result.invalid_entities).toContain('non-existent-entity');
    });

    it('should fail bulk assignment with empty entity list', async () => {
      const result = await AssignmentService.bulkAssignEntities(
        [],
        'people',
        testUserId1,
        adminUserId
      );

      expect(result.success).toBe(false);
      expect(result.errors).toContain('No entities provided for assignment');
    });
  });

  describe('Assignment History', () => {
    it('should track assignment history', async () => {
      // Perform assignment
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);

      // Check if assignment log was created
      const { data: logs } = await supabase.from('assignment_logs')
        .select('*')
        .eq('entity_type', 'people')
        .eq('entity_id', testEntityId1);

      expect(logs).toHaveLength(1);
      expect(logs[0].new_owner_id).toBe(testUserId1);
      expect(logs[0].assigned_by).toBe(adminUserId);
    });

    it('should retrieve assignment history', async () => {
      // Perform multiple assignments
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);
      await AssignmentService.assignEntity('people', testEntityId1, testUserId2, adminUserId);

      const history = await AssignmentService.getAssignmentHistory('people', testEntityId1);

      expect(history).toHaveLength(2);
      expect(history[0].new_owner_id).toBe(testUserId2); // Most recent first
      expect(history[1].new_owner_id).toBe(testUserId1);
    });
  });

  describe('Assignment Statistics', () => {
    it('should calculate assignment statistics correctly', async () => {
      // Assign entities
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);
      await AssignmentService.assignEntity('people', testEntityId2, testUserId2, adminUserId);

      const stats = await AssignmentService.getAssignmentStats();

      expect(stats.totalAssigned).toBeGreaterThanOrEqual(2);
      expect(stats.unassigned).toBeGreaterThanOrEqual(0);
      expect(stats.byUser).toHaveLength(3);
      
      const user1Stats = stats.byUser.find(userStat => userStat.userId === testUserId1);
      const user2Stats = stats.byUser.find(userStat => userStat.userId === testUserId2);
      
      expect(user1Stats?.count).toBeGreaterThanOrEqual(1);
      expect(user2Stats?.count).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Orphaned Records Reassignment', () => {
    it('should reassign orphaned records when user is deleted', async () => {
      // Assign entity to user
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);

      // Simulate user deletion by deactivating and removing assignments
      await supabase.from('user_profiles')
        .update({ is_active: false })
        .eq('id', testUserId1);

      // Reassign orphaned records
      const result = await AssignmentService.reassignOrphanedRecords(
        testUserId1,
        testUserId2
      );

      expect(result.success).toBe(true);
      expect(result.message).toContain('Successfully reassigned');

      // Verify reassignment
      const { data: entity } = await supabase.from('people')
        .select('owner_id')
        .eq('id', testEntityId1)
        .single();

      expect(entity.owner_id).toBe(testUserId2);
    });
  });

  describe('Concurrent Assignment Handling', () => {
    it('should handle concurrent assignments gracefully', async () => {
      // Simulate concurrent assignments
      const promises = [
        AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId),
        AssignmentService.assignEntity('people', testEntityId1, testUserId2, adminUserId)
      ];

      const results = await Promise.all(promises);

      // One should succeed, one might fail due to race condition
      const successCount = results.filter(result => result.success).length;
      expect(successCount).toBeGreaterThanOrEqual(1);

      // Verify final state
      const { data: entity } = await supabase.from('people')
        .select('owner_id')
        .eq('id', testEntityId1)
        .single();

      expect([testUserId1, testUserId2]).toContain(entity.owner_id);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain referential integrity', async () => {
      // Assign entity
      await AssignmentService.assignEntity('people', testEntityId1, testUserId1, adminUserId);

      // Verify the assignment exists and is valid
      const { data: entity } = await supabase.from('people')
        .select(`
          id,
          owner_id,
          user_profiles!owner_id(id, full_name, is_active)
        `)
        .eq('id', testEntityId1)
        .single();

      expect(entity.owner_id).toBe(testUserId1);
      expect(entity.user_profiles).toBeTruthy();
      expect(entity.user_profiles.is_active).toBe(true);
    });

    it('should handle cascading updates correctly', async () => {
      // Create multiple entities assigned to same user
      const { data: entity3 } = await supabase.from('people').insert({
        name: 'Test Lead 3',
        email: 'lead3@example.com',
        owner_id: testUserId1
      }).select().single();

      // Reassign all records from one user to another
      const result = await AssignmentService.reassignOrphanedRecords(
        testUserId1,
        testUserId2
      );

      expect(result.success).toBe(true);

      // Verify all entities were reassigned
      const { data: entities } = await supabase.from('people')
        .select('owner_id')
        .in('id', [testEntityId1, entity3.id]);

      entities.forEach(entity => {
        expect(entity.owner_id).toBe(testUserId2);
      });
    });
  });
});
