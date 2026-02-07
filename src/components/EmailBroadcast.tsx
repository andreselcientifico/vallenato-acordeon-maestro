import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Users, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  sendBulkEmail,
  getNotificationRecipientsCount,
  SendBulkEmailRequest,
} from "@/api/notifications";

type NotificationType =
  | "email_notifications"
  | "course_reminders"
  | "new_content";

const NOTIFICATION_TYPE_LABELS: Record<NotificationType, string> = {
  email_notifications: "📧 Notificaciones por Email",
  course_reminders: "📚 Recordatorios de Cursos",
  new_content: "🆕 Nuevo Contenido",
};

const EmailBroadcast = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recipientCount, setRecipientCount] = useState<number | null>(null);
  const [loadingCount, setLoadingCount] = useState(false);

  const [formData, setFormData] = useState<SendBulkEmailRequest>({
    notification_type: "email_notifications",
    subject: "",
    html_content: "",
  });

  // Fetch recipient count when notification type changes
  useEffect(() => {
    const fetchCount = async () => {
      setLoadingCount(true);
      try {
        const result = await getNotificationRecipientsCount(
          formData.notification_type,
        );
        setRecipientCount(result.count);
      } catch (error) {
        console.error("Error fetching count:", error);
        setRecipientCount(null);
      } finally {
        setLoadingCount(false);
      }
    };

    fetchCount();
  }, [formData.notification_type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast({
        title: "Error",
        description: "El asunto es requerido",
        variant: "destructive",
      });
      return;
    }

    if (!formData.html_content.trim()) {
      toast({
        title: "Error",
        description: "El contenido del correo es requerido",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await sendBulkEmail(formData);
      toast({
        title: "¡Éxito!",
        description: result.message,
      });

      // Reset form
      setFormData({
        ...formData,
        subject: "",
        html_content: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error enviando correos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-vallenato-red">
            <Mail className="w-6 h-6" />
            Enviar Correos Masivos
          </CardTitle>
          <CardDescription>
            Envía correos a usuarios según sus preferencias de notificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Audience Selector */}
            <div className="space-y-2">
              <Label htmlFor="notification-type">Audiencia</Label>
              <Select
                value={formData.notification_type}
                onValueChange={(value: NotificationType) =>
                  setFormData({ ...formData, notification_type: value })
                }
              >
                <SelectTrigger id="notification-type" className="min-h-[44px]">
                  <SelectValue placeholder="Seleccionar audiencia" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(NOTIFICATION_TYPE_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>

              {/* Recipient count badge */}
              <div className="flex items-center gap-2 mt-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                {loadingCount ? (
                  <span className="text-sm text-muted-foreground">
                    Cargando...
                  </span>
                ) : recipientCount !== null ? (
                  <Badge variant={recipientCount > 0 ? "default" : "secondary"}>
                    {recipientCount}{" "}
                    {recipientCount === 1 ? "usuario" : "usuarios"} recibirán
                    este correo
                  </Badge>
                ) : (
                  <span className="text-sm text-muted-foreground">
                    Error obteniendo conteo
                  </span>
                )}
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Asunto</Label>
              <Input
                id="subject"
                placeholder="🎵 ¡Novedades de la Academia!"
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="min-h-[44px]"
              />
            </div>

            {/* HTML Content */}
            <div className="space-y-2">
              <Label htmlFor="html-content">Contenido del Correo (HTML)</Label>
              <Textarea
                id="html-content"
                placeholder="<p>Escribe tu mensaje aquí...</p>

<p>El correo se enviará con un diseño bonito automáticamente.</p>

<p><strong>¡Saludos!</strong></p>"
                value={formData.html_content}
                onChange={(e) =>
                  setFormData({ ...formData, html_content: e.target.value })
                }
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Puedes usar etiquetas HTML como <code>&lt;p&gt;</code>,{" "}
                <code>&lt;strong&gt;</code>, <code>&lt;a href=""&gt;</code>,
                etc.
              </p>
            </div>

            {/* Preview indicator */}
            {recipientCount === 0 && (
              <div className="flex items-center gap-2 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  No hay usuarios con esta preferencia activa. Verifica la
                  audiencia seleccionada.
                </p>
              </div>
            )}

            {/* Submit button */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading || recipientCount === 0}
                className="min-h-[44px] bg-vallenato-red hover:bg-vallenato-red/90"
              >
                {loading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar a {recipientCount ?? 0} usuarios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Tips card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Consejos para Correos Efectivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Usa un asunto llamativo con emojis (🎵 🎹 🎸)</li>
            <li>• Mantén el mensaje breve y directo</li>
            <li>• Incluye un llamado a la acción claro</li>
            <li>
              • Personaliza mencionando al usuario (se agrega automáticamente)
            </li>
            <li>
              • Los correos se envían en segundo plano, puedes cerrar esta
              página
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailBroadcast;
