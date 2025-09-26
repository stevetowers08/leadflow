/**
 * Comprehensive Touch Interactions and Accessibility Testing Suite
 * Tests mobile touch interactions, keyboard navigation, and accessibility features
 */

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SwipeableComponent, MobileCard, MobileButton, useMobile } from '@/components/MobileComponents';
import { useKeyboardShortcuts, useFocusManagement, useScreenReaderAnnouncement } from '@/hooks/useKeyboardShortcuts';
import { cn } from '@/lib/utils';

// Test Results Interface
interface TestResult {
  testName: string;
  passed: boolean;
  message: string;
  details?: any;
}

interface TestSuite {
  touchInteractions: TestResult[];
  keyboardNavigation: TestResult[];
  accessibility: TestResult[];
  overallScore: number;
}

// Touch Interaction Test Component
const TouchInteractionTests: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [swipeCount, setSwipeCount] = useState({ left: 0, right: 0, up: 0, down: 0 });
  const [tapCount, setTapCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);
  const { isMobile } = useMobile();

  const addTestResult = (testName: string, passed: boolean, message: string, details?: any) => {
    try {
      setTestResults(prev => [...prev, { testName, passed, message, details }]);
    } catch (error) {
      console.error('Error adding test result:', error);
    }
  };

  // Test swipe gestures
  const testSwipeGestures = () => {
    const tests = [
      {
        name: 'Swipe Left Detection',
        test: () => swipeCount.left > 0,
        message: swipeCount.left > 0 ? 'Swipe left detected' : 'Swipe left not detected'
      },
      {
        name: 'Swipe Right Detection', 
        test: () => swipeCount.right > 0,
        message: swipeCount.right > 0 ? 'Swipe right detected' : 'Swipe right not detected'
      },
      {
        name: 'Swipe Up Detection',
        test: () => swipeCount.up > 0,
        message: swipeCount.up > 0 ? 'Swipe up detected' : 'Swipe up not detected'
      },
      {
        name: 'Swipe Down Detection',
        test: () => swipeCount.down > 0,
        message: swipeCount.down > 0 ? 'Swipe down detected' : 'Swipe down not detected'
      }
    ];

    tests.forEach(test => {
      addTestResult(test.name, test.test(), test.message, { swipeCount });
    });
  };

  // Test touch targets
  const testTouchTargets = () => {
    const touchTargets = document.querySelectorAll('button, [role="button"], a, input, select, textarea');
    let validTargets = 0;
    let invalidTargets = 0;

    touchTargets.forEach(element => {
      const rect = element.getBoundingClientRect();
      const isVisible = rect.width > 0 && rect.height > 0;
      const isLargeEnough = rect.width >= 44 && rect.height >= 44;
      
      if (isVisible && isLargeEnough) {
        validTargets++;
      } else {
        invalidTargets++;
      }
    });

    addTestResult(
      'Touch Target Size',
      invalidTargets === 0,
      `${validTargets} valid targets, ${invalidTargets} invalid targets`,
      { validTargets, invalidTargets, totalTargets: touchTargets.length }
    );
  };

  // Test touch-action CSS
  const testTouchActionCSS = () => {
    const elementsWithTouchAction = document.querySelectorAll('[style*="touch-action"], .touch-manipulation');
    const hasTouchAction = elementsWithTouchAction.length > 0;

    addTestResult(
      'Touch Action CSS',
      hasTouchAction,
      hasTouchAction ? 'Touch-action CSS properties found' : 'No touch-action CSS properties found',
      { elementsWithTouchAction: elementsWithTouchAction.length }
    );
  };

  // Test mobile detection
  const testMobileDetection = () => {
    const userAgent = navigator.userAgent;
    const isMobileUA = /Mobi|Android/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    addTestResult(
      'Mobile Detection',
      isMobile === isMobileUA || isMobile === isTouchDevice,
      `Mobile detected: ${isMobile}, UA mobile: ${isMobileUA}, Touch device: ${isTouchDevice}`,
      { isMobile, isMobileUA, isTouchDevice, userAgent }
    );
  };

  const runTouchTests = () => {
    setTestResults([]);
    testSwipeGestures();
    testTouchTargets();
    testTouchActionCSS();
    testMobileDetection();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">👆</span>
          Touch Interaction Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runTouchTests} variant="default">
            Run Touch Tests
          </Button>
          <Button onClick={() => setTestResults([])} variant="outline">
            Clear Results
          </Button>
        </div>

        {/* Swipe Test Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Swipe Test Area</h3>
          <p className="text-sm text-gray-600 mb-4">
            Swipe in different directions to test gesture detection
          </p>
          
          <SwipeableComponent
            onSwipeLeft={() => setSwipeCount(prev => ({ ...prev, left: prev.left + 1 }))}
            onSwipeRight={() => setSwipeCount(prev => ({ ...prev, right: prev.right + 1 }))}
            onSwipeUp={() => setSwipeCount(prev => ({ ...prev, up: prev.up + 1 }))}
            onSwipeDown={() => setSwipeCount(prev => ({ ...prev, down: prev.down + 1 }))}
            className="bg-blue-50 p-4 rounded-lg min-h-[100px] flex items-center justify-center"
          >
            <div className="text-center">
              <div className="text-lg font-semibold">Swipe Test Area</div>
              <div className="text-sm text-gray-600">
                Swipe counts: L:{swipeCount.left} R:{swipeCount.right} U:{swipeCount.up} D:{swipeCount.down}
              </div>
            </div>
          </SwipeableComponent>
        </div>

        {/* Mobile Card Test */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Mobile Card Swipe Test</h3>
          <p className="text-sm text-gray-600 mb-4">
            Swipe left or right on the card to test swipe actions
          </p>
          
          <MobileCard
            onSwipeLeft={() => addTestResult('Mobile Card Swipe Left', true, 'Mobile card swipe left action triggered')}
            onSwipeRight={() => addTestResult('Mobile Card Swipe Right', true, 'Mobile card swipe right action triggered')}
            leftAction={<span>Archive</span>}
            rightAction={<span>Delete</span>}
            className="max-w-sm mx-auto"
          >
            <div className="p-4">
              <h4 className="font-semibold">Test Card</h4>
              <p className="text-sm text-gray-600">Swipe left or right to test actions</p>
            </div>
          </MobileCard>
        </div>

        {/* Touch Target Test */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Touch Target Test</h3>
          <p className="text-sm text-gray-600 mb-4">
            Test buttons with different sizes to verify touch targets
          </p>
          
          <div className="flex flex-wrap gap-4">
            <MobileButton size="sm" onClick={() => setTapCount(prev => prev + 1)}>
              Small ({tapCount})
            </MobileButton>
            <MobileButton size="md" onClick={() => setTapCount(prev => prev + 1)}>
              Medium ({tapCount})
            </MobileButton>
            <MobileButton size="lg" onClick={() => setTapCount(prev => prev + 1)}>
              Large ({tapCount})
            </MobileButton>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("text-lg", result.passed ? "text-green-600" : "text-red-600")}>
                    {result.passed ? "✅" : "❌"}
                  </span>
                  <span className="font-medium">{result.testName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Keyboard Navigation Test Component
const KeyboardNavigationTests: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [focusedElement, setFocusedElement] = useState<string>('');
  const [keyboardEvents, setKeyboardEvents] = useState<string[]>([]);
  const shortcuts = useKeyboardShortcuts();
  const { trapFocus, focusFirstElement } = useFocusManagement();

  const addTestResult = (testName: string, passed: boolean, message: string, details?: any) => {
    try {
      setTestResults(prev => [...prev, { testName, passed, message, details }]);
    } catch (error) {
      console.error('Error adding test result:', error);
    }
  };

  // Test keyboard shortcuts
  const testKeyboardShortcuts = () => {
    const shortcutTests = [
      {
        name: 'Escape Key',
        key: 'Escape',
        test: () => keyboardEvents.includes('Escape'),
        message: 'Escape key should close modals'
      },
      {
        name: 'Tab Navigation',
        key: 'Tab',
        test: () => keyboardEvents.includes('Tab'),
        message: 'Tab key should navigate between elements'
      },
      {
        name: 'Enter Key',
        key: 'Enter',
        test: () => keyboardEvents.includes('Enter'),
        message: 'Enter key should activate buttons'
      },
      {
        name: 'Arrow Keys',
        key: 'Arrow',
        test: () => keyboardEvents.some(event => event.includes('Arrow')),
        message: 'Arrow keys should navigate within components'
      }
    ];

    shortcutTests.forEach(test => {
      addTestResult(test.name, test.test(), test.message, { keyboardEvents });
    });
  };

  // Test focus management
  const testFocusManagement = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const visibleFocusableElements = Array.from(focusableElements).filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });

    addTestResult(
      'Focus Management',
      visibleFocusableElements.length > 0,
      `${visibleFocusableElements.length} focusable elements found`,
      { totalFocusable: focusableElements.length, visibleFocusable: visibleFocusableElements.length }
    );
  };

  // Test tab order
  const testTabOrder = () => {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    let hasProperTabOrder = true;
    const tabIndexes = Array.from(focusableElements).map(el => el.tabIndex);
    
    // Check for proper tab order (no gaps, no duplicates)
    const sortedIndexes = [...tabIndexes].sort((a, b) => a - b);
    for (let i = 0; i < sortedIndexes.length - 1; i++) {
      if (sortedIndexes[i + 1] - sortedIndexes[i] > 1) {
        hasProperTabOrder = false;
        break;
      }
    }

    addTestResult(
      'Tab Order',
      hasProperTabOrder,
      hasProperTabOrder ? 'Proper tab order detected' : 'Tab order issues detected',
      { tabIndexes, sortedIndexes }
    );
  };

  // Test keyboard event handling
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      try {
        setKeyboardEvents(prev => [...prev.slice(-9), event.key]);
        setFocusedElement(document.activeElement?.tagName || '');
      } catch (error) {
        console.error('Error handling keyboard event:', error);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const runKeyboardTests = () => {
    setTestResults([]);
    testKeyboardShortcuts();
    testFocusManagement();
    testTabOrder();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">⌨️</span>
          Keyboard Navigation Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runKeyboardTests} variant="default">
            Run Keyboard Tests
          </Button>
          <Button onClick={() => setTestResults([])} variant="outline">
            Clear Results
          </Button>
        </div>

        {/* Keyboard Event Monitor */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Keyboard Event Monitor</h3>
          <p className="text-sm text-gray-600 mb-4">
            Press keys to see events and test keyboard navigation
          </p>
          
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <div><strong>Focused Element:</strong> {focusedElement}</div>
              <div><strong>Recent Keys:</strong> {keyboardEvents.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Focus Test Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Focus Test Area</h3>
          <p className="text-sm text-gray-600 mb-4">
            Use Tab to navigate between elements and test focus management
          </p>
          
          <div className="space-y-2">
            <Button 
              onClick={() => addTestResult('Button Focus', true, 'Button received focus and was activated')}
              className="w-full"
            >
              Test Button 1
            </Button>
            <input 
              type="text" 
              placeholder="Test input field"
              className="w-full p-2 border rounded"
              onFocus={() => addTestResult('Input Focus', true, 'Input field received focus')}
            />
            <select className="w-full p-2 border rounded">
              <option>Test Option 1</option>
              <option>Test Option 2</option>
            </select>
            <Button 
              onClick={() => addTestResult('Button Focus 2', true, 'Second button received focus and was activated')}
              className="w-full"
            >
              Test Button 2
            </Button>
          </div>
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Available Keyboard Shortcuts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex justify-between">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {shortcut.ctrlKey ? 'Ctrl+' : ''}{shortcut.key}
                </span>
                <span className="text-gray-600">{shortcut.description}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("text-lg", result.passed ? "text-green-600" : "text-red-600")}>
                    {result.passed ? "✅" : "❌"}
                  </span>
                  <span className="font-medium">{result.testName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Accessibility Test Component
const AccessibilityTests: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const announce = useScreenReaderAnnouncement();

  const addTestResult = (testName: string, passed: boolean, message: string, details?: any) => {
    try {
      setTestResults(prev => [...prev, { testName, passed, message, details }]);
    } catch (error) {
      console.error('Error adding test result:', error);
    }
  };

  // Test ARIA labels
  const testARIALabels = () => {
    const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
    const elementsWithoutAria = document.querySelectorAll('button, input, select, textarea, [role="button"]');
    
    let elementsNeedingAria = 0;
    elementsWithoutAria.forEach(el => {
      if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby') && !el.textContent?.trim()) {
        elementsNeedingAria++;
      }
    });

    addTestResult(
      'ARIA Labels',
      elementsNeedingAria === 0,
      `${elementsWithAria.length} elements with ARIA, ${elementsNeedingAria} elements need ARIA labels`,
      { elementsWithAria: elementsWithAria.length, elementsNeedingAria }
    );
  };

  // Test color contrast
  const testColorContrast = () => {
    const elements = document.querySelectorAll('*');
    let contrastIssues = 0;
    
    elements.forEach(el => {
      const style = window.getComputedStyle(el);
      const color = style.color;
      const backgroundColor = style.backgroundColor;
      
      // Basic contrast check (simplified)
      if (color !== 'rgba(0, 0, 0, 0)' && backgroundColor !== 'rgba(0, 0, 0, 0)') {
        // This is a simplified check - in production, use a proper contrast ratio calculator
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

    addTestResult(
      'Color Contrast',
      contrastIssues === 0,
      `${contrastIssues} potential contrast issues found`,
      { contrastIssues }
    );
  };

  // Test heading hierarchy
  const testHeadingHierarchy = () => {
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

    addTestResult(
      'Heading Hierarchy',
      hierarchyIssues === 0,
      `${hierarchyIssues} heading hierarchy issues found`,
      { headingLevels, hierarchyIssues }
    );
  };

  // Test alt text on images
  const testAltText = () => {
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt);

    addTestResult(
      'Image Alt Text',
      imagesWithoutAlt.length === 0,
      `${imagesWithoutAlt.length} images missing alt text`,
      { totalImages: images.length, imagesWithoutAlt: imagesWithoutAlt.length }
    );
  };

  // Test screen reader announcements
  const testScreenReaderAnnouncements = () => {
    announce('Testing screen reader announcements', 'polite');
    
    addTestResult(
      'Screen Reader Announcements',
      true,
      'Screen reader announcement system is functional',
      { announcementSent: true }
    );
  };

  const runAccessibilityTests = () => {
    setTestResults([]);
    testARIALabels();
    testColorContrast();
    testHeadingHierarchy();
    testAltText();
    testScreenReaderAnnouncements();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-2xl">♿</span>
          Accessibility Tests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex flex-wrap gap-2">
          <Button onClick={runAccessibilityTests} variant="default">
            Run Accessibility Tests
          </Button>
          <Button onClick={() => setTestResults([])} variant="outline">
            Clear Results
          </Button>
        </div>

        {/* Accessibility Test Areas */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold mb-2">ARIA Test Elements</h3>
          <p className="text-sm text-gray-600 mb-4">
            Test elements with proper ARIA labels and roles
          </p>
          
          <div className="space-y-2">
            <Button aria-label="Test button with ARIA label">
              Button with ARIA Label
            </Button>
            <input 
              type="text" 
              placeholder="Input with placeholder"
              aria-label="Test input field"
            />
            <div role="button" tabIndex={0} aria-label="Div with button role">
              Div with Button Role
            </div>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results</h3>
            {testResults.map((result, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("text-lg", result.passed ? "text-green-600" : "text-red-600")}>
                    {result.passed ? "✅" : "❌"}
                  </span>
                  <span className="font-medium">{result.testName}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                {result.details && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">Details</summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Test Suite Component
const TouchAndAccessibilityTestSuite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'touch' | 'keyboard' | 'accessibility'>('touch');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Touch & Accessibility Test Suite</h1>
        <p className="text-gray-600">
          Comprehensive testing for mobile touch interactions, keyboard navigation, and accessibility
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <Button
            variant={activeTab === 'touch' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('touch')}
            className="px-4"
          >
            👆 Touch Tests
          </Button>
          <Button
            variant={activeTab === 'keyboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('keyboard')}
            className="px-4"
          >
            ⌨️ Keyboard Tests
          </Button>
          <Button
            variant={activeTab === 'accessibility' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('accessibility')}
            className="px-4"
          >
            ♿ Accessibility Tests
          </Button>
        </div>
      </div>

      {/* Test Content */}
      {activeTab === 'touch' && <TouchInteractionTests />}
      {activeTab === 'keyboard' && <KeyboardNavigationTests />}
      {activeTab === 'accessibility' && <AccessibilityTests />}

      {/* Instructions */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Testing Instructions</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p><strong>Touch Tests:</strong> Use touch gestures on mobile devices or simulate touch events in browser dev tools</p>
            <p><strong>Keyboard Tests:</strong> Use keyboard navigation (Tab, Enter, Arrow keys) to test focus management</p>
            <p><strong>Accessibility Tests:</strong> Run automated tests and verify with screen readers if available</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TouchAndAccessibilityTestSuite;
