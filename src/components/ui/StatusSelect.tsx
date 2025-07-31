import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslation } from "@/lib/translations";

type LeadStatus = "nuevo" | "consulta-inicial" | "evaluacion" | "cotizacion" | "programado" | "cerrado" | "perdido";

interface StatusSelectProps {
  value: LeadStatus;
  onStatusChange: (status: LeadStatus) => void;
  disabled?: boolean;
}

const statusConfig = {
  nuevo: { 
    color: "bg-status-nuevo", 
    textColor: "text-status-nuevo-foreground",
    label: "Nuevo", 
    variant: "default" as const,
    borderColor: "border-status-nuevo"
  },
  "consulta-inicial": { 
    color: "bg-status-consulta", 
    textColor: "text-status-consulta-foreground",
    label: "Consulta Inicial", 
    variant: "secondary" as const,
    borderColor: "border-status-consulta"
  },
  evaluacion: { 
    color: "bg-status-evaluacion", 
    textColor: "text-status-evaluacion-foreground",
    label: "Evaluación", 
    variant: "outline" as const,
    borderColor: "border-status-evaluacion"
  },
  cotizacion: { 
    color: "bg-status-cotizacion", 
    textColor: "text-status-cotizacion-foreground",
    label: "Cotización", 
    variant: "default" as const,
    borderColor: "border-status-cotizacion"
  },
  programado: { 
    color: "bg-status-programado", 
    textColor: "text-status-programado-foreground",
    label: "Programado", 
    variant: "default" as const,
    borderColor: "border-status-programado"
  },
  cerrado: { 
    color: "bg-status-cerrado", 
    textColor: "text-status-cerrado-foreground",
    label: "Cerrado", 
    variant: "default" as const,
    borderColor: "border-status-cerrado"
  },
  perdido: { 
    color: "bg-status-perdido", 
    textColor: "text-status-perdido-foreground",
    label: "Perdido", 
    variant: "destructive" as const,
    borderColor: "border-status-perdido"
  },
};

export function StatusSelect({ value, onStatusChange, disabled = false }: StatusSelectProps) {
  const { t } = useTranslation();
  const currentStatus = statusConfig[value];

  if (disabled) {
    return (
      <Badge variant={currentStatus.variant} className="font-medium">
        {t(currentStatus.label.toLowerCase())}
      </Badge>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <div className="flex items-center space-x-1">
            <Badge 
              variant={currentStatus.variant} 
              className={`font-medium cursor-pointer hover:opacity-80 ${currentStatus.color} ${currentStatus.textColor} border-0`}
            >
              {t(currentStatus.label.toLowerCase())}
            </Badge>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-popover border">
        {Object.entries(statusConfig).map(([key, config]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onStatusChange(key as LeadStatus)}
            className="cursor-pointer"
          >
            <Badge 
              variant={config.variant} 
              className={`font-medium ${config.color} ${config.textColor} border-0`}
            >
              {t(config.label.toLowerCase())}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}