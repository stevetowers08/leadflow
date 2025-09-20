import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusStyles = {
  // Lead statuses
  new: "bg-green-100 text-green-800 hover:bg-green-100",
  contacted: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  qualified: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  proposal: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  won: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  lost: "bg-red-100 text-red-800 hover:bg-red-100",
  
  // Company statuses
  active: "bg-green-100 text-green-800 hover:bg-green-100",
  inactive: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  prospect: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  
  // Job statuses
  draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  paused: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  filled: "bg-green-100 text-green-800 hover:bg-green-100",
  cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const normalizedStatus = status.toLowerCase() as keyof typeof statusStyles;
  const styleClass = statusStyles[normalizedStatus] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  
  return (
    <Badge
      variant="secondary"
      className={cn(styleClass, className)}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};