import { Button } from "@/components/ui/button";
import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/translations";

interface ViewToggleProps {
  view: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center space-x-1 bg-muted p-1 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 transition-all",
          view === "grid" 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onViewChange("grid")}
      >
        <LayoutGrid className="h-4 w-4 mr-2" />
        {t('cards')}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "h-8 px-3 transition-all",
          view === "list" 
            ? "bg-background shadow-sm text-foreground" 
            : "text-muted-foreground hover:text-foreground"
        )}
        onClick={() => onViewChange("list")}
      >
        <List className="h-4 w-4 mr-2" />
        {t('list')}
      </Button>
    </div>
  );
}