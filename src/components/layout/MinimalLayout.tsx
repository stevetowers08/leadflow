import React from "react";
import { cn } from "@/lib/utils";

interface MinimalLayoutProps {
  children: React.ReactNode;
}

export const MinimalLayout = ({ children }: MinimalLayoutProps) => {
  return (
    <div className="min-h-screen w-full">
      {/* Main content without sidebar */}
      <main className="w-full overflow-auto">
        {/* Content */}
        <div className={cn(
          "min-h-screen bg-gray-50"
        )}>
          {children}
        </div>
      </main>
    </div>
  );
};

