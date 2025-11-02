/**
 * Sidebar Color Options - 10 Modern 2025 Designs
 *
 * A showcase page displaying different glassmorphism sidebar color schemes
 * inspired by current design trends and Monday.com's aesthetic.
 */

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ArrowLeft, BarChart3, Home, Settings, Users } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

// Color scheme definitions
const colorSchemes = [
  {
    id: 'soft-blue',
    name: 'Soft Blue Glassmorphism',
    description: 'Calm, professional, trustworthy',
    gradient:
      'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 197, 253, 0.15) 100%)',
    border: 'rgba(255, 255, 255, 0.2)',
    blur: 'blur(10px)',
    textColor: '#1e293b',
    accentColor: '#3b82f6',
    trend: 'Classic',
  },
  {
    id: 'warm-sunset',
    name: 'Warm Sunset Gradient',
    description: 'Vibrant, energetic, creative',
    gradient:
      'linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(236, 72, 153, 0.15) 50%, rgba(139, 92, 246, 0.1) 100%)',
    border: 'rgba(255, 255, 255, 0.25)',
    blur: 'blur(12px)',
    textColor: '#1e293b',
    accentColor: '#ec4899',
    trend: 'Trending',
  },
  {
    id: 'cool-teal',
    name: 'Cool Teal Glassmorphism',
    description: 'Fresh, modern, tech-forward',
    gradient:
      'linear-gradient(135deg, rgba(20, 184, 166, 0.1) 0%, rgba(45, 212, 191, 0.15) 100%)',
    border: 'rgba(255, 255, 255, 0.18)',
    blur: 'blur(8px)',
    textColor: '#1e293b',
    accentColor: '#14b8a6',
    trend: 'Popular',
  },
  {
    id: 'jewel-toned',
    name: 'Jewel-Toned Sophisticated',
    description: 'Luxurious, sophisticated, premium',
    gradient:
      'linear-gradient(135deg, rgba(139, 69, 19, 0.08) 0%, rgba(30, 64, 175, 0.12) 50%, rgba(75, 85, 99, 0.1) 100%)',
    border: 'rgba(255, 255, 255, 0.15)',
    blur: 'blur(15px)',
    textColor: '#1e293b',
    accentColor: '#1e40af',
    trend: 'Premium',
  },
  {
    id: 'minimal-gray',
    name: 'Minimalist Gray Glass',
    description: 'Clean, minimal, versatile',
    gradient:
      'linear-gradient(135deg, rgba(107, 114, 128, 0.05) 0%, rgba(156, 163, 175, 0.08) 100%)',
    border: 'rgba(255, 255, 255, 0.1)',
    blur: 'blur(6px)',
    textColor: '#374151',
    accentColor: '#6b7280',
    trend: 'Minimal',
  },
  {
    id: 'forest-green',
    name: 'Forest Green Serenity',
    description: 'Natural, calming, sustainable',
    gradient:
      'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.12) 100%)',
    border: 'rgba(255, 255, 255, 0.16)',
    blur: 'blur(9px)',
    textColor: '#1e293b',
    accentColor: '#22c55e',
    trend: 'Eco',
  },
  {
    id: 'purple-dream',
    name: 'Purple Dream Gradient',
    description: 'Creative, mystical, innovative',
    gradient:
      'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.14) 50%, rgba(99, 102, 241, 0.08) 100%)',
    border: 'rgba(255, 255, 255, 0.22)',
    blur: 'blur(11px)',
    textColor: '#1e293b',
    accentColor: '#a855f7',
    trend: 'Creative',
  },
  {
    id: 'coral-warmth',
    name: 'Coral Warmth Glass',
    description: 'Welcoming, friendly, approachable',
    gradient:
      'linear-gradient(135deg, rgba(251, 113, 133, 0.09) 0%, rgba(244, 114, 182, 0.13) 100%)',
    border: 'rgba(255, 255, 255, 0.19)',
    blur: 'blur(7px)',
    textColor: '#1e293b',
    accentColor: '#fb7185',
    trend: 'Friendly',
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue Elegance',
    description: 'Professional, deep, authoritative',
    gradient:
      'linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(59, 130, 246, 0.12) 100%)',
    border: 'rgba(255, 255, 255, 0.14)',
    blur: 'blur(13px)',
    textColor: '#f8fafc',
    accentColor: '#3b82f6',
    trend: 'Executive',
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold Luxury',
    description: 'Elegant, warm, premium',
    gradient:
      'linear-gradient(135deg, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.11) 50%, rgba(239, 68, 68, 0.09) 100%)',
    border: 'rgba(255, 255, 255, 0.17)',
    blur: 'blur(10px)',
    textColor: '#1e293b',
    accentColor: '#f59e0b',
    trend: 'Luxury',
  },
];

