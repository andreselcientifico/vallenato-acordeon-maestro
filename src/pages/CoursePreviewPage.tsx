// src/pages/CoursePreviewPage.tsx

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactPlayer from "react-player";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Maximize, 
  CheckCircle2, 
  Circle, 
  Clock, 
  BookOpen, 
  MessageCircle,
  Star,
  ChevronDown,
  ChevronRight,
  MonitorPlay,
  ClipboardCheck,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
// Importar los tipos actualizados
import { CourseDetails, getCourseDetails, Lesson, Module, Comment, getLessonComments, CourseRating, getCourseRating } from "@/api/courses";
import { API_URL } from "@/config/api";

interface LessonContentRendererProps {
  lesson: Lesson;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  isLocked: boolean;
}

// --- Componente de Renderizado de Contenido de la Lección ---
const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  isPlaying,
  setIsPlaying,
  isLocked
}) => {
  const isVideo = lesson.type === 'video' && lesson.content_url;

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  if (isLocked) {
    return (
      <div className="p-10 bg-gray-100 dark:bg-gray-800 h-[400px] flex flex-col items-center justify-center text-center space-y-4">
        <Lock className="h-16 w-16 text-gray-400" />
        <h3 className="text-2xl font-bold text-gray-600 dark:text-gray-400">Contenido Bloqueado</h3>
        <p className="text-lg text-muted-foreground max-w-md">
          Esta lección está disponible solo para estudiantes inscritos en el curso completo.
        </p>
        <p className="text-sm text-muted-foreground">
          Compra el curso para acceder a todo el contenido.
        </p>
      </div>
    );
  }

  if (isVideo) {
    return (
      <>
        {/* Reproductor de Video */}
        <div className="aspect-video bg-black relative">
          <ReactPlayer
            src={lesson.content_url} 
            ref={(videoElement) => {
              if (videoElement) {
                if (isPlaying) {
                  videoElement.play();
                } else {
                  videoElement.pause();
                }
              }
            }}
            autoPlay={isPlaying}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            width="100%"
            height="100%"
            className="position:absolute; top:0; left:0;"
          >
            Tu navegador no soporta la etiqueta de video.
          </ReactPlayer>
        </div>
        
        {/* Controles de Video */}
        <div className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">0:00 / {lesson.duration || '0:00'}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Volume2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Renderizado de Contenido No-Video
  const icon = lesson.type === 'quiz' ? <Star className="h-10 w-10 text-primary" /> : <ClipboardCheck className="h-10 w-10 text-primary" />;
  const title = lesson.type === 'quiz' ? 'Cuestionario' : 'Ejercicio';
  const description = lesson.description || `Esta lección es un ${title.toLowerCase()} que debes completar.`;

  return (
    <div className="p-10 bg-white dark:bg-gray-800 h-[400px] flex flex-col items-center justify-center text-center space-y-4">
      {icon}
      <h3 className="text-3xl font-bold">{title}: {lesson.title}</h3>
      <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
    </div>
  );
};

// --- Componente Principal ---

const CoursePreviewPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [courseRating, setCourseRating] = useState<CourseRating | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingComments, setLoadingComments] = useState(false);

  // Lógica de carga de datos
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    Promise.all([
      getCourseDetails(courseId).catch(() => null), // Puede fallar si no tiene acceso
      getCourseRating(courseId).catch(() => null),
    ])
      .then(([data, ratingData]) => {
        if (!data) {
          toast({ title: "Curso no encontrado", description: "No se pudo cargar la información del curso." });
          navigate("/cursos");
          return;
        }

        setCourseData(data);
        setCourseRating(ratingData);

        // Mostrar solo la primera lección
        const firstLesson = data.modules
          .flatMap(m => m.lessons)
          .sort((a, b) => a.order - b.order)[0];

        setCurrentLesson(firstLesson || null);
      })
      .catch((err) => {
        toast({ title: "Error", description: err.message || "Error al cargar el curso", variant: "destructive" });
        navigate("/cursos");
      })
      .finally(() => setLoading(false));
  }, [courseId, navigate, toast]);

  useEffect(() => {
    if (!currentLesson) return;

    setLoadingComments(true);

    getLessonComments(currentLesson.id)
      .then(setComments)
      .catch(() => setComments([]))
      .finally(() => setLoadingComments(false));
  }, [currentLesson]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (lesson: Lesson) => {
    // Solo permitir seleccionar la primera lección
    const allLessons = courseData?.modules.flatMap(m => m.lessons).sort((a, b) => a.order - b.order) || [];
    if (allLessons.indexOf(lesson) === 0) {
      setCurrentLesson(lesson);
      setIsPlaying(false);
    }
  };

  // Cálculo de progreso (simulado para preview)
  const getProgressPercentage = useMemo(() => {
    if (!courseData || courseData.total_lessons === 0) return 0;
    return 0; // En preview, siempre 0%
  }, [courseData]);

  const getModuleProgress = (module: Module) => {
    return 0; // En preview, siempre 0%
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.type === 'exercise') return <BookOpen className="h-4 w-4" />;
    if (lesson.type === 'quiz') return <Star className="h-4 w-4" />;
    return <MonitorPlay className="h-4 w-4" />;
  };

  const isLessonLocked = (lesson: Lesson) => {
    const allLessons = courseData?.modules.flatMap(m => m.lessons).sort((a, b) => a.order - b.order) || [];
    return allLessons.indexOf(lesson) > 0;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }

  if (!courseData || !currentLesson) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Curso no encontrado</h2>
          <p className="text-muted-foreground">El curso que buscas no existe o no está disponible.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{courseData.title}</h1>
                <p className="text-muted-foreground">Vista previa del curso</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Vista Previa</Badge>
              <Button onClick={() => navigate("/cursos")}>
                Comprar Curso
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar con módulos y lecciones */}
          <aside className="w-80 flex-shrink-0">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Contenido del Curso</h3>
                <Badge variant="outline" className="text-center">{courseData.total_lessons} lecciones</Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>Progreso</span>
                  <span>{getProgressPercentage}%</span>
                </div>
                <Progress value={getProgressPercentage} className="h-2" />
              </div>

              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {courseData.modules.map((module) => (
                    <div key={module.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-3 h-auto"
                        onClick={() => toggleModule(module.id)}
                      >
                        <span className="font-medium text-left">{module.title}</span>
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                      
                      {expandedModules.includes(module.id) && (
                        <div className="ml-4 space-y-1 mt-2">
                          {module.lessons.map((lesson) => (
                            <Button
                              key={lesson.id}
                              variant={currentLesson.id === lesson.id ? "secondary" : "ghost"}
                              className={`w-full justify-start p-3 h-auto ${
                                isLessonLocked(lesson) ? 'opacity-50' : ''
                              }`}
                              onClick={() => selectLesson(lesson)}
                              disabled={isLessonLocked(lesson)}
                            >
                              <div className="flex items-center space-x-3 w-full">
                                <div className="flex-shrink-0">
                                  {isLessonLocked(lesson) ? (
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                  ) : (
                                    getLessonIcon(lesson)
                                  )}
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-sm font-medium">{lesson.title}</div>
                                  <div className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {lesson.duration || 'N/A'}
                                  </div>
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </aside>

          {/* Contenido Principal */}
          <main className="flex-1">
            <div className="space-y-6">
              {/* Reproductor / Contenido de la Lección */}
              <Card className="overflow-hidden">
                <LessonContentRenderer
                  lesson={currentLesson}
                  isPlaying={isPlaying}
                  setIsPlaying={setIsPlaying}
                  isLocked={false} // La primera lección nunca está bloqueada
                />
              </Card>

              {/* Información de la Lección */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <p className="text-muted-foreground">{currentLesson.description}</p> 
                  </div>
                  <Badge variant="secondary">
                    Vista Previa
                  </Badge>
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Duración: {currentLesson.duration || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Tipo: {currentLesson.type.charAt(0).toUpperCase() + currentLesson.type.slice(1)}
                  </div>
                </div>
              </Card>

              {/* Sección de Comentarios y Calificación */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2" />
                  Calificación del Curso
                </h3>
                
                {courseRating && (
                  <div className="mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= courseRating.average
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {courseRating.average.toFixed(1)} ({courseRating.count} calificaciones)
                      </span>
                    </div>
                  </div>
                )}
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Comentarios ({comments.length})
                </h3>

                {/* Lista de Comentarios */}
                <div className="space-y-4">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="flex space-x-3 p-4 rounded-lg bg-muted/30">
                      <div className="text-2xl">👤</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.user_name}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(comment.created_at).toLocaleDateString()}
                          </span>
                          {comment.rating && (
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3 w-3 ${
                                    star <= comment.rating!
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length > 3 && (
                    <div className="text-center text-sm text-muted-foreground">
                      Y {comments.length - 3} comentarios más...
                    </div>
                  )}
                </div>
              </Card>

              {/* Call to Action */}
              <Card className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">¿Te gustó lo que viste?</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Accede a todo el contenido del curso, incluyendo todas las lecciones, ejercicios y soporte personalizado.
                  </p>
                  <Button size="lg" onClick={() => navigate("/cursos")}>
                    Comprar Curso Completo
                  </Button>
                </div>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CoursePreviewPage;