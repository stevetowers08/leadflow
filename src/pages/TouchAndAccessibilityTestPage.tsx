/**
 * Test Page for Touch Interactions and Accessibility
 * Provides a dedicated page to run comprehensive tests
 */

import React from 'react';
import TouchAndAccessibilityTestSuite from '@/components/TouchAndAccessibilityTestSuite';
import { usePageMeta } from '@/hooks/usePageMeta';

const TouchAndAccessibilityTestPage: React.FC = () => {
  // Set page meta tags
  usePageMeta({
    title: 'Touch & Accessibility Tests - Empowr CRM',
    description: 'Comprehensive testing suite for mobile touch interactions, keyboard navigation, and accessibility features.',
    keywords: 'touch tests, accessibility tests, keyboard navigation, mobile testing, CRM testing',
    ogTitle: 'Touch & Accessibility Tests - Empowr CRM',
    ogDescription: 'Test mobile touch interactions, keyboard navigation, and accessibility features.',
    twitterTitle: 'Touch & Accessibility Tests - Empowr CRM',
    twitterDescription: 'Test mobile touch interactions, keyboard navigation, and accessibility features.'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <TouchAndAccessibilityTestSuite />
    </div>
  );
};

export default TouchAndAccessibilityTestPage;
