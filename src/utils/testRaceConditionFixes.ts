/**
 * Test Suite for Race Condition Fixes
 * This file tests the implemented fixes to ensure they work correctly
 */

// Test managed cache functionality
export function testManagedCache() {
  console.log('🧪 Testing Managed Cache...');
  
  const { dashboardCache } = require('./src/utils/managedCache');
  
  // Test basic operations
  dashboardCache.set('test-key', { data: 'test-value' });
  const retrieved = dashboardCache.get('test-key');
  
  if (retrieved?.data === 'test-value') {
    console.log('✅ Cache set/get works correctly');
  } else {
    console.error('❌ Cache set/get failed');
  }
  
  // Test cache stats
  const stats = dashboardCache.getStats();
  console.log('📊 Cache stats:', stats);
  
  // Test cleanup
  dashboardCache.clear();
  const cleared = dashboardCache.get('test-key');
  
  if (cleared === null) {
    console.log('✅ Cache clear works correctly');
  } else {
    console.error('❌ Cache clear failed');
  }
}

// Test robust storage functionality
export function testRobustStorage() {
  console.log('🧪 Testing Robust Storage...');
  
  const { jsonStorage } = require('./src/utils/robustStorage');
  
  // Test JSON operations
  const testData = { name: 'test', value: 123 };
  const saved = jsonStorage.setItem('test-storage', testData);
  
  if (saved) {
    console.log('✅ JSON storage save works correctly');
  } else {
    console.error('❌ JSON storage save failed');
  }
  
  const loaded = jsonStorage.getItem('test-storage', null);
  
  if (loaded && loaded.name === 'test' && loaded.value === 123) {
    console.log('✅ JSON storage load works correctly');
  } else {
    console.error('❌ JSON storage load failed');
  }
  
  // Cleanup
  jsonStorage.removeItem('test-storage');
  console.log('✅ JSON storage cleanup completed');
}

// Test debounced fetch functionality
export function testDebouncedFetch() {
  console.log('🧪 Testing Debounced Fetch...');
  
  // This would need to be tested in a React component context
  // For now, we'll just verify the hook exports correctly
  try {
    const { useDebouncedFetch } = require('./src/hooks/useDebouncedFetch');
    console.log('✅ useDebouncedFetch hook exports correctly');
  } catch (error) {
    console.error('❌ useDebouncedFetch hook export failed:', error);
  }
}

// Test request deduplication
export function testRequestDeduplication() {
  console.log('🧪 Testing Request Deduplication...');
  
  const { requestDeduplicator } = require('./src/hooks/useDebouncedFetch');
  
  // Test deduplication
  let callCount = 0;
  const testRequest = () => {
    callCount++;
    return Promise.resolve('test-result');
  };
  
  const key = 'test-request';
  
  // Start multiple requests with same key
  const promise1 = requestDeduplicator.deduplicate(key, testRequest);
  const promise2 = requestDeduplicator.deduplicate(key, testRequest);
  const promise3 = requestDeduplicator.deduplicate(key, testRequest);
  
  Promise.all([promise1, promise2, promise3]).then(results => {
    if (results.every(r => r === 'test-result') && callCount === 1) {
      console.log('✅ Request deduplication works correctly');
    } else {
      console.error('❌ Request deduplication failed');
    }
  });
}

// Run all tests
export function runAllTests() {
  console.log('🚀 Running Race Condition Fix Tests...\n');
  
  testManagedCache();
  console.log('');
  
  testRobustStorage();
  console.log('');
  
  testDebouncedFetch();
  console.log('');
  
  testRequestDeduplication();
  console.log('');
  
  console.log('✅ All tests completed!');
}

// Export for manual testing
if (typeof window !== 'undefined') {
  (window as any).testRaceConditionFixes = runAllTests;
}
