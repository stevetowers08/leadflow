import React from 'react';
import {
  RecruitEdgeLogo,
  RecruitEdgeLogoHorizontal,
  RecruitEdgeLogoVertical,
} from '../components/RecruitEdgeLogo';

export const LogoShowcase: React.FC = () => {
  return (
    <div className='p-8 space-y-8 bg-muted min-h-screen'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-foreground mb-8'>
          RECRUITEDGE Logo Showcase
        </h1>

        {/* Icon Only */}
        <div className='bg-white p-6 rounded-lg shadow-sm border mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Icon Only</h2>
          <div className='flex items-center gap-4'>
            <RecruitEdgeLogo size={24} />
            <RecruitEdgeLogo size={32} />
            <RecruitEdgeLogo size={48} />
            <RecruitEdgeLogo size={64} />
          </div>
        </div>

        {/* Horizontal Layout */}
        <div className='bg-white p-6 rounded-lg shadow-sm border mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Horizontal Layout</h2>
          <div className='space-y-4'>
            <RecruitEdgeLogoHorizontal size={24} />
            <RecruitEdgeLogoHorizontal size={32} />
            <RecruitEdgeLogoHorizontal size={48} />
          </div>
        </div>

        {/* Vertical Layout */}
        <div className='bg-white p-6 rounded-lg shadow-sm border mb-6'>
          <h2 className='text-xl font-semibold mb-4'>Vertical Layout</h2>
          <div className='flex items-start gap-8'>
            <RecruitEdgeLogoVertical size={24} />
            <RecruitEdgeLogoVertical size={32} />
            <RecruitEdgeLogoVertical size={48} />
          </div>
        </div>

        {/* Dark Theme Test */}
        <div className='bg-gray-900 p-6 rounded-lg shadow-sm border mb-6'>
          <h2 className='text-xl font-semibold mb-4 text-white'>Dark Theme</h2>
          <div className='flex items-center gap-4'>
            <RecruitEdgeLogo size={32} className='text-white' />
            <RecruitEdgeLogoHorizontal size={32} className='text-white' />
          </div>
        </div>

        {/* Usage Examples */}
        <div className='bg-white p-6 rounded-lg shadow-sm border'>
          <h2 className='text-xl font-semibold mb-4'>Usage Examples</h2>
          <div className='space-y-4 text-sm text-muted-foreground'>
            <div>
              <code className='bg-gray-100 px-2 py-1 rounded'>
                {'<RecruitEdgeLogo size={32} />'}
              </code>
              <span className='ml-2'>- Icon only</span>
            </div>
            <div>
              <code className='bg-gray-100 px-2 py-1 rounded'>
                {'<RecruitEdgeLogoHorizontal size={32} />'}
              </code>
              <span className='ml-2'>- Logo with horizontal text</span>
            </div>
            <div>
              <code className='bg-gray-100 px-2 py-1 rounded'>
                {'<RecruitEdgeLogoVertical size={32} />'}
              </code>
              <span className='ml-2'>- Logo with vertical text</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
