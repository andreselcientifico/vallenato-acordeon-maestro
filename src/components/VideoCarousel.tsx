import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Clock, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  category: string;
  description: string;
}

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample videos - in a real app, this would come from an API
  const videos: Video[] = [
    {
      id: "1",
      title: "Aprende 'La Gota Fría' - Lección Completa",
      thumbnail: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      duration: "15:30",
      views: "12.5K",
      category: "Básico",
      description: "Aprende a tocar este clásico del vallenato paso a paso"
    },
    {
      id: "2", 
      title: "Técnicas de Digitación Avanzadas",
      thumbnail: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&h=300&fit=crop",
      duration: "22:15",
      views: "8.2K",
      category: "Avanzado",
      description: "Mejora tu técnica con ejercicios profesionales"
    },
    {
      id: "3",
      title: "Historia del Vallenato - Clase Cultural", 
      thumbnail: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=300&fit=crop",
      duration: "18:45",
      views: "15.1K", 
      category: "Cultura",
      description: "Conoce las raíces y evolución de nuestra música"
    },
    {
      id: "4",
      title: "'El Mochuelo' - Tutorial Completo",
      thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      duration: "20:10",
      views: "9.8K",
      category: "Intermedio", 
      description: "Domina este paseo vallenato tradicional"
    },
    {
      id: "5",
      title: "Improvisación en el Acordeón",
      thumbnail: "https://images.unsplash.com/photo-1571974599782-87def81e5837?w=400&h=300&fit=crop",
      duration: "25:30",
      views: "6.7K",
      category: "Avanzado",
      description: "Desarrolla tu creatividad musical"
    }
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.max(1, videos.length - 2));
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.max(1, videos.length - 2)) % Math.max(1, videos.length - 2));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Básico": return "bg-vallenato-gold text-white";
      case "Intermedio": return "bg-vallenato-red text-white";
      case "Avanzado": return "bg-primary text-primary-foreground";
      case "Cultura": return "bg-accent text-accent-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <section id="videos" className="py-20 bg-gradient-to-b from-vallenato-cream/10 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Videos</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Educativos
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Aprende con lecciones estructuradas y contenido de calidad profesional
          </p>
        </div>

        <div className="relative">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-semibold text-primary">Lecciones Destacadas</h3>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={prevSlide}
                className="rounded-full border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={nextSlide}
                className="rounded-full border-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-smooth"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {videos.map((video) => (
                <div key={video.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <Card className="bg-gradient-card shadow-elegant border-primary/20 overflow-hidden group hover:shadow-warm transition-all duration-300 hover:scale-105">
                    <div className="relative">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button variant="hero" size="lg" className="rounded-full">
                          <Play className="h-6 w-6" />
                        </Button>
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(video.category)}>
                          {video.category}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-sm flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-primary mb-2 line-clamp-2">
                        {video.title}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {video.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1 text-muted-foreground text-sm">
                          <Eye className="h-4 w-4" />
                          <span>{video.views} vistas</span>
                        </div>
                        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
                          Ver Lección
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(1, videos.length - 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-primary scale-125' 
                    : 'bg-border hover:bg-primary/50'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Button variant="hero" size="lg" className="shadow-elegant">
            Ver Todos Los Videos
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoCarousel;