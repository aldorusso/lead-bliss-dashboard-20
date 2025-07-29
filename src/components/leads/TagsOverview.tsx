import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead } from "./LeadCard";
import { getTagColor, getTagBackgroundColor } from "@/lib/tagColors";
import { Tag } from "lucide-react";

interface TagsOverviewProps {
  leads: Lead[];
  onTagClick?: (tag: string) => void;
  selectedTag?: string;
}

export function TagsOverview({ leads, onTagClick, selectedTag }: TagsOverviewProps) {
  const [showAll, setShowAll] = useState(false);
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
    .sort(([, a], [, b]) => b - a);

  const displayedTags = showAll ? sortedTags : sortedTags.slice(0, 12);

  if (sortedTags.length === 0) {
    return null;
  }

  return (
    <div className="bg-muted/20 border border-border/40 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Tag className="h-4 w-4 mr-2" />
          <span>Etiquetas más frecuentes</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {Object.keys(tagStats).length} etiquetas
        </span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
        {displayedTags.map(([tag, count]) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className={`group flex items-center justify-between border rounded-md px-2 py-1.5 transition-all duration-200 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                isSelected 
                  ? 'bg-primary/10 border-primary/40 shadow-sm' 
                  : 'bg-background/60 hover:bg-background border-border/60'
              }`}
            >
              <div className="flex items-center min-w-0">
                <div 
                  className="w-2 h-2 rounded-full mr-2 flex-shrink-0"
                  style={{ backgroundColor: getTagColor(tag) }}
                />
                <span className={`text-xs truncate font-medium ${
                  isSelected ? 'text-primary' : 'text-foreground'
                }`}>
                  {tag}
                </span>
              </div>
              <span 
                className={`text-xs font-semibold ml-1 px-1.5 py-0.5 rounded-full flex-shrink-0 ${
                  isSelected ? 'font-bold' : ''
                }`}
                style={{
                  backgroundColor: isSelected ? getTagColor(tag) : `${getTagColor(tag)}15`,
                  color: isSelected ? 'white' : getTagColor(tag),
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      
      {sortedTags.length > 12 && (
        <div className="flex justify-center mt-3">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
          >
            {showAll 
              ? 'Mostrar menos' 
              : `${sortedTags.length - 12} etiquetas más...`
            }
          </button>
        </div>
      )}
    </div>
  );
}