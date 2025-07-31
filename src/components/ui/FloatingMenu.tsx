import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, LogOut, Zap, X, Moon, Sun, MessageCircle, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { generateDiceBearAvatar } from "@/lib/avatarUtils";

interface FloatingMenuProps {
  userName?: string;
  userAvatar?: string;
  onAutomationsClick?: () => void;
  onSettingsClick?: () => void;
  onWhatsAppClick?: () => void;
  onReportsClick?: () => void;
}

export function FloatingMenu({ userName = "Usuario", userAvatar, onAutomationsClick, onSettingsClick, onWhatsAppClick, onReportsClick }: FloatingMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  console.log("FloatingMenu - Current theme:", theme);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: string) => {
    setIsOpen(false);
    
    switch (action) {
      case "theme":
        const newTheme = theme === "dark" ? "light" : "dark";
        console.log("Changing theme from", theme, "to", newTheme);
        setTheme(newTheme);
        
        // Force document class update
        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        
        toast({
          title: t('themeChanged'),
          description: newTheme === "dark" ? t('themeChangedToDark') : t('themeChangedToLight'),
        });
        break;
      case "automations":
        onAutomationsClick?.();
        break;
      case "whatsapp":
        onWhatsAppClick?.();
        break;
      case "reports":
        onReportsClick?.();
        break;
      case "settings":
        onSettingsClick?.();
        break;
      case "profile":
        toast({
          title: "Perfil",
          description: "Abriendo perfil de usuario...",
        });
        break;
      case "logout":
        toast({
          title: "Cerrando sesión",
          description: "Hasta pronto...",
        });
        break;
    }
  };

  const menuItems = [
    {
      id: "theme",
      label: theme === "dark" ? t('lightMode') : t('darkMode'),
      icon: theme === "dark" ? Sun : Moon,
      onClick: () => handleAction("theme"),
    },
    {
      id: "whatsapp",
      label: "WhatsApp Automático",
      icon: MessageCircle,
      onClick: () => handleAction("whatsapp"),
    },
    {
      id: "reports",
      label: "Reportes Estadísticos",
      icon: BarChart3,
      onClick: () => handleAction("reports"),
    },
    {
      id: "automations",
      label: t('automations'),
      icon: Zap,
      onClick: () => handleAction("automations"),
    },
    {
      id: "settings",
      label: t('settings'),
      icon: Settings,
      onClick: () => handleAction("settings"),
    },
    {
      id: "profile", 
      label: t('profile'),
      icon: User,
      onClick: () => handleAction("profile"),
    },
    {
      id: "logout",
      label: t('logout'),
      icon: LogOut,
      onClick: () => handleAction("logout"),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50" data-tour="floating-menu">
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Menu Items Panel - Lovable Style */}
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-80 bg-background/95 backdrop-blur-sm border border-border/60 rounded-2xl shadow-2xl animate-fade-in p-6">
            {/* Project Header */}
            <div className="mb-6 pb-4 border-b border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-1">EstetiQ.net</h3>
              <p className="text-sm text-muted-foreground">Sistema de gestión de leads</p>
            </div>
            
            {/* Menu Items Grid */}
            <div className="grid grid-cols-2 gap-3">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={item.onClick}
                    className="h-16 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 rounded-xl animate-scale-in"
                    style={{ 
                      animationDelay: `${index * 0.05}s`,
                      animationFillMode: "both"
                    }}
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                    <span className="text-xs font-medium text-foreground text-center leading-tight">
                      {item.label}
                    </span>
                  </Button>
                );
              })}
            </div>
            
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 h-8 w-8 p-0 rounded-full hover:bg-muted/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Main Button - Larger Lovable Style */}
        <Button
          onClick={toggleMenu}
          className={`h-16 w-16 rounded-2xl shadow-2xl hover:shadow-glow transition-all duration-300 p-0 ${
            isOpen ? "scale-105" : "hover:scale-105"
          } bg-gradient-primary hover:bg-gradient-primary/90`}
        >
          {isOpen ? (
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar || generateDiceBearAvatar(userName)} alt={userName} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-bold">
                E
              </AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarImage src={userAvatar || generateDiceBearAvatar(userName)} alt={userName} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-lg font-bold">
                E
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </div>
    </div>
  );
}