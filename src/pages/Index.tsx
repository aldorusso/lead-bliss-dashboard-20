import { useState, useEffect } from "react";
import { LeadCard, Lead } from "@/components/leads/LeadCard";
import { LeadList } from "@/components/leads/LeadList";
import { LeadStats } from "@/components/leads/LeadStats";
import { StatisticalReports } from "@/components/leads/StatisticalReports";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { GameificationBadges } from "@/components/leads/GameificationBadges";
import { LeadForm } from "@/components/leads/LeadForm";
import { AutomationsPanel } from "@/components/leads/AutomationsPanel";
import { SettingsPanel } from "@/components/leads/SettingsPanel";
import { GuidedTour } from "@/components/leads/GuidedTour";
import { BulkActionsMenu } from "@/components/leads/BulkActionsMenu";
import { FloatingMenu } from "@/components/ui/FloatingMenu";
import { CallModal, EmailModal } from "@/components/leads/ActionModals";
import { WhatsAppWidget } from "@/components/leads/WhatsAppWidget";
import { ViewToggle } from "@/components/leads/ViewToggle";
import { TagsOverview } from "@/components/leads/TagsOverview";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious, 
  PaginationEllipsis 
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { mockLeads } from "@/data/mockLeads";
import { useTranslation } from "@/lib/translations";

