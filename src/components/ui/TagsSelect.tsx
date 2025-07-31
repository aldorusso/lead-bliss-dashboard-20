import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Plus, ChevronDown } from "lucide-react";
import { getTagColor, getTagBackgroundColor } from "@/lib/tagColors";

interface TagsSelectProps {
  value: string[];
  onTagsChange: (tags: string[]) => void;
  disabled?: boolean;
  availableTags?: string[];
}

const DEFAULT_TAGS = [
  "botox", "rellenos", "laser", "depilacion", "urgente", "primera-vez",
  "implante-capilar", "tratamiento-completado", "presupuesto", "competencia",
  "cirugia", "aumento-senos", "liposuccion", "primera-consulta", "cita-programada",
  "calvicie", "lifting", "ginecomastia", "masculino", "rinoplastia", "evaluacion-medica",
  "plasma-rico", "laser-co2", "cicatrices", "coolsculpting", "criolipolisis",
  "otoplastia", "ultherapy", "microinjertos", "cita-confirmada", "hifu", "rejuvenecimiento"
];

export function TagsSelect({ 
  value = [], 
  onTagsChange, 
  disabled = false, 
  availableTags = DEFAULT_TAGS 
}: TagsSelectProps) {
  const [newTag, setNewTag] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const addTag = (tag: string) => {
    if (tag && !value.includes(tag)) {
      onTagsChange([...value, tag]);
    }
    setNewTag("");
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(value.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(newTag.trim());
    }
  };

  if (disabled) {
    return (
      <div className="flex flex-wrap gap-1">
        {value.length > 0 ? (
          value.slice(0, 2).map((tag, index) => (
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
          ))
        ) : (
          <span className="text-muted-foreground text-sm">-</span>
        )}
        {value.length > 2 && (
          <Badge variant="secondary" className="text-xs">
            +{value.length - 2}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="h-auto p-1 hover:bg-muted/50 justify-start">
          <div className="flex items-center space-x-2 w-full">
            <div className="flex flex-wrap gap-1 flex-1">
              {value.length > 0 ? (
                value.slice(0, 2).map((tag, index) => (
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
                ))
              ) : (
                <span className="text-muted-foreground text-sm">-</span>
              )}
              {value.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{value.length - 2}
                </Badge>
              )}
            </div>
            <ChevronDown className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 bg-popover border" align="start">
        <div className="space-y-3">
          {/* Tags actuales */}
          {value.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Etiquetas actuales:</h4>
              <div className="flex flex-wrap gap-1">
                {value.map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs font-medium group cursor-pointer"
                    style={{
                      backgroundColor: getTagBackgroundColor(tag),
                      color: getTagColor(tag),
                      border: `1px solid ${getTagColor(tag)}20`,
                    }}
                  >
                    {tag}
                    <X 
                      className="h-3 w-3 ml-1 opacity-60 group-hover:opacity-100" 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTag(tag);
                      }}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Agregar nueva etiqueta */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Agregar etiqueta:</h4>
            <div className="flex space-x-2">
              <Input
                placeholder="Nueva etiqueta..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-8 text-sm"
              />
              <Button 
                size="sm" 
                onClick={() => addTag(newTag.trim())}
                disabled={!newTag.trim()}
                className="h-8 px-3"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Etiquetas sugeridas */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Etiquetas sugeridas:</h4>
            <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
              {availableTags
                .filter(tag => !value.includes(tag))
                .map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs cursor-pointer hover:bg-muted"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}