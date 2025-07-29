import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Phone, Mail, Calendar, Eye } from "lucide-react";
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
  onCall?: (lead: Lead) => void;
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

export function LeadList({ leads, onCall, onEmail, onSchedule, onViewDetails, onStatusClick }: LeadListProps) {
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
            <TableHead>{t('phone')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead>{t('tags')}</TableHead>
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
                <TableCell className="text-muted-foreground text-sm">
                  {lead.lastContact}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end space-x-1">
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