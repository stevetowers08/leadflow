import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Tag {
  id: string;
  name: string;
  color: string;
  description?: string;
}

interface TagDisplayProps {
  tags: Tag[];
  size?: "sm" | "md" | "lg";
  maxVisible?: number;
  showAll?: boolean;
  className?: string;
}

export const TagDisplay = ({
  tags,
  size = "sm",
  maxVisible = 3,
  showAll = false,
  className,
}: TagDisplayProps) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  const visibleTags = showAll ? tags : tags.slice(0, maxVisible);
  const remainingCount = tags.length - maxVisible;

  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "md":
        return "text-sm px-2.5 py-1.5";
      case "lg":
        return "text-sm px-3 py-2";
      default:
        return "text-xs px-2 py-1";
    }
  };

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {visibleTags.map((tag) => (
        <Badge
          key={tag.id}
          variant="secondary"
          className={cn(
            "flex items-center gap-1 font-medium",
            getSizeClasses(size)
          )}
          style={{ 
            backgroundColor: tag.color + '20', 
            borderColor: tag.color,
            color: tag.color 
          }}
        >
          <div 
            className={cn(
              "rounded-full",
              size === "sm" && "w-1.5 h-1.5",
              size === "md" && "w-2 h-2",
              size === "lg" && "w-2 h-2"
            )}
            style={{ backgroundColor: tag.color }}
          />
          {tag.name}
        </Badge>
      ))}
      
      {!showAll && remainingCount > 0 && (
        <Badge
          variant="outline"
          className={cn(
            "text-muted-foreground",
            getSizeClasses(size)
          )}
        >
          +{remainingCount}
        </Badge>
      )}
    </div>
  );
};




