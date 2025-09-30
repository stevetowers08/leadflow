import { Badge } from "@/components/ui/badge";
import { getReplyTypeEmoji, getReplyTypeColor, getReplyTypeLabel } from "@/utils/replyAnalysis";
import type { Database } from "@/integrations/supabase/types";

type ReplyType = Database["public"]["Enums"]["reply_type"];

interface ReplyTypeBadgeProps {
  replyType: ReplyType | null;
  showEmoji?: boolean;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ReplyTypeBadge({ 
  replyType, 
  showEmoji = true, 
  showLabel = true, 
  size = "sm",
  className = "" 
}: ReplyTypeBadgeProps) {
  if (!replyType) {
    return (
      <Badge 
        variant="outline" 
        className={`text-gray-500 bg-gray-50 border-gray-200 ${className}`}
      >
        No Reply
      </Badge>
    );
  }

  const emoji = getReplyTypeEmoji(replyType);
  const colorClasses = getReplyTypeColor(replyType);
  const label = getReplyTypeLabel(replyType);

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5", 
    lg: "text-base px-4 py-2"
  };

  return (
    <Badge 
      variant="outline" 
      className={`${colorClasses} ${sizeClasses[size]} ${className}`}
    >
      {showEmoji && <span className="mr-1">{emoji}</span>}
      {showLabel && label}
    </Badge>
  );
}

interface ReplyTypeStatsProps {
  interested: number;
  notInterested: number;
  maybe: number;
  total: number;
}

export function ReplyTypeStats({ interested, notInterested, maybe, total }: ReplyTypeStatsProps) {
  const interestedPercent = total > 0 ? (interested / total) * 100 : 0;
  const notInterestedPercent = total > 0 ? (notInterested / total) * 100 : 0;
  const maybePercent = total > 0 ? (maybe / total) * 100 : 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-600">😊</span>
        <span className="text-gray-600">
          {interestedPercent.toFixed(1)}% {interested}/{total}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-orange-600">😐</span>
        <span className="text-gray-600">
          {maybePercent.toFixed(1)}% {maybe}/{total}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-red-600">😞</span>
        <span className="text-gray-600">
          {notInterestedPercent.toFixed(1)}% {notInterested}/{total}
        </span>
      </div>
    </div>
  );
}
