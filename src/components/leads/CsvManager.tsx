import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  lastContact: string;
  interestedTreatments: string[];
  tags: string[];
}

interface CsvManagerProps {
  leads: Lead[];
  onImportLeads: (leads: Lead[]) => void;
}

export function CsvManager({ leads, onImportLeads }: CsvManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const headers = [
      "name",
      "email", 
      "phone",
      "status",
      "lastContact",
      "interestedTreatments",
      "tags"
    ];

    const csvContent = headers.join(",") + "\n" + 
      'Juan Pérez,juan@email.com,+1234567890,nuevo,Hace 2 días,"Botox,Depilación láser","vip,premium"';

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla_leads.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Plantilla descargada",
      description: "La plantilla CSV se ha descargado correctamente"
    });
  };

  const exportLeads = () => {
    if (leads.length === 0) {
      toast({
        title: "Sin datos",
        description: "No hay leads para exportar",
        variant: "destructive"
      });
      return;
    }

    const headers = [
      "name",
      "email",
      "phone", 
      "status",
      "lastContact",
      "interestedTreatments",
      "tags"
    ];

    const csvRows = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.status,
      lead.lastContact,
      lead.interestedTreatments?.join(";") || "",
      lead.tags?.join(";") || ""
    ]);

    const csvContent = headers.join(",") + "\n" + 
      csvRows.map(row => row.map(field => `"${field}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({
      title: "Leads exportados",
      description: `Se han exportado ${leads.length} leads correctamente`
    });
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Archivo inválido",
        description: "Por favor selecciona un archivo CSV",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const importedLeads: Lead[] = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.replace(/"/g, '').trim());
            
            return {
              id: `imported_${Date.now()}_${index}`,
              name: values[0] || '',
              email: values[1] || '',
              phone: values[2] || '',
              status: values[3] || 'nuevo',
              lastContact: values[4] || 'Importado',
              interestedTreatments: values[5] ? values[5].split(';') : [],
              tags: values[6] ? values[6].split(';') : []
            };
          });

        onImportLeads(importedLeads);
        setIsOpen(false);
        
        toast({
          title: "Importación exitosa",
          description: `Se han importado ${importedLeads.length} leads correctamente`
        });
        
      } catch (error) {
        toast({
          title: "Error de importación",
          description: "Hubo un problema al procesar el archivo CSV",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="border-border/60 hover:bg-muted/50"
        >
          <FileText className="h-4 w-4 mr-2" />
          CSV
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Gestión de CSV
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-3">
            <Label className="text-base font-medium">Exportar Datos</Label>
            <Button 
              onClick={exportLeads}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar todos los leads
            </Button>
          </div>

          <div className="space-y-3 border-t pt-4">
            <Label className="text-base font-medium">Importar Datos</Label>
            
            <Button 
              onClick={downloadTemplate}
              className="w-full justify-start"
              variant="outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar plantilla CSV
            </Button>

            <div className="space-y-2">
              <Label htmlFor="csv-file" className="text-sm">
                Seleccionar archivo CSV
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileImport}
                  className="flex-1"
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">
                Formatos soportados: .csv
              </p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
            <strong>Formato esperado:</strong> name, email, phone, status, lastContact, interestedTreatments, tags
            <br />
            <strong>Separadores:</strong> Usa punto y coma (;) para múltiples valores en tratamientos y tags
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}