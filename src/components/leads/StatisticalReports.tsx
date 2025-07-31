import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  AreaChart,
  Area
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Mail, 
  Phone, 
  Calendar as CalendarIcon, 
  Download,
  Send,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Clock,
  Target,
  DollarSign,
  UserCheck,
  MessageSquare,
  Filter,
  X
} from "lucide-react";
import { Lead } from "@/components/leads/LeadCard";
import { useToast } from "@/hooks/use-toast";
import { ChartContainer } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface StatisticalReportsProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#8dd1e1', '#d084d0'];

export function StatisticalReports({ isOpen, onClose, leads }: StatisticalReportsProps) {
  const [emailRecipient, setEmailRecipient] = useState("");
  const [emailSubject, setEmailSubject] = useState("Reporte Estadístico de Leads - " + new Date().toLocaleDateString());
  const [emailMessage, setEmailMessage] = useState("Adjunto encontrarás el reporte estadístico completo de leads del CRM.");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [dateFilterActive, setDateFilterActive] = useState(false);
  const { toast } = useToast();

  // Función para filtrar leads por fecha
  const getFilteredLeads = () => {
    if (!dateFilterActive || (!startDate && !endDate)) {
      return leads;
    }

    return leads.filter(lead => {
      // Simulamos una fecha de creación basada en el lastContact
      // En un sistema real, tendrías una fecha de creación real
      const leadDate = new Date();
      
      if (lead.lastContact === "Ahora") {
        // Lead de hoy
      } else if (lead.lastContact.includes("día")) {
        const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
        leadDate.setDate(leadDate.getDate() - days);
      } else if (lead.lastContact.includes("semana")) {
        const weeks = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
        leadDate.setDate(leadDate.getDate() - (weeks * 7));
      } else if (lead.lastContact.includes("mes")) {
        const months = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
        leadDate.setMonth(leadDate.getMonth() - months);
      }

      if (startDate && endDate) {
        return leadDate >= startDate && leadDate <= endDate;
      } else if (startDate) {
        return leadDate >= startDate;
      } else if (endDate) {
        return leadDate <= endDate;
      }
      
      return true;
    });
  };

  const filteredLeads = getFilteredLeads();

  // Calcular estadísticas completas
  const totalLeads = filteredLeads.length;
  const activeLeads = filteredLeads.filter(lead => !['cerrado', 'perdido'].includes(lead.status)).length;
  const newLeads = filteredLeads.filter(lead => lead.status === 'nuevo').length;
  const inConsultation = filteredLeads.filter(lead => lead.status === 'consulta-inicial').length;
  const inEvaluation = filteredLeads.filter(lead => lead.status === 'evaluacion').length;
  const inQuotation = filteredLeads.filter(lead => lead.status === 'cotizacion').length;
  const scheduled = filteredLeads.filter(lead => lead.status === 'programado').length;
  const closed = filteredLeads.filter(lead => lead.status === 'cerrado').length;
  const lost = filteredLeads.filter(lead => lead.status === 'perdido').length;

  // Datos para gráfica de barras - Estado de leads
  const statusData = [
    { name: 'Nuevo', value: newLeads, color: '#3b82f6' },
    { name: 'Consulta', value: inConsultation, color: '#eab308' },
    { name: 'Evaluación', value: inEvaluation, color: '#a855f7' },
    { name: 'Cotización', value: inQuotation, color: '#f97316' },
    { name: 'Programado', value: scheduled, color: '#6366f1' },
    { name: 'Cerrado', value: closed, color: '#22c55e' },
    { name: 'Perdido', value: lost, color: '#ef4444' }
  ];

  // Datos para gráfica de pie - Distribución de leads
  const pieData = statusData.filter(item => item.value > 0);

  // Análisis de tratamientos más solicitados
  const treatmentAnalysis = () => {
    const treatments: { [key: string]: number } = {};
    filteredLeads.forEach(lead => {
      if (lead.interestedTreatments) {
        lead.interestedTreatments.forEach(treatment => {
          treatments[treatment] = (treatments[treatment] || 0) + 1;
        });
      }
    });
    return Object.entries(treatments)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const treatmentData = treatmentAnalysis();

  // Análisis de tags más utilizados
  const tagAnalysis = () => {
    const tags: { [key: string]: number } = {};
    filteredLeads.forEach(lead => {
      if (lead.tags) {
        lead.tags.forEach(tag => {
          tags[tag] = (tags[tag] || 0) + 1;
        });
      }
    });
    return Object.entries(tags)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  };

  const tagData = tagAnalysis();

  // Análisis temporal de actividad
  const activityAnalysis = () => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return {
        date: date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' }),
        leads: filteredLeads.filter(lead => {
          if (lead.lastContact === "Ahora") return i === 0;
          if (lead.lastContact.includes("día")) {
            const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
            return days === i;
          }
          return false;
        }).length
      };
    }).reverse();
    return last30Days;
  };

  const activityData = activityAnalysis();

  // Métricas de rendimiento
  const conversionRate = ((closed / (closed + lost)) * 100) || 0;
  const activeRate = ((activeLeads / totalLeads) * 100) || 0;
  const lossRate = ((lost / totalLeads) * 100) || 0;

  // Leads que requieren seguimiento
  const needsFollowUp = filteredLeads.filter(lead => {
    if (lead.status === 'cerrado' || lead.status === 'perdido') return false;
    if (lead.lastContact === "Ahora") return false;
    if (lead.lastContact.includes("semana") || lead.lastContact.includes("mes")) return true;
    if (lead.lastContact.includes("día")) {
      const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
      return days > 7;
    }
    return false;
  }).length;

  // Leads con comentarios vs sin comentarios
  const leadsWithComments = filteredLeads.filter(lead => lead.comments && lead.comments.length > 0).length;
  const leadsWithoutComments = totalLeads - leadsWithComments;

  const commentData = [
    { name: 'Con Comentarios', value: leadsWithComments, color: '#22c55e' },
    { name: 'Sin Comentarios', value: leadsWithoutComments, color: '#ef4444' }
  ];

  const clearDateFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setDateFilterActive(false);
  };

  const applyDateFilter = () => {
    if (startDate || endDate) {
      setDateFilterActive(true);
      toast({
        title: "Filtro aplicado",
        description: `Mostrando datos ${startDate ? 'desde ' + format(startDate, 'dd/MM/yyyy', { locale: es }) : ''}${startDate && endDate ? ' ' : ''}${endDate ? 'hasta ' + format(endDate, 'dd/MM/yyyy', { locale: es }) : ''}`,
      });
    }
  };

  const handleSendEmail = () => {
    if (!emailRecipient.trim()) {
      toast({
        title: "Error",
        description: "Por favor ingresa un destinatario",
        variant: "destructive"
      });
      return;
    }

    // Simular envío de email
    toast({
      title: "Reporte enviado",
      description: `Reporte estadístico enviado a ${emailRecipient}`,
    });
    
    setEmailRecipient("");
    onClose();
  };

  const handleDownloadReport = () => {
    toast({
      title: "Descarga iniciada",
      description: "El reporte PDF se está generando...",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BarChart3 className="h-6 w-6 text-primary" />
            Reportes Estadísticos Completos
            {dateFilterActive && (
              <Badge variant="secondary" className="ml-2">
                <Filter className="h-3 w-3 mr-1" />
                Filtrado
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {/* Filtro de Fechas */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Filtrar por Fechas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-end gap-4">
              <div className="space-y-2">
                <Label>Fecha de Inicio</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Fecha de Fin</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-[240px] justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button onClick={applyDateFilter} disabled={!startDate && !endDate}>
                <Filter className="h-4 w-4 mr-2" />
                Aplicar Filtro
              </Button>

              {dateFilterActive && (
                <Button variant="outline" onClick={clearDateFilter}>
                  <X className="h-4 w-4 mr-2" />
                  Limpiar Filtro
                </Button>
              )}
            </div>

            {dateFilterActive && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Mostrando <strong>{totalLeads}</strong> leads 
                  {startDate && ` desde ${format(startDate, 'dd/MM/yyyy', { locale: es })}`}
                  {endDate && ` hasta ${format(endDate, 'dd/MM/yyyy', { locale: es })}`}
                  {totalLeads !== leads.length && ` (de ${leads.length} totales)`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="status">Estados</TabsTrigger>
            <TabsTrigger value="treatments">Tratamientos</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="export">Exportar</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Métricas principales */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalLeads}</div>
                  <Badge variant="secondary">{activeLeads} activos</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa Conversión</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
                  <Badge variant={conversionRate > 50 ? "default" : "destructive"}>
                    {conversionRate > 50 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                    {conversionRate > 50 ? "Excelente" : "Mejorar"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Seguimiento</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{needsFollowUp}</div>
                  <Badge variant={needsFollowUp > 5 ? "destructive" : "default"}>
                    Requieren atención
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Documentados</CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{leadsWithComments}</div>
                  <Badge variant="secondary">
                    {((leadsWithComments / totalLeads) * 100).toFixed(1)}% del total
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Gráfica de distribución general */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Leads por Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado por Estados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8">
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Comentarios y Documentación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={commentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {commentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="treatments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tratamientos Más Solicitados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={treatmentData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tags Más Utilizados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tagData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actividad de Leads - Últimos 30 Días</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="leads" stroke="#8884d8" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Promedio Diario</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(activityData.reduce((acc, day) => acc + day.leads, 0) / 30).toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">leads por día</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Día Más Activo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.max(...activityData.map(d => d.leads))}
                  </div>
                  <p className="text-xs text-muted-foreground">leads en un día</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Tendencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <span className="text-sm font-medium">Creciente</span>
                  </div>
                  <p className="text-xs text-muted-foreground">última semana</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Exportar y Compartir Reporte</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Button onClick={handleDownloadReport} className="h-20">
                    <div className="flex flex-col items-center gap-2">
                      <Download className="h-6 w-6" />
                      <span>Descargar PDF</span>
                    </div>
                  </Button>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Enviar por Correo</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="destinatario@email.com"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Asunto</Label>
                      <Input
                        id="subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensaje</Label>
                      <Textarea
                        id="message"
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <Button onClick={handleSendEmail} className="w-full">
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Reporte
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resumen del Reporte</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Total de Leads:</span>
                    <span className="font-medium">{totalLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Leads Activos:</span>
                    <span className="font-medium">{activeLeads}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tasa de Conversión:</span>
                    <span className="font-medium">{conversionRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Requieren Seguimiento:</span>
                    <span className="font-medium">{needsFollowUp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Con Documentación:</span>
                    <span className="font-medium">{leadsWithComments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fecha del Reporte:</span>
                    <span className="font-medium">{new Date().toLocaleDateString('es-ES')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}