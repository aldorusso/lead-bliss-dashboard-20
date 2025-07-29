import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Phone, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/lib/translations";
import { Lead } from "@/components/leads/LeadCard";

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSave: (leadId: string, note: string) => void;
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onSave: (leadId: string, note: string) => void;
}

export function CallModal({ isOpen, onClose, lead, onSave }: CallModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [callNotes, setCallNotes] = useState("");
  const [duration, setDuration] = useState("");

  const handleSave = () => {
    if (!callNotes.trim()) {
      toast({
        title: "Error",
        description: "Por favor escribe las notas de la llamada",
        variant: "destructive"
      });
      return;
    }

    if (lead) {
      const note = `📞 Llamada ${duration ? `(${duration} min)` : ""}: ${callNotes}`;
      onSave(lead.id, note);
      setCallNotes("");
      setDuration("");
      onClose();
      
      toast({
        title: "Nota guardada",
        description: `Notas de llamada con ${lead.name} guardadas correctamente`
      });
    }
  };

  const handleCancel = () => {
    setCallNotes("");
    setDuration("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Phone className="h-5 w-5 mr-2 text-primary" />
            Llamada con {lead?.name}
          </DialogTitle>
          <DialogDescription>
            Registra los detalles de tu conversación telefónica
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duración (minutos)</Label>
            <Input
              id="duration"
              type="number"
              placeholder="15"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="callNotes">¿Qué conversaron?</Label>
            <Textarea
              id="callNotes"
              placeholder="Escribe los puntos principales de la conversación..."
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Guardar Nota
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function EmailModal({ isOpen, onClose, lead, onSave }: EmailModalProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");

  const handleSave = () => {
    if (!subject.trim() || !emailContent.trim()) {
      toast({
        title: "Error",
        description: "Por favor completa el asunto y contenido del email",
        variant: "destructive"
      });
      return;
    }

    if (lead) {
      const note = `📧 Email enviado - Asunto: "${subject}"\nContenido: ${emailContent}`;
      onSave(lead.id, note);
      setSubject("");
      setEmailContent("");
      onClose();
      
      toast({
        title: "Email registrado",
        description: `Email a ${lead.name} registrado correctamente`
      });
    }
  };

  const handleCancel = () => {
    setSubject("");
    setEmailContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Email a {lead?.name}
          </DialogTitle>
          <DialogDescription>
            Registra el email que enviaste a este lead
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="subject">Asunto del email</Label>
            <Input
              id="subject"
              placeholder="Propuesta comercial - Seguimiento"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailContent">Contenido del email</Label>
            <Textarea
              id="emailContent"
              placeholder="Describe el contenido principal del email que enviaste..."
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              rows={6}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Registrar Email
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}