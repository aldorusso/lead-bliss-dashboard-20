import { useEffect, useRef } from "react";
import { Lead } from "@/components/leads/LeadCard";
import { useToast } from "@/hooks/use-toast";
import { Trophy, Flame, Target, TrendingUp, Star, Zap } from "lucide-react";

interface GameificationBadgesProps {
  leads: Lead[];
}

export function GameificationBadges({ leads = [] }: GameificationBadgesProps) {
  const { toast } = useToast();
  const previousMetricsRef = useRef<any>(null);
  // Calcular métricas de gamificación
  const calculateMetrics = () => {
    const now = new Date();
    
    // Leads contactados esta semana (asumiendo que "Ahora" o "1 día" significa contacto reciente)
    const contactedThisWeek = leads.filter(lead => {
      if (lead.lastContact === "Ahora") return true;
      if (lead.lastContact.includes("día")) {
        const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
        return days <= 7;
      }
      return false;
    }).length;

    // Leads activos (no cerrados ni perdidos)
    const activeLeads = leads.filter(lead => !['cerrado', 'perdido'].includes(lead.status)).length;
    
    // Porcentaje de contacto semanal
    const contactPercentage = activeLeads > 0 ? Math.round((contactedThisWeek / activeLeads) * 100) : 0;
    
    // Leads cerrados este mes (simplificado - contamos todos los cerrados)
    const closedThisMonth = leads.filter(lead => lead.status === 'cerrado').length;
    
    // Leads calificados (progreso en el pipeline)
    const qualifiedLeads = leads.filter(lead => ['calificado', 'propuesta'].includes(lead.status)).length;
    
    // Leads con tags premium (leads de alta calidad)
    const premiumLeads = leads.filter(lead => lead.tags?.includes('premium')).length;

    return {
      contactPercentage,
      closedThisMonth,
      qualifiedLeads,
      premiumLeads,
      totalLeads: leads.length,
      contactedThisWeek
    };
  };

  const metrics = calculateMetrics();

  // Detectar cambios y mostrar toasts cuando se logran nuevos achievements
  useEffect(() => {
    if (!previousMetricsRef.current || leads.length === 0) {
      previousMetricsRef.current = metrics;
      return;
    }

    const prevMetrics = previousMetricsRef.current;

    // Achievement: Alto porcentaje de contacto semanal
    if (metrics.contactPercentage >= 80 && prevMetrics.contactPercentage < 80) {
      toast({
        title: "🔥 ¡Excelente contacto!",
        description: `Has contactado al ${metrics.contactPercentage}% de tus leads esta semana`,
        duration: 5000,
      });
    }

    // Achievement: Nuevo lead cerrado
    if (metrics.closedThisMonth > prevMetrics.closedThisMonth) {
      toast({
        title: "🏆 ¡Lead cerrado!",
        description: `${metrics.closedThisMonth} leads cerrados este mes`,
        duration: 5000,
      });
    }

    // Achievement: Leads en pipeline avanzado
    if (metrics.qualifiedLeads >= 5 && prevMetrics.qualifiedLeads < 5) {
      toast({
        title: "📈 ¡Pipeline fuerte!",
        description: `${metrics.qualifiedLeads} leads en etapas avanzadas`,
        duration: 5000,
      });
    }

    // Achievement: Leads premium
    if (metrics.premiumLeads >= 2 && prevMetrics.premiumLeads < 2) {
      toast({
        title: "⭐ ¡Leads premium!",
        description: `${metrics.premiumLeads} leads premium en cartera`,
        duration: 5000,
      });
    }

    // Achievement: Velocidad de respuesta
    if (metrics.contactedThisWeek >= 5 && prevMetrics.contactedThisWeek < 5) {
      toast({
        title: "⚡ ¡Velocidad excelente!",
        description: "Has contactado muchos leads esta semana",
        duration: 5000,
      });
    }

    previousMetricsRef.current = metrics;
  }, [leads, toast, metrics]);

  // No renderizar nada - todo se maneja via toasts
  return null;
}