import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * LeadFlow Logo Component
 *
 * Main logo for the LeadFlow application
 */
export function LeadFlowLogo({ size = 120, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src='/Leadflow beta .png'
        alt='LeadFlow Beta'
        width={size}
        height={size}
        className='object-contain'
      />
    </div>
  );
}

/**
 * LeadFlow Logo Horizontal
 *
 * Horizontal layout logo variant
 */
export function LeadFlowLogoHorizontal({ size = 120, className }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img
        src='/Leadflow beta .png'
        alt='LeadFlow Beta'
        width={size}
        height={size}
        className='object-contain'
      />
    </div>
  );
}

/**
 * LeadFlow Logo Vertical
 *
 * Vertical layout logo variant
 */
export function LeadFlowLogoVertical({ size = 120, className }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <img
        src='/Leadflow beta .png'
        alt='LeadFlow Beta'
        width={size}
        height={size}
        className='object-contain'
      />
    </div>
  );
}
