import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { normalizeStatus, getStatusDisplayText, getStatusColorClass } from "@/utils/statusUtils";

interface StatusBadgeProps {
  status: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const statusStyles = {
  // Database enum values (from lead_stage enum)
  new: "bg-blue-50 text-blue-700 border-blue-200",
  contacted: "bg-yellow-50 text-yellow-700 border-yellow-200",
  qualified: "bg-purple-50 text-purple-700 border-purple-200",
  interview: "bg-indigo-50 text-indigo-700 border-indigo-200",
  offer: "bg-orange-50 text-orange-700 border-orange-200",
  hired: "bg-green-50 text-green-700 border-green-200",
  lost: "bg-red-50 text-red-700 border-red-200",
  
  // Legacy uppercase versions (from Stage field)
  'NEW LEAD': "bg-blue-50 text-blue-700 border-blue-200",
  'IN QUEUE': "bg-yellow-50 text-yellow-700 border-yellow-200",
  'CONNECT SENT': "bg-purple-50 text-purple-700 border-purple-200", 
  'MSG SENT': "bg-indigo-50 text-indigo-700 border-indigo-200",
  'CONNECTED': "bg-green-50 text-green-700 border-green-200",
  'REPLIED': "bg-green-50 text-green-700 border-green-200",
  'LEAD LOST': "bg-red-50 text-red-700 border-red-200",
  
  // Lowercase versions for consistency
  'new lead': "bg-blue-50 text-blue-700 border-blue-200",
  'in queue': "bg-yellow-50 text-yellow-700 border-yellow-200",
  'connect sent': "bg-purple-50 text-purple-700 border-purple-200", 
  'msg sent': "bg-indigo-50 text-indigo-700 border-indigo-200",
  connected: "bg-green-50 text-green-700 border-green-200",
  replied: "bg-green-50 text-green-700 border-green-200",
  'lead lost': "bg-red-50 text-red-700 border-red-200",
  
  // Status enum values
  active: "bg-green-50 text-green-700 border-green-200",
  inactive: "bg-slate-50 text-slate-700 border-slate-200",
  prospect: "bg-indigo-50 text-indigo-700 border-indigo-200",
  
  // Job statuses
  "job-new": "bg-blue-50 text-blue-700 border-blue-200",
  "job-active": "bg-green-50 text-green-700 border-green-200",
  paused: "bg-yellow-50 text-yellow-700 border-yellow-200",
  "job-completed": "bg-green-50 text-green-700 border-green-200",
  "job-failed": "bg-red-50 text-red-700 border-red-200",
  
  // Priority levels - Consistent colors
  low: "bg-slate-50 text-slate-600 border-slate-200",
  medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  
  // Employment types
  "full-time": "bg-blue-50 text-blue-700 border-blue-200",
  "part-time": "bg-purple-50 text-purple-700 border-purple-200",
  contract: "bg-orange-50 text-orange-700 border-orange-200",
  internship: "bg-green-50 text-green-700 border-green-200",
  freelance: "bg-yellow-50 text-yellow-700 border-yellow-200",
  
  // Automation statuses
  queued: "bg-yellow-50 text-yellow-700 border-yellow-200",
  running: "bg-blue-50 text-blue-700 border-blue-200",
  "automation-completed": "bg-green-50 text-green-700 border-green-200",
  "automation-failed": "bg-red-50 text-red-700 border-red-200",
};

// STANDARDIZED OVAL STYLING - Wider to accommodate "Connect Sent"
const sizeStyles = {
  sm: "h-5 w-24 text-xs font-medium rounded-full text-center",
  md: "h-6 w-28 text-xs font-medium rounded-full text-center", 
  lg: "h-7 w-32 text-sm font-medium rounded-full text-center"
};

export const StatusBadge = ({ status, className, size = "md" }: StatusBadgeProps) => {
  if (!status) return null;
  
  // Use the utility functions for proper display and colors
  const styleClass = getStatusColorClass(status);
  const displayText = getStatusDisplayText(status);
  
  return (
    <Badge
      variant="outline"
      className={cn(
        "border font-medium justify-center items-center flex",
        styleClass,
        sizeStyles[size],
        className
      )}
    >
      {displayText}
    </Badge>
  );
};