/**
 * Comprehensive Responsive Design and Accessibility Testing Script
 * Tests mobile layout, browser compatibility, touch interactions, and accessibility
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class ResponsiveAccessibilityTester {
  constructor() {
    this.browser = null;
    this.page = null;
    this.results = {
      responsive: [],
      browserCompatibility: [],
      touchInteractions: [],
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
    
    // Set viewport for desktop testing
    await this.page.setViewport({ width: 1920, height: 1080 });
    
    // Enable accessibility testing
    await this.page.evaluateOnNewDocument(() => {
      // Add accessibility testing utilities
      window.accessibilityTest = {
        checkFocusManagement: () => {
          const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          return Array.from(focusableElements).map(el => ({
            tag: el.tagName,
            type: el.type || 'none',
            tabIndex: el.tabIndex,
            ariaLabel: el.getAttribute('aria-label'),
            ariaLabelledBy: el.getAttribute('aria-labelledby'),
            role: el.getAttribute('role'),
            visible: el.offsetParent !== null
          }));
        },
        
        checkARIALabels: () => {
          const elements = document.querySelectorAll('[aria-label], [aria-labelledby], [role]');
          return Array.from(elements).map(el => ({
            tag: el.tagName,
            ariaLabel: el.getAttribute('aria-label'),
            ariaLabelledBy: el.getAttribute('aria-labelledby'),
            role: el.getAttribute('role'),
            hasText: el.textContent.trim().length > 0
          }));
        },
        
        checkColorContrast: () => {
          const elements = document.querySelectorAll('*');
          const issues = [];
          
          elements.forEach(el => {
            const style = window.getComputedStyle(el);
            const color = style.color;
            const backgroundColor = style.backgroundColor;
            
            if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
              // Basic contrast check (simplified)
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
                  issues.push({
                    element: el.tagName,
                    color,
                    backgroundColor,
                    contrast: contrast.toFixed(2)
                  });
                }
              }
            }
          });
          
          return issues;
        }
      };
    });
  }

  async testResponsiveDesign() {
    console.log('🧪 Testing responsive design...');
    
    const viewports = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Large Desktop', width: 2560, height: 1440 }
    ];

    for (const viewport of viewports) {
      await this.page.setViewport(viewport);
      await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
      
      // Wait for content to load
      await this.page.waitForTimeout(2000);
      
      const issues = await this.page.evaluate(() => {
        const problems = [];
        
        // Check for horizontal scroll
        const bodyWidth = document.body.scrollWidth;
        const viewportWidth = window.innerWidth;
        if (bodyWidth > viewportWidth) {
          problems.push({
            type: 'horizontal-scroll',
            message: `Content overflows viewport by ${bodyWidth - viewportWidth}px`,
            severity: 'high'
          });
        }
        
        // Check for fixed width elements that might break layout
        const fixedWidthElements = document.querySelectorAll('*');
        fixedWidthElements.forEach(el => {
          const style = window.getComputedStyle(el);
          const width = style.width;
          if (width.includes('px') && parseInt(width) > viewport.width * 0.9) {
            problems.push({
              type: 'fixed-width',
              element: el.tagName,
              width: width,
              message: `Element ${el.tagName} has fixed width ${width} that might break on smaller screens`,
              severity: 'medium'
            });
          }
        });
        
        // Check for touch target sizes
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
        interactiveElements.forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            problems.push({
              type: 'small-touch-target',
              element: el.tagName,
              width: rect.width,
              height: rect.height,
              message: `Touch target too small: ${rect.width}x${rect.height}px (minimum 44x44px)`,
              severity: 'high'
            });
          }
        });
        
        return problems;
      });
      
      this.results.responsive.push({
        viewport: viewport.name,
        dimensions: `${viewport.width}x${viewport.height}`,
        issues: issues
      });
      
      console.log(`✅ ${viewport.name} (${viewport.width}x${viewport.height}): ${issues.length} issues found`);
    }
  }

  async testBrowserCompatibility() {
    console.log('🌐 Testing browser compatibility...');
    
    const userAgents = [
      {
        name: 'Chrome',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      {
        name: 'Firefox',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0'
      },
      {
        name: 'Safari',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
      },
      {
        name: 'Edge',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
      }
    ];

    for (const browser of userAgents) {
      await this.page.setUserAgent(browser.userAgent);
      await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
      
      const compatibilityIssues = await this.page.evaluate(() => {
        const issues = [];
        
        // Check for CSS Grid support
        const testGrid = document.createElement('div');
        testGrid.style.display = 'grid';
        if (testGrid.style.display !== 'grid') {
          issues.push({
            type: 'css-grid',
            message: 'CSS Grid not supported',
            severity: 'high'
          });
        }
        
        // Check for Flexbox support
        const testFlex = document.createElement('div');
        testFlex.style.display = 'flex';
        if (testFlex.style.display !== 'flex') {
          issues.push({
            type: 'flexbox',
            message: 'Flexbox not supported',
            severity: 'high'
          });
        }
        
        // Check for CSS Custom Properties
        const testCustomProp = document.createElement('div');
        testCustomProp.style.setProperty('--test', 'value');
        if (!testCustomProp.style.getPropertyValue('--test')) {
          issues.push({
            type: 'css-custom-properties',
            message: 'CSS Custom Properties not supported',
            severity: 'medium'
          });
        }
        
        // Check for Intersection Observer
        if (!window.IntersectionObserver) {
          issues.push({
            type: 'intersection-observer',
            message: 'Intersection Observer not supported',
            severity: 'medium'
          });
        }
        
        // Check for ResizeObserver
        if (!window.ResizeObserver) {
          issues.push({
            type: 'resize-observer',
            message: 'Resize Observer not supported',
            severity: 'low'
          });
        }
        
        return issues;
      });
      
      this.results.browserCompatibility.push({
        browser: browser.name,
        userAgent: browser.userAgent,
        issues: compatibilityIssues
      });
      
      console.log(`✅ ${browser.name}: ${compatibilityIssues.length} compatibility issues`);
    }
  }

  async testTouchInteractions() {
    console.log('👆 Testing touch interactions...');
    
    await this.page.setViewport({ width: 375, height: 667 });
    await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    const touchIssues = await this.page.evaluate(() => {
      const issues = [];
      
      // Test swipe functionality
      const swipeableElements = document.querySelectorAll('[data-swipeable], .swipeable');
      if (swipeableElements.length === 0) {
        issues.push({
          type: 'no-swipe-support',
          message: 'No swipeable elements found for mobile navigation',
          severity: 'medium'
        });
      }
      
      // Check for proper touch event handling
      const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
      interactiveElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.pointerEvents === 'none') {
          issues.push({
            type: 'disabled-touch',
            element: el.tagName,
            message: 'Element has pointer-events: none, preventing touch interaction',
            severity: 'high'
          });
        }
      });
      
      // Check for touch-action CSS property
      const touchElements = document.querySelectorAll('*');
      let hasTouchAction = false;
      touchElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.touchAction && style.touchAction !== 'auto') {
          hasTouchAction = true;
        }
      });
      
      if (!hasTouchAction) {
        issues.push({
          type: 'missing-touch-action',
          message: 'No touch-action CSS properties found for better touch handling',
          severity: 'low'
        });
      }
      
      return issues;
    });
    
    // Test actual touch interactions
    try {
      // Test mobile menu toggle
      const menuButton = await this.page.$('button[aria-label*="menu"], button[aria-label*="Menu"]');
      if (menuButton) {
        await menuButton.tap();
        await this.page.waitForTimeout(500);
        
        const sidebar = await this.page.$('.sidebar, [role="navigation"]');
        if (sidebar) {
          const isVisible = await this.page.evaluate(el => {
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
          }, sidebar);
          
          if (!isVisible) {
            touchIssues.push({
              type: 'menu-toggle-failed',
              message: 'Mobile menu toggle did not work properly',
              severity: 'high'
            });
          }
        }
      }
      
      // Test swipe gestures
      const swipeableCard = await this.page.$('[data-swipeable], .swipeable');
      if (swipeableCard) {
        const box = await swipeableCard.boundingBox();
        if (box) {
          await this.page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
          await this.page.mouse.down();
          await this.page.mouse.move(box.x + box.width / 2 - 100, box.y + box.height / 2);
          await this.page.mouse.up();
        }
      }
    } catch (error) {
      touchIssues.push({
        type: 'touch-test-error',
        message: `Touch interaction test failed: ${error.message}`,
        severity: 'medium'
      });
    }
    
    this.results.touchInteractions = touchIssues;
    console.log(`✅ Touch interactions: ${touchIssues.length} issues found`);
  }

  async testAccessibility() {
    console.log('♿ Testing accessibility...');
    
    await this.page.goto('http://localhost:8080', { waitUntil: 'networkidle0' });
    
    const accessibilityIssues = await this.page.evaluate(() => {
      const issues = [];
      
      // Check focus management
      const focusableElements = window.accessibilityTest.checkFocusManagement();
      const invisibleFocusable = focusableElements.filter(el => !el.visible);
      if (invisibleFocusable.length > 0) {
        issues.push({
          type: 'invisible-focusable',
          count: invisibleFocusable.length,
          message: `${invisibleFocusable.length} focusable elements are not visible`,
          severity: 'high'
        });
      }
      
      // Check ARIA labels
      const ariaElements = window.accessibilityTest.checkARIALabels();
      const missingLabels = ariaElements.filter(el => 
        !el.ariaLabel && !el.ariaLabelledBy && !el.hasText
      );
      if (missingLabels.length > 0) {
        issues.push({
          type: 'missing-aria-labels',
          count: missingLabels.length,
          message: `${missingLabels.length} elements missing ARIA labels or text content`,
          severity: 'high'
        });
      }
      
      // Check color contrast
      const contrastIssues = window.accessibilityTest.checkColorContrast();
      if (contrastIssues.length > 0) {
        issues.push({
          type: 'color-contrast',
          count: contrastIssues.length,
          message: `${contrastIssues.length} elements have poor color contrast`,
          severity: 'high'
        });
      }
      
      // Check for missing alt text on images
      const images = document.querySelectorAll('img');
      const missingAlt = Array.from(images).filter(img => !img.alt);
      if (missingAlt.length > 0) {
        issues.push({
          type: 'missing-alt-text',
          count: missingAlt.length,
          message: `${missingAlt.length} images missing alt text`,
          severity: 'high'
        });
      }
      
      // Check for proper heading hierarchy
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
      
      if (hierarchyIssues > 0) {
        issues.push({
          type: 'heading-hierarchy',
          count: hierarchyIssues,
          message: `${hierarchyIssues} heading hierarchy issues found`,
          severity: 'medium'
        });
      }
      
      return issues;
    });
    
    // Test keyboard navigation
    const keyboardIssues = await this.testKeyboardNavigation();
    accessibilityIssues.push(...keyboardIssues);
    
    this.results.accessibility = accessibilityIssues;
    console.log(`✅ Accessibility: ${accessibilityIssues.length} issues found`);
  }

  async testKeyboardNavigation() {
    const issues = [];
    
    try {
      // Test Tab navigation
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
      
      if (!focusedElement.visible) {
        issues.push({
          type: 'invisible-focus',
          message: 'Focus moved to invisible element',
          severity: 'high'
        });
      }
      
      // Test Escape key functionality
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(100);
      
      // Test Enter key on buttons
      const buttons = await this.page.$$('button');
      if (buttons.length > 0) {
        await buttons[0].focus();
        await this.page.keyboard.press('Enter');
        await this.page.waitForTimeout(100);
      }
      
      // Test Arrow key navigation
      await this.page.keyboard.press('ArrowDown');
      await this.page.keyboard.press('ArrowUp');
      await this.page.keyboard.press('ArrowLeft');
      await this.page.keyboard.press('ArrowRight');
      
    } catch (error) {
      issues.push({
        type: 'keyboard-test-error',
        message: `Keyboard navigation test failed: ${error.message}`,
        severity: 'medium'
      });
    }
    
    return issues;
  }

  generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.results.responsive.reduce((sum, r) => sum + r.issues.length, 0) +
                    this.results.browserCompatibility.reduce((sum, r) => sum + r.issues.length, 0) +
                    this.results.touchInteractions.length +
                    this.results.accessibility.length,
        responsiveIssues: this.results.responsive.reduce((sum, r) => sum + r.issues.length, 0),
        browserIssues: this.results.browserCompatibility.reduce((sum, r) => sum + r.issues.length, 0),
        touchIssues: this.results.touchInteractions.length,
        accessibilityIssues: this.results.accessibility.length
      },
      results: this.results,
      recommendations: this.generateRecommendations()
    };
    
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Responsive recommendations
    const responsiveIssues = this.results.responsive.reduce((sum, r) => sum + r.issues.length, 0);
    if (responsiveIssues > 0) {
      recommendations.push({
        category: 'Responsive Design',
        priority: 'high',
        items: [
          'Implement CSS Grid and Flexbox for better responsive layouts',
          'Use relative units (rem, em, %) instead of fixed pixels',
          'Ensure all interactive elements meet minimum 44x44px touch target size',
          'Test on actual devices, not just browser dev tools',
          'Implement proper viewport meta tag'
        ]
      });
    }
    
    // Browser compatibility recommendations
    const browserIssues = this.results.browserCompatibility.reduce((sum, r) => sum + r.issues.length, 0);
    if (browserIssues > 0) {
      recommendations.push({
        category: 'Browser Compatibility',
        priority: 'medium',
        items: [
          'Add polyfills for older browsers if needed',
          'Use CSS fallbacks for modern features',
          'Test on actual target browsers',
          'Consider progressive enhancement approach'
        ]
      });
    }
    
    // Touch interaction recommendations
    if (this.results.touchInteractions.length > 0) {
      recommendations.push({
        category: 'Touch Interactions',
        priority: 'high',
        items: [
          'Implement proper touch-action CSS properties',
          'Add swipe gestures for mobile navigation',
          'Ensure touch targets are large enough (44x44px minimum)',
          'Test touch interactions on actual mobile devices',
          'Consider haptic feedback for better UX'
        ]
      });
    }
    
    // Accessibility recommendations
    if (this.results.accessibility.length > 0) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'high',
        items: [
          'Add proper ARIA labels to all interactive elements',
          'Ensure proper color contrast ratios (4.5:1 minimum)',
          'Implement proper focus management',
          'Add alt text to all images',
          'Use semantic HTML elements',
          'Test with screen readers',
          'Implement keyboard navigation for all functionality'
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
async function runTests() {
  const tester = new ResponsiveAccessibilityTester();
  
  try {
    await tester.init();
    
    console.log('🚀 Starting comprehensive responsive and accessibility testing...\n');
    
    await tester.testResponsiveDesign();
    console.log('');
    
    await tester.testBrowserCompatibility();
    console.log('');
    
    await tester.testTouchInteractions();
    console.log('');
    
    await tester.testAccessibility();
    console.log('');
    
    const report = tester.generateReport();
    
    // Save report
    const reportPath = path.join(__dirname, 'responsive-accessibility-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.log('📊 Test Results Summary:');
    console.log(`Total Issues: ${report.summary.totalIssues}`);
    console.log(`Responsive Issues: ${report.summary.responsiveIssues}`);
    console.log(`Browser Compatibility Issues: ${report.summary.browserIssues}`);
    console.log(`Touch Interaction Issues: ${report.summary.touchIssues}`);
    console.log(`Accessibility Issues: ${report.summary.accessibilityIssues}`);
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Print recommendations
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => {
      console.log(`\n${rec.category} (Priority: ${rec.priority}):`);
      rec.items.forEach(item => console.log(`  • ${item}`));
    });
    
  } catch (error) {
    console.error('❌ Test execution failed:', error);
  } finally {
    await tester.cleanup();
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = ResponsiveAccessibilityTester;
