import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Settings, 
  MessageCircle, 
  UserPlus, 
  Zap, 
  X,
  ChevronUp,
  ChevronDown
} from "lucide-react";

interface SetupChecklistProps {
  isOpen: boolean;
  onComplete: () => void;
  onOpenStageManager: () => void;
  onOpenWhatsApp: () => void;
  onOpenAddLead: () => void;
  onOpenAutomations: () => void;
}

const tasks = [
  {
    id: "stages",
    title: "Configurar etapas",
    description: "Define tu pipeline de ventas",
    icon: Settings,
    action: "openStageManager"
  },
  {
    id: "whatsapp",
    title: "Mensajes WhatsApp",
    description: "Automatiza comunicaciones",
    icon: MessageCircle,
    action: "openWhatsApp"
  },
  {
    id: "firstLead",
    title: "Agregar primer lead",
    description: "Crea tu primer registro",
    icon: UserPlus,
    action: "openAddLead"
  },
  {
    id: "automations",
    title: "Configurar recordatorios",
    description: "Automatiza seguimientos",
    icon: Zap,
    action: "openAutomations"
  }
];

export function SetupChecklist({ 
  isOpen, 
  onComplete, 
  onOpenStageManager, 
  onOpenWhatsApp, 
  onOpenAddLead, 
  onOpenAutomations 
}: SetupChecklistProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const progress = (completedTasks.length / tasks.length) * 100;
  const isAllCompleted = completedTasks.length === tasks.length;

  const handleTaskClick = (task: typeof tasks[0]) => {
    // Mark task as completed
    if (!completedTasks.includes(task.id)) {
      setCompletedTasks([...completedTasks, task.id]);
    }

    // Execute the action
    switch (task.action) {
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

  const handleMarkCompleted = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (completedTasks.includes(taskId)) {
      setCompletedTasks(completedTasks.filter(id => id !== taskId));
    } else {
      setCompletedTasks([...completedTasks, taskId]);
    }
  };

  const handleFinish = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-primary/20 shadow-xl bg-gradient-to-br from-background to-muted/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-sm">Configuración inicial</CardTitle>
                <p className="text-xs text-muted-foreground">
                  {completedTasks.length}/{tasks.length} completadas
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0"
              >
                {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onComplete}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            {isAllCompleted && (
              <Badge variant="default" className="w-full justify-center bg-green-500">
                ¡Todo listo! 🎉
              </Badge>
            )}
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="space-y-2">
            {tasks.map((task) => {
              const isCompleted = completedTasks.includes(task.id);
              const IconComponent = task.icon;

              return (
                <div
                  key={task.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all hover:border-primary/40 ${
                    isCompleted 
                      ? "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800" 
                      : "bg-muted/30 border-border hover:bg-muted/50"
                  }`}
                  onClick={() => handleTaskClick(task)}
                >
                  <button
                    onClick={(e) => handleMarkCompleted(task.id, e)}
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-green-500 border-green-500"
                        : "border-muted-foreground hover:border-primary"
                    }`}
                  >
                    {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                  </button>

                  <IconComponent className={`w-4 h-4 ${
                    isCompleted ? "text-green-600" : "text-muted-foreground"
                  }`} />

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${
                      isCompleted ? "text-green-700 dark:text-green-300 line-through" : "text-foreground"
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                </div>
              );
            })}

            {isAllCompleted && (
              <Button 
                onClick={handleFinish}
                className="w-full mt-4 bg-gradient-primary hover:opacity-90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                ¡Finalizar configuración!
              </Button>
            )}

            <div className="text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onComplete}
                className="text-xs text-muted-foreground"
              >
                Saltar configuración
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}