import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const stylingInfo = [];
  
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

  try {
    console.log('🎨 Testing Tailwind CSS v3 styling restoration...');
    
    // Test main page
    await page.goto('http://localhost:8082', { waitUntil: 'networkidle' });
    
    // Check if Tailwind CSS is working
    const tailwindWorking = await page.evaluate(() => {
      const testElement = document.createElement('div');
      testElement.className = 'bg-blue-500 text-white p-4 rounded-lg';
      document.body.appendChild(testElement);
      
      const styles = window.getComputedStyle(testElement);
      const hasBackground = styles.backgroundColor !== 'rgba(0, 0, 0, 0)' && styles.backgroundColor !== 'transparent';
      const hasTextColor = styles.color !== 'rgba(0, 0, 0, 0)' && styles.color !== 'transparent';
      const hasPadding = styles.padding !== '0px';
      const hasBorderRadius = styles.borderRadius !== '0px';
      
      document.body.removeChild(testElement);
      
      return {
        hasBackground,
        hasTextColor,
        hasPadding,
        hasBorderRadius,
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius
      };
    });
    
    console.log('🎨 Tailwind CSS Test Results:', tailwindWorking);
    
    // Check main content styling
    const mainContentInfo = await page.evaluate(() => {
      const mainDiv = document.querySelector('main');
      const contentDiv = document.querySelector('main > div');
      
      if (!mainDiv || !contentDiv) return null;
      
      const mainStyles = window.getComputedStyle(mainDiv);
      const contentStyles = window.getComputedStyle(contentDiv);
      
      return {
        mainBackground: mainStyles.backgroundColor,
        mainClasses: mainDiv.className,
        contentBackground: contentStyles.backgroundColor,
        contentClasses: contentDiv.className,
        fontFamily: mainStyles.fontFamily,
        fontSize: mainStyles.fontSize
      };
    });
    
    console.log('📄 Main Content Styling:', mainContentInfo);
    
    // Check if fonts are loading properly
    const fontInfo = await page.evaluate(() => {
      const body = document.body;
      const styles = window.getComputedStyle(body);
      
      return {
        fontFamily: styles.fontFamily,
        fontSize: styles.fontSize,
        fontWeight: styles.fontWeight,
        lineHeight: styles.lineHeight,
        color: styles.color
      };
    });
    
    console.log('🔤 Font Information:', fontInfo);
    
    // Navigate to jobs page to test more components
    await page.goto('http://localhost:8082/jobs', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    
    console.log('\n📊 FINAL RESULTS:');
    console.log(`Total errors found: ${errors.length}`);
    
    if (tailwindWorking.hasBackground && tailwindWorking.hasTextColor && tailwindWorking.hasPadding) {
      console.log('✅ SUCCESS: Tailwind CSS v3 is working correctly!');
    } else {
      console.log('❌ ISSUE: Tailwind CSS may not be working properly');
    }
    
    if (errors.length === 0) {
      console.log('🎉 SUCCESS: No errors found!');
    } else {
      console.log('❌ ERRORS STILL PRESENT:');
      errors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.timestamp}] ${error.text}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  } finally {
    await browser.close();
  }
})();
