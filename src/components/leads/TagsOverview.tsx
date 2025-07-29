import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "./LeadCard";
import { getTagColor, getTagBackgroundColor } from "@/lib/tagColors";
import { Tag } from "lucide-react";

interface TagsOverviewProps {
  leads: Lead[];
}

export function TagsOverview({ leads }: TagsOverviewProps) {
  // Calcular estadísticas de etiquetas
  const tagStats = leads.reduce((acc, lead) => {
    if (lead.tags) {
      lead.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  // Ordenar etiquetas por frecuencia (más comunes primero)
  const sortedTags = Object.entries(tagStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 12); // Mostrar solo las 12 etiquetas más populares

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <Card className="bg-gradient-card border-border/60 shadow-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center">
          <Tag className="h-5 w-5 mr-2 text-primary" />
          Etiquetas Populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {sortedTags.map(([tag, count]) => (
            <div
              key={tag}
              className="relative group"
            >
              <Badge
                variant="secondary"
                className="text-sm font-medium px-3 py-1 cursor-default transition-all hover:scale-105"
                style={{
                  backgroundColor: getTagBackgroundColor(tag),
                  color: getTagColor(tag),
                  border: `1px solid ${getTagColor(tag)}20`,
                }}
              >
                {tag}
                <span 
                  className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: getTagColor(tag),
                    color: 'white',
                  }}
                >
                  {count}
                </span>
              </Badge>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-popover border border-border rounded text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {count} lead{count !== 1 ? 's' : ''} con esta etiqueta
              </div>
            </div>
          ))}
        </div>
        
        {Object.keys(tagStats).length > 12 && (
          <p className="text-xs text-muted-foreground mt-3">
            Mostrando las 12 etiquetas más populares de {Object.keys(tagStats).length} total
          </p>
        )}
      </CardContent>
    </Card>
  );
}