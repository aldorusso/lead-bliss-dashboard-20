import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Menu, Search, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";

interface MobileHeaderProps {
  title?: string;
  onAddLead?: () => void;
  onMenuToggle?: () => void;
  hasNotifications?: boolean;
  leadsCount?: number;
}

export function MobileHeader({ 
  title = "Leads Dashboard", 
  onAddLead, 
  onMenuToggle,
  hasNotifications = false,
  leadsCount = 0
}: MobileHeaderProps) {
  const haptic = useHapticFeedback();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border transition-all duration-300",
      isScrolled && "shadow-sm bg-background/98"
    )}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full hover:bg-muted/80"
            onClick={() => {
              haptic.light();
              onMenuToggle?.();
            }}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-lg font-semibold text-foreground animate-fade-in">
              {title}
            </h1>
            {leadsCount > 0 && (
              <p className="text-xs text-muted-foreground animate-fade-in">
                {leadsCount} leads activos
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full hover:bg-muted/80 relative"
            onClick={() => {
              haptic.light();
              // Notifications logic
            }}
          >
            <Bell className="h-5 w-5" />
            {hasNotifications && (
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full animate-pulse" />
            )}
          </Button>

          <Button
            size="sm"
            className={cn(
              "h-10 px-4 rounded-full transition-all duration-200 shadow-sm",
              "hover:scale-105 active:scale-95 transform",
              "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            )}
            onClick={() => {
              haptic.medium();
              onAddLead?.();
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Lead
          </Button>
        </div>
      </div>
      
      {/* Animated progress bar on scroll */}
      <div className={cn(
        "h-0.5 bg-gradient-to-r from-primary/50 to-primary transition-all duration-300",
        isScrolled ? "opacity-100" : "opacity-0"
      )} />
    </header>
  );
}