const Index = () => {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [stages, setStages] = useState([
    { key: "nuevo", label: "Nuevo", color: "bg-blue-400" },
    { key: "consulta-inicial", label: "Consulta", color: "bg-yellow-400" },
    { key: "evaluacion", label: "Evaluación", color: "bg-purple-400" },
    { key: "cotizacion", label: "Cotización", color: "bg-orange-400" },
    { key: "programado", label: "Programado", color: "bg-indigo-400" },
    { key: "cerrado", label: "Cerrado", color: "bg-green-400" },
  ]);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    tags: "all",
    dateRange: "all",
  });
  const [activeStatFilter, setActiveStatFilter] = useState<'active' | 'new' | 'conversion' | 'needsFollowUp' | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAutomationsOpen, setIsAutomationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isReportsOpen, setIsReportsOpen] = useState(false);
  const [isSetupWizardOpen, setIsSetupWizardOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 12;
  
  // Action modals
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Check if this is the first time using the app
  useEffect(() => {
    // Tour disabled - no longer showing by default
    // setIsSetupWizardOpen(true);
  }, []);

  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => {
    // Aplicar filtro estadístico si está activo
    if (activeStatFilter) {
      switch (activeStatFilter) {
        case 'active':
          if (['cerrado', 'perdido'].includes(lead.status)) return false;
          break;
        case 'new':
          if (lead.status !== 'nuevo') return false;
          break;
        case 'conversion':
          if (!['cerrado', 'perdido'].includes(lead.status)) return false;
          break;
        case 'needsFollowUp':
          if (lead.status === 'cerrado' || lead.status === 'perdido') return false;
          if (lead.lastContact === "Ahora") return false;
          if (!lead.lastContact.includes("semana") && !lead.lastContact.includes("mes")) {
            if (lead.lastContact.includes("día")) {
              const days = parseInt(lead.lastContact.match(/\d+/)?.[0] || "0");
              if (days <= 7) return false;
            } else {
              return false;
            }
          }
          break;
      }
    }

    if (filters.search && !lead.name.toLowerCase().includes(filters.search.toLowerCase()) && 
        !lead.email.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.status && filters.status !== "all" && lead.status !== filters.status) {
      return false;
    }
    if (filters.tags && filters.tags !== "all") {
      if (!lead.tags || !lead.tags.includes(filters.tags)) {
        return false;
      }
    }
    return true;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredLeads.length / leadsPerPage);
  const startIndex = (currentPage - 1) * leadsPerPage;
  const endIndex = startIndex + leadsPerPage;
  const paginatedLeads = filteredLeads.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(1);
    // Clear stat filter when normal filters are used
    if (activeStatFilter) {
      setActiveStatFilter(null);
    }
    // Clear selections when filters change
    setSelectedLeads([]);
  };

  const handleStatClick = (filterType: 'active' | 'new' | 'conversion' | 'needsFollowUp') => {
    if (activeStatFilter === filterType) {
      // Si ya está activo, desactivar
      setActiveStatFilter(null);
    } else {
      // Activar nuevo filtro y limpiar filtros normales
      setActiveStatFilter(filterType);
      setFilters({
        search: "",
        status: "all",
        tags: "all",
        dateRange: "all",
      });
    }
    setCurrentPage(1);
    // Clear selections when filters change
    setSelectedLeads([]);
  };

  const handleWhatsApp = (lead: Lead) => {
    const message = encodeURIComponent(`Hola ${lead.name}, me pongo en contacto desde el CRM para dar seguimiento a tu consulta.`);
    const phoneNumber = lead.phone.replace(/[^\d+]/g, ''); // Remove non-numeric chars except +
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp abierto",
      description: `Iniciando conversación con ${lead.name}`
    });
  };

  const handleWhatsAppAPI = (lead: Lead) => {
    // Por ahora mostrar placeholder - se implementará con API de WhatsApp
    toast({
      title: "API WhatsApp",
      description: `Función en desarrollo - Enviar mensaje a ${lead.name} vía API WhatsApp`,
      variant: "default"
    });
  };

  const handleEmail = (lead: Lead) => {
    setSelectedLead(lead);
    setEmailModalOpen(true);
  };

  const handleSchedule = (lead: Lead) => {
    toast({
      title: "Reunión programada",
      description: `Programar reunión con ${lead.name}`,
    });
  };

  const handleViewDetails = (lead: Lead) => {
    setEditingLead(lead);
    setIsFormOpen(true);
  };

  const handleAddLead = () => {
    setEditingLead(undefined);
    setIsFormOpen(true);
  };

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      // Editar lead existente
      setLeads(prev => prev.map(lead => 
        lead.id === editingLead.id 
          ? { ...lead, ...leadData }
          : lead
      ));
      toast({
        title: "Lead actualizado",
        description: `Los datos de ${leadData.name} han sido actualizados`,
      });
    } else {
      // Crear nuevo lead
      const newLead: Lead = {
        id: Date.now().toString(),
        name: leadData.name!,
        email: leadData.email!,
        phone: leadData.phone!,
        status: leadData.status as Lead["status"],
        comments: leadData.comments || [],
        tags: leadData.tags || [],
        lastContact: "Ahora",
      };
      setLeads(prev => [newLead, ...prev]);
      toast({
        title: "Lead creado",
        description: `${newLead.name} ha sido añadido correctamente`,
      });
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingLead(undefined);
  };

  const handleOpenAutomations = () => {
    setIsAutomationsOpen(true);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleOpenWhatsApp = () => {
    setIsWhatsAppOpen(true);
  };

  const handleOpenReports = () => {
    setIsReportsOpen(true);
  };

  const handleCompleteSetup = () => {
    localStorage.setItem('hasCompletedSetup', 'true');
    setIsSetupWizardOpen(false);
    toast({
      title: "¡Configuración completada!",
      description: "Tu sistema está listo para usar. ¡Comienza a gestionar tus leads!"
    });
  };

  const handleImportLeads = (importedLeads: Lead[]) => {
    setLeads(prev => [...prev, ...importedLeads]);
  };

  const handleSaveNote = (leadId: string, note: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const newComment = {
          id: Date.now().toString(),
          text: note,
          author: "Sistema",
          timestamp: new Date().toLocaleString('es-ES')
        };
        return {
          ...lead,
          comments: [...(lead.comments || []), newComment],
          lastContact: "Ahora"
        };
      }
      return lead;
    }));
  };

  // Bulk actions handlers
  const handleLeadSelection = (leadId: string, selected: boolean) => {
    setSelectedLeads(prev => 
      selected 
        ? [...prev, leadId]
        : prev.filter(id => id !== leadId)
    );
  };

  const handleSelectAll = (selected: boolean) => {
    setSelectedLeads(selected ? paginatedLeads.map(lead => lead.id) : []);
  };

  const handleClearSelection = () => {
    setSelectedLeads([]);
  };

  const handleBulkDelete = (leadIds: string[]) => {
    setLeads(prev => prev.filter(lead => !leadIds.includes(lead.id)));
    setSelectedLeads([]);
    toast({
      title: "Leads eliminados",
      description: `${leadIds.length} leads han sido eliminados`,
    });
  };

  const handleBulkStatusChange = (leadIds: string[], status: Lead["status"]) => {
    setLeads(prev => prev.map(lead => 
      leadIds.includes(lead.id) 
        ? { ...lead, status, lastContact: "Ahora" }
        : lead
    ));
    setSelectedLeads([]);
    toast({
      title: "Estado actualizado",
      description: `${leadIds.length} leads movidos a ${status}`,
    });
  };

  const handleBulkEmail = (leads: Lead[]) => {
    toast({
      title: "Email masivo",
      description: `Preparando email para ${leads.length} leads`,
    });
  };

  const handleBulkWhatsApp = (leads: Lead[]) => {
    toast({
      title: "WhatsApp masivo",
      description: `Preparando mensajes para ${leads.length} leads`,
    });
  };

  const handleBulkAddTags = (leadIds: string[], tags: string[]) => {
    setLeads(prev => prev.map(lead => 
      leadIds.includes(lead.id) 
        ? { ...lead, tags: [...(lead.tags || []), ...tags].filter((tag, index, arr) => arr.indexOf(tag) === index) }
        : lead
    ));
    setSelectedLeads([]);
    toast({
      title: "Etiquetas agregadas",
      description: `Etiquetas agregadas a ${leadIds.length} leads`,
    });
  };

  const handleDuplicateLeads = (leads: Lead[]) => {
    const duplicatedLeads = leads.map(lead => ({
      ...lead,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: `${lead.name} (Copia)`,
      lastContact: "Ahora",
      status: "nuevo" as Lead["status"]
    }));
    
    setLeads(prev => [...duplicatedLeads, ...prev]);
    setSelectedLeads([]);
    toast({
      title: "Leads duplicados",
      description: `${leads.length} leads han sido duplicados exitosamente`,
    });
  };

  const handleExportLeads = (leads: Lead[]) => {
    try {
      // Preparar datos para CSV
      const csvHeaders = ['Nombre', 'Email', 'Teléfono', 'Estado', 'Último Contacto', 'Etiquetas', 'Comentarios'];
      const csvData = leads.map(lead => [
        lead.name,
        lead.email,
        lead.phone,
        lead.status,
        lead.lastContact,
        (lead.tags || []).join('; '),
        (lead.comments || []).map(c => c.text).join(' | ')
      ]);
      
      const csvContent = [csvHeaders, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');
      
      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSelectedLeads([]);
      toast({
        title: "Exportación exitosa",
        description: `${leads.length} leads exportados a CSV`,
      });
    } catch (error) {
      toast({
        title: "Error en exportación",
        description: "No se pudo exportar el archivo",
        variant: "destructive",
      });
    }
  };

  const handleArchiveLeads = (leadIds: string[]) => {
    setLeads(prev => prev.map(lead => 
      leadIds.includes(lead.id) 
        ? { ...lead, tags: [...(lead.tags || []), 'archivado'].filter((tag, index, arr) => arr.indexOf(tag) === index) }
        : lead
    ));
    setSelectedLeads([]);
    toast({
      title: "Leads archivados",
      description: `${leadIds.length} leads han sido archivados`,
    });
  };

  const handleUpdateLead = (leadId: string, field: string, value: string | string[]) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId 
        ? { ...lead, [field]: value, lastContact: field !== 'tags' ? "Ahora" : lead.lastContact }
        : lead
    ));
    toast({
      title: "Lead actualizado",
      description: `Campo ${field} actualizado`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header with Date */}
        <div className="flex justify-end">
          <div className="text-sm text-muted-foreground">
            {new Date().toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric', 
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Stats */}
        <LeadStats 
          leads={leads} 
          onStatClick={handleStatClick}
          activeFilter={activeStatFilter}
        />

        {/* Tags Overview */}
        <TagsOverview 
          leads={leads} 
          onTagClick={(tag) => {
            handleFiltersChange({ ...filters, tags: filters.tags === tag ? "all" : tag });
            setActiveStatFilter(null); // Clear stat filter when using tag filter
          }}
          selectedTag={filters.tags !== "all" ? filters.tags : undefined}
        />

        {/* Gamification Badges (invisible - only shows toasts) */}
        <GameificationBadges leads={leads} />

        {/* Filters */}
        <LeadFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onAddLead={handleAddLead}
          leads={leads}
          stages={stages}
          onStagesChange={setStages}
          onImportLeads={handleImportLeads}
        />

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t('showing')} {paginatedLeads.length} {t('of')} {filteredLeads.length} {t('leadsText')} 
              {totalPages > 1 && (
                <span> ({t('page')} {currentPage} {t('of')} {totalPages})</span>
              )}
            </p>
            {activeStatFilter && (
              <p className="text-xs text-primary font-medium">
                Filtro activo: {
                  activeStatFilter === 'active' ? 'Leads Activos' :
                  activeStatFilter === 'new' ? 'Nuevos Leads' :
                  activeStatFilter === 'conversion' ? 'Leads Finalizados' :
                  'Requieren Seguimiento'
                }
              </p>
            )}
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {/* Leads Display */}
        {view === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onWhatsApp={handleWhatsApp}
                onWhatsAppAPI={handleWhatsAppAPI}
                onEmail={handleEmail}
                onSchedule={handleSchedule}
                onViewDetails={handleViewDetails}
            onStatusClick={(status) => {
              handleFiltersChange({ ...filters, status: filters.status === status ? "all" : status });
              setActiveStatFilter(null); // Clear stat filter when using status filter
            }}
                onUpdateLead={handleUpdateLead}
              />
            ))}
          </div>
        ) : (
          <LeadList
            leads={paginatedLeads}
            onWhatsApp={handleWhatsApp}
            onWhatsAppAPI={handleWhatsAppAPI}
            onEmail={handleEmail}
            onSchedule={handleSchedule}
            onViewDetails={handleViewDetails}
            onStatusClick={(status) => {
              handleFiltersChange({ ...filters, status: filters.status === status ? "all" : status });
              setActiveStatFilter(null); // Clear stat filter when using status filter
            }}
            onUpdateLead={handleUpdateLead}
            selectedLeads={selectedLeads}
            onLeadSelection={handleLeadSelection}
            onSelectAll={handleSelectAll}
            enableBulkActions={true}
          />
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {/* Current page and neighbors */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={pageNum === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }).filter(Boolean)}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(totalPages);
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        {paginatedLeads.length === 0 && filteredLeads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('noLeadsFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('noLeadsDescription')}
            </p>
          </div>
        )}

        {/* Bulk Actions Menu */}
        <BulkActionsMenu
          selectedLeads={selectedLeads.map(id => leads.find(lead => lead.id === id)!).filter(Boolean)}
          onClearSelection={handleClearSelection}
          onDeleteLeads={handleBulkDelete}
          onChangeStatus={handleBulkStatusChange}
          onBulkEmail={handleBulkEmail}
          onBulkWhatsApp={handleBulkWhatsApp}
          onAddTags={handleBulkAddTags}
          onDuplicateLeads={handleDuplicateLeads}
          onExportLeads={handleExportLeads}
          onArchiveLeads={handleArchiveLeads}
        />

        {/* Lead Form */}
        <LeadForm
          isOpen={isFormOpen}
          onClose={handleCloseForm}
          onSave={handleSaveLead}
          lead={editingLead}
          mode={editingLead ? "edit" : "create"}
        />

        {/* Automations Panel */}
        <AutomationsPanel
          isOpen={isAutomationsOpen}
          onClose={() => setIsAutomationsOpen(false)}
          selectedLead={selectedLead}
        />

        {/* Settings Panel */}
        <SettingsPanel
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          leads={leads}
          onImportLeads={handleImportLeads}
        />

        {/* Action Modals */}
        <CallModal
          isOpen={callModalOpen}
          onClose={() => setCallModalOpen(false)}
          lead={selectedLead}
          onSave={handleSaveNote}
        />
        
        <EmailModal
          isOpen={emailModalOpen}
          onClose={() => setEmailModalOpen(false)}
          lead={selectedLead}
          onSave={handleSaveNote}
        />


        {/* Floating Menu */}
        <FloatingMenu 
          userName="Ana García"
          userAvatar="https://images.unsplash.com/photo-1494790108755-2616b9211ae9?w=150&h=150&fit=crop&crop=face"
          onAutomationsClick={handleOpenAutomations}
          onSettingsClick={handleOpenSettings}
          onWhatsAppClick={handleOpenWhatsApp}
          onReportsClick={handleOpenReports}
        />

        {/* WhatsApp Widget */}
        <WhatsAppWidget 
          isOpen={isWhatsAppOpen}
          onClose={() => setIsWhatsAppOpen(false)}
          stages={stages}
        />

        {/* Statistical Reports */}
        <StatisticalReports 
          isOpen={isReportsOpen}
          onClose={() => setIsReportsOpen(false)}
          leads={leads}
        />

        {/* Guided Tour */}
        <GuidedTour
          isOpen={isSetupWizardOpen}
          onComplete={handleCompleteSetup}
          onOpenStageManager={() => {/* Will be handled by LeadFilters */}}
          onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
          onOpenAddLead={() => setIsFormOpen(true)}
        />
      </div>
    </div>
  );
};

export default Index;