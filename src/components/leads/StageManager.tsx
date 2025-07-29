import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Trash2, Edit2, Save, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Stage {
  key: string;
  label: string;
  color: string;
}

interface StageManagerProps {
  stages: Stage[];
  onStagesChange: (stages: Stage[]) => void;
}

const availableColors = [
  "bg-blue-400",
  "bg-yellow-400", 
  "bg-purple-400",
  "bg-orange-400",
  "bg-indigo-400",
  "bg-green-400",
  "bg-red-400",
  "bg-pink-400",
  "bg-cyan-400",
  "bg-lime-400"
];

export function StageManager({ stages, onStagesChange }: StageManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingStages, setEditingStages] = useState<Stage[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newStage, setNewStage] = useState({ label: "", color: "bg-blue-400" });
  const { toast } = useToast();

  const handleOpen = () => {
    setEditingStages([...stages]);
    setIsOpen(true);
  };

  const handleSave = () => {
    if (editingStages.length === 0) {
      toast({
        title: "Error",
        description: "Debe haber al menos una etapa",
        variant: "destructive"
      });
      return;
    }
    
    onStagesChange(editingStages);
    setIsOpen(false);
    toast({
      title: "Etapas actualizadas",
      description: "Los cambios se han guardado correctamente"
    });
  };

  const handleAddStage = () => {
    if (!newStage.label.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la etapa no puede estar vacío",
        variant: "destructive"
      });
      return;
    }

    const key = newStage.label.toLowerCase().replace(/\s+/g, '-');
    const newStageObj = { ...newStage, key };
    setEditingStages([...editingStages, newStageObj]);
    setNewStage({ label: "", color: "bg-blue-400" });
  };

  const handleDeleteStage = (index: number) => {
    if (editingStages.length === 1) {
      toast({
        title: "Error",
        description: "No se puede eliminar la última etapa",
        variant: "destructive"
      });
      return;
    }
    setEditingStages(editingStages.filter((_, i) => i !== index));
  };

  const handleEditStage = (index: number, field: 'label' | 'color', value: string) => {
    const updated = [...editingStages];
    if (field === 'label') {
      updated[index] = { ...updated[index], label: value, key: value.toLowerCase().replace(/\s+/g, '-') };
    } else {
      updated[index] = { ...updated[index], [field]: value };
    }
    setEditingStages(updated);
  };

  const moveStage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingStages.length) return;

    const updated = [...editingStages];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setEditingStages(updated);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          onClick={handleOpen}
          className="border-border/60 hover:bg-muted/50"
        >
          <Settings className="h-4 w-4 mr-2" />
          Gestionar Etapas
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Gestionar Etapas del Pipeline
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Lista de etapas existentes */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Etapas Actuales</Label>
            <div className="space-y-2">
              {editingStages.map((stage, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border border-border rounded-lg">
                  <div className={`w-4 h-4 rounded-full ${stage.color}`} />
                  
                  {editingIndex === index ? (
                    <Input
                      value={stage.label}
                      onChange={(e) => handleEditStage(index, 'label', e.target.value)}
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') setEditingIndex(null);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      autoFocus
                    />
                  ) : (
                    <span className="flex-1 font-medium">{stage.label}</span>
                  )}

                  <div className="flex items-center gap-1">
                    {/* Color picker */}
                    <div className="flex gap-1">
                      {availableColors.slice(0, 5).map((color) => (
                        <button
                          key={color}
                          onClick={() => handleEditStage(index, 'color', color)}
                          className={`w-6 h-6 rounded-full ${color} border-2 ${
                            stage.color === color ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>

                    {/* Move buttons */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStage(index, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStage(index, 'down')}
                      disabled={index === editingStages.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      ↓
                    </Button>

                    {/* Edit/Save button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                      className="h-8 w-8 p-0"
                    >
                      {editingIndex === index ? <Save className="h-4 w-4" /> : <Edit2 className="h-4 w-4" />}
                    </Button>

                    {/* Delete button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteStage(index)}
                      disabled={editingStages.length === 1}
                      className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agregar nueva etapa */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-medium">Agregar Nueva Etapa</Label>
            <div className="flex items-center gap-3">
              <Input
                placeholder="Nombre de la etapa"
                value={newStage.label}
                onChange={(e) => setNewStage({ ...newStage, label: e.target.value })}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddStage();
                }}
              />
              
              <div className="flex gap-1">
                {availableColors.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewStage({ ...newStage, color })}
                    className={`w-8 h-8 rounded-full ${color} border-2 ${
                      newStage.color === color ? 'border-foreground' : 'border-transparent hover:border-muted-foreground'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleAddStage} size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSave} className="bg-gradient-primary hover:opacity-90">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}