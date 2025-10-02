import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  contentSpacing?: string;
  compact?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  actionButton,
  className = "",
  showDivider = true,
  contentSpacing = "space-y-3",
  compact = false
}) => {
  const paddingClass = compact ? "p-6" : "p-8";
  
  return (
    <div className={`bg-card rounded-xl ${paddingClass} border shadow-sm hover:shadow-md transition-all duration-300 ${className}`}>
      <div className="pb-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-card-foreground">{title}</h3>
          {actionButton}
        </div>
        {showDivider && (
          <div className="pt-1.5">
            <div className="w-full h-[0.5px] bg-gray-200"></div>
          </div>
        )}
      </div>
      <div className={contentSpacing}>
        {children}
      </div>
    </div>
  );
};

