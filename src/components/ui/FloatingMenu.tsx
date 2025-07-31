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

      {/* Menu Items Panel - Simple Style */}
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-20 right-0 w-56 bg-background border border-border rounded-lg shadow-lg animate-fade-in">
            <div className="py-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    onClick={item.onClick}
                    className="w-full justify-start h-10 px-4 rounded-none hover:bg-muted"
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    <span className="text-sm">{item.label}</span>
                  </Button>
                );
              })}
            </div>
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