import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MessageCircle, Mail, Calendar, Eye, MessageSquare } from "lucide-react";
import { Lead } from "@/components/leads/LeadCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "@/lib/translations";
import { getLeadAvatar } from "@/lib/avatarUtils";

interface LeadListProps {
  leads: Lead[];
  onWhatsApp?: (lead: Lead) => void;
  onWhatsAppAPI?: (lead: Lead) => void;
  onEmail?: (lead: Lead) => void;
  onSchedule?: (lead: Lead) => void;
  onViewDetails?: (lead: Lead) => void;
  onStatusClick?: (status: Lead["status"]) => void;
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

export function LeadList({ leads, onWhatsApp, onWhatsAppAPI, onEmail, onSchedule, onViewDetails, onStatusClick }: LeadListProps) {
  const { t } = useTranslation();
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Lead</TableHead>
            <TableHead>{t('email')}</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('tags')}</TableHead>
            <TableHead>Último comentario</TableHead>
            <TableHead>{t('lastContact')}</TableHead>
            <TableHead className="text-right">{t('actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => {
            const statusInfo = statusConfig[lead.status];
            return (
              <TableRow key={lead.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage src={getLeadAvatar(lead)} alt={lead.name} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getInitials(lead.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-foreground">{lead.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{lead.email}</TableCell>
                <TableCell className="text-muted-foreground">{lead.phone}</TableCell>
                <TableCell>
                  <button 
                    onClick={() => onStatusClick?.(lead.status)}
                    className="transition-transform hover:scale-105"
                  >
                    <Badge variant={statusInfo.variant} className="font-medium cursor-pointer hover:opacity-80">
                      {t(statusInfo.label.toLowerCase())}
                    </Badge>
                  </button>
                </TableCell>
                <TableCell>
                  {lead.tags && lead.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {lead.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {lead.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{lead.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="max-w-[200px]">
                  {lead.comments && lead.comments.length > 0 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2 cursor-pointer">
                            <MessageSquare className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground truncate">
                              {lead.comments[lead.comments.length - 1].text}
                            </span>
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
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {lead.lastContact}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
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
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onViewDetails?.(lead)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}