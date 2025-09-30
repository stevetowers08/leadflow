import React from 'react';

interface InfoFieldProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const InfoField: React.FC<InfoFieldProps> = ({ label, value, className = "" }) => (
  <div className={`space-y-1 ${className}`}>
    <div className="text-xs font-medium text-gray-400 uppercase tracking-wide">
      {label}
    </div>
    <div className="text-sm text-gray-900 font-medium">
      {value || "-"}
    </div>
  </div>
);
