import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface OwnerDisplayProps {
  ownerId: string | null;
  size?: "sm" | "md" | "lg";
  showName?: boolean;
  showRole?: boolean;
  className?: string;
}

interface OwnerInfo {
  id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

export const OwnerDisplay = ({ 
  ownerId, 
  size = "sm", 
  showName = true, 
  showRole = false,
  className 
}: OwnerDisplayProps) => {
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ownerId) {
      setOwnerInfo(null);
      return;
    }

    const fetchOwnerInfo = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('id, full_name, role, avatar_url')
          .eq('id', ownerId)
          .single();

        if (error) throw error;

        setOwnerInfo(data);
      } catch (error) {
        console.error('Error fetching owner info:', error);
        setOwnerInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerInfo();
  }, [ownerId]);

  if (!ownerId || loading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          size === "sm" && "w-6 h-6",
          size === "md" && "w-8 h-8", 
          size === "lg" && "w-10 h-10"
        )}>
          <User className={cn(
            "text-muted-foreground",
            size === "sm" && "w-3 h-3",
            size === "md" && "w-4 h-4",
            size === "lg" && "w-5 h-5"
          )} />
        </div>
        {showName && (
          <span className={cn(
            "text-muted-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}>
            {loading ? "Loading..." : "Unassigned"}
          </span>
        )}
      </div>
    );
  }

  if (!ownerInfo) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <div className={cn(
          "rounded-full bg-muted flex items-center justify-center",
          size === "sm" && "w-6 h-6",
          size === "md" && "w-8 h-8",
          size === "lg" && "w-10 h-10"
        )}>
          <User className={cn(
            "text-muted-foreground",
            size === "sm" && "w-3 h-3",
            size === "md" && "w-4 h-4",
            size === "lg" && "w-5 h-5"
          )} />
        </div>
        {showName && (
          <span className={cn(
            "text-muted-foreground",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}>
            Unknown
          </span>
        )}
      </div>
    );
  }

  const initials = ownerInfo.full_name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn(
        "rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium",
        size === "sm" && "w-6 h-6 text-xs",
        size === "md" && "w-8 h-8 text-sm",
        size === "lg" && "w-10 h-10 text-base"
      )}>
        {initials}
      </div>
      {showName && (
        <div className="flex flex-col">
          <span className={cn(
            "font-medium",
            size === "sm" && "text-xs",
            size === "md" && "text-sm",
            size === "lg" && "text-base"
          )}>
            {ownerInfo.full_name}
          </span>
          {showRole && ownerInfo.role && (
            <span className={cn(
              "text-muted-foreground",
              size === "sm" && "text-xs",
              size === "md" && "text-xs",
              size === "lg" && "text-sm"
            )}>
              {ownerInfo.role}
            </span>
          )}
        </div>
      )}
    </div>
  );
};




