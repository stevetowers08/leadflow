import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusStyles = {
  // Lead statuses - Enhanced with recruiting stages
  'new lead': "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 hover:from-blue-100 hover:to-blue-200 shadow-sm dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  'in queue': "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-800 border-yellow-300 hover:from-yellow-100 hover:to-yellow-200 shadow-sm dark:bg-yellow-950/50 dark:text-yellow-400 dark:border-yellow-800",
  'connect sent': "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-300 hover:from-purple-100 hover:to-purple-200 shadow-sm dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800", 
  'msg sent': "bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 border-indigo-300 hover:from-indigo-100 hover:to-indigo-200 shadow-sm dark:bg-indigo-950/50 dark:text-indigo-400 dark:border-indigo-800",
  connected: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 hover:from-emerald-100 hover:to-emerald-200 shadow-sm dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  replied: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 hover:from-green-100 hover:to-green-200 shadow-sm dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  'lead lost': "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 hover:from-red-100 hover:to-red-200 shadow-sm dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  
  // Legacy stages for backwards compatibility
  new: "bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-800 border-emerald-300 hover:from-emerald-100 hover:to-emerald-200 shadow-sm dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800",
  contacted: "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border-blue-300 hover:from-blue-100 hover:to-blue-200 shadow-sm dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800",
  qualified: "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 border-purple-300 hover:from-purple-100 hover:to-purple-200 shadow-sm dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800",
  interview: "bg-gradient-to-r from-amber-50 to-amber-100 text-amber-800 border-amber-300 hover:from-amber-100 hover:to-amber-200 shadow-sm dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800",
  offer: "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 border-orange-300 hover:from-orange-100 hover:to-orange-200 shadow-sm dark:bg-orange-950/50 dark:text-orange-400 dark:border-orange-800",
  hired: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 hover:from-green-100 hover:to-green-200 shadow-sm dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  won: "bg-gradient-to-r from-green-50 to-green-100 text-green-800 border-green-300 hover:from-green-100 hover:to-green-200 shadow-sm dark:bg-green-950/50 dark:text-green-400 dark:border-green-800",
  lost: "bg-gradient-to-r from-red-50 to-red-100 text-red-800 border-red-300 hover:from-red-100 hover:to-red-200 shadow-sm dark:bg-red-950/50 dark:text-red-400 dark:border-red-800",
  
  // Status enum values
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
  sm: "text-[11px] px-2 py-1 font-medium min-w-24 text-center",
  md: "text-xs px-2.5 py-1 font-medium min-w-28 text-center",
  lg: "text-sm px-3 py-1.5 font-medium min-w-32 text-center"
};

export const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  if (!status) return null;
  
  const normalizedHyphen = status.toLowerCase().trim().replace(/\s+/g, '-') as keyof typeof statusStyles;
  const normalizedSpace = status.toLowerCase().trim().replace(/\s+/g, ' ') as keyof typeof statusStyles;
  const styleClass = statusStyles[normalizedHyphen] || statusStyles[normalizedSpace] || "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 dark:bg-slate-950/50 dark:text-slate-400 dark:border-slate-800";
  
  // Format the display text
  const displayText = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "border transition-colors duration-200 font-medium justify-center",
        styleClass,
        sizeStyles[size],
        className
      )}
    >
      {displayText}
    </Badge>
  );
};