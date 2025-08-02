import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, UserPlus, CheckCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { useTranslation } from "@/lib/translations";
import type { Lead } from "@/components/leads/LeadCard";

interface MobileStatsProps {
  leads: Lead[];
  onStatClick?: (filterType: 'active' | 'new' | 'conversion' | 'needsFollowUp') => void;
  activeFilter?: string | null;
}

export function MobileStats({ leads, onStatClick, activeFilter }: MobileStatsProps) {
  const { t } = useTranslation();
  const haptic = useHapticFeedback();

  const stats = [
    {
      id: 'active',
      title: 'Activos',
      value: leads.filter(lead => !['cerrado', 'perdido'].includes(lead.status)).length,
      total: leads.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      emoji: '👥',
    },
    {
      id: 'new',
      title: 'Nuevos',
      value: leads.filter(lead => lead.status === 'nuevo').length,
      total: leads.length,
      icon: UserPlus,
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      emoji: '🆕',
    },
    {
      id: 'conversion',
      title: 'Cerrados',
      value: leads.filter(lead => ['cerrado', 'perdido'].includes(lead.status)).length,
      total: leads.length,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      emoji: '✅',
    },
    {
      id: 'needsFollowUp',
      title: 'Seguimiento',
      value: leads.filter(lead => {
        if (lead.status === 'cerrado' || lead.status === 'perdido') return false;
        if (lead.lastContact === "Ahora") return false;
        if (lead.lastContact.includes("semana") || lead.lastContact.includes("mes")) return true;
        if (lead.lastContact.includes("día")) {
          const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
          return days > 7;
        }
        return false;
      }).length,
      total: leads.length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      emoji: '⏰',
    },
  ];

  const handleStatClick = (statId: string) => {
    haptic.medium();
    onStatClick?.(statId as any);
  };

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {stats.map((stat, index) => {
        const percentage = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
        const isActive = activeFilter === stat.id;
        
        return (
          <Card
            key={stat.id}
            className={cn(
              "group relative overflow-hidden cursor-pointer transition-all duration-300 touch-manipulation",
              "active:scale-95 hover:shadow-md transform",
              "animate-fade-in",
              isActive && "ring-2 ring-primary/50 shadow-lg scale-[1.02]"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => handleStatClick(stat.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={cn("p-2 rounded-lg", stat.bgColor)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <span className="text-lg">{stat.emoji}</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </h3>
                  <Badge 
                    variant="secondary" 
                    className="text-xs px-2 py-0.5 animate-scale-in"
                  >
                    {percentage}%
                  </Badge>
                </div>
                
                <div className="flex items-end space-x-2">
                  <span className="text-2xl font-bold text-foreground">
                    {stat.value}
                  </span>
                  <span className="text-sm text-muted-foreground mb-1">
                    de {stat.total}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-500 ease-out",
                      stat.color.replace('text-', 'bg-')
                    )}
                    style={{ 
                      width: `${percentage}%`,
                      transitionDelay: `${index * 0.1 + 0.3}s`
                    }}
                  />
                </div>
              </div>
              
              {/* Pulse animation for active filter */}
              {isActive && (
                <div className="absolute inset-0 bg-primary/5 animate-pulse rounded-lg" />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}