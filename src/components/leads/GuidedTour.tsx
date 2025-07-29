import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, X, Settings, MessageCircle, UserPlus, Filter } from "lucide-react";

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector
  icon: any;
  position: "center" | "top" | "bottom" | "left" | "right";
  action?: () => void;
}

interface GuidedTourProps {
  isOpen: boolean;
  onComplete: () => void;
  onOpenStageManager: () => void;
  onOpenWhatsApp: () => void;
  onOpenAddLead: () => void;
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "¡Bienvenido a tu CRM!",
    description: "Te mostraremos las funciones principales para que puedas empezar a gestionar tus leads de manera eficiente.",
    target: "",
    icon: null,
    position: "center"
  },
  {
    id: "filters",
    title: "Filtros de leads",
    description: "Aquí puedes buscar y filtrar tus leads por estado, fecha y otros criterios.",
    target: '[data-tour="filters"]',
    icon: Filter,
    position: "bottom"
  },
  {
    id: "stage-manager", 
    title: "Gestionar etapas",
    description: "Haz clic en 'Configurar Ahora' para personalizar las etapas de tu pipeline de ventas.",
    target: 'button',
    icon: Settings,
    position: "bottom",
    action: () => {} // Se define en el componente
  },
  {
    id: "add-lead",
    title: "Agregar nuevo lead", 
    description: "Haz clic en 'Configurar Ahora' para agregar tu primer lead al sistema.",
    target: 'button',
    icon: UserPlus,
    position: "left",
    action: () => {} // Se define en el componente
  },
  {
    id: "floating-menu",
    title: "Menú de herramientas",
    description: "Aquí encontrarás acceso rápido a WhatsApp, automatizaciones y configuración.",
    target: '[data-tour="floating-menu"]',
    icon: MessageCircle,
    position: "left"
  }
];

export function GuidedTour({ isOpen, onComplete, onOpenStageManager, onOpenWhatsApp, onOpenAddLead }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedElement, setHighlightedElement] = useState<Element | null>(null);

  const currentStepData = tourSteps[currentStep];

  useEffect(() => {
    if (!isOpen || !currentStepData?.target) {
      setHighlightedElement(null);
      return;
    }

    // Wait a bit for DOM to be ready
    const timer = setTimeout(() => {
      let element = null;
      
      // Try different selector strategies based on step
      if (currentStepData.id === 'stage-manager') {
        // Find button with text "Gestionar Etapas"
        element = Array.from(document.querySelectorAll('button')).find(el => 
          el.textContent?.includes('Gestionar Etapas')
        );
      } else if (currentStepData.id === 'add-lead') {
        // Find button with text "Nuevo Lead"
        element = Array.from(document.querySelectorAll('button')).find(el => 
          el.textContent?.includes('Nuevo Lead')
        );
      } else {
        // For data-tour attributes and other selectors
        element = document.querySelector(currentStepData.target);
      }
      
      console.log(`Tour step: ${currentStepData.id}, target: ${currentStepData.target}, found:`, element);
      setHighlightedElement(element);

      // Scroll to element if found
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [currentStep, isOpen, currentStepData]);

  const handleNext = () => {
    if (currentStepData?.action) {
      currentStepData.action();
    }

    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  // Update actions for current step
  if (currentStepData) {
    switch (currentStepData.id) {
      case "stage-manager":
        currentStepData.action = onOpenStageManager;
        break;
      case "add-lead":
        currentStepData.action = onOpenAddLead;
        break;
    }
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Spotlight effect */}
      {highlightedElement && (
        <div
          className="fixed z-50 pointer-events-none transition-all duration-500"
          style={{
            top: highlightedElement.getBoundingClientRect().top - 8 + window.scrollY,
            left: highlightedElement.getBoundingClientRect().left - 8 + window.scrollX,
            width: highlightedElement.getBoundingClientRect().width + 16,
            height: highlightedElement.getBoundingClientRect().height + 16,
            border: '4px solid #3b82f6',
            borderRadius: '8px',
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7), 0 0 20px rgba(59, 130, 246, 0.5)',
            background: 'transparent'
          }}
        />
      )}

      {/* Tour Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md bg-background border-primary/20 shadow-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {currentStepData?.icon && (
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    <currentStepData.icon className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <CardTitle className="text-lg">{currentStepData?.title}</CardTitle>
                  <Badge variant="secondary" className="mt-1">
                    {currentStep + 1} de {tourSteps.length}
                  </Badge>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSkip}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              {currentStepData?.description}
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentStep
                      ? "bg-primary scale-125"
                      : index < currentStep
                      ? "bg-primary/50"
                      : "bg-muted"
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                size="sm"
              >
                Anterior
              </Button>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={handleSkip} size="sm">
                  Saltar tour
                </Button>
                <Button onClick={handleNext} size="sm" className="bg-gradient-primary hover:opacity-90">
                  {currentStep === tourSteps.length - 1 ? "¡Finalizar!" : "Siguiente"}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}