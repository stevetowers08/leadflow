import { cn } from "@/lib/utils";
import { getStatusDisplayText } from "@/utils/statusUtils";
import { getUnifiedStatusClass } from "@/utils/colorScheme";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

// STANDARDIZED STYLING - Professional LinkedIn-inspired design
const sizeStyles = {
  sm: "h-8 text-xs font-medium rounded-md text-center px-3",
  md: "h-9 text-sm font-medium rounded-md text-center px-3", 
  lg: "h-10 text-sm font-medium rounded-md text-center px-4"
};

export const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  if (!status) return null;
  
  // Use the unified color scheme for consistent colors across the app
  const styleClass = getUnifiedStatusClass(status);
  const displayText = getStatusDisplayText(status);
  
  // Fixed width for consistent sizing
  const fixedWidth = size === "sm" ? "115px" : size === "md" ? "125px" : "135px";
  
  return (
    <div
      className={cn(
        "border font-medium justify-center items-center flex rounded-md mx-auto",
        styleClass,
        sizeStyles[size],
        className
      )}
      style={{ 
        width: `${fixedWidth}`,
        minWidth: `${fixedWidth}`,
        maxWidth: `${fixedWidth}`
      }}
    >
      {displayText}
    </div>
  );
};