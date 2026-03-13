import { useEffect, useRef, useState } from "react";
import { Mail, RefreshCw, Trash2, ArrowLeft, Send, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  ReceivedEmail,
  getReceivedEmails,
  markEmailAsRead,
  deleteReceivedEmail,
  replyToEmail,
  ReplyEmailRequest,
} from "@/api/inbox";
import { toast } from "sonner";
import Header from "@/components/Header";
import EmailBroadcast from "@/components/EmailBroadcast";

const AdminInboxPage = () => {
  const [emails, setEmails] = useState<ReceivedEmail[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<ReceivedEmail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const [replyMinimized, setReplyMinimized] = useState(false);
  const [replyData, setReplyData] = useState<ReplyEmailRequest>({
    to_address: "",
    subject: "",
    html_content: "",
  });
  const [isReplying, setIsReplying] = useState(false);

  const fetchEmails = async () => {
    try {
      setIsLoading(true);
      const data = await getReceivedEmails();
      setEmails(data);
    } catch {
      toast.error("Error al cargar los correos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const extractClientEmail = (email: ReceivedEmail): string => {
    const contentToSearch = email.text_content || email.html_content || "";
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const matches = contentToSearch.match(emailRegex);
    if (matches) {
      const foundEmails = matches.filter(
        (e) => !e.includes("vallenatofemenino.com") && !e.includes("resend.app")
      );
      
      if (foundEmails.length > 0) {
        return foundEmails[0];
      }
    }
    return email.from_address; 
  };

  const handleSelectEmail = async (email: ReceivedEmail) => {
    setShowMobileList(false);
    setShowReplyForm(false);
    setReplyMinimized(false);

    const replyToAddress = extractClientEmail(email);
    email.from_address = replyToAddress
    setSelectedEmail(email);

    setReplyData({
      to_address: replyToAddress,
      subject: email.subject.startsWith("Re:") ? email.subject : `Re: ${email.subject}`,
      html_content: "",
    });

    if (!email.is_read) {
      try {
        await markEmailAsRead(email.id);
        setEmails((prev) =>
          prev.map((e) => (e.id === email.id ? { ...e, is_read: true } : e)),
        );
      } catch {
        console.error("No se pudo marcar como leído");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Seguro que deseas eliminar este correo?")) return;
    try {
      await deleteReceivedEmail(id);
      setEmails((prev) => prev.filter((e) => e.id !== id));
      if (selectedEmail?.id === id) {
        setSelectedEmail(null);
        setShowMobileList(true);
        setShowReplyForm(false);
      }
      toast.success("Correo eliminado");
    } catch {
      toast.error("Error al eliminar el correo");
    }
  };

  const handleReply = async () => {
    if (!selectedEmail) return;

    if (!replyData.subject.trim() || !replyData.html_content.trim()) {
      toast.error("Por favor completa el asunto y el mensaje");
      return;
    }

    setIsReplying(true);
    try {
      await replyToEmail(selectedEmail.id, replyData);
      toast.success("Respuesta enviada correctamente");
      setShowReplyForm(false);
      setReplyData({
        to_address: selectedEmail.from_address,
        subject: `Re: ${selectedEmail.subject}`,
        html_content: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al enviar la respuesta",
      );
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header/>
      <div className="flex-1 w-full flex flex-col min-h-0 pt-24">
        <div className="container mx-auto px-4 py-6 flex-1 flex flex-col max-w-6xl overflow-hidden">
          <Tabs defaultValue="inbox" className="w-full flex flex-col flex-1 overflow-hidden">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-6 shrink-0">
              <TabsTrigger value="inbox">Bandeja de Entrada</TabsTrigger>
              <TabsTrigger value="send">Enviar Emails</TabsTrigger>
            </TabsList>

            {/* INBOX TAB */}
            <TabsContent value="inbox" className="flex-1 flex-col data-[state=active]:flex overflow-hidden m-0">
              {/* MOBILE: Toggle between list and detail */}
              <div className="md:hidden flex-1 flex flex-col h-full min-h-[500px] overflow-hidden">
                {showMobileList ? (
                  <EmailList
                    emails={emails}
                    isLoading={isLoading}
                    onRefresh={fetchEmails}
                    selectedId={selectedEmail?.id}
                    onSelect={handleSelectEmail}
                  />
                ) : selectedEmail ? (
                  <div className="flex-1 flex flex-col h-full w-full">
                    <EmailDetail
                      email={selectedEmail}
                      onBack={() => setShowMobileList(true)}
                      onDelete={() => handleDelete(selectedEmail.id)}
                      onReply={() => setShowReplyForm(true)}
                    />
                  </div>
                ) : null}
              </div>

              {/* DESKTOP: Show both side by side */}
              <div className="hidden md:flex gap-4 flex-1 overflow-hidden min-w-0">
                <div className="w-80 shrink-0 flex flex-col overflow-hidden">
                  <EmailList
                    emails={emails}
                    isLoading={isLoading}
                    onRefresh={fetchEmails}
                    selectedId={selectedEmail?.id}
                    onSelect={handleSelectEmail}
                  />
                </div>
                <div className="flex-1 flex flex-col overflow-hidden min-w-0 w-0">
                  {selectedEmail ? (
                    <EmailDetail
                      email={selectedEmail}
                      onDelete={() => handleDelete(selectedEmail.id)}
                      onReply={() => setShowReplyForm(true)}
                    />
                  ) : (
                    <Card className="h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <Mail className="w-12 h-12 mb-2 opacity-20 mx-auto" />
                        <p className="text-sm">Selecciona un correo para leerlo</p>
                      </div>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* SEND EMAILS TAB */}
            <TabsContent value="send" className="flex-1 flex-col data-[state=active]:flex overflow-hidden m-0">
              <div className="flex-1 overflow-y-auto">
                <EmailBroadcast />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* FLOATING REPLY FORM (Gmail Style) */}
      {selectedEmail && showReplyForm && (
        <div
          className={`fixed right-4 transition-all duration-300 z-50 ${
            replyMinimized
              ? "bottom-4 w-72"
              : "bottom-4 w-96 md:w-2xl max-h-[80vh]"
          }`}
        >
          <Card className="shadow-2xl border border-border overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/20 shrink-0">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm line-clamp-1">
                  Responder a: {selectedEmail.from_address}
                </h3>
              </div>
              <div className="flex gap-1 shrink-0 ml-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setReplyMinimized(!replyMinimized)}
                  className="h-6 w-6"
                >
                  <Minimize2 className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowReplyForm(false)}
                  className="h-6 w-6"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            {!replyMinimized && (
              <>
                <ScrollArea className="flex-1 p-4 space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="reply-subject" className="text-xs">
                      Asunto
                    </Label>
                    <Input
                      id="reply-subject"
                      value={replyData.subject}
                      onChange={(e) =>
                        setReplyData({ ...replyData, subject: e.target.value })
                      }
                      className="text-xs h-8"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="reply-content" className="text-xs">
                      Mensaje
                    </Label>
                    <Textarea
                      id="reply-content"
                      value={replyData.html_content}
                      onChange={(e) =>
                        setReplyData({ ...replyData, html_content: e.target.value })
                      }
                      placeholder="Escribe tu respuesta..."
                      className="min-h-[100px] text-xs resize-none"
                    />
                  </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-4 border-t flex gap-2 justify-end bg-muted/10 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReplyForm(false)}
                    className="h-8 text-xs"
                  >
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleReply}
                    disabled={isReplying}
                    className="h-8 text-xs"
                  >
                    {isReplying ? (
                      <>
                        <span className="animate-spin mr-1">⏳</span>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 mr-1" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};

/* Email List Component */
interface EmailListProps {
  emails: ReceivedEmail[];
  isLoading: boolean;
  selectedId?: string;
  onRefresh: () => void;
  onSelect: (email: ReceivedEmail) => void;
}

const EmailList = ({
  emails,
  isLoading,
  selectedId,
  onRefresh,
  onSelect,
}: EmailListProps) => (
  <Card className="h-full flex flex-col overflow-hidden">
    <CardHeader className="shrink-0 pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Mail className="w-4 h-4" />
          Correos ({emails.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
          className="h-8 w-8"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
    </CardHeader>
    <ScrollArea className="flex-1 w-full">
      {emails.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No hay correos
        </div>
      ) : (
        <div className="divide-y">
          {emails.map((email) => (
            <button
              key={email.id}
              onClick={() => onSelect(email)}
              className={`w-full text-left p-3 hover:bg-muted/50 transition-colors border-l-2 ${
                selectedId === email.id
                  ? "bg-primary/5 border-l-primary"
                  : "border-l-transparent"
              }`}
            >
              <div className="flex justify-between items-start gap-2 mb-1">
                <span className="truncate text-xs font-medium flex-1">
                  {email.from_address}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                  {format(new Date(email.created_at), "dd MMM", { locale: es })}
                </span>
              </div>
              <div className="text-xs truncate text-foreground/90">
                {email.subject}
              </div>
            </button>
          ))}
        </div>
      )}
    </ScrollArea>
  </Card>
);

/* Email Detail Component */
interface EmailDetailProps {
  email: ReceivedEmail;
  onBack?: () => void;
  onDelete: () => void;
  onReply: () => void;
}

const EmailDetail = ({ email, onBack, onDelete, onReply }: EmailDetailProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Efecto para inyectar el HTML de forma segura en el iframe
  useEffect(() => {
    if (iframeRef.current && email.html_content) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        doc.open();
        // Inyectamos el HTML. Usamos una etiqueta base opcional para manejar links
        doc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <base target="_blank">
              <style>
                /* Estilos base para que el iframe luzca bien en modo oscuro/claro */
                body {
                  margin: 0;
                  padding: 16px;
                  font-family: system-ui, -apple-system, sans-serif;
                  color-scheme: light dark;
                  word-break: break-word;
                }
              </style>
            </head>
            <body>
              ${email.html_content}
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, [email.html_content]);

  return (
    <Card className="h-full flex flex-col overflow-hidden w-full min-w-0">
      {/* Header */}
      <div className="p-4 border-b bg-muted/20 shrink-0 space-y-3">
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mb-2 -ml-2 h-8 md:hidden"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver
          </Button>
        )}
        <h2 className="text-lg font-bold break-words line-clamp-2">
          {email.subject}
        </h2>
        <div className="text-xs space-y-1 text-muted-foreground">
          <div className="truncate">
            <span className="font-medium text-foreground">De:</span>{" "}
            {email.from_address}
          </div>
          <div className="truncate">
            <span className="font-medium text-foreground">Para:</span>{" "}
            {email.to_address}
          </div>
          <div>
            {format(new Date(email.created_at), "dd 'de' MMMM, yyyy HH:mm", {
              locale: es,
            })}
          </div>
        </div>
      </div>

      {/* CONTENT: Iframe en lugar de dangerouslySetInnerHTML */}
      <div className="flex-1 min-h-[360px] md:min-h-0 w-full bg-background relative flex flex-col">
        {email.html_content ? (
          <iframe
            ref={iframeRef}
            className="absolute inset-0 w-full h-full border-none bg-white dark:bg-background rounded-b-lg"
            title="Contenido del correo"
            sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        ) : (
          <div className="h-full overflow-y-auto p-4 flex-1">
            <pre className="whitespace-pre-wrap font-sans text-xs break-words">
              {email.text_content}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t flex gap-2 bg-muted/20 shrink-0">
        <Button onClick={onReply} className="flex-1 h-8 text-xs">
          <Mail className="w-3 h-3 mr-2" />
          Responder
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={onDelete}
          className="h-8 px-3 shrink-0"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </Card>
  );
};


export default AdminInboxPage;
