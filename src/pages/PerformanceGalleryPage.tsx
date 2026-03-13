import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Play, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPresentacionVideos } from "@/api/presentacion_videos";
import { PresentacionVideo } from "@/lib/PresentacionVideos";

const PerformanceGalleryPage = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<PresentacionVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<PresentacionVideo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEventType, setSelectedEventType] = useState<string>("all");
  const [selectedVideo, setSelectedVideo] = useState<PresentacionVideo | null>(null);

  useEffect(() => {
      const loadVideos = async () => {
        try {
          const videos = await getPresentacionVideos();
          if (videos && videos.length > 0) {
            setVideos(videos);
            localStorage.setItem("eventVideos", JSON.stringify(videos));
          }
        } catch (error) {
          console.error("Error loading videos:", error);
        }
      };
      loadVideos();
  }, []);

  useEffect(() => {
    let filtered = videos;

    // Filter by event type
    if (selectedEventType !== "all") {
      filtered = filtered.filter((v) => v.eventType === selectedEventType);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setFilteredVideos(filtered);
  }, [videos, searchTerm, selectedEventType]);

  const eventTypeLabels: Record<string, string> = {
    bodas: "Bodas",
    cumpleaños: "Cumpleaños",
    festival: "Festival",
    corporativo: "Corporativo",
    serenata: "Serenata",
    otro: "Otro",
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </div>

        {/* Header */}
        <div className="space-y-6 mb-12">
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-primary">Galería de</span>{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Presentaciones
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora las presentaciones y eventos en vivo del Maestro Andrea.
              Vallenato Machine en sus mejores momentos.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar presentaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="px-4 py-2 rounded-md border border-input bg-background text-foreground"
            >
              <option value="all">Todos los eventos</option>
              {Object.entries(eventTypeLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Video Gallery Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredVideos.map((video) => (
              <Card
                key={video.id}
                className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-vallenato-red/20 flex items-center justify-center">
                      <div className="text-center">
                        <Play className="h-12 w-12 text-white/60 mx-auto mb-2" />
                        <p className="text-white/60 text-sm">Video</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="lg"
                      className="rounded-full p-3"
                    >
                      <Play className="h-8 w-8 text-white fill-white" />
                    </Button>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(video.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {eventTypeLabels[video.eventType]}
                    </span>
                  </div>
                  {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              {videos.length === 0
                ? "No hay videos disponibles aún."
                : "No se encontraron presentaciones con esos criterios."}
            </p>
          </div>
        )}

        {/* Video Player Modal */}
        {selectedVideo && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setSelectedVideo(null)}
          >
            <Card className="w-full max-w-4xl bg-black my-8">
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 p-2 rounded-full text-white z-10"
              >
                ✕
              </button>
              <div className="relative">
                {selectedVideo.embedUrl.includes("youtube") ||
                selectedVideo.embedUrl.includes("youtube-nocookie") ? (
                  <div className="aspect-video relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src={selectedVideo.embedUrl}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full flex justify-center bg-black py-4">
                    <iframe
                      src={selectedVideo.embedUrl}
                      width="550"
                      height="650"
                      style={{ border: "none", overflow: "hidden" }}
                      scrolling="no"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    ></iframe>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold">{selectedVideo.title}</h2>
                  <p className="text-muted-foreground">
                    {new Date(selectedVideo.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                {selectedVideo.description && (
                  <p className="text-foreground">{selectedVideo.description}</p>
                )}
                <div className="flex items-center gap-2">
                  <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded">
                    {eventTypeLabels[selectedVideo.eventType]}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceGalleryPage;
