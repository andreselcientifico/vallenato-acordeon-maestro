import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PresentacionVideo, getYouTubeEmbedUrl, getFacebookEmbedUrl } from "@/lib/PresentacionVideos";
import { Trash2, Plus, Edit2, Wand2 } from "lucide-react";
import {
  getPresentacionVideos,
  createPresentacionVideo,
  updatePresentacionVideo,
  deletePresentacionVideo,
} from "@/api/presentacion_videos";
import { useToast } from "@/hooks/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Asegúrate de tener los estilos importados

export function PresentacionVideoManager() {
  const { toast } = useToast();
  const [videos, setVideos] = useState<PresentacionVideo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<PresentacionVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const defaultFormState = {
    title: "",
    date: new Date(),
    source: "youtube" as "youtube" | "facebook",
    eventType: "bodas" as "bodas" | "cumpleaños" | "festival" | "corporativo" | "serenata" | "otro",
    description: "",
    videoUrl: "",
    embedUrl: "",
    thumbnailUrl: "",
  };

  const [formData, setFormData] = useState(defaultFormState);

  // Load videos from backend
  useEffect(() => {
    const loadVideos = async () => {
      setIsLoading(true);
      try {
        const loadedVideos = await getPresentacionVideos();
        setVideos(loadedVideos);
      } catch (error) {
        console.error("Error loading videos:", error);
        toast({
          title: "Error",
          description: "No se pudo cargar los videos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadVideos();
  }, [toast]);

  // Extraer ID de YouTube de varias formas posibles de URL
  const extractYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url; // Devuelve el ID o asume que el input ya era un ID
  };

  // Autogenerar Thumbnail
  const handleAutoGenerateThumbnail = () => {
    if (!formData.videoUrl) {
      toast({
        title: "Error",
        description: "Primero ingresa la URL del video para generar la carátula",
        variant: "destructive",
      });
      return;
    }

    if (formData.source === "youtube") {
      const videoId = extractYouTubeId(formData.videoUrl);
      if (videoId) {
        const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        setFormData({ ...formData, thumbnailUrl: thumbUrl });
        toast({
          title: "Éxito",
          description: "Carátula de YouTube generada automáticamente",
        });
      }
    } else {
      toast({
        title: "Aviso",
        description: "Para Facebook, debes subir o pegar la URL de la imagen manualmente debido a restricciones de Meta.",
      });
    }
  };

  const handleAddVideo = async () => {
    if (!formData.title || !formData.videoUrl) {
      toast({
        title: "Error",
        description: "Por favor completa el título y la URL del video",
        variant: "destructive",
      });
      return;
    }

    let embedUrl = formData.videoUrl;
    if (formData.source === "youtube") {
      embedUrl = getYouTubeEmbedUrl(formData.videoUrl);
    } else if (formData.source === "facebook") {
      embedUrl = getFacebookEmbedUrl(formData.videoUrl);
    }

    const token = localStorage.getItem("token");

    if (editingVideo) {
      // Update existing video
      const success = await updatePresentacionVideo(
        editingVideo.id,
        {
          title: formData.title,
          description: formData.description,
          embed_url: embedUrl,
          // Asegúrate de que tu backend acepte estos campos al actualizar:
          // eventType: formData.eventType,
          // thumbnailUrl: formData.thumbnailUrl,
          // date: formData.date
        },
        token || undefined
      );

      if (success) {
        const updatedVideos = videos.map((v) =>
          v.id === editingVideo.id
            ? {
                ...v,
                title: formData.title,
                description: formData.description,
                videoUrl: formData.videoUrl, // Importante: actualizar estado local
                eventType: formData.eventType, // Importante: actualizar estado local
                thumbnailUrl: formData.thumbnailUrl, // Importante: actualizar estado local
                date: formData.date,
                embedUrl,
              }
            : v
        );
        setVideos(updatedVideos);
        toast({
          title: "Éxito",
          description: "Video actualizado correctamente",
        });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Error al actualizar el video",
          variant: "destructive",
        });
      }
    } else {
      // Add new video
      const newVideo = await createPresentacionVideo(
        formData.title,
        formData.source,
        formData.videoUrl,
        embedUrl,
        formData.description,
        token || undefined
      );

      if (newVideo) {
        setVideos([...videos, newVideo]);
        toast({
          title: "Éxito",
          description: "Video añadido correctamente",
        });
        setIsDialogOpen(false);
        resetForm();
      } else {
        toast({
          title: "Error",
          description: "Error al crear el video",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData(defaultFormState);
    setEditingVideo(null);
  };

  const handleDeleteVideo = async (id: string) => {
    if (videos.length <= 1) {
      toast({
        title: "Error",
        description: "Debes mantener al menos un video",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem("token");
    const success = await deletePresentacionVideo(id, token || undefined);

    if (success) {
      setVideos(videos.filter((v) => v.id !== id));
      toast({
        title: "Éxito",
        description: "Video eliminado correctamente",
      });
    } else {
      toast({
        title: "Error",
        description: "Error al eliminar el video",
        variant: "destructive",
      });
    }
  };

  const handleEditVideo = (video: PresentacionVideo) => {
    setEditingVideo(video);
    
    // Aquí estaba el bug. Si la base de datos devuelve null o nombres diferentes, se rompía.
    // Usamos el operador nullish coalescing (??) y fallback values.
    setFormData({
      title: video.title || "",
      date: video.date ? new Date(video.date) : new Date(),
      source: (video.source === "facebook" ? "facebook" : "youtube"),
      eventType: (video.eventType as any) || "bodas",
      description: video.description || "",
      videoUrl: video.videoUrl || "", 
      embedUrl: video.embedUrl || "",
      thumbnailUrl: video.thumbnailUrl || "",
    });
    
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (isLoading) {
    return <div className="text-center py-8">Cargando videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Videos de las Presentaciones</h3>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Añadir Video
        </Button>
      </div>

      <div className="grid gap-4">
        {videos.map((video) => (
          <Card key={video.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h4 className="font-semibold text-base">{video.title}</h4>
                <p className="text-sm text-muted-foreground">{video.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs bg-secondary px-2 py-1 rounded capitalize">
                    {video.source}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">{video.videoUrl}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditVideo(video)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteVideo(video.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVideo ? "Editar Video" : "Añadir Nuevo Video"}
            </DialogTitle>
            <DialogDescription>
              {formData.source === "youtube"
                ? "Puedes usar la URL completa o solo el ID del video"
                : "Puedes usar la URL del reel o solo el ID"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Mi Presentación"
              />
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium block">Fecha del Evento</label>
                <DatePicker
                  selected={formData.date}
                  onChange={(date: Date | null) =>
                    setFormData({...formData, date: date || new Date()})
                  }
                  dateFormat="dd/MM/yyyy"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción breve del video"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fuente</label>
                <Select value={formData.source} onValueChange={(value) =>
                  setFormData({ ...formData, source: value as "youtube" | "facebook" })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="youtube">YouTube</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo de Evento</label>
                <Select value={formData.eventType} onValueChange={(value) =>
                  setFormData({ ...formData, eventType: value as any })
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bodas">Bodas</SelectItem>
                    <SelectItem value="cumpleaños">Cumpleaños</SelectItem>
                    <SelectItem value="festival">Festival</SelectItem>
                    <SelectItem value="corporativo">Corporativo</SelectItem>
                    <SelectItem value="serenata">Serenata</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {formData.source === "youtube" ? "URL o ID de YouTube" : "URL o ID de Facebook"}
              </label>
              <Input
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder={
                  formData.source === "youtube"
                    ? "Ej: https://youtube.com/watch?v=efFC9ROqTzM o efFC9ROqTzM"
                    : "Ej: https://facebook.com/reel/121512741676727 o 121512741676727"
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                 Imagen de portada (Thumbnail)
              </label>
              <div className="flex gap-2">
                <Input
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  placeholder="URL de la imagen de portada"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={handleAutoGenerateThumbnail}
                  title="Generar automáticamente desde YouTube"
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              {formData.thumbnailUrl && (
                <div className="mt-2 rounded-md overflow-hidden border w-32 h-20 bg-muted">
                  <img src={formData.thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button onClick={handleAddVideo}>
                {editingVideo ? "Actualizar" : "Añadir"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
