import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Trash2, 
  ArrowRight, 
  Mail, 
  Phone, 
  Tag, 
  X,
  MoreHorizontal
} from "lucide-react";
import { Lead } from "@/components/leads/LeadCard";
import { useTranslation } from "@/lib/translations";

interface BulkActionsMenuProps {
  selectedLeads: Lead[];
  onClearSelection: () => void;
  onDeleteLeads: (leadIds: string[]) => void;
  onChangeStatus: (leadIds: string[], status: Lead["status"]) => void;
  onBulkEmail: (leads: Lead[]) => void;
  onBulkWhatsApp: (leads: Lead[]) => void;
  onAddTags: (leadIds: string[], tags: string[]) => void;
}

const statusOptions = [
  { key: "nuevo", label: "Nuevo", variant: "default" as const },
  { key: "consulta-inicial", label: "Consulta Inicial", variant: "secondary" as const },
  { key: "evaluacion", label: "Evaluación", variant: "outline" as const },
  { key: "cotizacion", label: "Cotización", variant: "default" as const },
  { key: "programado", label: "Programado", variant: "default" as const },
  { key: "cerrado", label: "Cerrado", variant: "default" as const },
  { key: "perdido", label: "Perdido", variant: "destructive" as const },
];

export function BulkActionsMenu({
  selectedLeads,
  onClearSelection,
  onDeleteLeads,
  onChangeStatus,
  onBulkEmail,
  onBulkWhatsApp,
  onAddTags
}: BulkActionsMenuProps) {
  const { t } = useTranslation();
  
  if (selectedLeads.length === 0) return null;

  const selectedIds = selectedLeads.map(lead => lead.id);

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 flex items-center space-x-4 min-w-fit">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="font-medium">
            {selectedLeads.length} leads seleccionados
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="h-6 w-6 p-0 hover:bg-muted"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex items-center space-x-2">
          {/* Cambiar Estado */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <ArrowRight className="h-3 w-3 mr-2" />
                Cambiar estado
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-48">
              {statusOptions.map((status) => (
                <DropdownMenuItem
                  key={status.key}
                  onClick={() => onChangeStatus(selectedIds, status.key as Lead["status"])}
                  className="cursor-pointer"
                >
                  <Badge variant={status.variant} className="mr-2 text-xs">
                    {status.label}
                  </Badge>
                  Mover a {status.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Email masivo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkEmail(selectedLeads)}
            className="h-8"
          >
            <Mail className="h-3 w-3 mr-2" />
            Email
          </Button>

          {/* WhatsApp masivo */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkWhatsApp(selectedLeads)}
            className="h-8"
          >
            <Phone className="h-3 w-3 mr-2" />
            WhatsApp
          </Button>

          {/* Más acciones */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => onAddTags(selectedIds, ["seguimiento"])}
                className="cursor-pointer"
              >
                <Tag className="h-3 w-3 mr-2" />
                Agregar etiqueta
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDeleteLeads(selectedIds)}
                className="cursor-pointer text-destructive"
              >
                <Trash2 className="h-3 w-3 mr-2" />
                Eliminar leads
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}