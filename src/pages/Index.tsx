import { useState } from "react";
import { LeadCard, Lead } from "@/components/leads/LeadCard";
import { LeadList } from "@/components/leads/LeadList";
import { LeadStats } from "@/components/leads/LeadStats";
import { LeadFilters } from "@/components/leads/LeadFilters";
import { GameificationBadges } from "@/components/leads/GameificationBadges";
import { LeadForm } from "@/components/leads/LeadForm";
import { AutomationsPanel } from "@/components/leads/AutomationsPanel";
import { SettingsPanel } from "@/components/leads/SettingsPanel";
import { FloatingMenu } from "@/components/ui/FloatingMenu";
import { CallModal, EmailModal } from "@/components/leads/ActionModals";
import { ViewToggle } from "@/components/leads/ViewToggle";
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
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    tags: "all",
    dateRange: "all",
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAutomationsOpen, setIsAutomationsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | undefined>(undefined);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const leadsPerPage = 12;
  
  // Action modals
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  const { toast } = useToast();

  const filteredLeads = leads.filter(lead => {
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
  };

  const handleCall = (lead: Lead) => {
    setSelectedLead(lead);
    setCallModalOpen(true);
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
        <LeadStats leads={leads} />

        {/* Gamification Badges (invisible - only shows toasts) */}
        <GameificationBadges leads={leads} />

        {/* Filters */}
        <LeadFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onAddLead={handleAddLead}
          leads={leads}
        />

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t('showing')} {paginatedLeads.length} {t('of')} {filteredLeads.length} {t('leadsText')} 
            {totalPages > 1 && (
              <span> ({t('page')} {currentPage} {t('of')} {totalPages})</span>
            )}
          </p>
          <ViewToggle view={view} onViewChange={setView} />
        </div>

        {/* Leads Display */}
        {view === "grid" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedLeads.map((lead) => (
              <LeadCard
                key={lead.id}
                lead={lead}
                onCall={handleCall}
                onEmail={handleEmail}
                onSchedule={handleSchedule}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <LeadList
            leads={paginatedLeads}
            onCall={handleCall}
            onEmail={handleEmail}
            onSchedule={handleSchedule}
            onViewDetails={handleViewDetails}
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
        />
      </div>
    </div>
  );
};

export default Index;