import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const performanceMetrics = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({
        type: msg.type(),
        text: msg.text(),
        timestamp: new Date().toISOString(),
        url: page.url()
      });
      console.log(`❌ [${new Date().toISOString()}] ERROR: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: page.url()
    });
    console.log(`💥 [${new Date().toISOString()}] PAGE ERROR: ${error.message}`);
  });

  try {
    console.log('🚀 Testing performance and error fixes...');
    
    // Test main page
    const startTime = Date.now();
    await page.goto('http://localhost:8084', { waitUntil: 'networkidle' });
    const loadTime = Date.now() - startTime;
    
    console.log(`⏱️ Page load time: ${loadTime}ms`);
    
    // Get performance metrics
    const metrics = await page.evaluate(() => {
      const [entry] = performance.getEntriesByType('navigation');
      return {
        loadTime: entry.loadEventEnd - entry.startTime,
        domContentLoaded: entry.domContentLoadedEventEnd - entry.startTime,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0,
        largestContentfulPaint: performance.getEntriesByName('largest-contentful-paint')[0]?.startTime || 0
      };
    });
    
    performanceMetrics.push(metrics);
    console.log('📊 Performance Metrics:', metrics);
    
    // Check CSS errors
    const cssErrors = await page.evaluate(() => {
      const errors = [];
      const styleSheets = document.styleSheets;
      for (let i = 0; i < styleSheets.length; i++) {
        try {
          const rules = styleSheets[i].cssRules;
          // This will throw if there are CSS parsing errors
        } catch (e) {
          errors.push(e.message);
        }
      }
      return errors;
    });
    
    console.log('🎨 CSS Errors:', cssErrors.length > 0 ? cssErrors : 'None found');
    
    // Check background colors
    const backgroundInfo = await page.evaluate(() => {
      const mainDiv = document.querySelector('main > div > div');
      if (!mainDiv) return null;
      
      const style = window.getComputedStyle(mainDiv);
      return {
        backgroundColor: style.backgroundColor,
        classes: mainDiv.className
      };
    });
    
    console.log('🎨 Background Info:', backgroundInfo);
    
    // Navigate to jobs page to test resource loading
    await page.goto('http://localhost:8084/jobs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    
    console.log('\n📊 FINAL RESULTS:');
    console.log(`Total errors found: ${errors.length}`);
    console.log(`Performance metrics collected: ${performanceMetrics.length}`);
    
    if (errors.length === 0) {
      console.log('🎉 SUCCESS: No errors found!');
    } else {
      console.log('❌ ERRORS STILL PRESENT:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.timestamp}] ${error.message || error.text}`);
      });
    }
    
    // Performance analysis
    const fcp = metrics.firstContentfulPaint;
    if (fcp < 1800) {
      console.log(`✅ Good First Contentful Paint: ${fcp}ms`);
    } else {
      console.log(`⚠️ Needs improvement First Contentful Paint: ${fcp}ms (threshold: 1800ms)`);
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await browser.close();
  }
})();
