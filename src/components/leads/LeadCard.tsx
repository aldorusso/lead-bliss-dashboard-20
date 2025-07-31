import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Mail, Calendar, Clock, MessageSquare } from "lucide-react";
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

interface Stage {
  key: string;
  label: string;
  color: string;
}

interface LeadCardProps {
  lead: Lead;
  onWhatsApp?: (lead: Lead) => void;
  onWhatsAppAPI?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onSchedule?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
  onStatusClick?: (status: Lead["status"]) => void;
  stages?: Stage[];
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

export function LeadCard({ lead, onWhatsApp, onWhatsAppAPI, onEmail, onSchedule, onViewDetails, onStatusClick, stages }: LeadCardProps) {
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
            <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
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

        {/* Último comentario */}
        {lead.comments && lead.comments.length > 0 && (
          <div className="mt-3 pt-2 border-t border-border/40">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-start space-x-2 p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-xs text-muted-foreground truncate">
                        {lead.comments[lead.comments.length - 1].text}
                      </div>
                      <div className="text-xs text-muted-foreground/70 mt-1">
                        Por {lead.comments[lead.comments.length - 1].author}
                      </div>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <div className="space-y-1">
                    <p className="text-sm">{lead.comments[lead.comments.length - 1].text}</p>
                    <div className="text-xs text-muted-foreground">
                      Por {lead.comments[lead.comments.length - 1].author} - {lead.comments[lead.comments.length - 1].timestamp}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}

        {/* Pipeline Visual */}
        <div className="mt-3 pt-2 border-t border-border/40">
          <LeadPipeline 
            status={lead.status} 
            className="justify-center" 
            onStatusClick={onStatusClick}
            stages={stages}
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border/60">
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onWhatsApp?.(lead)}
              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
              title="Abrir WhatsApp Web"
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onWhatsAppAPI?.(lead)}
              className="hover:bg-green-50 hover:border-green-300 hover:text-green-700"
              title="Enviar vía API WhatsApp"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.487"/>
              </svg>
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onEmail?.(lead)}
              className="hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
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