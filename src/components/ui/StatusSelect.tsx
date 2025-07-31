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
  nuevo: { color: "bg-blue-500", label: "Nuevo", variant: "default" as const },
  "consulta-inicial": { color: "bg-yellow-500", label: "Consulta Inicial", variant: "secondary" as const },
  evaluacion: { color: "bg-purple-500", label: "Evaluación", variant: "outline" as const },
  cotizacion: { color: "bg-orange-500", label: "Cotización", variant: "default" as const },
  programado: { color: "bg-indigo-500", label: "Programado", variant: "default" as const },
  cerrado: { color: "bg-green-500", label: "Cerrado", variant: "default" as const },
  perdido: { color: "bg-red-500", label: "Perdido", variant: "destructive" as const },
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
            <Badge variant={currentStatus.variant} className="font-medium cursor-pointer hover:opacity-80">
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
            <Badge variant={config.variant} className="font-medium">
              {t(config.label.toLowerCase())}
            </Badge>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}