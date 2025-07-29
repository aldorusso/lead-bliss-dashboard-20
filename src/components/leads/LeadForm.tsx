import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Lead, Comment } from "./LeadCard";
import { User, Phone, Mail, Tag, Save, FileText, Clock, MessageCircle, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LeadFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead;
  mode: "create" | "edit";
}

export function LeadForm({ isOpen, onClose, onSave, lead, mode }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: lead?.name || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    status: lead?.status || "nuevo",
  });

  const [newComment, setNewComment] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(lead?.tags || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Update form data when lead prop changes (for editing)
  useEffect(() => {
    if (lead && mode === "edit") {
      console.log("Loading lead data for editing:", lead);
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.status || "nuevo",
      });
      setSelectedTags(lead.tags || []);
    } else if (mode === "create") {
      // Reset form for creating new lead
      setFormData({
        name: "",
        email: "",
        phone: "",
        status: "nuevo",
      });
      setSelectedTags([]);
    }
  }, [lead, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^[\+]?[\d\s\-\(\)]{9,}$/.test(formData.phone)) {
      newErrors.phone = "Formato de teléfono inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const updatedLead = {
        ...formData,
        tags: selectedTags,
        id: lead?.id || Date.now().toString(),
        lastContact: mode === "create" ? "Ahora" : lead?.lastContact,
        comments: lead?.comments || [],
      };
      
      onSave(updatedLead);
      handleClose();
    }
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now().toString(),
      text: newComment.trim(),
      author: "Ana García", // En producción vendría del usuario actual
      timestamp: new Date().toLocaleString('es-ES', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedComments = [...(lead?.comments || []), comment];
    
    onSave({
      ...formData,
      tags: selectedTags,
      id: lead?.id || Date.now().toString(),
      lastContact: lead?.lastContact || "Ahora",
      comments: updatedComments,
    });

    setNewComment("");
    toast({
      title: "Comentario añadido",
      description: "El comentario se ha guardado correctamente",
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      status: "nuevo",
    });
    setNewComment("");
    setSelectedTags([]);
    setErrors({});
    onClose();
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const availableTags = ["premium", "startup", "empresa", "urgente", "demo", "presupuesto"];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const statusOptions = [
    { value: "nuevo", label: "Nuevo", color: "bg-blue-500" },
    { value: "contactado", label: "Contactado", color: "bg-yellow-500" },
    { value: "calificado", label: "Calificado", color: "bg-purple-500" },
    { value: "propuesta", label: "Propuesta", color: "bg-orange-500" },
    { value: "cerrado", label: "Cerrado", color: "bg-green-500" },
    { value: "perdido", label: "Perdido", color: "bg-red-500" },
  ];

  const currentStatus = statusOptions.find(s => s.value === formData.status);

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:w-[600px] bg-background border-border/60 overflow-y-auto">
        <SheetHeader className="space-y-4 pb-6">
          <div>
            <SheetTitle className="text-2xl font-bold text-foreground">
              {mode === "create" ? "Nuevo Lead" : "Editar Lead"}
            </SheetTitle>
            <SheetDescription className="text-muted-foreground">
              {mode === "create" 
                ? "Completa la información del nuevo lead"
                : "Actualiza la información del lead"
              }
            </SheetDescription>
          </div>

          {/* Preview Card */}
          {formData.name && (
            <div className="bg-gradient-card border border-border/60 rounded-lg p-4 shadow-card">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {getInitials(formData.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{formData.name}</h3>
                  <p className="text-sm text-muted-foreground">{formData.email}</p>
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {lead?.comments && lead.comments.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {lead.comments.length} comentario{lead.comments.length !== 1 ? 's' : ''}
                    </p>
                  )}
                  {currentStatus && (
                    <div className="flex items-center mt-1">
                      <div className={`w-2 h-2 rounded-full ${currentStatus.color} mr-2`} />
                      <span className="text-xs text-muted-foreground">{currentStatus.label}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground font-medium flex items-center">
              <User className="h-4 w-4 mr-2 text-primary" />
              Nombre completo
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ej: Ana García López"
              className={`bg-background border-border/60 focus:border-primary transition-colors ${
                errors.name ? "border-destructive focus:border-destructive" : ""
              }`}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground font-medium flex items-center">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Ej: ana.garcia@empresa.com"
              className={`bg-background border-border/60 focus:border-primary transition-colors ${
                errors.email ? "border-destructive focus:border-destructive" : ""
              }`}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-foreground font-medium flex items-center">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              Teléfono
            </Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Ej: +34 691 234 567"
              className={`bg-background border-border/60 focus:border-primary transition-colors ${
                errors.phone ? "border-destructive focus:border-destructive" : ""
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          {/* Estado */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-foreground font-medium flex items-center">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              Estado del lead
            </Label>
            <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger className="bg-background border-border/60 focus:border-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border/60">
                {statusOptions.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${status.color} mr-3`} />
                      {status.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Etiquetas */}
          <div className="space-y-2">
            <Label className="text-foreground font-medium flex items-center">
              <Tag className="h-4 w-4 mr-2 text-primary" />
              Etiquetas
            </Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Button
                  key={tag}
                  type="button"
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleTag(tag)}
                  className={`text-xs ${
                    selectedTags.includes(tag) 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-accent"
                  }`}
                >
                  {tag}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Selecciona las etiquetas que describen mejor a este lead
            </p>
          </div>

          {/* Comentarios */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium flex items-center">
              <MessageCircle className="h-4 w-4 mr-2 text-primary" />
              Comentarios del lead
            </Label>
            
            {/* Lista de comentarios existentes */}
            {lead?.comments && lead.comments.length > 0 && (
              <ScrollArea className="h-48 w-full border border-border/60 rounded-lg p-3 bg-muted/20">
                <div className="space-y-3">
                  {lead.comments.map((comment) => (
                    <div key={comment.id} className="bg-background border border-border/40 rounded-lg p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-foreground">{comment.author}</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {comment.timestamp}
                        </div>
                      </div>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {/* Agregar nuevo comentario */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Escribir un comentario sobre este lead..."
                  className="bg-background border-border/60 focus:border-primary transition-colors resize-none"
                  rows={3}
                />
                <Button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity px-3"
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Los comentarios no se pueden borrar una vez añadidos
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-border/60">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity shadow-glow"
            >
              <Save className="h-4 w-4 mr-2" />
              {mode === "create" ? "Crear Lead" : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}