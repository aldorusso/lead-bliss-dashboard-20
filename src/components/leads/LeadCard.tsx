import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, Clock } from "lucide-react";
import { useTranslation } from "@/lib/translations";
import { getLeadAvatar } from "@/lib/avatarUtils";
import { getTagColor, getTagBackgroundColor } from "@/lib/tagColors";
import { LeadPipeline } from "./LeadPipeline";

export interface Comment {
  id: string;
  text: string;
  author: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "nuevo" | "consulta-inicial" | "evaluacion" | "cotizacion" | "programado" | "cerrado" | "perdido";
  lastContact: string;
  comments?: Comment[];
  tags?: string[];
  avatar?: string;
  interestedTreatments?: string[];
}

interface LeadCardProps {
  lead: Lead;
  onCall?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onSchedule?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
}

const statusConfig = {
  nuevo: { color: "bg-blue-500", label: "Nuevo", variant: "default" as const },
  "consulta-inicial": { color: "bg-yellow-500", label: "Consulta Inicial", variant: "secondary" as const },
  evaluacion: { color: "bg-purple-500", label: "Evaluación", variant: "outline" as const },
  cotizacion: { color: "bg-orange-500", label: "Cotización", variant: "default" as const },
  programado: { color: "bg-indigo-500", label: "Programado", variant: "default" as const },
  cerrado: { color: "bg-green-500", label: "Cerrado", variant: "default" as const },
  perdido: { color: "bg-red-500", label: "Perdido", variant: "destructive" as const },
};

export function LeadCard({ lead, onCall, onEmail, onSchedule, onViewDetails }: LeadCardProps) {
  const { t } = useTranslation();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const statusInfo = statusConfig[lead.status];

  // Determinar si el lead necesita seguimiento (más de 7 días sin contacto)
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

  return (
    <Card className={`group relative overflow-hidden bg-gradient-card border-border/60 shadow-card hover:shadow-hover transition-all duration-300 hover:scale-[1.02] ${needsFollowUp() ? 'ring-2 ring-orange-400/50 border-orange-300/60' : ''}`}>
      <div className={`absolute top-0 left-0 right-0 h-1 ${statusInfo.color}`} />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={getLeadAvatar(lead)} alt={lead.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(lead.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {lead.name}
                </h3>
                {needsFollowUp() && (
                  <div title="Necesita seguimiento">
                    <Clock className="h-4 w-4 text-orange-500" />
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
            </div>
          </div>
          <Badge variant={statusInfo.variant} className="font-medium">
            {t(statusInfo.label.toLowerCase())}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Phone className="h-4 w-4 mr-2 text-primary/60" />
            <span>{lead.phone}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Mail className="h-4 w-4 mr-2 text-primary/60" />
            <span>{lead.email}</span>
          </div>
          
          {/* Tags */}
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs font-medium"
                  style={{
                    backgroundColor: getTagBackgroundColor(tag),
                    color: getTagColor(tag),
                    border: `1px solid ${getTagColor(tag)}20`,
                  }}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Pipeline Visual */}
        <div className="mt-3 pt-2 border-t border-border/40">
          <LeadPipeline status={lead.status} className="justify-center" />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => onCall?.(lead)}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => onEmail?.(lead)}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
              onClick={() => onSchedule?.(lead)}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-xs"
            onClick={() => onViewDetails?.(lead)}
          >
            {t('viewDetails')}
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          {t('lastContact')}: {lead.lastContact}
        </div>
      </CardContent>
    </Card>
  );
}