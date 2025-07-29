import { useState } from "react";
import { MessageCircle, Settings, Plus, Edit3, Save, X, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface WhatsAppWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppWidget({ isOpen, onClose }: WhatsAppWidgetProps) {
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
      <div className="space-y-3 p-2 sm:p-3 border border-border rounded-md bg-muted/30">
        <Textarea
          value={editedMessage}
          onChange={(e) => setEditedMessage(e.target.value)}
          placeholder="Escribe tu mensaje personalizado aquí..."
          className="min-h-16 sm:min-h-20 text-xs sm:text-sm"
        />
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Variables disponibles:</strong></p>
          <div className="flex flex-wrap gap-2 text-xs">
            <code className="bg-background px-1.5 py-0.5 rounded">[tratamiento]</code>
            <code className="bg-background px-1.5 py-0.5 rounded">[nombre]</code>
            <code className="bg-background px-1.5 py-0.5 rounded">[clinica]</code>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button size="sm" onClick={() => onSave(editedMessage)} className="text-xs">
            <Save className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Guardar</span>
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="text-xs">
            <X className="w-3 h-3 sm:mr-1" />
            <span className="hidden sm:inline">Cancelar</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-none w-[98vw] h-[98vh] flex flex-col overflow-hidden p-0 gap-0">
        <DialogHeader className="p-4 sm:p-6 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-sm sm:text-base">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
            <span className="hidden sm:inline">Mensajes WhatsApp Automáticos por Etapa</span>
            <span className="sm:hidden">WhatsApp Automático</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Explicación de funcionamiento */}
          <Alert className="shrink-0">
            <MessageCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              <strong>¿Cómo funciona?</strong> Los mensajes se envían automáticamente cuando un lead cambia de etapa. 
              Configura mensajes personalizados para cada tratamiento y etapa del pipeline.
            </AlertDescription>
          </Alert>
          {/* Agregar nuevo tratamiento */}
          <Card className="shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm sm:text-base">Agregar Nuevo Tratamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  placeholder="Nombre del tratamiento..."
                  value={newTreatment}
                  onChange={(e) => setNewTreatment(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewTreatment()}
                  className="flex-1"
                />
                <Button onClick={addNewTreatment} disabled={!newTreatment.trim()} className="w-full sm:w-auto">
                  <Plus className="w-4 h-4 sm:mr-2" />
                  <span className="hidden sm:inline">Agregar</span>
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {treatmentsList.map(treatment => (
                  <Badge 
                    key={treatment}
                    variant="outline" 
                    className="cursor-pointer hover:bg-muted transition-colors text-xs"
                    onClick={() => setNewTreatment(treatment)}
                  >
                    {treatment}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pipelines por tratamiento */}
          <div className="space-y-4 sm:space-y-6">
            {pipelines.map((pipeline) => (
              <Card key={pipeline.id} className="border border-border">
                <Collapsible 
                  open={pipeline.isExpanded} 
                  onOpenChange={() => togglePipelineExpansion(pipeline.id)}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
                          {pipeline.isExpanded ? (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                          <span className="truncate">{pipeline.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {pipeline.messageTemplates.filter(t => t.isActive).length} activos
                          </Badge>
                        </CardTitle>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>

                <CollapsibleContent>
                  <CardContent className="space-y-4">
                    {/* Pipeline visual */}
                    <div className="flex items-center gap-1 p-2 sm:p-3 bg-muted/30 rounded-md overflow-x-auto">
                      <div className="flex items-center gap-1 min-w-max">
                        {pipeline.stages.map((stage, index) => (
                          <div key={stage.key} className="flex items-center">
                            <div 
                              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${stage.color} flex items-center justify-center`}
                              title={stage.label}
                            >
                              {pipeline.messageTemplates.some(t => t.stage === stage.key && t.isActive) && (
                                <MessageCircle className="w-1 h-1 sm:w-1.5 sm:h-1.5 text-white" />
                              )}
                            </div>
                            {index < pipeline.stages.length - 1 && (
                              <div className="w-2 sm:w-3 h-0.5 bg-muted-foreground/30" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mensajes por etapa */}
                    <div className="space-y-3">
                      {pipeline.stages.map((stage) => {
                        const existingMessage = pipeline.messageTemplates.find(t => t.stage === stage.key);
                        
                        return (
                          <div key={stage.key} className="border border-border rounded-md p-2 sm:p-3 space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                <span className="font-medium text-xs sm:text-sm">{stage.label}</span>
                              </div>
                              
                              {existingMessage ? (
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant={existingMessage.isActive ? "default" : "secondary"}
                                    className="cursor-pointer text-xs"
                                    onClick={() => toggleMessageActive(pipeline.id, existingMessage.id)}
                                  >
                                    {existingMessage.isActive ? "Activo" : "Inactivo"}
                                  </Badge>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingMessage(existingMessage.id)}
                                    className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => addMessageTemplate(pipeline.id, stage.key)}
                                  className="text-xs"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  <span className="hidden sm:inline">Agregar mensaje</span>
                                  <span className="sm:hidden">Agregar</span>
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
                                  <div className="bg-muted/30 p-2 rounded text-xs sm:text-sm leading-relaxed">
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
              <div className="text-center py-8 sm:py-12 text-muted-foreground">
                <MessageCircle className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-base sm:text-lg font-medium">No hay tratamientos configurados</p>
                <p className="text-xs sm:text-sm">Agrega tu primer tratamiento para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}