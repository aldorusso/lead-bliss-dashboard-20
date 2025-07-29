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
  
  // Calcular el porcentaje de progreso
  const progress = currentStageIndex >= 0 ? ((currentStageIndex + 1) / pipelineStages.length) * 100 : 0;
  
  // Si el status es "perdido", mostrar batería en rojo
  if (status === "perdido") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex items-center space-x-2">
          {/* Batería perdida */}
          <div className="relative">
            <div className="w-8 h-4 border border-red-300 rounded-sm bg-red-50">
              <div className="w-full h-full bg-red-200 rounded-sm flex items-center justify-center">
                <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              </div>
            </div>
            {/* Terminal de la batería */}
            <div className="absolute -right-0.5 top-1 w-0.5 h-2 bg-red-300 rounded-r-sm"></div>
          </div>
          <span className="text-xs text-red-600 font-medium">Perdido</span>
        </div>
      </div>
    );
  }

  // Determinar el color según el nivel de progreso
  const getBatteryColor = () => {
    if (progress >= 80) return "bg-green-500"; // Verde completo
    if (progress >= 60) return "bg-green-400"; // Verde medio
    if (progress >= 40) return "bg-yellow-400"; // Amarillo
    if (progress >= 20) return "bg-orange-400"; // Naranja
    return "bg-red-400"; // Rojo para muy bajo
  };

  const getBatteryBackground = () => {
    if (progress >= 80) return "bg-green-50";
    if (progress >= 60) return "bg-green-50";
    if (progress >= 40) return "bg-yellow-50";
    if (progress >= 20) return "bg-orange-50";
    return "bg-red-50";
  };

  const getBatteryBorder = () => {
    if (progress >= 80) return "border-green-300";
    if (progress >= 60) return "border-green-300";
    if (progress >= 40) return "border-yellow-300";
    if (progress >= 20) return "border-orange-300";
    return "border-red-300";
  };

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      {/* Batería */}
      <div className="relative">
        <div className={`w-10 h-4 border ${getBatteryBorder()} rounded-sm ${getBatteryBackground()}`}>
          <div 
            className={`h-full ${getBatteryColor()} rounded-sm transition-all duration-300 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        {/* Terminal de la batería */}
        <div className={`absolute -right-0.5 top-1 w-0.5 h-2 ${getBatteryBorder().replace('border-', 'bg-')} rounded-r-sm`}></div>
      </div>
      
      {/* Etiqueta de etapa actual */}
      <span className="text-xs text-muted-foreground font-medium">
        {pipelineStages[currentStageIndex]?.label || status}
      </span>
    </div>
  );
}