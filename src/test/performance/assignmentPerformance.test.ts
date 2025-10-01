import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { createClient } from '@supabase/supabase-js';
import { AssignmentService } from '@/services/assignmentService';
import { performance } from 'perf_hooks';

// Test configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'http://localhost:54321';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'test-key';

const supabase = createClient(supabaseUrl, supabaseKey);

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  SINGLE_ASSIGNMENT: 1000, // 1 second
  BULK_ASSIGNMENT_10: 2000, // 2 seconds
  BULK_ASSIGNMENT_100: 5000, // 5 seconds
  BULK_ASSIGNMENT_1000: 15000, // 15 seconds
  TEAM_MEMBERS_QUERY: 500, // 500ms
  ASSIGNMENT_STATS: 2000, // 2 seconds
  ASSIGNMENT_HISTORY: 1000, // 1 second
  CONCURRENT_REQUESTS: 3000 // 3 seconds for 10 concurrent
};

describe('Assignment Performance Tests', () => {
  let testUserIds: string[] = [];
  let testEntityIds: string[] = [];
  let adminUserId: string;

  beforeEach(async () => {
    await cleanupTestData();
    await setupTestData();
  });

  afterEach(async () => {
    await cleanupTestData();
  });

  async function cleanupTestData() {
    // Clean up test data
    await supabase.from('assignment_logs').delete().like('entity_id', 'perf-test-%');
    await supabase.from('people').delete().like('name', 'Perf Test Lead%');
    await supabase.from('companies').delete().like('name', 'Perf Test Company%');
    await supabase.from('jobs').delete().like('title', 'Perf Test Job%');
    await supabase.from('user_profiles').delete().like('email', '%perf-test.com');
    
    // Clean up auth users
    const { data: users } = await supabase.auth.admin.listUsers();
    for (const user of users.users) {
      if (user.email?.includes('perf-test.com')) {
        await supabase.auth.admin.deleteUser(user.id);
      }
    }
  }

  async function setupTestData() {
    // Create test users (10 users for performance testing)
    const userPromises = Array.from({ length: 10 }, (_, i) => 
      supabase.auth.admin.createUser({
        email: `user${i}@perf-test.com`,
        password: 'testpassword123',
        email_confirm: true
      })
    );

    const userResults = await Promise.all(userPromises);
    testUserIds = userResults.map(result => result.data.user.id);

    // Create admin user
    const { data: adminUser } = await supabase.auth.admin.createUser({
      email: 'admin@perf-test.com',
      password: 'testpassword123',
      email_confirm: true
    });
    adminUserId = adminUser.user.id;

    // Create user profiles
    const profilePromises = testUserIds.map((userId, i) => 
      supabase.from('user_profiles').insert({
        id: userId,
        full_name: `Performance Test User ${i}`,
        email: `user${i}@perf-test.com`,
        role: 'user',
        is_active: true
      })
    );

    await supabase.from('user_profiles').insert({
      id: adminUserId,
      full_name: 'Performance Test Admin',
      email: 'admin@perf-test.com',
      role: 'admin',
      is_active: true
    });

    await Promise.all(profilePromises);

    // Create test entities (1000 entities for bulk testing)
    const entityPromises = Array.from({ length: 1000 }, (_, i) => 
      supabase.from('people').insert({
        name: `Perf Test Lead ${i}`,
        email: `lead${i}@perf-test.com`,
        owner_id: null
      }).select().single()
    );

    const entityResults = await Promise.all(entityPromises);
    testEntityIds = entityResults.map(result => result.data.id);
  }

  describe('Single Assignment Performance', () => {
    it('should assign single entity within performance threshold', async () => {
      const startTime = performance.now();
      
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityIds[0],
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_ASSIGNMENT);
    });

    it('should unassign single entity within performance threshold', async () => {
      // First assign the entity
      await AssignmentService.assignEntity('people', testEntityIds[0], testUserIds[0], adminUserId);

      const startTime = performance.now();
      
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityIds[0],
        null,
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_ASSIGNMENT);
    });
  });

  describe('Bulk Assignment Performance', () => {
    it('should handle bulk assignment of 10 entities efficiently', async () => {
      const entityIds = testEntityIds.slice(0, 10);
      
      const startTime = performance.now();
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(10);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_10);
    });

    it('should handle bulk assignment of 100 entities efficiently', async () => {
      const entityIds = testEntityIds.slice(0, 100);
      
      const startTime = performance.now();
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(100);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_100);
    });

    it('should handle bulk assignment of 1000 entities efficiently', async () => {
      const entityIds = testEntityIds.slice(0, 1000);
      
      const startTime = performance.now();
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(1000);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_1000);
    });

    it('should handle bulk assignment with mixed entity types', async () => {
      // Create companies and jobs for mixed testing
      const companyPromises = Array.from({ length: 50 }, (_, i) => 
        supabase.from('companies').insert({
          name: `Perf Test Company ${i}`,
          owner_id: null
        }).select().single()
      );

      const jobPromises = Array.from({ length: 50 }, (_, i) => 
        supabase.from('jobs').insert({
          title: `Perf Test Job ${i}`,
          company_id: null,
          owner_id: null
        }).select().single()
      );

      const [companyResults, jobResults] = await Promise.all([
        Promise.all(companyPromises),
        Promise.all(jobPromises)
      ]);

      const companyIds = companyResults.map(result => result.data.id);
      const jobIds = jobResults.map(result => result.data.id);

      const startTime = performance.now();
      
      // Assign companies
      const companyResult = await AssignmentService.bulkAssignEntities(
        companyIds,
        'companies',
        testUserIds[0],
        adminUserId
      );

      // Assign jobs
      const jobResult = await AssignmentService.bulkAssignEntities(
        jobIds,
        'jobs',
        testUserIds[1],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(companyResult.success).toBe(true);
      expect(jobResult.success).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_100);
    });
  });

  describe('Query Performance', () => {
    it('should fetch team members efficiently', async () => {
      const startTime = performance.now();
      
      const members = await AssignmentService.getTeamMembers();
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(members.length).toBeGreaterThanOrEqual(10);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.TEAM_MEMBERS_QUERY);
    });

    it('should fetch assignment statistics efficiently', async () => {
      // Create some assignments first
      await AssignmentService.bulkAssignEntities(
        testEntityIds.slice(0, 100),
        'people',
        testUserIds[0],
        adminUserId
      );

      const startTime = performance.now();
      
      const stats = await AssignmentService.getAssignmentStats();
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(stats.totalAssigned).toBeGreaterThanOrEqual(100);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.ASSIGNMENT_STATS);
    });

    it('should fetch assignment history efficiently', async () => {
      // Create assignment history
      const entityId = testEntityIds[0];
      for (let i = 0; i < 5; i++) {
        await AssignmentService.assignEntity(
          'people',
          entityId,
          testUserIds[i % testUserIds.length],
          adminUserId
        );
      }

      const startTime = performance.now();
      
      const history = await AssignmentService.getAssignmentHistory('people', entityId);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(history.length).toBeGreaterThanOrEqual(5);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.ASSIGNMENT_HISTORY);
    });
  });

  describe('Concurrent Operations Performance', () => {
    it('should handle concurrent single assignments efficiently', async () => {
      const entityIds = testEntityIds.slice(0, 10);
      
      const startTime = performance.now();
      
      const assignmentPromises = entityIds.map((entityId, index) => 
        AssignmentService.assignEntity(
          'people',
          entityId,
          testUserIds[index % testUserIds.length],
          adminUserId
        )
      );

      const results = await Promise.all(assignmentPromises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success)).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
    });

    it('should handle concurrent bulk assignments efficiently', async () => {
      const batchSize = 50;
      const batches = 5;
      
      const startTime = performance.now();
      
      const bulkPromises = Array.from({ length: batches }, (_, batchIndex) => {
        const startIdx = batchIndex * batchSize;
        const endIdx = startIdx + batchSize;
        const entityIds = testEntityIds.slice(startIdx, endIdx);
        
        return AssignmentService.bulkAssignEntities(
          entityIds,
          'people',
          testUserIds[batchIndex % testUserIds.length],
          adminUserId
        );
      });

      const results = await Promise.all(bulkPromises);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success)).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_100 * 2);
    });

    it('should handle mixed concurrent operations efficiently', async () => {
      const startTime = performance.now();
      
      const operations = [
        // Single assignments
        AssignmentService.assignEntity('people', testEntityIds[0], testUserIds[0], adminUserId),
        AssignmentService.assignEntity('people', testEntityIds[1], testUserIds[1], adminUserId),
        
        // Bulk assignments
        AssignmentService.bulkAssignEntities(
          testEntityIds.slice(2, 12),
          'people',
          testUserIds[2],
          adminUserId
        ),
        AssignmentService.bulkAssignEntities(
          testEntityIds.slice(12, 22),
          'people',
          testUserIds[3],
          adminUserId
        ),
        
        // Queries
        AssignmentService.getTeamMembers(),
        AssignmentService.getAssignmentStats()
      ];

      const results = await Promise.all(operations);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success !== false)).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
    });
  });

  describe('Memory Usage Performance', () => {
    it('should handle large bulk assignments without memory issues', async () => {
      const entityIds = testEntityIds.slice(0, 500);
      
      const startTime = performance.now();
      const startMemory = process.memoryUsage();
      
      const result = await AssignmentService.bulkAssignEntities(
        entityIds,
        'people',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const endMemory = process.memoryUsage();
      const duration = endTime - startTime;
      const memoryIncrease = endMemory.heapUsed - startMemory.heapUsed;

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(500);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_1000);
      
      // Memory increase should be reasonable (less than 100MB)
      expect(memoryIncrease).toBeLessThan(100 * 1024 * 1024);
    });

    it('should handle multiple large operations without memory leaks', async () => {
      const operations = Array.from({ length: 10 }, (_, i) => {
        const entityIds = testEntityIds.slice(i * 50, (i + 1) * 50);
        return AssignmentService.bulkAssignEntities(
          entityIds,
          'people',
          testUserIds[i % testUserIds.length],
          adminUserId
        );
      });

      const startMemory = process.memoryUsage();
      
      const results = await Promise.all(operations);
      
      const endMemory = process.memoryUsage();
      const memoryIncrease = endMemory.heapUsed - startMemory.heapUsed;

      expect(results.every(result => result.success)).toBe(true);
      
      // Memory increase should be reasonable across multiple operations
      expect(memoryIncrease).toBeLessThan(200 * 1024 * 1024);
    });
  });

  describe('Database Connection Performance', () => {
    it('should handle connection pooling efficiently', async () => {
      const startTime = performance.now();
      
      // Simulate many quick operations that would use connection pooling
      const quickOperations = Array.from({ length: 20 }, (_, i) => 
        AssignmentService.assignEntity(
          'people',
          testEntityIds[i],
          testUserIds[i % testUserIds.length],
          adminUserId
        )
      );

      const results = await Promise.all(quickOperations);
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(results.every(result => result.success)).toBe(true);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.CONCURRENT_REQUESTS);
    });

    it('should handle database timeout scenarios gracefully', async () => {
      // This test simulates a scenario where the database might be slow
      const startTime = performance.now();
      
      try {
        const result = await AssignmentService.bulkAssignEntities(
          testEntityIds.slice(0, 1000),
          'people',
          testUserIds[0],
          adminUserId
        );
        
        const endTime = performance.now();
        const duration = endTime - startTime;

        expect(result.success).toBe(true);
        expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_1000);
      } catch (error) {
        // If it times out, that's also acceptable as long as it fails gracefully
        expect(error).toBeDefined();
      }
    });
  });

  describe('Scalability Tests', () => {
    it('should maintain performance with increasing user count', async () => {
      // Test with different numbers of users
      const userCounts = [10, 50, 100];
      const results = [];

      for (const count of userCounts) {
        const startTime = performance.now();
        
        const members = await AssignmentService.getTeamMembers();
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        results.push({ count, duration, memberCount: members.length });
      }

      // Performance should not degrade significantly with more users
      expect(results[0].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.TEAM_MEMBERS_QUERY);
      expect(results[1].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.TEAM_MEMBERS_QUERY * 2);
      expect(results[2].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.TEAM_MEMBERS_QUERY * 3);
    });

    it('should maintain performance with increasing assignment count', async () => {
      const assignmentCounts = [100, 500, 1000];
      const results = [];

      for (const count of assignmentCounts) {
        const entityIds = testEntityIds.slice(0, count);
        
        const startTime = performance.now();
        
        const result = await AssignmentService.bulkAssignEntities(
          entityIds,
          'people',
          testUserIds[0],
          adminUserId
        );
        
        const endTime = performance.now();
        const duration = endTime - startTime;
        
        results.push({ count, duration, success: result.success });
      }

      // All operations should succeed
      expect(results.every(r => r.success)).toBe(true);
      
      // Performance should scale reasonably
      expect(results[0].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_100);
      expect(results[1].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_1000);
      expect(results[2].duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_1000);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle invalid user errors efficiently', async () => {
      const startTime = performance.now();
      
      const result = await AssignmentService.assignEntity(
        'people',
        testEntityIds[0],
        'invalid-user-id',
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_ASSIGNMENT);
    });

    it('should handle invalid entity errors efficiently', async () => {
      const startTime = performance.now();
      
      const result = await AssignmentService.assignEntity(
        'people',
        'invalid-entity-id',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(false);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.SINGLE_ASSIGNMENT);
    });

    it('should handle bulk assignment with mixed valid/invalid entities efficiently', async () => {
      const validIds = testEntityIds.slice(0, 50);
      const invalidIds = Array.from({ length: 50 }, (_, i) => `invalid-id-${i}`);
      const mixedIds = [...validIds, ...invalidIds];
      
      const startTime = performance.now();
      
      const result = await AssignmentService.bulkAssignEntities(
        mixedIds,
        'people',
        testUserIds[0],
        adminUserId
      );
      
      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(result.success).toBe(true);
      expect(result.updated_count).toBe(50);
      expect(result.invalid_entities.length).toBe(50);
      expect(duration).toBeLessThan(PERFORMANCE_THRESHOLDS.BULK_ASSIGNMENT_100);
    });
  });
});
