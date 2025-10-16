/**
 * Mobile Testing Script
 * Run this to test mobile functionality
 */

// Test mobile components
export function runMobileTests() {
  console.log('🧪 Running Mobile Tests...');

  // Test 1: Mobile Detection
  const testMobileDetection = () => {
    const isMobile = window.innerWidth < 768;
    console.log(
      `📱 Mobile Detection: ${isMobile ? 'PASS' : 'FAIL'} (Width: ${window.innerWidth}px)`
    );
    return isMobile;
  };

  // Test 2: Touch Targets
  const testTouchTargets = () => {
    const buttons = document.querySelectorAll('button, [role="button"]');
    let allValid = true;

    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (rect.height < 44 || rect.width < 44) {
        allValid = false;
        console.warn(`❌ Touch target too small:`, button);
      }
    });

    console.log(
      `👆 Touch Targets: ${allValid ? 'PASS' : 'FAIL'} (${buttons.length} elements checked)`
    );
    return allValid;
  };

  // Test 3: Viewport Meta
  const testViewportMeta = () => {
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const hasViewport = viewportMeta !== null;
    console.log(`📐 Viewport Meta: ${hasViewport ? 'PASS' : 'FAIL'}`);
    return hasViewport;
  };

  // Test 4: Mobile Navigation
  const testMobileNavigation = () => {
    const mobileNav = document.querySelector('[data-mobile-nav]');
    const hamburgerMenu = document.querySelector('[data-menu-button]');
    const hasMobileNav = mobileNav !== null || hamburgerMenu !== null;
    console.log(`🧭 Mobile Navigation: ${hasMobileNav ? 'PASS' : 'FAIL'}`);
    return hasMobileNav;
  };

  // Test 5: Form Inputs
  const testFormInputs = () => {
    const inputs = document.querySelectorAll('input, textarea, select');
    let allValid = true;

    inputs.forEach(input => {
      const rect = input.getBoundingClientRect();
      if (rect.height < 44) {
        allValid = false;
        console.warn(`❌ Form input too small:`, input);
      }
    });

    console.log(
      `📝 Form Inputs: ${allValid ? 'PASS' : 'FAIL'} (${inputs.length} elements checked)`
    );
    return allValid;
  };

  // Test 6: Performance
  const testPerformance = () => {
    const loadTime = performance.now();
    const isFast = loadTime < 3000;
    console.log(
      `⚡ Performance: ${isFast ? 'PASS' : 'FAIL'} (Load time: ${loadTime.toFixed(2)}ms)`
    );
    return isFast;
  };

  // Run all tests
  const results = {
    mobileDetection: testMobileDetection(),
    touchTargets: testTouchTargets(),
    viewportMeta: testViewportMeta(),
    mobileNavigation: testMobileNavigation(),
    formInputs: testFormInputs(),
    performance: testPerformance(),
  };

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);

  if (passedTests === totalTests) {
    console.log('🎉 All mobile tests passed!');
  } else {
    console.log(
      '⚠️ Some mobile tests failed. Check the output above for details.'
    );
  }

  return results;
}

// Auto-run tests in development
if (import.meta.env.DEV === true) {
  // Run tests after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(runMobileTests, 1000);
    });
  } else {
    setTimeout(runMobileTests, 1000);
  }
}

export default runMobileTests;
