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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { designTokens } from '@/design-system/tokens';
import { Palette, Type, Box, Layers, Sparkles, Search } from 'lucide-react';

export default function StyleGuidePage() {
  const colors = [
    {
      name: 'Primary',
      class: 'bg-primary',
      text: 'text-primary-foreground',
      value: 'hsl(75 100% 77%)',
      hex: '#E3FF8C',
    },
    {
      name: 'Secondary',
      class: 'bg-secondary',
      text: 'text-secondary-foreground',
      value: 'hsl(75 100% 70%)',
      hex: '#D4FF6B',
    },
    {
      name: 'Success',
      class: 'bg-success',
      text: 'text-success-foreground',
      value: 'hsl(160 84% 39%)',
      hex: '#10B981',
    },
    {
      name: 'Warning',
      class: 'bg-warning',
      text: 'text-warning-foreground',
      value: 'hsl(38 96% 50%)',
      hex: '#F59E0B',
    },
    {
      name: 'Destructive',
      class: 'bg-destructive',
      text: 'text-destructive-foreground',
      value: 'hsl(0 85% 60%)',
      hex: '#EF4444',
    },
    {
      name: 'Info',
      class: 'bg-info',
      text: 'text-info-foreground',
      value: 'hsl(75 100% 77%)',
      hex: '#E3FF8C',
    },
    {
      name: 'Muted',
      class: 'bg-muted',
      text: 'text-muted-foreground',
      value: 'hsl(240 4.8% 95.9%)',
      hex: '#F3F4F6',
    },
  ];

  const neutralColors = [
    {
      name: 'Background',
      class: 'bg-background',
      text: 'text-foreground',
      value: 'hsl(0 0% 100%) / hsl(0 0% 0%)',
      hex: '#FFFFFF / #000000 (dark)',
    },
    {
      name: 'Foreground',
      class: 'bg-foreground',
      text: 'text-background',
      value: 'hsl(218 60% 9%)',
      hex: '#0A1628',
    },
    {
      name: 'Card',
      class: 'bg-card',
      text: 'text-card-foreground',
      value: 'hsl(0 0% 100%)',
      hex: '#FFFFFF',
    },
    {
      name: 'Border',
      class: 'bg-border',
      text: 'text-foreground',
      value: 'hsl(240 5.9% 90%)',
      hex: '#E5E7EB',
    },
  ];

  const typographySizes = [
    {
      name: 'H1',
      class: designTokens.typography.heading.h1,
      example: 'Heading 1',
    },
    {
      name: 'H2',
      class: designTokens.typography.heading.h2,
      example: 'Heading 2',
    },
    {
      name: 'H3',
      class: designTokens.typography.heading.h3,
      example: 'Heading 3',
    },
    {
      name: 'H4',
      class: designTokens.typography.heading.h4,
      example: 'Heading 4',
    },
    {
      name: 'Body',
      class: designTokens.typography.body.default,
      example: 'Body text',
    },
    {
      name: 'Body Muted',
      class: designTokens.typography.body.muted,
      example: 'Muted text',
    },
    {
      name: 'Small',
      class: designTokens.typography.body.small,
      example: 'Small text',
    },
  ];

  const shadows = [
    { name: 'Small', class: designTokens.shadows.sm },
    { name: 'Medium', class: designTokens.shadows.md },
    { name: 'Large', class: designTokens.shadows.lg },
    { name: 'XL', class: designTokens.shadows.xl },
    { name: '2XL', class: designTokens.shadows['2xl'] },
  ];

  return (
    <div className='h-full overflow-y-auto'>
      <div className='max-w-7xl mx-auto px-4 lg:px-6 py-6 space-y-6'>
        <div className='space-y-2'>
          <h1 className={designTokens.typography.heading.h1}>Style Guide</h1>
          <p className={designTokens.typography.body.muted}>
            Design system components, colors, and patterns used throughout
            LeadFlow
          </p>
        </div>

        {/* Colors Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Palette className='h-5 w-5 text-primary' />
            <h2 className={designTokens.typography.heading.h2}>Colors</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
              <CardDescription>
                Primary color palette for LeadFlow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {colors.map(color => (
                  <div key={color.name} className='space-y-2'>
                    <div
                      className={`${color.class} ${color.text} h-24 rounded-lg flex items-center justify-center font-semibold shadow-md`}
                    >
                      {color.name}
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold'>{color.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {color.hex}
                      </p>
                      <p className='text-xs text-muted-foreground font-mono'>
                        {color.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Neutral Colors</CardTitle>
              <CardDescription>
                Background, foreground, and border colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {neutralColors.map(color => (
                  <div key={color.name} className='space-y-2'>
                    <div
                      className={`${color.class} ${color.text} h-24 rounded-lg flex items-center justify-center font-semibold shadow-md border`}
                    >
                      {color.name}
                    </div>
                    <div className='space-y-1'>
                      <p className='text-sm font-semibold'>{color.name}</p>
                      <p className='text-xs text-muted-foreground'>
                        {color.hex}
                      </p>
                      <p className='text-xs text-muted-foreground font-mono'>
                        {color.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Combinations</CardTitle>
              <CardDescription>
                Pre-defined color combinations for status and states
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div
                  className={`${designTokens.colors.combinations.success} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Success</p>
                  <p className='text-xs mt-1'>text-success bg-success/10</p>
                </div>
                <div
                  className={`${designTokens.colors.combinations.warning} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Warning</p>
                  <p className='text-xs mt-1'>text-warning bg-warning/10</p>
                </div>
                <div
                  className={`${designTokens.colors.combinations.error} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Error</p>
                  <p className='text-xs mt-1'>
                    text-destructive bg-destructive/10
                  </p>
                </div>
                <div
                  className={`${designTokens.colors.combinations.info} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Info</p>
                  <p className='text-xs mt-1'>text-info bg-info/10</p>
                </div>
                <div
                  className={`${designTokens.colors.combinations.primary} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Primary</p>
                  <p className='text-xs mt-1'>text-primary bg-primary/10</p>
                </div>
                <div
                  className={`${designTokens.colors.combinations.muted} p-4 rounded-lg`}
                >
                  <p className='font-semibold'>Muted</p>
                  <p className='text-xs mt-1'>text-muted-foreground bg-muted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Typography Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Type className='h-5 w-5 text-primary' />
            <h2 className={designTokens.typography.heading.h2}>Typography</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Type Scale</CardTitle>
              <CardDescription>
                Font sizes and weights for headings and body text
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {typographySizes.map(type => (
                  <div key={type.name} className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <p className='text-sm font-semibold text-muted-foreground w-24'>
                        {type.name}
                      </p>
                      <p className={type.class}>{type.example}</p>
                    </div>
                    <p className='text-xs text-muted-foreground font-mono ml-24'>
                      {type.class}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Components Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Box className='h-5 w-5 text-primary' />
            <h2 className={designTokens.typography.heading.h2}>Components</h2>
          </div>

          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Button variants and sizes</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
              <div className='space-y-3'>
                <h3 className={designTokens.typography.heading.h3}>Variants</h3>
                <div className='flex flex-wrap gap-3'>
                  <Button variant='default'>Default</Button>
                  <Button variant='secondary'>Secondary</Button>
                  <Button variant='destructive'>Destructive</Button>
                  <Button variant='outline'>Outline</Button>
                  <Button variant='ghost'>Ghost</Button>
                  <Button variant='link'>Link</Button>
                  {/* <Button variant='success'>Success</Button> */}
                  {/* <Button variant='warning'>Warning</Button> */}
                </div>
              </div>
              <div className='space-y-3'>
                <h3 className={designTokens.typography.heading.h3}>Sizes</h3>
                <div className='flex flex-wrap items-center gap-3'>
                  {/* <Button size='xs'>Extra Small</Button> */}
                  <Button size='sm'>Small</Button>
                  <Button size='default'>Default</Button>
                  <Button size='lg'>Large</Button>
                  <Button size='icon' className='h-10 w-10'>
                    <Search className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <div className='space-y-3'>
                <h3 className={designTokens.typography.heading.h3}>States</h3>
                <div className='flex flex-wrap gap-3'>
                  <Button>Normal</Button>
                  <Button disabled>Disabled</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges */}
          <Card>
            <CardHeader>
              <CardTitle>Badges</CardTitle>
              <CardDescription>
                Badge variants for status and labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap gap-3'>
                <Badge variant='default'>Default</Badge>
                <Badge variant='secondary'>Secondary</Badge>
                <Badge variant='destructive'>Destructive</Badge>
                <Badge variant='outline'>Outline</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>Card component variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <Card>
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standard card variant</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm'>Card content goes here</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                    <CardDescription>
                      Card with shadow elevation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm'>Card content goes here</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Outlined Card</CardTitle>
                    <CardDescription>Card with border emphasis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-sm'>Card content goes here</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Form Elements */}
          <Card>
            <CardHeader>
              <CardTitle>Form Elements</CardTitle>
              <CardDescription>Input fields and labels</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='example-input'>Input Label</Label>
                <Input id='example-input' placeholder='Enter text...' />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='example-disabled'>Disabled Input</Label>
                <Input
                  id='example-disabled'
                  placeholder='Disabled...'
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Design Tokens Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Layers className='h-5 w-5 text-primary' />
            <h2 className={designTokens.typography.heading.h2}>
              Design Tokens
            </h2>
          </div>

          {/* Shadows */}
          <Card>
            <CardHeader>
              <CardTitle>Shadows</CardTitle>
              <CardDescription>Elevation and depth system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4'>
                {shadows.map(shadow => (
                  <div key={shadow.name} className='space-y-2'>
                    <div
                      className={`bg-card border rounded-lg p-6 ${shadow.class}`}
                    >
                      <p className='text-sm font-semibold text-center'>
                        {shadow.name}
                      </p>
                    </div>
                    <p className='text-xs text-muted-foreground text-center'>
                      {shadow.name}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Spacing */}
          <Card>
            <CardHeader>
              <CardTitle>Spacing</CardTitle>
              <CardDescription>Consistent spacing scale</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {Object.entries(designTokens.spacing.padding).map(
                  ([size, classes]) => (
                    <div key={size} className='space-y-2'>
                      <div className='flex items-center justify-between'>
                        <p className='text-sm font-semibold text-muted-foreground w-24'>
                          {size.toUpperCase()}
                        </p>
                        <div className={`bg-primary/10 ${classes} rounded`}>
                          <p className='text-xs text-primary'>Padding {size}</p>
                        </div>
                      </div>
                      <p className='text-xs text-muted-foreground font-mono ml-24'>
                        {classes}
                      </p>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Borders */}
          <Card>
            <CardHeader>
              <CardTitle>Borders</CardTitle>
              <CardDescription>Border styles and variants</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div
                  className={`${designTokens.borders.default} p-4 rounded-lg`}
                >
                  <p className='text-sm font-semibold'>Default</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    border border-border
                  </p>
                </div>
                <div
                  className={`${designTokens.borders.accent} p-4 rounded-lg`}
                >
                  <p className='text-sm font-semibold'>Accent</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    border border-primary/20
                  </p>
                </div>
                <div
                  className={`${designTokens.borders.success} p-4 rounded-lg`}
                >
                  <p className='text-sm font-semibold'>Success</p>
                  <p className='text-xs text-muted-foreground mt-1'>
                    border border-success/20
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Separator />

        {/* Icons Section */}
        <section className='space-y-4'>
          <div className='flex items-center gap-2'>
            <Sparkles className='h-5 w-5 text-primary' />
            <h2 className={designTokens.typography.heading.h2}>Icons</h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Icon Sizes</CardTitle>
              <CardDescription>
                Standard icon sizing from design tokens
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='flex flex-wrap items-center gap-6'>
                <div className='flex items-center gap-2'>
                  <Search
                    className={designTokens.icons.sizeSm + ' text-primary'}
                  />
                  <span className='text-sm'>
                    Small ({designTokens.icons.sizeSm})
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Search
                    className={designTokens.icons.size + ' text-primary'}
                  />
                  <span className='text-sm'>
                    Default ({designTokens.icons.size})
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Search
                    className={designTokens.icons.sizeLg + ' text-primary'}
                  />
                  <span className='text-sm'>
                    Large ({designTokens.icons.sizeLg})
                  </span>
                </div>
                <div className='flex items-center gap-2'>
                  <Search
                    className={designTokens.icons.sizeXl + ' text-primary'}
                  />
                  <span className='text-sm'>
                    XL ({designTokens.icons.sizeXl})
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
