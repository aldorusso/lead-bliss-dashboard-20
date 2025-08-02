import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { MessageCircle, Mail, Calendar, Clock, MessageSquare, Phone, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTouchGestures } from "@/hooks/use-touch-gestures";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { useTranslation } from "@/lib/translations";
import { getLeadAvatar } from "@/lib/avatarUtils";
import type { Lead } from "@/components/leads/LeadCard";

interface MobileLeadCardProps {
  lead: Lead;
  onWhatsApp?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onSchedule?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
  onCall?: (lead: Lead) => void;
  onStatusChange?: (lead: Lead, status: Lead["status"]) => void;
}

const statusConfig = {
  nuevo: { color: "bg-status-nuevo", label: "Nuevo", emoji: "🆕" },
  "consulta-inicial": { color: "bg-status-consulta", label: "Consulta", emoji: "💬" },
  evaluacion: { color: "bg-status-evaluacion", label: "Evaluación", emoji: "📋" },
  cotizacion: { color: "bg-status-cotizacion", label: "Cotización", emoji: "💰" },
  programado: { color: "bg-status-programado", label: "Programado", emoji: "📅" },
  cerrado: { color: "bg-status-cerrado", label: "Cerrado", emoji: "✅" },
  perdido: { color: "bg-status-perdido", label: "Perdido", emoji: "❌" },
};

export function MobileLeadCard({
  lead,
  onWhatsApp,
  onEmail,
  onSchedule,
  onViewDetails,
  onCall,
  onStatusChange,
}: MobileLeadCardProps) {
  const { t } = useTranslation();
  const haptic = useHapticFeedback();
  const [isPressed, setIsPressed] = useState(false);
  const [swipeProgress, setSwipeProgress] = useState(0);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const statusInfo = statusConfig[lead.status];

  const needsFollowUp = () => {
    if (lead.status === 'cerrado' || lead.status === 'perdido') return false;
    if (lead.lastContact === "Ahora") return false;
    if (lead.lastContact.includes("semana") || lead.lastContact.includes("mes")) return true;
    if (lead.lastContact.includes("día")) {
      const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
      return days > 7;
    }
    return false;
  };

  const { touchHandlers } = useTouchGestures({
    onSwipeLeft: () => {
      haptic.light();
      onWhatsApp?.(lead);
    },
    onSwipeRight: () => {
      haptic.light();
      onCall?.(lead);
    },
    onTap: () => {
      haptic.light();
      onViewDetails?.(lead);
    },
    onLongPress: () => {
      haptic.medium();
      // Trigger quick actions menu
    },
    swipeThreshold: 100,
  });

  return (
    <Card 
      className={cn(
        "group relative overflow-hidden bg-gradient-card border-border/60 shadow-card transition-all duration-300 touch-manipulation",
        "hover:shadow-hover active:scale-[0.98] transform",
        needsFollowUp() && "ring-2 ring-orange-400/50 border-orange-300/60",
        isPressed && "scale-[0.98] shadow-lg"
      )}
      {...touchHandlers}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Status indicator */}
      <div className={cn("absolute top-0 left-0 right-0 h-1", statusInfo.color)} />
      
      {/* Swipe indicators */}
      <div className="absolute inset-y-0 left-0 w-16 bg-green-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Phone className="h-5 w-5 text-green-600" />
      </div>
      <div className="absolute inset-y-0 right-0 w-16 bg-blue-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <MessageCircle className="h-5 w-5 text-blue-600" />
      </div>

      <CardHeader className="pb-3 px-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20 flex-shrink-0">
              <AvatarImage src={getLeadAvatar(lead)} alt={lead.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate text-sm">
                  {lead.name}
                </h3>
                {needsFollowUp() && (
                  <div className="animate-pulse">
                    <Clock className="h-4 w-4 text-orange-500 flex-shrink-0" />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">
                {lead.email}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {lead.phone}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge 
              variant="secondary" 
              className={cn("text-xs px-2 py-1 animate-fade-in", statusInfo.color)}
            >
              <span className="mr-1">{statusInfo.emoji}</span>
              {statusInfo.label}
            </Badge>
            
            <Drawer>
              <DrawerTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 hover:bg-muted/80"
                  onClick={(e) => {
                    e.stopPropagation();
                    haptic.light();
                  }}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="pb-6">
                <DrawerHeader>
                  <DrawerTitle className="text-center">
                    Acciones para {lead.name}
                  </DrawerTitle>
                </DrawerHeader>
                <div className="px-4 space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 text-left animate-fade-in"
                    onClick={() => {
                      haptic.medium();
                      onCall?.(lead);
                    }}
                  >
                    <Phone className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">Llamar</div>
                      <div className="text-xs text-muted-foreground">{lead.phone}</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 text-left animate-fade-in"
                    style={{ animationDelay: "0.1s" }}
                    onClick={() => {
                      haptic.medium();
                      onWhatsApp?.(lead);
                    }}
                  >
                    <MessageCircle className="h-5 w-5 mr-3 text-green-600" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-xs text-muted-foreground">Enviar mensaje</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 text-left animate-fade-in"
                    style={{ animationDelay: "0.2s" }}
                    onClick={() => {
                      haptic.medium();
                      onEmail?.(lead);
                    }}
                  >
                    <Mail className="h-5 w-5 mr-3 text-blue-600" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-xs text-muted-foreground">{lead.email}</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-12 text-left animate-fade-in"
                    style={{ animationDelay: "0.3s" }}
                    onClick={() => {
                      haptic.medium();
                      onSchedule?.(lead);
                    }}
                  >
                    <Calendar className="h-5 w-5 mr-3 text-purple-600" />
                    <div>
                      <div className="font-medium">Programar</div>
                      <div className="text-xs text-muted-foreground">Agendar reunión</div>
                    </div>
                  </Button>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        {/* Tags */}
        {lead.tags && lead.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {lead.tags.slice(0, 3).map((tag, index) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs px-2 py-0.5 animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {tag}
              </Badge>
            ))}
            {lead.tags.length > 3 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                +{lead.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Last comment */}
        {lead.comments && lead.comments.length > 0 && (
          <div className="mb-3 p-2 rounded-md bg-muted/30 animate-fade-in">
            <div className="flex items-start space-x-2">
              <MessageSquare className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="text-xs text-foreground line-clamp-2">
                  {lead.comments[lead.comments.length - 1].text}
                </div>
                <div className="text-xs text-muted-foreground/70 mt-1">
                  {lead.comments[lead.comments.length - 1].author}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last contact */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{t('lastContact')}: {lead.lastContact}</span>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse" />
            <span>Toca para ver detalles</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}