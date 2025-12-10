import React, { useState } from 'react';
import {
  Clock,
  DollarSign,
  Bot,
  Users,
  Briefcase,
  Zap,
  Target,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const TabDesignsPage = () => {
  const [activeTab, setActiveTab] = useState('recent');

  const tabs = [
    { id: 'recent', label: 'LAST 24HRS', icon: Clock, count: 12 },
    { id: 'sales', label: 'SALES ROLES', icon: DollarSign, count: 8 },
    { id: 'new', label: 'NEW JOBS', icon: Bot, count: 5 },
    { id: 'all', label: 'ALL JOBS', icon: Briefcase, count: 45 },
  ];

  return (
    <div className='p-8 space-y-12 bg-muted min-h-screen'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Modern Tab Designs
        </h1>
        <p className='text-muted-foreground'>
          Choose your favorite design for the Jobs page tabs
        </p>
      </div>

      {/* Design 1: Minimal Pills */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 1: Minimal Pills</h3>
        <div className='flex gap-2'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-primary-foreground/20 text-xs px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 2: Underline Style */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>
          Design 2: Underline Style
        </h3>
        <div className='flex gap-8 border-b border-gray-200'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-2 py-4 text-sm font-medium transition-all duration-200 relative',
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full ml-1'>
                  {tab.count}
                </span>
                {activeTab === tab.id && (
                  <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full' />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 3: Card Style */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 3: Card Style</h3>
        <div className='flex gap-3'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all duration-200 min-w-[120px]',
                  activeTab === tab.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                )}
              >
                <Icon className='h-5 w-5' />
                <span className='text-xs font-medium text-center'>
                  {tab.label}
                </span>
                <span className='bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 4: Segmented Control */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>
          Design 4: Segmented Control
        </h3>
        <div className='bg-gray-100 p-1 rounded-lg inline-flex'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 5: Modern Glass */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 5: Modern Glass</h3>
        <div className='flex gap-2 bg-gray-50 p-2 rounded-xl'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm',
                  activeTab === tab.id
                    ? 'bg-white/80 text-gray-900 shadow-lg border border-white/20'
                    : 'text-gray-600 hover:bg-white/40 hover:text-gray-900'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-gray-200/60 text-gray-600 text-xs px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 6: Minimal Lines */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 6: Minimal Lines</h3>
        <div className='flex gap-6'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 relative',
                  activeTab === tab.id
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='text-xs text-gray-400'>({tab.count})</span>
                {activeTab === tab.id && (
                  <div className='absolute -bottom-1 left-0 right-0 h-px bg-blue-600' />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 7: Floating Pills */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 7: Floating Pills</h3>
        <div className='flex gap-3'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm',
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border border-gray-200 hover:shadow-md hover:border-gray-300'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    activeTab === tab.id
                      ? 'bg-white/20 text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 8: Clean Buttons */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 8: Clean Buttons</h3>
        <div className='flex gap-2'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 9: Gradient Accent */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>
          Design 9: Gradient Accent
        </h3>
        <div className='flex gap-2'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                <Icon className='h-4 w-4' />
                {tab.label}
                <span className='bg-primary-foreground/20 text-xs px-2 py-0.5 rounded-full'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Design 10: Sleek Modern */}
      <div className='bg-background p-6 rounded-lg shadow-sm'>
        <h3 className='text-lg font-semibold mb-4'>Design 10: Sleek Modern</h3>
        <div className='flex gap-1 bg-gray-50 p-1 rounded-xl'>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center',
                  activeTab === tab.id
                    ? 'bg-background text-foreground shadow-sm border border-border'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <Icon className='h-4 w-4' />
                <span className='hidden sm:inline'>{tab.label}</span>
                <span className='bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full ml-1'>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className='text-center mt-8 p-6 bg-sidebar-primary/10 rounded-lg'>
        <h3 className='text-lg font-semibold text-sidebar-primary mb-2'>
          Which design do you prefer?
        </h3>
        <p className='text-sidebar-primary/80'>
          Let me know which design looks best and I'll implement it on the Jobs
          page!
        </p>
      </div>
    </div>
  );
};

export default TabDesignsPage;
