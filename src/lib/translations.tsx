import React, { useState, useContext, createContext, ReactNode } from 'react';

export type Language = 'es' | 'en';

export const translations = {
  es: {
    // General
    loading: "Cargando...",
    save: "Guardar",
    cancel: "Cancelar",
    close: "Cerrar",
    delete: "Eliminar",
    edit: "Editar",
    create: "Crear",
    search: "Buscar",
    filter: "Filtrar",
    export: "Exportar",
    import: "Importar",
    settings: "Configuración",
    
    // Navigation & Views
    cards: "Tarjetas",
    list: "Lista",
    grid: "Cuadrícula",
    
    // Lead Management
    leads: "Leads",
    newLead: "Nuevo Lead",
    leadDetails: "Detalles del Lead",
    addLead: "Añadir Lead",
    editLead: "Editar Lead",
    viewDetails: "Ver detalles",
    lastContact: "Último contacto",
    
    // Lead Status
    nuevo: "Nuevo",
    contactado: "Contactado", 
    calificado: "Calificado",
    propuesta: "Propuesta",
    cerrado: "Cerrado",
    perdido: "Perdido",
    
    // Lead Fields
    name: "Nombre",
    email: "Email",
    phone: "Teléfono",
    status: "Estado",
    tags: "Tags",
    comments: "Comentarios",
    avatar: "Avatar",
    
    // Actions
    call: "Llamar",
    sendEmail: "Enviar Email",
    schedule: "Programar",
    actions: "Acciones",
    
    // Filters
    allStatuses: "Todos los estados",
    allTags: "Todas las etiquetas",
    allDates: "Todas las fechas",
    today: "Hoy",
    thisWeek: "Esta semana", 
    thisMonth: "Este mes",
    clearFilters: "Limpiar filtros",
    activeFilters: "filtros activos",
    
    // Results
    showing: "Mostrando",
    of: "de",
    leadsText: "leads",
    page: "página",
    noLeadsFound: "No se encontraron leads",
    noLeadsDescription: "Intenta ajustar los filtros o añade un nuevo lead",
    
    // Settings Panel
    settingsTitle: "Configuración",
    settingsDescription: "Personaliza tu experiencia y gestiona los datos del sistema",
    
    // Settings Tabs
    general: "General",
    notifications: "Notificaciones", 
    data: "Datos",
    appearance: "Apariencia",
    
    // General Settings
    companyInfo: "Información de la Empresa",
    companyInfoDescription: "Configura la información básica de tu empresa",
    companyName: "Nombre de la empresa",
    mainEmail: "Email principal",
    timezone: "Zona horaria",
    regionalPreferences: "Preferencias Regionales",
    language: "Idioma",
    currency: "Moneda",
    
    // Notifications
    notificationSettings: "Configuración de Notificaciones",
    notificationSettingsDescription: "Controla cuándo y cómo recibes notificaciones",
    emailNewLead: "Email por nuevo lead",
    emailNewLeadDesc: "Recibe un email cuando se crea un nuevo lead",
    emailStatusChange: "Email por cambio de estado", 
    emailStatusChangeDesc: "Notificación cuando un lead cambia de estado",
    desktopNotifications: "Notificaciones de escritorio",
    desktopNotificationsDesc: "Permite notificaciones push en el navegador",
    weeklyReport: "Reporte semanal",
    weeklyReportDesc: "Resumen semanal de actividad de leads",
    monthlyReport: "Reporte mensual",
    monthlyReportDesc: "Análisis mensual detallado",
    reminderFollowUp: "Recordatorios de seguimiento",
    reminderFollowUpDesc: "Alertas para hacer seguimiento a leads",
    
    // Custom Notifications
    sendCustomNotification: "Enviar Notificación Manual",
    sendCustomNotificationDesc: "Crea y envía una notificación personalizada",
    notificationTitle: "Título",
    notificationMessage: "Mensaje",
    notificationType: "Tipo",
    notificationTitlePlaceholder: "Título de la notificación",
    notificationMessagePlaceholder: "Contenido del mensaje...",
    sendNotification: "Enviar Notificación",
    
    // Notification Types
    info: "Información",
    success: "Éxito", 
    warning: "Advertencia",
    error: "Error",
    
    // Data Management
    exportData: "Exportar Datos",
    exportDataDescription: "Descarga una copia de seguridad de tus leads",
    exportAllLeads: "Exportar todos los leads",
    downloadJsonFile: "Descarga archivo JSON con",
    importData: "Importar Datos",
    importDataDescription: "Sube un archivo JSON con leads para importar",
    selectJsonFile: "Selecciona un archivo JSON",
    fileValidationMessage: "El archivo debe contener un array de leads válidos",
    selectFile: "Seleccionar archivo",
    
    // Appearance
    appTheme: "Tema de la Aplicación", 
    appThemeDescription: "Personaliza la apariencia de la interfaz",
    lightTheme: "Claro",
    darkTheme: "Oscuro",
    systemTheme: "Sistema",
    active: "Activo",
    
    // Floating Menu
    lightMode: "Tema Claro",
    darkMode: "Tema Oscuro",
    automations: "Automatizaciones",
    profile: "Perfil",
    logout: "Salir",
    
    // Messages & Toasts
    themeChanged: "Tema cambiado",
    themeChangedToLight: "Cambiado a tema claro",
    themeChangedToDark: "Cambiado a tema oscuro",
    configurationSaved: "Configuración guardada",
    configurationSavedDesc: "Todos los cambios han sido guardados correctamente",
    exportCompleted: "Exportación completada", 
    exportCompletedDesc: "leads exportados correctamente",
    importCompleted: "Importación completada",
    importCompletedDesc: "leads importados correctamente",
    importError: "Error de importación",
    importErrorDesc: "El archivo no tiene el formato correcto",
    customNotificationError: "Por favor completa el título y mensaje",
    
    // Automations
    automationsTitle: "Automatizaciones",
    automationsDescription: "Conecta tu CRM con herramientas externas usando Zapier",
    
    // Time expressions
    ago: "Hace",
    now: "Ahora",
    days: "días",
    weeks: "semanas", 
    months: "meses",
    
    // Save Changes
    saveChanges: "Guardar Cambios"
  },
  en: {
    // General
    loading: "Loading...",
    save: "Save",
    cancel: "Cancel", 
    close: "Close",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    search: "Search",
    filter: "Filter",
    export: "Export",
    import: "Import", 
    settings: "Settings",
    
    // Navigation & Views
    cards: "Cards",
    list: "List",
    grid: "Grid",
    
    // Lead Management
    leads: "Leads",
    newLead: "New Lead",
    leadDetails: "Lead Details",
    addLead: "Add Lead",
    editLead: "Edit Lead", 
    viewDetails: "View details",
    lastContact: "Last contact",
    
    // Lead Status
    nuevo: "New",
    contactado: "Contacted",
    calificado: "Qualified", 
    propuesta: "Proposal",
    cerrado: "Closed",
    perdido: "Lost",
    
    // Lead Fields
    name: "Name",
    email: "Email",
    phone: "Phone",
    status: "Status",
    tags: "Tags", 
    comments: "Comments",
    avatar: "Avatar",
    
    // Actions
    call: "Call",
    sendEmail: "Send Email",
    schedule: "Schedule", 
    actions: "Actions",
    
    // Filters
    allStatuses: "All statuses",
    allTags: "All tags",
    allDates: "All dates",
    today: "Today",
    thisWeek: "This week",
    thisMonth: "This month",
    clearFilters: "Clear filters",
    activeFilters: "active filters",
    
    // Results
    showing: "Showing",
    of: "of", 
    leadsText: "leads",
    page: "page",
    noLeadsFound: "No leads found",
    noLeadsDescription: "Try adjusting the filters or add a new lead",
    
    // Settings Panel
    settingsTitle: "Settings",
    settingsDescription: "Customize your experience and manage system data",
    
    // Settings Tabs
    general: "General",
    notifications: "Notifications",
    data: "Data",
    appearance: "Appearance",
    
    // General Settings
    companyInfo: "Company Information", 
    companyInfoDescription: "Configure your company's basic information",
    companyName: "Company name",
    mainEmail: "Main email",
    timezone: "Timezone", 
    regionalPreferences: "Regional Preferences",
    language: "Language",
    currency: "Currency",
    
    // Notifications
    notificationSettings: "Notification Settings",
    notificationSettingsDescription: "Control when and how you receive notifications",
    emailNewLead: "Email for new lead",
    emailNewLeadDesc: "Receive an email when a new lead is created", 
    emailStatusChange: "Email for status change",
    emailStatusChangeDesc: "Notification when a lead changes status",
    desktopNotifications: "Desktop notifications",
    desktopNotificationsDesc: "Allow push notifications in browser",
    weeklyReport: "Weekly report",
    weeklyReportDesc: "Weekly summary of lead activity",
    monthlyReport: "Monthly report", 
    monthlyReportDesc: "Detailed monthly analysis",
    reminderFollowUp: "Follow-up reminders",
    reminderFollowUpDesc: "Alerts to follow up on leads",
    
    // Custom Notifications
    sendCustomNotification: "Send Manual Notification",
    sendCustomNotificationDesc: "Create and send a custom notification", 
    notificationTitle: "Title",
    notificationMessage: "Message",
    notificationType: "Type",
    notificationTitlePlaceholder: "Notification title",
    notificationMessagePlaceholder: "Message content...",
    sendNotification: "Send Notification",
    
    // Notification Types
    info: "Information",
    success: "Success",
    warning: "Warning", 
    error: "Error",
    
    // Data Management
    exportData: "Export Data",
    exportDataDescription: "Download a backup copy of your leads",
    exportAllLeads: "Export all leads",
    downloadJsonFile: "Download JSON file with",
    importData: "Import Data",
    importDataDescription: "Upload a JSON file with leads to import", 
    selectJsonFile: "Select a JSON file",
    fileValidationMessage: "File must contain a valid array of leads",
    selectFile: "Select file",
    
    // Appearance
    appTheme: "Application Theme",
    appThemeDescription: "Customize the interface appearance",
    lightTheme: "Light",
    darkTheme: "Dark",
    systemTheme: "System",
    active: "Active",
    
    // Floating Menu
    lightMode: "Light Mode",
    darkMode: "Dark Mode", 
    automations: "Automations",
    profile: "Profile",
    logout: "Logout",
    
    // Messages & Toasts
    themeChanged: "Theme changed",
    themeChangedToLight: "Changed to light theme",
    themeChangedToDark: "Changed to dark theme",
    configurationSaved: "Configuration saved",
    configurationSavedDesc: "All changes have been saved successfully",
    exportCompleted: "Export completed",
    exportCompletedDesc: "leads exported successfully",
    importCompleted: "Import completed", 
    importCompletedDesc: "leads imported successfully",
    importError: "Import error",
    importErrorDesc: "File does not have the correct format",
    customNotificationError: "Please complete the title and message",
    
    // Automations
    automationsTitle: "Automations",
    automationsDescription: "Connect your CRM with external tools using Zapier",
    
    // Time expressions
    ago: "",
    now: "Now",
    days: "days",
    weeks: "weeks",
    months: "months",
    
    // Save Changes
    saveChanges: "Save Changes"
  }
};

export function getTranslation(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }
  
  return typeof value === 'string' ? value : key;
}

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('es');
  
  // Ensure light theme on initial load
  React.useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
  
  const t = (key: string) => getTranslation(language, key);
  
  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}