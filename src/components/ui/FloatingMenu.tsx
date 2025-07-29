import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, User, LogOut, Zap, X, Moon, Sun, MessageCircle } from "lucide-react";
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
}

export function FloatingMenu({ userName = "Usuario", userAvatar, onAutomationsClick, onSettingsClick, onWhatsAppClick }: FloatingMenuProps) {
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

      {/* Menu Items */}
      <div className="relative">
        {isOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 animate-fade-in">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-end group animate-scale-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: "both"
                  }}
                >
                  {/* Label */}
                  <div className="bg-background/95 backdrop-blur-sm border border-border/60 rounded-lg px-3 py-2 mr-3 shadow-card opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-sm font-medium text-foreground whitespace-nowrap">
                      {item.label}
                    </span>
                  </div>
                  
                  {/* Button */}
                  <Button
                    size="sm"
                    onClick={item.onClick}
                    className="h-12 w-12 rounded-full bg-background/95 backdrop-blur-sm border border-border/60 shadow-card hover:shadow-hover hover:scale-110 transition-all duration-200 p-0"
                  >
                    <Icon className="h-5 w-5 text-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Main Button */}
        <Button
          onClick={toggleMenu}
          className={`h-14 w-14 rounded-full shadow-glow hover:shadow-hover transition-all duration-300 p-0 ${
            isOpen ? "rotate-45 scale-110" : "hover:scale-105"
          } ${theme === 'dark' ? 'bg-gray-800 border border-gray-600' : 'bg-gradient-primary'}`}
          style={{
            backgroundColor: theme === 'dark' ? '#1f2937' : undefined,
            borderColor: theme === 'dark' ? '#4b5563' : undefined
          }}
        >
          {isOpen ? (
            <X className={`h-6 w-6 ${theme === 'dark' ? 'text-white' : 'text-primary-foreground'}`} />
          ) : (
            <Avatar className="h-8 w-8">
              <AvatarImage src={userAvatar || generateDiceBearAvatar(userName)} alt={userName} />
              <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-sm font-semibold">
                {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </div>
    </div>
  );
}