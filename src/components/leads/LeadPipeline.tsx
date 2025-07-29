import { Lead } from "./LeadCard";

interface LeadPipelineProps {
  status: Lead["status"];
  className?: string;
}

const pipelineStages = [
  { key: "nuevo", label: "Nuevo", color: "bg-blue-500" },
  { key: "consulta-inicial", label: "Consulta", color: "bg-yellow-500" },
  { key: "evaluacion", label: "Evaluación", color: "bg-purple-500" },
  { key: "cotizacion", label: "Cotización", color: "bg-orange-500" },
  { key: "programado", label: "Programado", color: "bg-indigo-500" },
  { key: "cerrado", label: "Cerrado", color: "bg-green-500" },
] as const;

export function LeadPipeline({ status, className = "" }: LeadPipelineProps) {
  // Encontrar el índice de la etapa actual
  const currentStageIndex = pipelineStages.findIndex(stage => stage.key === status);
  
  // Si el status es "perdido", mostrar diferente
  if (status === "perdido") {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className="flex items-center space-x-0.5">
          {pipelineStages.slice(0, 3).map((stage, index) => (
            <div key={stage.key} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-muted border border-border" />
              {index < 2 && <div className="w-2 h-0.5 bg-muted" />}
            </div>
          ))}
        </div>
        <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full" />
        </div>
        <span className="text-xs text-red-600 font-medium">Perdido</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-0.5 ${className}`}>
      {pipelineStages.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isUpcoming = index > currentStageIndex;

        return (
          <div key={stage.key} className="flex items-center">
            {/* Punto de etapa */}
            <div 
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
                isCurrent 
                  ? `${stage.color} ring-2 ring-white shadow-sm scale-110` 
                  : isCompleted 
                    ? stage.color 
                    : "bg-muted border border-border"
              }`}
              title={stage.label}
            />
            
            {/* Línea conectora */}
            {index < pipelineStages.length - 1 && (
              <div 
                className={`w-1.5 h-0.5 transition-colors duration-200 ${
                  isCompleted ? "bg-primary/60" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
      
      {/* Etiqueta de etapa actual */}
      <div className="ml-2">
        <span className="text-xs text-muted-foreground font-medium">
          {pipelineStages[currentStageIndex]?.label || status}
        </span>
      </div>
    </div>
  );
}