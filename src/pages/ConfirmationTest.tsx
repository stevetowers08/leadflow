import React from 'react';
import { ConfirmationProvider } from '@/contexts/ConfirmationContext';
import { ConfirmationExamples } from '@/components/examples/ConfirmationExamples';

/**
 * Test page to verify the confirmation system is working
 * This can be accessed at /test-confirmations for testing
 */
export function ConfirmationTestPage() {
  return (
    <ConfirmationProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <ConfirmationExamples />
        </div>
      </div>
    </ConfirmationProvider>
  );
}

export default ConfirmationTestPage;
