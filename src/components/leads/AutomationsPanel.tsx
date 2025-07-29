import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Globe, Mail, MessageSquare, Calendar, X, Loader2, Plus, Trash2, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLead?: any; // Lead data to send to automations
}

interface Automation {
  id: string;
  name: string;
  service: 'zapier' | 'n8n' | 'make';
  type: 'email' | 'whatsapp' | 'slack' | 'calendar' | 'custom';
  webhookUrl: string;
  isActive: boolean;
}

export function AutomationsPanel({ isOpen, onClose, selectedLead }: AutomationsPanelProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    service: "zapier" as const,
    type: "email" as const,
    webhookUrl: "",
  });
  const { toast } = useToast();

  const addAutomation = () => {
    if (!newAutomation.name || !newAutomation.webhookUrl) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive",
      });
      return;
    }

    const automation: Automation = {
      id: Date.now().toString(),
      ...newAutomation,
      isActive: true,
    };

    setAutomations([...automations, automation]);
    setNewAutomation({
      name: "",
      service: "zapier",
      type: "email",
      webhookUrl: "",
    });

    toast({
      title: "Automatización Agregada",
      description: `${newAutomation.name} ha sido configurada correctamente`,
    });
  };

  const removeAutomation = (id: string) => {
    setAutomations(automations.filter(auto => auto.id !== id));
    toast({
      title: "Automatización Eliminada",
      description: "La automatización ha sido eliminada",
    });
  };

  const triggerAutomation = async (automation: Automation) => {
    setIsLoading(true);
    
    try {
      const leadData = selectedLead ? {
        id: selectedLead.id,
        name: selectedLead.name,
        email: selectedLead.email,
        phone: selectedLead.phone,
        status: selectedLead.status,
        tags: selectedLead.tags,
        notes: selectedLead.notes,
      } : null;

      const payload = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        automation_type: automation.type,
        automation_name: automation.name,
        service: automation.service,
        lead_data: leadData,
        event: "automation_trigger",
      };

      await fetch(automation.webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(payload),
      });

      toast({
        title: "Automatización Activada",
        description: `${automation.name} ha sido ejecutada. Revisa tu servicio para confirmar.`,
      });
    } catch (error) {
      console.error("Error triggering automation:", error);
      toast({
        title: "Error",
        description: `Error al ejecutar ${automation.name}. Verifica la configuración.`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case 'zapier': return Zap;
      case 'n8n': return Settings;
      case 'make': return Globe;
      default: return Zap;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return Mail;
      case 'whatsapp': return MessageSquare;
      case 'slack': return MessageSquare;
      case 'calendar': return Calendar;
      default: return Globe;
    }
  };

  const automationExamples = [
    {
      icon: Mail,
      title: "Email de Bienvenida",
      description: "Envía emails automáticos cuando se crea un nuevo lead",
      platform: "Gmail/Outlook",
      color: "bg-blue-500"
    },
    {
      icon: MessageSquare,
      title: "Notificación Slack",
      description: "Notifica al equipo cuando un lead cambia de estado",
      platform: "Slack",
      color: "bg-green-500"
    },
    {
      icon: Calendar,
      title: "Programar Seguimiento",
      description: "Crea eventos automáticos en el calendario",
      platform: "Google Calendar",
      color: "bg-purple-500"
    },
    {
      icon: Globe,
      title: "Webhook Personalizado",
      description: "Conecta con cualquier sistema externo",
      platform: "API Custom",
      color: "bg-orange-500"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] w-full bg-background border-border/60 overflow-y-auto p-0">
        <DialogHeader className="space-y-4 p-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  Automatizaciones
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  Conecta tu CRM con herramientas externas usando Zapier
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Add New Automation */}
          <Card className="bg-gradient-card border-border/60 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Plus className="h-5 w-5 mr-2 text-primary" />
                Agregar Nueva Automatización
              </CardTitle>
              <CardDescription>
                Configura webhooks para Zapier, n8n, Make.com y otros servicios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="automation-name" className="text-foreground font-medium">
                    Nombre de la Automatización
                  </Label>
                  <Input
                    id="automation-name"
                    value={newAutomation.name}
                    onChange={(e) => setNewAutomation({...newAutomation, name: e.target.value})}
                    placeholder="Ej: Enviar Email de Bienvenida"
                    className="bg-background border-border/60 focus:border-primary transition-colors"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="automation-service" className="text-foreground font-medium">
                    Servicio
                  </Label>
                  <Select value={newAutomation.service} onValueChange={(value: any) => setNewAutomation({...newAutomation, service: value})}>
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue placeholder="Selecciona un servicio" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zapier">Zapier</SelectItem>
                      <SelectItem value="n8n">n8n</SelectItem>
                      <SelectItem value="make">Make.com</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="automation-type" className="text-foreground font-medium">
                    Tipo de Automatización
                  </Label>
                  <Select value={newAutomation.type} onValueChange={(value: any) => setNewAutomation({...newAutomation, type: value})}>
                    <SelectTrigger className="bg-background border-border/60">
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">📧 Email</SelectItem>
                      <SelectItem value="whatsapp">📱 WhatsApp</SelectItem>
                      <SelectItem value="slack">💬 Slack</SelectItem>
                      <SelectItem value="calendar">📅 Calendario</SelectItem>
                      <SelectItem value="custom">🔧 Personalizado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url" className="text-foreground font-medium">
                    URL del Webhook
                  </Label>
                  <Input
                    id="webhook-url"
                    type="url"
                    value={newAutomation.webhookUrl}
                    onChange={(e) => setNewAutomation({...newAutomation, webhookUrl: e.target.value})}
                    placeholder="https://hooks.zapier.com/hooks/catch/..."
                    className="bg-background border-border/60 focus:border-primary transition-colors"
                  />
                </div>
              </div>

              <Button 
                onClick={addAutomation}
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Automatización
              </Button>
            </CardContent>
          </Card>

          {/* Active Automations */}
          {automations.length > 0 && (
            <Card className="bg-gradient-card border-border/60 shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-primary" />
                  Automatizaciones Configuradas ({automations.length})
                </CardTitle>
                <CardDescription>
                  {selectedLead ? `Ejecutar automatizaciones para: ${selectedLead.name}` : "Automatizaciones disponibles"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {automations.map((automation) => {
                  const ServiceIcon = getServiceIcon(automation.service);
                  const TypeIcon = getTypeIcon(automation.type);
                  
                  return (
                    <div key={automation.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-lg border border-border/60">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <ServiceIcon className="h-5 w-5 text-primary" />
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground">{automation.name}</h4>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {automation.service}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {automation.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => triggerAutomation(automation)}
                          disabled={isLoading}
                          size="sm"
                          className="bg-gradient-primary hover:opacity-90 transition-opacity"
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          onClick={() => removeAutomation(automation.id)}
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Automation Examples */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Ejemplos de Automatizaciones
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Conecta con estas plataformas populares usando Zapier
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {automationExamples.map((automation, index) => {
                const Icon = automation.icon;
                return (
                  <Card key={index} className="bg-gradient-card border-border/60 shadow-card hover:shadow-hover transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className={`h-10 w-10 rounded-lg ${automation.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {automation.title}
                            </h4>
                            <Badge variant="secondary" className="text-xs">
                              {automation.platform}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {automation.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Instructions */}
          <Card className="bg-accent/50 border-border/60">
            <CardHeader>
              <CardTitle className="text-lg">¿Cómo configurar?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start space-x-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5 flex-shrink-0">1</span>
                <p>Ve a <strong>zapier.com</strong> y crea una cuenta gratuita</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5 flex-shrink-0">2</span>
                <p>Crea un nuevo <strong>Zap</strong> con trigger tipo "Webhook"</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5 flex-shrink-0">3</span>
                <p>Copia la <strong>URL del webhook</strong> y pégala arriba</p>
              </div>
              <div className="flex items-start space-x-2">
                <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center mt-0.5 flex-shrink-0">4</span>
                <p>Conecta con Gmail, Slack, Google Calendar, etc.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}