// Mock sidebar component for preview
const SidebarPreview = ({ scheme }: { scheme: (typeof colorSchemes)[0] }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: Home },
    { id: 'people', name: 'People', icon: Users },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  return (
    <div
      className='w-48 h-64 rounded-lg overflow-hidden shadow-lg'
      style={{
        background: scheme.gradient,
        backdropFilter: scheme.blur,
        border: `1px solid ${scheme.border}`,
      }}
    >
      <div className='p-3 h-full flex flex-col'>
        <div className='mb-3'>
          <div className='w-6 h-6 bg-white/20 rounded mb-2'></div>
          <div
            className='text-xs font-semibold'
            style={{ color: scheme.textColor }}
          >
            Empowr CRM
          </div>
        </div>

        <nav className='flex-1 space-y-1'>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs font-medium transition-all duration-200 ${
                  isActive ? 'shadow-sm' : 'hover:bg-white/10'
                }`}
                style={{
                  backgroundColor: isActive
                    ? scheme.accentColor
                    : 'transparent',
                  color: isActive ? '#ffffff' : scheme.textColor,
                }}
              >
                <Icon className='w-3 h-3' />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

const SidebarColorOptions = () => {
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);

  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-success/5 rounded-2xl p-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <Link href='/settings'>
            <Button variant='ghost' className='mb-4'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Back to Settings
            </Button>
          </Link>

          <h1 className='text-3xl font-bold text-gray-900 mb-2'>
            Sidebar Color Options
          </h1>
          <p className='text-gray-600'>
            Choose from 10 modern glassmorphism designs inspired by 2025 trends
          </p>
        </div>

        {/* Color Schemes Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {colorSchemes.map(scheme => (
            <Card
              key={scheme.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedScheme === scheme.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedScheme(scheme.id)}
            >
              <CardHeader className='pb-3'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{scheme.name}</CardTitle>
                  <Badge
                    variant='secondary'
                    className='text-xs'
                    style={{
                      backgroundColor: `${scheme.accentColor}20`,
                      color: scheme.accentColor,
                    }}
                  >
                    {scheme.trend}
                  </Badge>
                </div>
                <CardDescription className='text-sm'>
                  {scheme.description}
                </CardDescription>
              </CardHeader>

              <CardContent className='space-y-4'>
                {/* Preview */}
                <div className='flex justify-center'>
                  <SidebarPreview scheme={scheme} />
                </div>

                {/* Color Info */}
                <div className='space-y-2 text-xs'>
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-3 h-3 rounded-full border'
                      style={{ backgroundColor: scheme.accentColor }}
                    ></div>
                    <span className='text-gray-600'>
                      Accent: {scheme.accentColor}
                    </span>
                  </div>
                  <div className='text-gray-500'>
                    Blur: {scheme.blur} • Border: {scheme.border}
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  className='w-full'
                  variant={selectedScheme === scheme.id ? 'default' : 'outline'}
                  onClick={e => {
                    e.stopPropagation();
                    // Here you would apply the selected scheme
                    console.log('Applying scheme:', scheme.id);
                  }}
                >
                  {selectedScheme === scheme.id
                    ? 'Applied'
                    : 'Apply This Design'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Implementation Info */}
        <div className='mt-12 p-6 bg-white rounded-lg shadow-sm'>
          <h2 className='text-xl font-semibold mb-4'>Implementation Notes</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600'>
            <div>
              <h3 className='font-medium text-gray-900 mb-2'>
                Glassmorphism Effects
              </h3>
              <ul className='space-y-1'>
                <li>• Semi-transparent backgrounds</li>
                <li>• Backdrop blur filters</li>
                <li>• Subtle border highlights</li>
                <li>• Layered depth effects</li>
              </ul>
            </div>
            <div>
              <h3 className='font-medium text-gray-900 mb-2'>
                2025 Design Trends
              </h3>
              <ul className='space-y-1'>
                <li>• Soft gradients over solid colors</li>
                <li>• Reduced opacity for subtlety</li>
                <li>• Enhanced accessibility</li>
                <li>• Mobile-first responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarColorOptions;
