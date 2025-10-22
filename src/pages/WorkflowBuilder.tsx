/**
 * WorkflowBuilder - Workflow Detail/Builder Page
 *
 * Full-screen workflow builder with back button
 * Accessed via /workflows/:id or /workflows/new
 */

import WorkflowBuilder from '@/components/workflow/WorkflowBuilder';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const WorkflowBuilderPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams();
  const [workflowName, setWorkflowName] = useState(
    id === 'new' ? 'Untitled Workflow' : 'New Lead Follow-up'
  );

  const handleBack = () => {
    navigate('/workflows');
  };

  const handleSave = () => {
    toast({
      title: 'Workflow Saved',
      description: 'Your workflow has been saved successfully.',
    });
  };

  const handleSaveAndActivate = () => {
    toast({
      title: 'Workflow Activated',
      description: 'Your workflow has been saved and activated.',
    });
  };

  return (
    <div className='h-screen flex flex-col bg-white'>
      {/* Header with Back Button */}
      <div className='bg-white border-b border-gray-100 px-6 py-3'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <button
              onClick={handleBack}
              className='p-1 text-gray-600 hover:text-gray-900 transition-colors'
            >
              <ArrowLeft className='h-5 w-5' />
            </button>
            <h1 className='text-lg font-medium text-gray-900'>Workflow</h1>
            <input
              type='text'
              value={workflowName}
              onChange={e => setWorkflowName(e.target.value)}
              className='text-base font-medium bg-transparent border-none outline-none text-gray-900 placeholder-gray-400'
              placeholder='Enter workflow name...'
            />
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={handleSave}
              className='px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-md'
            >
              Save Draft
            </button>
            <button
              onClick={handleSaveAndActivate}
              className='px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md'
            >
              Save & Activate
            </button>
          </div>
        </div>
      </div>

      {/* Full-Screen Workflow Builder */}
      <div className='flex-1 overflow-hidden'>
        <WorkflowBuilder />
      </div>
    </div>
  );
};

export default WorkflowBuilderPage;
