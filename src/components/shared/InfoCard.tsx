import React from 'react';

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
  showDivider?: boolean;
  contentSpacing?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  actionButton,
  className = "",
  showDivider = true,
  contentSpacing = "space-y-3"
}) => {
  return (
    <div className={`bg-card rounded-xl p-4 border shadow-sm ${className}`}>
      <div className="pb-1.5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-card-foreground">{title}</h3>
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

