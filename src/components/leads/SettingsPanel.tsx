import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Bell, 
  Download, 
  Upload, 
  User, 
  Lock, 
  Palette, 
  Globe,
  Mail,
  Phone,
  FileText,
  X,
  Check,
  AlertCircle,
  Info
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { Lead } from "@/components/leads/LeadCard";
import { useTranslation } from "@/lib/translations";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  leads?: Lead[];
  onImportLeads?: (leads: Lead[]) => void;
}

export function SettingsPanel({ isOpen, onClose, leads = [], onImportLeads }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { t, language, setLanguage } = useTranslation();
  
  // General Settings
  const [settings, setSettings] = useState({
    companyName: "Mi Empresa",
    userEmail: "usuario@email.com",
    phone: "+34 600 000 000",
    timezone: "Europe/Madrid",
    language: language,
    currency: "EUR"
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNewLead: true,
    emailStatusChange: false,
    desktopNotifications: true,
    weeklyReport: true,
    monthlyReport: false,
    reminderFollowUp: true
  });

  // Custom Notification
  const [customNotification, setCustomNotification] = useState({
    title: "",
    message: "",
    type: "info" as "info" | "success" | "warning" | "error"
  });

  const handleSettingChange = (key: string, value: any) => {
    if (key === "language") {
      setLanguage(value);
    }
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSendCustomNotification = () => {
    if (!customNotification.title || !customNotification.message) {
      toast({
        title: t('error'),
        description: t('customNotificationError'),
        variant: "destructive"
      });
      return;
    }

    const variants = {
      info: "default",
      success: "default",
      warning: "destructive",
      error: "destructive"
    };

    toast({
      title: customNotification.title,
      description: customNotification.message,
      variant: variants[customNotification.type] as any
    });

    setCustomNotification({ title: "", message: "", type: "info" });
  };

  const handleExportLeads = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: t('exportCompleted'),
      description: `${leads.length} ${t('exportCompletedDesc')}`
    });
  };

  const handleImportLeads = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedLeads = JSON.parse(e.target?.result as string);
        if (Array.isArray(importedLeads) && onImportLeads) {
          onImportLeads(importedLeads);
          toast({
            title: t('importCompleted'),
            description: `${importedLeads.length} ${t('importCompletedDesc')}`
          });
        } else {
          throw new Error("Formato inválido");
        }
      } catch (error) {
        toast({
          title: t('importError'),
          description: t('importErrorDesc'),
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleSaveSettings = () => {
    toast({
      title: t('configurationSaved'),
      description: t('configurationSavedDesc')
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] w-full bg-background border-border/60 overflow-hidden p-0">
        <DialogHeader className="space-y-4 p-6 pb-4 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Settings className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-foreground">
                  {t('settingsTitle')}
                </DialogTitle>
                <DialogDescription className="text-muted-foreground">
                  {t('settingsDescription')}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <Tabs defaultValue="general" className="p-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">{t('general')}</TabsTrigger>
              <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
              <TabsTrigger value="data">{t('data')}</TabsTrigger>
              <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
            </TabsList>

            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    {t('companyInfo')}
                  </CardTitle>
                  <CardDescription>
                    {t('companyInfoDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t('companyName')}</Label>
                      <Input
                        id="companyName"
                        value={settings.companyName}
                        onChange={(e) => handleSettingChange("companyName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="userEmail">{t('mainEmail')}</Label>
                      <Input
                        id="userEmail"
                        type="email"
                        value={settings.userEmail}
                        onChange={(e) => handleSettingChange("userEmail", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('phone')}</Label>
                      <Input
                        id="phone"
                        value={settings.phone}
                        onChange={(e) => handleSettingChange("phone", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">{t('timezone')}</Label>
                      <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
                          <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                          <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                          <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-primary" />
                    {t('regionalPreferences')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="language">{t('language')}</Label>
                      <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">{t('currency')}</Label>
                      <Select value={settings.currency} onValueChange={(value) => handleSettingChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dólar ($)</SelectItem>
                          <SelectItem value="GBP">Libra (£)</SelectItem>
                          <SelectItem value="MXN">Peso mexicano (MX$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-primary" />
                    {t('notificationSettings')}
                  </CardTitle>
                  <CardDescription>
                    {t('notificationSettingsDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { key: "emailNewLead", label: t('emailNewLead'), description: t('emailNewLeadDesc') },
                      { key: "emailStatusChange", label: t('emailStatusChange'), description: t('emailStatusChangeDesc') },
                      { key: "desktopNotifications", label: t('desktopNotifications'), description: t('desktopNotificationsDesc') },
                      { key: "weeklyReport", label: t('weeklyReport'), description: t('weeklyReportDesc') },
                      { key: "monthlyReport", label: t('monthlyReport'), description: t('monthlyReportDesc') },
                      { key: "reminderFollowUp", label: t('reminderFollowUp'), description: t('reminderFollowUpDesc') }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between space-x-2">
                        <div className="space-y-0.5">
                          <div className="text-sm font-medium">{item.label}</div>
                          <div className="text-xs text-muted-foreground">{item.description}</div>
                        </div>
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-primary" />
                    {t('sendCustomNotification')}
                  </CardTitle>
                  <CardDescription>
                    {t('sendCustomNotificationDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="notificationTitle">{t('notificationTitle')}</Label>
                      <Input
                        id="notificationTitle"
                        placeholder={t('notificationTitlePlaceholder')}
                        value={customNotification.title}
                        onChange={(e) => setCustomNotification(prev => ({ ...prev, title: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationMessage">{t('notificationMessage')}</Label>
                      <Textarea
                        id="notificationMessage"
                        placeholder={t('notificationMessagePlaceholder')}
                        value={customNotification.message}
                        onChange={(e) => setCustomNotification(prev => ({ ...prev, message: e.target.value }))}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notificationType">{t('notificationType')}</Label>
                      <Select 
                        value={customNotification.type} 
                        onValueChange={(value: any) => setCustomNotification(prev => ({ ...prev, type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">
                            <div className="flex items-center">
                              <Info className="h-4 w-4 mr-2 text-blue-500" />
                              {t('info')}
                            </div>
                          </SelectItem>
                          <SelectItem value="success">
                            <div className="flex items-center">
                              <Check className="h-4 w-4 mr-2 text-green-500" />
                              {t('success')}
                            </div>
                          </SelectItem>
                          <SelectItem value="warning">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-yellow-500" />
                              {t('warning')}
                            </div>
                          </SelectItem>
                          <SelectItem value="error">
                            <div className="flex items-center">
                              <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                              {t('error')}
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSendCustomNotification} className="w-full">
                      <Bell className="h-4 w-4 mr-2" />
                      {t('sendNotification')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Download className="h-5 w-5 mr-2 text-primary" />
                    {t('exportData')}
                  </CardTitle>
                  <CardDescription>
                    {t('exportDataDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="font-medium">{t('exportAllLeads')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('downloadJsonFile')} {leads.length} {t('leadsText')}
                      </div>
                    </div>
                    <Button onClick={handleExportLeads}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('export')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-primary" />
                    {t('importData')}
                  </CardTitle>
                  <CardDescription>
                    {t('importDataDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-border/60 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <div className="space-y-2">
                      <div className="font-medium">{t('selectJsonFile')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('fileValidationMessage')}
                      </div>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleImportLeads}
                        className="hidden"
                        id="import-file"
                      />
                      <Label htmlFor="import-file">
                        <Button variant="outline" className="cursor-pointer">
                          <FileText className="h-4 w-4 mr-2" />
                          {t('selectFile')}
                        </Button>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Appearance */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2 text-primary" />
                    {t('appTheme')}
                  </CardTitle>
                  <CardDescription>
                    {t('appThemeDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: "light", label: t('lightTheme'), preview: "bg-white border" },
                      { value: "dark", label: t('darkTheme'), preview: "bg-gray-900 border" },
                      { value: "system", label: t('systemTheme'), preview: "bg-gradient-to-r from-white to-gray-900 border" }
                    ].map((themeOption) => (
                      <div
                        key={themeOption.value}
                        className={`cursor-pointer rounded-lg border-2 p-4 text-center transition-all ${
                          theme === themeOption.value ? "border-primary" : "border-border/60"
                        }`}
                        onClick={() => setTheme(themeOption.value)}
                      >
                        <div className={`h-12 w-full rounded mb-2 ${themeOption.preview}`} />
                        <div className="font-medium">{themeOption.label}</div>
                        {theme === themeOption.value && (
                          <Badge variant="secondary" className="mt-2">
                            {t('active')}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-border/60 p-6">
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSaveSettings}>
              <Check className="h-4 w-4 mr-2" />
              {t('saveChanges')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}