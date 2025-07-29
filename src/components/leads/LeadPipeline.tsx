import { Lead } from "./LeadCard";

interface Stage {
  key: string;
  label: string;
  color: string;
}

interface LeadPipelineProps {
  status: Lead["status"];
  className?: string;
  onStatusClick?: (status: string) => void;
  stages?: Stage[];
}

const defaultStages: Stage[] = [
  { key: "nuevo", label: "Nuevo", color: "bg-blue-400" },
  { key: "consulta-inicial", label: "Consulta", color: "bg-yellow-400" },
  { key: "evaluacion", label: "Evaluación", color: "bg-purple-400" },
  { key: "cotizacion", label: "Cotización", color: "bg-orange-400" },
  { key: "programado", label: "Programado", color: "bg-indigo-400" },
  { key: "cerrado", label: "Cerrado", color: "bg-green-400" },
];

export function LeadPipeline({ status, className = "", onStatusClick, stages = defaultStages }: LeadPipelineProps) {
  // Encontrar el índice de la etapa actual
  const currentStageIndex = stages.findIndex(stage => stage.key === status);
  
  // Si el status es "perdido", mostrar diferente
  if (status === "perdido") {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        <div className="flex items-center space-x-0.5">
          {stages.slice(0, 3).map((stage, index) => (
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
      {stages.map((stage, index) => {
        const isCompleted = index < currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isUpcoming = index > currentStageIndex;

        return (
          <div key={stage.key} className="flex items-center">
            {/* Punto de etapa clicable */}
            <button
              onClick={() => onStatusClick?.(stage.key)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                isCurrent 
                  ? `${stage.color} ring-2 ring-white shadow-sm scale-110` 
                  : isCompleted 
                    ? `${stage.color} hover:opacity-80` 
                    : "bg-muted border border-border hover:bg-muted-foreground/20"
              }`}
              title={`Filtrar por: ${stage.label}`}
            />
            
            {/* Línea conectora */}
            {index < stages.length - 1 && (
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
          {stages[currentStageIndex]?.label || status}
        </span>
      </div>
    </div>
  );
}