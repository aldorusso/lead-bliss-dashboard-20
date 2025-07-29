import { Lead } from "./LeadCard";

interface LeadPipelineProps {
  status: Lead["status"];
  className?: string;
}

const pipelineStages = [
  { key: "nuevo", label: "Nuevo", color: "bg-blue-400" },
  { key: "consulta-inicial", label: "Consulta", color: "bg-yellow-400" },
  { key: "evaluacion", label: "Evaluación", color: "bg-purple-400" },
  { key: "cotizacion", label: "Cotización", color: "bg-orange-400" },
  { key: "programado", label: "Programado", color: "bg-indigo-400" },
  { key: "cerrado", label: "Cerrado", color: "bg-green-400" },
] as const;

export function LeadPipeline({ status, className = "" }: LeadPipelineProps) {
  // Encontrar el índice de la etapa actual
  const currentStageIndex = pipelineStages.findIndex(stage => stage.key === status);
  
  // Si el status es "perdido", mostrar diferente
  if (status === "perdido") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center space-x-0.5 opacity-50">
          {pipelineStages.slice(0, 3).map((stage, index) => (
            <div key={stage.key} className="flex items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-muted" />
              {index < 2 && <div className="w-1 h-px bg-muted" />}
            </div>
          ))}
        </div>
        <div className="w-2 h-2 rounded-full bg-red-400/60 ml-1" />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center space-x-0.5 ${className}`}>
      {pipelineStages.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isUpcoming = index > currentStageIndex;

        return (
          <div key={stage.key} className="flex items-center">
            {/* Punto de etapa */}
            <div 
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                isCurrent 
                  ? `${stage.color} shadow-sm scale-125` 
                  : isCompleted 
                    ? `${stage.color}/70` 
                    : "bg-muted/60"
              }`}
              title={stage.label}
            />
            
            {/* Línea conectora */}
            {index < pipelineStages.length - 1 && (
              <div 
                className={`w-1 h-px transition-colors duration-200 ${
                  isCompleted ? "bg-primary/40" : "bg-muted/40"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}