import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles = {
  // Lead statuses (enum values)
  new: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
  contacted: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  qualified: "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
  interview: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400",
  offer: "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
  hired: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400",
  won: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400",
  lost: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400",
  
  // Company statuses
  active: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400",
  prospect: "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  
  // Job statuses
  draft: "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400",
  paused: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400",
  filled: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400",
  
  // Priority levels
  low: "bg-slate-100 text-slate-800 hover:bg-slate-100 dark:bg-slate-900/20 dark:text-slate-400",
  medium: "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400",
  high: "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
  urgent: "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400",
  
  // Employment types
  "full-time": "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400",
  "part-time": "bg-purple-100 text-purple-800 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400",
  contract: "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400",
  internship: "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400",
  freelance: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  if (!status) return null;
  
  const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-') as keyof typeof statusStyles;
  const styleClass = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400";
  
  // Format the display text
  const displayText = status.charAt(0).toUpperCase() + status.slice(1).replace(/-/g, ' ');
  
  return (
    <Badge
      variant="secondary"
      className={cn(styleClass, className)}
    >
      {displayText}
    </Badge>
  );
};