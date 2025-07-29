import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Settings, MessageCircle, UserPlus, Zap, ArrowRight, ArrowLeft } from "lucide-react";

interface SetupWizardProps {
  isOpen: boolean;
  onComplete: () => void;
  onOpenStageManager: () => void;
  onOpenWhatsApp: () => void;
  onOpenAddLead: () => void;
  onOpenAutomations: () => void;
}

const wizardSteps = [
  {
    id: 1,
    title: "¡Bienvenido!",
    icon: CheckCircle,
    description: "Te guiaremos paso a paso para configurar tu sistema de gestión de leads",
    content: "Este asistente te ayudará a configurar todo lo necesario para empezar a gestionar tus leads de manera eficiente."
  },
  {
    id: 2,
    title: "Configurar Etapas",
    icon: Settings,
    description: "Define las etapas de tu pipeline de ventas",
    content: "Personaliza las etapas por las que pasarán tus leads, desde el primer contacto hasta la venta cerrada.",
    action: "openStageManager"
  },
  {
    id: 3,
    title: "Mensajes WhatsApp",
    icon: MessageCircle,
    description: "Configura mensajes automáticos para cada etapa",
    content: "Automatiza tus comunicaciones con mensajes personalizados que se envían cuando un lead cambia de etapa.",
    action: "openWhatsApp"
  },
  {
    id: 4,
    title: "Primer Lead",
    icon: UserPlus,
    description: "Agrega tu primer lead al sistema",
    content: "Crea tu primer registro de lead para familiarizarte con el sistema de gestión.",
    action: "openAddLead"
  },
  {
    id: 5,
    title: "Automatizaciones",
    icon: Zap,
    description: "Configura recordatorios y seguimientos automáticos",
    content: "Establece automatizaciones para no perder ningún seguimiento importante con tus leads.",
    action: "openAutomations"
  },
  {
    id: 6,
    title: "¡Listo!",
    icon: CheckCircle,
    description: "Tu sistema está configurado y listo para usar",
    content: "¡Perfecto! Ya tienes todo configurado. Ahora puedes empezar a gestionar tus leads de manera profesional."
  }
];

export function SetupWizard({ isOpen, onComplete, onOpenStageManager, onOpenWhatsApp, onOpenAddLead, onOpenAutomations }: SetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const currentStepData = wizardSteps.find(step => step.id === currentStep);
  const progress = (currentStep / wizardSteps.length) * 100;

  const handleNext = () => {
    if (currentStep < wizardSteps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleActionClick = () => {
    if (!currentStepData?.action) return;

    setCompletedSteps([...completedSteps, currentStep]);

    switch (currentStepData.action) {
      case "openStageManager":
        onOpenStageManager();
        break;
      case "openWhatsApp":
        onOpenWhatsApp();
        break;
      case "openAddLead":
        onOpenAddLead();
        break;
      case "openAutomations":
        onOpenAutomations();
        break;
    }
  };

  const handleSkipStep = () => {
    setCompletedSteps([...completedSteps, currentStep]);
    handleNext();
  };

  if (!currentStepData) return null;

  const IconComponent = currentStepData.icon;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{currentStepData.title}</h2>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>
            
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Paso {currentStep} de {wizardSteps.length}</span>
                <span>{Math.round(progress)}% completado</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">¿Qué haremos en este paso?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {currentStepData.content}
              </p>
            </CardContent>
          </Card>

          {/* Steps overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {wizardSteps.map((step) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = step.id === currentStep;
              const isPending = step.id > currentStep;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border text-center transition-all ${
                    isCompleted
                      ? "bg-green-50 border-green-200 text-green-700"
                      : isCurrent
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-muted/30 border-border text-muted-foreground"
                  }`}
                >
                  <StepIcon className={`w-6 h-6 mx-auto mb-2 ${
                    isCompleted ? "text-green-600" : isCurrent ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <p className="text-xs font-medium">{step.title}</p>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            <div className="flex gap-3">
              {currentStepData.action && (
                <Button
                  onClick={handleActionClick}
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Configurar Ahora
                </Button>
              )}

              {currentStepData.action && (
                <Button variant="outline" onClick={handleSkipStep}>
                  Saltar por ahora
                </Button>
              )}

              {!currentStepData.action && (
                <Button onClick={handleNext} className="bg-gradient-primary hover:opacity-90">
                  {currentStep === wizardSteps.length ? "¡Finalizar!" : "Siguiente"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}