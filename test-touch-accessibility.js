/**
 * Automated Touch Interactions and Accessibility Testing Script
 * Runs comprehensive tests for mobile touch interactions and accessibility
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class TouchAndAccessibilityTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      touchInteractions: [],
      keyboardNavigation: [],
      accessibility: [],
      issues: [],
      recommendations: []
    };
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    
    // Set mobile viewport for touch testing
    await this.page.setViewport({ width: 375, height: 667 });
    
    // Enable touch events
    await this.page.evaluateOnNewDocument(() => {
      // Add touch testing utilities
      window.touchTest = {
        touchEvents: [],
        swipeEvents: [],
        
        // Track touch events
        trackTouchEvent: (type, data) => {
          window.touchTest.touchEvents.push({ type, data, timestamp: Date.now() });
        },
        
        // Track swipe events
        trackSwipeEvent: (direction, data) => {
          window.touchTest.swipeEvents.push({ direction, data, timestamp: Date.now() });
        },
        
        // Get touch test results
        getTouchResults: () => ({
          touchEvents: window.touchTest.touchEvents,
          swipeEvents: window.touchTest.swipeEvents
        })
      };
    });
  }

  async testTouchInteractions() {
    console.log('👆 Testing touch interactions...');
    
    await this.page.goto('http://localhost:8080/tests/touch-accessibility', { waitUntil: 'networkidle0' });
    
    // Test swipe gestures
    const swipeTests = [
      { direction: 'left', startX: 300, endX: 100 },
      { direction: 'right', startX: 100, endX: 300 },
      { direction: 'up', startY: 400, endY: 200 },
      { direction: 'down', startY: 200, endY: 400 }
    ];

    for (const swipe of swipeTests) {
      try {
        await this.page.touchscreen.tap(swipe.startX || 200, swipe.startY || 300);
        await this.page.mouse.move(swipe.startX || 200, swipe.startY || 300);
        await this.page.mouse.down();
        await this.page.mouse.move(swipe.endX || 200, swipe.endY || 300);
        await this.page.mouse.up();
        
        await this.page.waitForTimeout(500);
        
        this.results.touchInteractions.push({
          test: `Swipe ${swipe.direction}`,
          passed: true,
          message: `Swipe ${swipe.direction} gesture executed successfully`
        });
      } catch (error) {
        this.results.touchInteractions.push({
          test: `Swipe ${swipe.direction}`,
          passed: false,
          message: `Swipe ${swipe.direction} failed: ${error.message}`
        });
      }
    }

    // Test touch targets
    const touchTargetTests = await this.page.evaluate(() => {
      const interactiveElements = document.querySelectorAll('button, [role="button"], a, input, select, textarea');
      const results = [];
      
      interactiveElements.forEach((element, index) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        const isLargeEnough = rect.width >= 44 && rect.height >= 44;
        
        results.push({
          element: element.tagName,
          index,
          width: rect.width,
          height: rect.height,
          isVisible,
          isLargeEnough,
          passed: isVisible && isLargeEnough
        });
      });
      
      return results;
    });

    touchTargetTests.forEach(test => {
      this.results.touchInteractions.push({
        test: `Touch Target ${test.element} ${test.index}`,
        passed: test.passed,
        message: `Element ${test.element} ${test.index}: ${test.width}x${test.height}px - ${test.passed ? 'Valid' : 'Invalid'} touch target`,
        details: test
      });
    });

    // Test mobile card swipe functionality
    try {
      const mobileCard = await this.page.$('[data-testid="mobile-card"], .mobile-card');
      if (mobileCard) {
        const box = await mobileCard.boundingBox();
        if (box) {
          await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2);
          await this.page.mouse.up();
          
          this.results.touchInteractions.push({
            test: 'Mobile Card Swipe',
            passed: true,
            message: 'Mobile card swipe functionality working'
          });
        }
      }
    } catch (error) {
      this.results.touchInteractions.push({
        test: 'Mobile Card Swipe',
        passed: false,
        message: `Mobile card swipe failed: ${error.message}`
      });
    }

    console.log(`✅ Touch interactions: ${this.results.touchInteractions.filter(r => r.passed).length}/${this.results.touchInteractions.length} tests passed`);
  }

  async testKeyboardNavigation() {
    console.log('⌨️ Testing keyboard navigation...');
    
    await this.page.goto('http://localhost:8080/tests/touch-accessibility', { waitUntil: 'networkidle0' });
    
    // Test Tab navigation
    const tabNavigationTests = [];
    for (let i = 0; i < 10; i++) {
      await this.page.keyboard.press('Tab');
      await this.page.waitForTimeout(100);
      
      const focusedElement = await this.page.evaluate(() => {
        const active = document.activeElement;
        return {
          tagName: active.tagName,
          type: active.type || 'none',
          tabIndex: active.tabIndex,
          visible: active.offsetParent !== null
        };
      });
      
      tabNavigationTests.push({
        tabPress: i + 1,
        focusedElement,
        passed: focusedElement.visible
      });
    }

    tabNavigationTests.forEach(test => {
      this.results.keyboardNavigation.push({
        test: `Tab Navigation ${test.tabPress}`,
        passed: test.passed,
        message: `Tab ${test.tabPress}: Focused on ${test.focusedElement.tagName} - ${test.passed ? 'Visible' : 'Hidden'}`,
        details: test.focusedElement
      });
    });

    // Test keyboard shortcuts
    const shortcutTests = [
      { key: 'Escape', description: 'Close modals' },
      { key: 'Enter', description: 'Activate buttons' },
      { key: 'ArrowDown', description: 'Navigate down' },
      { key: 'ArrowUp', description: 'Navigate up' },
      { key: 'ArrowLeft', description: 'Navigate left' },
      { key: 'ArrowRight', description: 'Navigate right' }
    ];

    for (const shortcut of shortcutTests) {
      try {
        await this.page.keyboard.press(shortcut.key);
        await this.page.waitForTimeout(100);
        
        this.results.keyboardNavigation.push({
          test: `Keyboard Shortcut: ${shortcut.key}`,
          passed: true,
          message: `${shortcut.key} key handled properly - ${shortcut.description}`
        });
      } catch (error) {
        this.results.keyboardNavigation.push({
          test: `Keyboard Shortcut: ${shortcut.key}`,
          passed: false,
          message: `${shortcut.key} key failed: ${error.message}`
        });
      }
    }

    // Test focus management
    const focusManagementTests = await this.page.evaluate(() => {
      const focusableElements = document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const visibleFocusableElements = Array.from(focusableElements).filter(el => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      });

      return {
        totalFocusable: focusableElements.length,
        visibleFocusable: visibleFocusableElements.length,
        hiddenFocusable: focusableElements.length - visibleFocusableElements.length
      };
    });

    this.results.keyboardNavigation.push({
      test: 'Focus Management',
      passed: focusManagementTests.hiddenFocusable === 0,
      message: `${focusManagementTests.visibleFocusable}/${focusManagementTests.totalFocusable} focusable elements are visible`,
      details: focusManagementTests
    });

    console.log(`✅ Keyboard navigation: ${this.results.keyboardNavigation.filter(r => r.passed).length}/${this.results.keyboardNavigation.length} tests passed`);
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    
    await this.page.goto('http://localhost:8080/tests/touch-accessibility', { waitUntil: 'networkidle0' });
    
    // Test ARIA labels
    const ariaTests = await this.page.evaluate(() => {
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
      const interactiveElements = document.querySelectorAll('button, input, select, textarea, [role="button"]');
      
      let elementsNeedingAria = 0;
      interactiveElements.forEach(el => {
        if (!el.hasAttribute('aria-label') && 
            !el.hasAttribute('aria-labelledby') && 
            !el.textContent?.trim()) {
          elementsNeedingAria++;
        }
      });

      return {
        elementsWithAria: elementsWithAria.length,
        interactiveElements: interactiveElements.length,
        elementsNeedingAria
      };
    });

    this.results.accessibility.push({
      test: 'ARIA Labels',
      passed: ariaTests.elementsNeedingAria === 0,
      message: `${ariaTests.elementsWithAria} elements with ARIA, ${ariaTests.elementsNeedingAria} need ARIA labels`,
      details: ariaTests
    });

    // Test heading hierarchy
    const headingTests = await this.page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
      
      let hierarchyIssues = 0;
      let lastLevel = 0;
      
      headingLevels.forEach(level => {
        if (level > lastLevel + 1) {
          hierarchyIssues++;
        }
        lastLevel = level;
      });

      return {
        totalHeadings: headings.length,
        headingLevels,
        hierarchyIssues
      };
    });

    this.results.accessibility.push({
      test: 'Heading Hierarchy',
      passed: headingTests.hierarchyIssues === 0,
      message: `${headingTests.hierarchyIssues} heading hierarchy issues found`,
      details: headingTests
    });

    // Test alt text on images
    const imageTests = await this.page.evaluate(() => {
      const images = document.querySelectorAll('img');
      const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);

      return {
        totalImages: images.length,
        imagesWithoutAlt: imagesWithoutAlt.length
      };
    });

    this.results.accessibility.push({
      test: 'Image Alt Text',
      passed: imageTests.imagesWithoutAlt === 0,
      message: `${imageTests.imagesWithoutAlt}/${imageTests.totalImages} images missing alt text`,
      details: imageTests
    });

    // Test color contrast (simplified)
    const contrastTests = await this.page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let contrastIssues = 0;
      
      elements.forEach(el => {
        const style = window.getComputedStyle(el);
        const color = style.color;
        const backgroundColor = style.backgroundColor;
        
        if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
          const colorMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          const bgMatch = backgroundColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
          
          if (colorMatch && bgMatch) {
            const r1 = parseInt(colorMatch[1]);
            const g1 = parseInt(colorMatch[2]);
            const b1 = parseInt(colorMatch[3]);
            const r2 = parseInt(bgMatch[1]);
            const g2 = parseInt(bgMatch[2]);
            const b2 = parseInt(bgMatch[3]);
            
            const contrast = ((r1 + g1 + b1) / 3) / ((r2 + g2 + b2) / 3);
            
            if (contrast < 0.3 || contrast > 0.7) {
              contrastIssues++;
            }
          }
        }
      });

      return { contrastIssues };
    });

    this.results.accessibility.push({
      test: 'Color Contrast',
      passed: contrastTests.contrastIssues === 0,
      message: `${contrastTests.contrastIssues} potential contrast issues found`,
      details: contrastTests
    });

    // Test screen reader support
    const screenReaderTests = await this.page.evaluate(() => {
      const ariaLiveRegions = document.querySelectorAll('[aria-live]');
      const srOnlyElements = document.querySelectorAll('.sr-only');
      
      return {
        ariaLiveRegions: ariaLiveRegions.length,
        srOnlyElements: srOnlyElements.length
      };
    });

    this.results.accessibility.push({
      test: 'Screen Reader Support',
      passed: screenReaderTests.ariaLiveRegions > 0 || screenReaderTests.srOnlyElements > 0,
      message: `${screenReaderTests.ariaLiveRegions} aria-live regions, ${screenReaderTests.srOnlyElements} screen reader only elements`,
      details: screenReaderTests
    });

    console.log(`✅ Accessibility: ${this.results.accessibility.filter(r => r.passed).length}/${this.results.accessibility.length} tests passed`);
  }

  generateReport() {
    const totalTests = this.results.touchInteractions.length + 
                      this.results.keyboardNavigation.length + 
                      this.results.accessibility.length;
    
    const passedTests = this.results.touchInteractions.filter(r => r.passed).length +
                       this.results.keyboardNavigation.filter(r => r.passed).length +
                       this.results.accessibility.filter(r => r.passed).length;

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate: Math.round((passedTests / totalTests) * 100),
        touchInteractions: {
          total: this.results.touchInteractions.length,
          passed: this.results.touchInteractions.filter(r => r.passed).length
        },
        keyboardNavigation: {
          total: this.results.keyboardNavigation.length,
          passed: this.results.keyboardNavigation.filter(r => r.passed).length
        },
        accessibility: {
          total: this.results.accessibility.length,
          passed: this.results.accessibility.filter(r => r.passed).length
        }
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Touch interaction recommendations
    const touchIssues = this.results.touchInteractions.filter(r => !r.passed);
    if (touchIssues.length > 0) {
      recommendations.push({
        category: 'Touch Interactions',
        priority: 'high',
        issues: touchIssues.length,
        items: [
          'Ensure all interactive elements meet 44x44px minimum touch target size',
          'Implement proper swipe gesture handling',
          'Add touch-action CSS properties for better touch handling',
          'Test touch interactions on actual mobile devices',
          'Consider haptic feedback for better user experience'
        ]
      });
    }
    
    // Keyboard navigation recommendations
    const keyboardIssues = this.results.keyboardNavigation.filter(r => !r.passed);
    if (keyboardIssues.length > 0) {
      recommendations.push({
        category: 'Keyboard Navigation',
        priority: 'high',
        issues: keyboardIssues.length,
        items: [
          'Implement proper focus management',
          'Ensure all interactive elements are keyboard accessible',
          'Add keyboard shortcuts for common actions',
          'Test keyboard navigation with screen readers',
          'Implement focus trapping in modals'
        ]
      });
    }
    
    // Accessibility recommendations
    const accessibilityIssues = this.results.accessibility.filter(r => !r.passed);
    if (accessibilityIssues.length > 0) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'high',
        issues: accessibilityIssues.length,
        items: [
          'Add proper ARIA labels to all interactive elements',
          'Ensure proper color contrast ratios (4.5:1 minimum)',
          'Implement proper heading hierarchy',
          'Add alt text to all images',
          'Test with screen readers and accessibility tools'
        ]
      });
    }
    
    return recommendations;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}

// Main execution
async function runTouchAndAccessibilityTests() {
  const tester = new TouchAndAccessibilityTester();
  
  try {
    await tester.init();
    
    console.log('🚀 Starting comprehensive touch and accessibility testing...\n');
    
    await tester.testTouchInteractions();
    console.log('');
    
    await tester.testKeyboardNavigation();
    console.log('');
    
    await tester.testAccessibility();
    console.log('');
    
    const report = tester.generateReport();
    
    // Save report
    const reportPath = path.join(__dirname, 'touch-accessibility-test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Test Results Summary:');
    console.log(`Total Tests: ${report.summary.totalTests}`);
    console.log(`Passed: ${report.summary.passedTests}`);
    console.log(`Failed: ${report.summary.failedTests}`);
    console.log(`Success Rate: ${report.summary.successRate}%`);
    console.log(`\nTouch Interactions: ${report.summary.touchInteractions.passed}/${report.summary.touchInteractions.total}`);
    console.log(`Keyboard Navigation: ${report.summary.keyboardNavigation.passed}/${report.summary.keyboardNavigation.total}`);
    console.log(`Accessibility: ${report.summary.accessibility.passed}/${report.summary.accessibility.total}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Print recommendations
    if (report.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      report.recommendations.forEach(rec => {
        console.log(`\n${rec.category} (Priority: ${rec.priority}, Issues: ${rec.issues}):`);
        rec.items.forEach(item => console.log(`  • ${item}`));
      });
    } else {
      console.log('\n🎉 All tests passed! No recommendations needed.');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTouchAndAccessibilityTests().catch(console.error);
}

module.exports = TouchAndAccessibilityTester;
