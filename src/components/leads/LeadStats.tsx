import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, CheckCircle, Clock, Phone, Mail, Calendar } from "lucide-react";
import { Lead } from "@/components/leads/LeadCard";
import { useTranslation } from "@/lib/translations";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon: React.ElementType;
  className?: string;
}

function StatCard({ title, value, description, trend, icon: Icon, className = "" }: StatCardProps) {
  return (
    <Card className={`bg-gradient-card border-border/60 shadow-card hover:shadow-hover transition-all duration-300 ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground mb-1">
          {value}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
          {trend && (
            <Badge 
              variant={trend.isPositive ? "default" : "destructive"}
              className="text-xs"
            >
              {trend.isPositive ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(trend.value)}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface LeadStatsProps {
  leads: Lead[];
}

export function LeadStats({ leads = [] }: LeadStatsProps) {
  const { t } = useTranslation();
  
  // Calculate real stats from leads data
  const totalLeads = leads.length;
  const newLeads = leads.filter(lead => lead.status === 'nuevo').length;
  const qualifiedLeads = leads.filter(lead => lead.status === 'evaluacion').length;
  const closedLeads = leads.filter(lead => lead.status === 'cerrado').length;
  const lostLeads = leads.filter(lead => lead.status === 'perdido').length;
  const activeLeads = leads.filter(lead => !['cerrado', 'perdido'].includes(lead.status)).length;
  
  // Calculate conversion rate
  const totalProcessedLeads = closedLeads + lostLeads;
  const conversionRate = totalProcessedLeads > 0 ? ((closedLeads / totalProcessedLeads) * 100).toFixed(1) : "0.0";
  
  // Calculate leads with recent activity (last 7 days)
  const recentActivityLeads = leads.filter(lead => {
    if (lead.lastContact === "Ahora") return true;
    if (lead.lastContact.includes("día") && !lead.lastContact.includes("semana")) {
      const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
      return days <= 7;
    }
    return false;
  }).length;
  
  // Calculate percentage of leads that need follow-up (no contact in > 7 days)
  const needsFollowUp = leads.filter(lead => {
    if (lead.status === 'cerrado' || lead.status === 'perdido') return false;
    if (lead.lastContact === "Ahora") return false;
    if (lead.lastContact.includes("semana") || lead.lastContact.includes("mes")) return true;
    if (lead.lastContact.includes("día")) {
      const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
      return days > 7;
    }
    return false;
  }).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Leads Activos"
        value={activeLeads.toString()}
        description={`${totalLeads} leads en total`}
        trend={{ 
          value: totalLeads > 0 ? Math.round((activeLeads / totalLeads) * 100) : 0, 
          isPositive: activeLeads > lostLeads 
        }}
        icon={Users}
      />
      
      <StatCard
        title="Nuevos Leads"
        value={newLeads.toString()}
        description="Sin contactar aún"
        trend={{ 
          value: totalLeads > 0 ? Math.round((newLeads / totalLeads) * 100) : 0, 
          isPositive: newLeads > 0 
        }}
        icon={Mail}
      />
      
      <StatCard
        title="Tasa de Conversión"
        value={`${conversionRate}%`}
        description={`${closedLeads} cerrados de ${totalProcessedLeads} finalizados`}
        trend={{ 
          value: parseFloat(conversionRate), 
          isPositive: parseFloat(conversionRate) > 50 
        }}
        icon={CheckCircle}
      />
      
      <StatCard
        title="Requieren Seguimiento"
        value={needsFollowUp.toString()}
        description="Sin contacto > 7 días"
        trend={{ 
          value: totalLeads > 0 ? Math.round((needsFollowUp / totalLeads) * 100) : 0, 
          isPositive: needsFollowUp === 0 
        }}
        icon={Clock}
      />
    </div>
  );
}