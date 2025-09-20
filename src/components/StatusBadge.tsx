import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusStyles = {
  // Lead statuses - Modern CRM colors inspired by HubSpot/Salesforce
  new: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  contacted: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  qualified: "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
  interview: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  offer: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  hired: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  won: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  lost: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  
  // Company statuses
  active: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  inactive: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800",
  prospect: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800",
  
  // Job statuses
  draft: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800",
  paused: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  filled: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  cancelled: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  
  // Priority levels - Heat map inspired colors
  low: "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  high: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  urgent: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  
  // Employment types
  "full-time": "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  "part-time": "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
  contract: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  internship: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  freelance: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100 dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5 font-medium",
  md: "text-sm px-2.5 py-1 font-medium",
  lg: "text-sm px-3 py-1.5 font-semibold"
};

export const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  if (!status) return null;
  
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as keyof typeof statusStyles;
  const styleClass = statusStyles[normalizedStatus] || "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800";
  
  // Format the display text
  const displayText = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "border transition-colors duration-200 font-medium",
        styleClass,
        sizeStyles[size],
        className
      )}
    >
      {displayText}
    </Badge>
  );
};