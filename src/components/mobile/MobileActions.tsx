import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { 
  MessageCircle, 
  Mail, 
  Calendar, 
  MoreHorizontal, 
  Trash2, 
  Archive, 
  Download,
  Copy,
  Tag
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHapticFeedback } from "@/hooks/use-haptic-feedback";
import type { Lead } from "@/components/leads/LeadCard";

interface MobileActionsProps {
  selectedLeads: string[];
  leads: Lead[];
  onBulkDelete?: (leadIds: string[]) => void;
  onBulkEmail?: (leads: Lead[]) => void;
  onBulkWhatsApp?: (leads: Lead[]) => void;
  onBulkArchive?: (leadIds: string[]) => void;
  onBulkExport?: (leads: Lead[]) => void;
  onBulkDuplicate?: (leads: Lead[]) => void;
  onBulkAddTags?: (leadIds: string[], tags: string[]) => void;
  onClearSelection?: () => void;
}

export function MobileActions({
  selectedLeads,
  leads,
  onBulkDelete,
  onBulkEmail,
  onBulkWhatsApp,
  onBulkArchive,
  onBulkExport,
  onBulkDuplicate,
  onBulkAddTags,
  onClearSelection,
}: MobileActionsProps) {
  const haptic = useHapticFeedback();
  const [isOpen, setIsOpen] = useState(false);

  if (selectedLeads.length === 0) return null;

  const selectedLeadObjects = leads.filter(lead => selectedLeads.includes(lead.id));

  const actions = [
    {
      id: 'whatsapp',
      label: 'WhatsApp Masivo',
      icon: MessageCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => onBulkWhatsApp?.(selectedLeadObjects),
    },
    {
      id: 'email',
      label: 'Email Masivo',
      icon: Mail,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => onBulkEmail?.(selectedLeadObjects),
    },
    {
      id: 'duplicate',
      label: 'Duplicar',
      icon: Copy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => onBulkDuplicate?.(selectedLeadObjects),
    },
    {
      id: 'export',
      label: 'Exportar',
      icon: Download,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => onBulkExport?.(selectedLeadObjects),
    },
    {
      id: 'archive',
      label: 'Archivar',
      icon: Archive,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => onBulkArchive?.(selectedLeads),
    },
    {
      id: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => onBulkDelete?.(selectedLeads),
      destructive: true,
    },
  ];

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border",
      "animate-slide-in-up transform transition-all duration-300"
    )}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Badge 
            variant="secondary" 
            className="h-8 px-3 rounded-full animate-scale-in"
          >
            {selectedLeads.length} seleccionados
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={() => {
              haptic.light();
              onClearSelection?.();
            }}
          >
            Limpiar
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick actions */}
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full hover:bg-green-50 hover:text-green-600"
            onClick={() => {
              haptic.medium();
              onBulkWhatsApp?.(selectedLeadObjects);
            }}
          >
            <MessageCircle className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0 rounded-full hover:bg-blue-50 hover:text-blue-600"
            onClick={() => {
              haptic.medium();
              onBulkEmail?.(selectedLeadObjects);
            }}
          >
            <Mail className="h-5 w-5" />
          </Button>

          <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-10 w-10 p-0 rounded-full hover:bg-muted/80"
                onClick={() => haptic.light()}
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="pb-6">
              <DrawerHeader>
                <DrawerTitle className="text-center">
                  Acciones para {selectedLeads.length} leads
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4 space-y-2">
                {actions.map((action, index) => (
                  <Button
                    key={action.id}
                    variant="outline"
                    className={cn(
                      "w-full justify-start h-12 text-left animate-fade-in",
                      action.destructive && "hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                    )}
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onClick={() => {
                      haptic.medium();
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <div className={cn("p-2 rounded-lg mr-3", action.bgColor)}>
                      <action.icon className={cn("h-4 w-4", action.color)} />
                    </div>
                    <div>
                      <div className="font-medium">{action.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {action.id === 'delete' 
                          ? 'Esta acción no se puede deshacer'
                          : `Aplicar a ${selectedLeads.length} leads`
                        }
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}