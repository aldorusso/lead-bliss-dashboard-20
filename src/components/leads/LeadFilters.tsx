import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, X, Plus } from "lucide-react";

interface FilterState {
  search: string;
  status: string;
  tags: string;
  dateRange: string;
}

interface LeadFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onAddLead: () => void;
  leads?: any[]; // Para calcular los contadores
}

export function LeadFilters({ filters, onFiltersChange, onAddLead, leads = [] }: LeadFiltersProps) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({ search: "", status: "all", tags: "all", dateRange: "all" });
  };

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === 'search') return value !== "";
    return value !== "" && value !== "all";
  }).length;

  // Calcular contadores por estado
  const getStatusCount = (status: string) => {
    return leads.filter(lead => lead.status === status).length;
  };

  // Calcular contadores por etiqueta
  const getTagCount = (tag: string) => {
    return leads.filter(lead => lead.tags?.includes(tag)).length;
  };

  return (
    <div className="space-y-4">
      {/* Primera línea: Búsqueda más compacta */}
      <div className="flex items-center gap-4">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar leads..."
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-10 bg-background border-border/60 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Segunda línea: Filtros y botón nuevo lead */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filtros:</span>
          </div>

        <Select value={filters.status} onValueChange={(value) => updateFilter("status", value)}>
          <SelectTrigger className="w-40 bg-background border-border/60">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border/60">
            <SelectItem value="all">Todos los estados ({leads.length})</SelectItem>
            <SelectItem value="nuevo">Nuevo ({getStatusCount('nuevo')})</SelectItem>
            <SelectItem value="consulta-inicial">Consulta Inicial ({getStatusCount('consulta-inicial')})</SelectItem>
            <SelectItem value="evaluacion">Evaluación ({getStatusCount('evaluacion')})</SelectItem>
            <SelectItem value="cotizacion">Cotización ({getStatusCount('cotizacion')})</SelectItem>
            <SelectItem value="programado">Programado ({getStatusCount('programado')})</SelectItem>
            <SelectItem value="cerrado">Cerrado ({getStatusCount('cerrado')})</SelectItem>
            <SelectItem value="perdido">Perdido ({getStatusCount('perdido')})</SelectItem>
          </SelectContent>
        </Select>


          <Select value={filters.dateRange} onValueChange={(value) => updateFilter("dateRange", value)}>
            <SelectTrigger className="w-40 bg-background border-border/60">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border/60">
              <SelectItem value="all">Todo el tiempo</SelectItem>
              <SelectItem value="today">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Este trimestre</SelectItem>
            </SelectContent>
          </Select>

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount} filtro{activeFiltersCount !== 1 ? 's' : ''} activo{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>

        {/* Botón Nuevo Lead */}
        <Button 
          onClick={onAddLead}
          className="bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow whitespace-nowrap"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Lead
        </Button>
      </div>
    </div>
  );
}