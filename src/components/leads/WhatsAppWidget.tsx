import { useState } from "react";
import { MessageCircle, Settings, Plus, Edit3, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

// Tipos para la configuración de mensajes
interface MessageTemplate {
  id: string;
  stage: string;
  message: string;
  isActive: boolean;
}

interface TreatmentPipeline {
  id: string;
  name: string;
  isExpanded: boolean;
  stages: {
    key: string;
    label: string;
    color: string;
  }[];
  messageTemplates: MessageTemplate[];
}

const pipelineStages = [
  { key: "nuevo", label: "Nuevo", color: "bg-blue-400" },
  { key: "consulta-inicial", label: "Consulta", color: "bg-yellow-400" },
  { key: "evaluacion", label: "Evaluación", color: "bg-purple-400" },
  { key: "cotizacion", label: "Cotización", color: "bg-orange-400" },
  { key: "programado", label: "Programado", color: "bg-indigo-400" },
  { key: "cerrado", label: "Cerrado", color: "bg-green-400" },
];

const treatmentsList = [
  "Botox",
  "Rellenos faciales",
  "Depilación láser",
  "Implante capilar",
  "Rinoplastia",
  "Aumento de senos",
  "Liposucción",
  "Lifting facial",
  "Mesoterapia",
  "CoolSculpting",
];

export function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [newTreatment, setNewTreatment] = useState("");
  const [pipelines, setPipelines] = useState<TreatmentPipeline[]>([
    {
      id: "1",
      name: "Botox",
      isExpanded: true,
      stages: pipelineStages,
      messageTemplates: [
        {
          id: "1-nuevo",
          stage: "nuevo",
          message: "¡Hola! 👋 Gracias por tu interés en [tratamiento]. Me pondré en contacto contigo para programar una consulta inicial.",
          isActive: true,
        },
        {
          id: "1-consulta",
          stage: "consulta-inicial",
          message: "¡Perfecto! Ya tienes tu consulta inicial para [tratamiento] programada. ¿Tienes alguna pregunta antes de la cita?",
          isActive: true,
        },
        {
          id: "1-evaluacion",
          stage: "evaluacion",
          message: "Hemos completado tu evaluación para [tratamiento]. Te enviaremos el plan personalizado en breve.",
          isActive: true,
        },
      ],
    },
    {
      id: "2",
      name: "Depilación láser",
      isExpanded: false,
      stages: pipelineStages,
      messageTemplates: [
        {
          id: "2-nuevo",
          stage: "nuevo",
          message: "¡Bienvenido! ✨ Has elegido [tratamiento], uno de nuestros tratamientos más populares. Te contactaremos pronto.",
          isActive: true,
        },
      ],
    },
  ]);

  const togglePipelineExpansion = (pipelineId: string) => {
    setPipelines(prev => prev.map(p => 
      p.id === pipelineId ? { ...p, isExpanded: !p.isExpanded } : p
    ));
  };

  const updateMessage = (pipelineId: string, messageId: string, newMessage: string) => {
    setPipelines(prev => prev.map(pipeline => 
      pipeline.id === pipelineId 
        ? {
            ...pipeline,
            messageTemplates: pipeline.messageTemplates.map(template =>
              template.id === messageId ? { ...template, message: newMessage } : template
            )
          }
        : pipeline
    ));
  };

  const addMessageTemplate = (pipelineId: string, stage: string) => {
    const stageInfo = pipelineStages.find(s => s.key === stage);
    if (!stageInfo) return;

    const pipeline = pipelines.find(p => p.id === pipelineId);
    if (!pipeline) return;

    const newTemplate: MessageTemplate = {
      id: `${pipelineId}-${stage}`,
      stage,
      message: `Mensaje personalizado para la etapa de ${stageInfo.label.toLowerCase()} en [tratamiento].`,
      isActive: true,
    };

    setPipelines(prev => prev.map(p => 
      p.id === pipelineId 
        ? {
            ...p,
            messageTemplates: [...p.messageTemplates, newTemplate]
          }
        : p
    ));
  };

  const addNewTreatment = () => {
    if (!newTreatment.trim()) return;

    const newPipeline: TreatmentPipeline = {
      id: Date.now().toString(),
      name: newTreatment,
      isExpanded: true,
      stages: pipelineStages,
      messageTemplates: [],
    };

    setPipelines(prev => [...prev, newPipeline]);
    setNewTreatment("");
  };

  const toggleMessageActive = (pipelineId: string, messageId: string) => {
    setPipelines(prev => prev.map(pipeline => 
      pipeline.id === pipelineId 
        ? {
            ...pipeline,
            messageTemplates: pipeline.messageTemplates.map(template =>
              template.id === messageId ? { ...template, isActive: !template.isActive } : template
            )
          }
        : pipeline
    ));
  };

  const MessageEditor = ({ 
    message, 
    onSave, 
    onCancel 
  }: { 
    message: MessageTemplate; 
    onSave: (newMessage: string) => void; 
    onCancel: () => void; 
  }) => {
    const [editedMessage, setEditedMessage] = useState(message.message);

    return (
      <div className="space-y-3 p-3 border border-border rounded-md bg-muted/30">
        <Textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
          placeholder="Escribe tu mensaje personalizado aquí..."
          className="min-h-20"
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Variables disponibles:</strong></p>
          <p><code>[tratamiento]</code> - Nombre del tratamiento</p>
          <p><code>[nombre]</code> - Nombre del lead</p>
          <p><code>[clinica]</code> - Nombre de la clínica</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => onSave(editedMessage)}>
            <Save className="w-3 h-3 mr-1" />
            Guardar
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel}>
            <X className="w-3 h-3 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="fixed bottom-6 right-6 z-50 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <MessageCircle className="w-4 h-4 mr-2 text-green-600" />
          WhatsApp
        </Button>
      </SheetTrigger>
      
      <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0">
        <SheetHeader className="p-6 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" />
            Mensajes WhatsApp por Etapa
          </SheetTitle>
        </SheetHeader>

        <div className="h-full overflow-y-auto p-6 space-y-6">
          {/* Agregar nuevo tratamiento */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Agregar Nuevo Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="Nombre del tratamiento..."
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTreatment()}
                />
                <Button onClick={addNewTreatment} disabled={!newTreatment.trim()}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {treatmentsList.map(treatment => (
                  <Badge 
                    key={treatment}
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => setNewTreatment(treatment)}
                  >
                    {treatment}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipelines por tratamiento */}
          {pipelines.map((pipeline) => (
            <Card key={pipeline.id} className="border border-border">
              <Collapsible 
                open={pipeline.isExpanded} 
                onOpenChange={() => togglePipelineExpansion(pipeline.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {pipeline.isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        {pipeline.name}
                        <Badge variant="secondary">
                          {pipeline.messageTemplates.filter(t => t.isActive).length} activos
                        </Badge>
                      </CardTitle>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Pipeline visual */}
                    <div className="flex items-center gap-1 p-3 bg-muted/30 rounded-md">
                      {pipeline.stages.map((stage, index) => (
                        <div key={stage.key} className="flex items-center">
                          <div 
                            className={`w-3 h-3 rounded-full ${stage.color} flex items-center justify-center`}
                            title={stage.label}
                          >
                            {pipeline.messageTemplates.some(t => t.stage === stage.key && t.isActive) && (
                              <MessageCircle className="w-1.5 h-1.5 text-white" />
                            )}
                          </div>
                          {index < pipeline.stages.length - 1 && (
                            <div className="w-3 h-0.5 bg-muted-foreground/30" />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Mensajes por etapa */}
                    <div className="space-y-3">
                      {pipeline.stages.map((stage) => {
                        const existingMessage = pipeline.messageTemplates.find(t => t.stage === stage.key);
                        
                        return (
                          <div key={stage.key} className="border border-border rounded-md p-3 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                <span className="font-medium text-sm">{stage.label}</span>
                              </div>
                              
                              {existingMessage ? (
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={existingMessage.isActive ? "default" : "secondary"}
                                    className="cursor-pointer"
                                    onClick={() => toggleMessageActive(pipeline.id, existingMessage.id)}
                                  >
                                    {existingMessage.isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingMessage(existingMessage.id)}
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addMessageTemplate(pipeline.id, stage.key)}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Agregar mensaje
                                </Button>
                              )}
                            </div>

                            {existingMessage && (
                              <div className="space-y-2">
                                {editingMessage === existingMessage.id ? (
                                  <MessageEditor
                                    message={existingMessage}
                                    onSave={(newMessage) => {
                                      updateMessage(pipeline.id, existingMessage.id, newMessage);
                                      setEditingMessage(null);
                                    }}
                                    onCancel={() => setEditingMessage(null)}
                                  />
                                ) : (
                                  <div className="bg-muted/30 p-2 rounded text-sm">
                                    {existingMessage.message}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}

          {pipelines.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay tratamientos configurados</p>
              <p className="text-sm">Agrega tu primer tratamiento para comenzar</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}