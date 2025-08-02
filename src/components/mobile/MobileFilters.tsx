import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import { useTranslation } from "@/lib/translations";

interface MobileFiltersProps {
  filters: {
    search: string;
    status: string;
    tags: string;
    dateRange: string;
  };
  onFiltersChange: (filters: any) => void;
  leads: any[];
}

export function MobileFilters({ filters, onFiltersChange, leads }: MobileFiltersProps) {
  const { t } = useTranslation();
  const haptic = useHapticFeedback();
  const [isOpen, setIsOpen] = useState(false);

  const statuses = [
    { value: "all", label: "Todos los estados", emoji: "📋" },
    { value: "nuevo", label: "Nuevo", emoji: "🆕" },
    { value: "consulta-inicial", label: "Consulta", emoji: "💬" },
    { value: "evaluacion", label: "Evaluación", emoji: "📋" },
    { value: "cotizacion", label: "Cotización", emoji: "💰" },
    { value: "programado", label: "Programado", emoji: "📅" },
    { value: "cerrado", label: "Cerrado", emoji: "✅" },
    { value: "perdido", label: "Perdido", emoji: "❌" },
  ];

  const tags = Array.from(new Set(leads.flatMap(lead => lead.tags || []))).map(tag => ({
    value: tag,
    label: tag,
    count: leads.filter(lead => lead.tags?.includes(tag)).length,
  }));

  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => 
    value !== "" && value !== "all"
  ).length;

  const handleSearchChange = (value: string) => {
    haptic.light();
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: string) => {
    haptic.medium();
    onFiltersChange({ ...filters, status });
  };

  const handleTagChange = (tag: string) => {
    haptic.medium();
    onFiltersChange({ ...filters, tags: tag });
  };

  const clearFilters = () => {
    haptic.medium();
    onFiltersChange({
      search: "",
      status: "all",
      tags: "all",
      dateRange: "all",
    });
  };

  return (
    <div className="flex flex-col space-y-4 p-4 bg-background/80 backdrop-blur-sm border-b border-border">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar leads..."
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-4 h-12 text-base rounded-xl border-border/60 focus:border-primary/60 transition-all duration-200"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted/80"
            onClick={() => handleSearchChange("")}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Quick Filters */}
      <div className="flex items-center space-x-3 overflow-x-auto pb-2">
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "flex items-center space-x-2 whitespace-nowrap rounded-full h-10 px-4 transition-all duration-200",
                activeFiltersCount > 0 && "bg-primary/10 border-primary/40 text-primary"
              )}
              onClick={() => haptic.light()}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filtros</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 text-xs rounded-full bg-primary/20">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="pb-6 max-h-[80vh]">
            <DrawerHeader>
              <DrawerTitle className="text-center">Filtros Avanzados</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 space-y-6 overflow-y-auto">
              {/* Status Filter */}
              <div className="space-y-3">
                <h3 className="font-medium text-sm">Estado del Lead</h3>
                <div className="grid grid-cols-2 gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status.value}
                      variant={filters.status === status.value ? "default" : "outline"}
                      size="sm"
                      className={cn(
                        "justify-start h-11 text-left transition-all duration-200 animate-fade-in",
                        filters.status === status.value && "shadow-sm scale-[1.02]"
                      )}
                      onClick={() => handleStatusChange(status.value)}
                    >
                      <span className="mr-2">{status.emoji}</span>
                      <div>
                        <div className="text-sm font-medium">{status.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {status.value === "all" 
                            ? `${leads.length} total` 
                            : `${leads.filter(l => l.status === status.value).length} leads`
                          }
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Tags Filter */}
              {tags.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium text-sm">Etiquetas</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={filters.tags === "all" ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() => handleTagChange("all")}
                    >
                      Todas
                    </Button>
                    {tags.map((tag) => (
                      <Button
                        key={tag.value}
                        variant={filters.tags === tag.value ? "default" : "outline"}
                        size="sm"
                        className="rounded-full"
                        onClick={() => handleTagChange(tag.value)}
                      >
                        {tag.label}
                        <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs rounded-full">
                          {tag.count}
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <div className="pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl"
                    onClick={clearFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar Filtros
                  </Button>
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center space-x-2 overflow-x-auto">
            {filters.status !== "all" && (
              <Badge 
                variant="secondary" 
                className="whitespace-nowrap rounded-full animate-fade-in"
              >
                {statuses.find(s => s.value === filters.status)?.label}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleStatusChange("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
            {filters.tags !== "all" && (
              <Badge 
                variant="secondary" 
                className="whitespace-nowrap rounded-full animate-fade-in"
              >
                {filters.tags}
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => handleTagChange("all")}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}