// src/pages/CoursePreviewPage.tsx

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Clock, 
  BookOpen, 
  MessageCircle,
  Star,
  ChevronDown,
  ChevronRight,
  MonitorPlay,
  ClipboardCheck,
  Lock,
  Menu,
  X,
  RotateCcw,
  RotateCw,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
// Importar los tipos actualizados
import { CourseDetails, Lesson, Module, Comment, getLessonComments, CourseRating, getCourseRating, getCourseDetails_preview } from "@/api/courses";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const isVideo = lesson.type === 'video' && lesson.content_url;

  // Control nativo del video
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.play().catch(() => {});
      else videoRef.current.pause();
    }
  }, [isPlaying, lesson.content_url]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) videoRef.current.currentTime += seconds;
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
      <div className="group relative aspect-video bg-black w-full overflow-hidden">
        <video
          ref={videoRef}
          src={lesson.content_url}
          className="w-full h-full"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
        
        {/* Controles simples para Preview */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-4 bg-black/40 p-3 rounded-full backdrop-blur-sm">
            <Button variant="ghost" size="icon" className="text-white h-10 w-10" onClick={() => skip(-10)}>
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white h-12 w-12" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current" />}
            </Button>
            <Button variant="ghost" size="icon" className="text-white h-10 w-10" onClick={() => skip(10)}>
              <RotateCw className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const icon = lesson.type === 'quiz' ? <Star className="h-10 w-10 text-primary" /> : <ClipboardCheck className="h-10 w-10 text-primary" />;
  return (
    <div className="p-10 bg-white dark:bg-gray-800 h-[400px] flex flex-col items-center justify-center text-center space-y-4">
      {icon}
      <h3 className="text-3xl font-bold">{lesson.title}</h3>
      <p className="text-lg text-muted-foreground max-w-2xl">{lesson.description || "Ejercicio de práctica."}</p>
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lógica de carga de datos
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    Promise.all([
      getCourseDetails_preview(courseId).catch(() => null), // Puede fallar si no tiene acceso
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
      <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-primary"
            >
              ← Volver
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold text-lg">{courseData.title}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">
                {courseData.completed_lessons} de {courseData.total_lessons} lecciones
                <Progress value={getProgressPercentage} className="w-32" />
              </div>
            </div>
            <Badge variant="secondary">
              {getProgressPercentage}% completado
            </Badge>
          </div>
        </div>
      </header>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
        <h2 className="text-2xl font-bold">{courseData.title}</h2>
        <p className="text-lg text-muted-foreground mt-2">Este curso no tiene lecciones para mostrar.</p>
      </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 relative">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-wrap">
              <Button variant="ghost" onClick={() => navigate(-1)} className="flex-shrink-0 h-8 w-8 px-0 sm:h-10 sm:w-auto sm:px-2">
                <span className="hidden sm:inline">← Volver</span>
                <span className="sm:hidden">←</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden flex-shrink-0 h-8 w-8 p-0"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold truncate">{courseData.title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Vista previa del curso</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <Badge variant="secondary" className="text-xs sm:text-sm">Vista Previa</Badge>
              <Button onClick={() => navigate("/cursos")} className="text-xs sm:text-sm w-full sm:w-auto">
                Comprar Curso
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 mt-0">
        <div className="flex relative gap-3 sm:gap-6 min-h-[calc(100vh-80px)]">
          {/* Sidebar con módulos y lecciones */}
          <aside className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 md:w-80 bg-background border-r border-border flex-shrink-0 transform transition-transform duration-300 md:relative md:translate-x-0 md:block mt-[60px] md:mt-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="p-3 sm:p-4 h-full md:h-auto bg-background border-r border-border">
              <div className="flex flex-col gap-2 sm:gap-3 mb-4">
                <h3 className="font-semibold text-sm sm:text-base">Contenido del Curso</h3>
                <Badge variant="outline" className="text-center text-xs sm:text-sm">{courseData.total_lessons} lecciones</Badge>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                  <span>Progreso</span>
                  <span>{getProgressPercentage}%</span>
                </div>
                <Progress value={getProgressPercentage} className="h-2" />
              </div>

              <ScrollArea className="h-[calc(100vh-18rem)] md:h-[600px]">
                <div className="space-y-2">
                  {courseData.modules.map((module) => (
                    <div key={module.id}>
                      <Button
                        variant="ghost"
                        className="w-full justify-between p-2 sm:p-3 h-auto text-xs sm:text-sm"
                        onClick={() => toggleModule(module.id)}
                      >
                        <span className="font-medium text-left truncate">{module.title}</span>
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        ) : (
                          <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        )}
                      </Button>
                      
                      {expandedModules.includes(module.id) && (
                        <div className="ml-3 sm:ml-4 space-y-1 mt-2">
                          {module.lessons.map((lesson) => (
                            <Button
                              key={lesson.id}
                              variant={currentLesson.id === lesson.id ? "secondary" : "ghost"}
                              className={`w-full justify-start p-2 sm:p-3 h-auto text-xs sm:text-sm ${
                                isLessonLocked(lesson) ? 'opacity-50' : ''
                              }`}
                              onClick={() => {
                                selectLesson(lesson);
                                setSidebarOpen(false);
                              }}
                              disabled={isLessonLocked(lesson)}
                            >
                              <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                                <div className="flex-shrink-0">
                                  {isLessonLocked(lesson) ? (
                                    <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                                  ) : (
                                    getLessonIcon(lesson)
                                  )}
                                </div>
                                <div className="flex-1 text-left min-w-0">
                                  <div className="text-xs sm:text-sm font-medium truncate">{lesson.title}</div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-2 w-2 sm:h-3 sm:w-3 flex-shrink-0" />
                                    <span className="truncate">{lesson.duration || 'N/A'}</span>
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
            </div>
          </aside>

          {/* Overlay para móviles */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 z-30 bg-black/50 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Contenido Principal */}
          <main className="flex-1 min-h-screen overflow-hidden">
            <div className="space-y-3 sm:space-y-6 overflow-y-auto h-[calc(100vh-130px)]">
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
              <Card className="p-3 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2 sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-2xl font-bold mb-2">{currentLesson.title}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">{currentLesson.description}</p> 
                  </div>
                  <Badge variant="secondary" className="text-xs sm:text-sm w-fit whitespace-nowrap">
                    Vista Previa
                  </Badge>
                </div>
                
                <div className="flex flex-col gap-2 sm:gap-6 text-xs sm:text-sm text-muted-foreground">
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
              <Card className="p-3 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
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
                
                <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Comentarios ({comments.length})
                </h3>

                {/* Lista de Comentarios */}
                <div className="space-y-3 sm:space-y-4">
                  {comments.slice(0, 3).map((comment) => (
                    <div key={comment.id} className="flex gap-2 sm:gap-3 p-2 sm:p-4 rounded-lg bg-muted/30">
                      <div className="text-lg sm:text-2xl flex-shrink-0">👤</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                          <span className="font-medium text-xs sm:text-sm truncate">{comment.user_name}</span>
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
                        <p className="text-xs sm:text-sm text-muted-foreground break-words">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                  {comments.length > 3 && (
                    <div className="text-center text-xs sm:text-sm text-muted-foreground">
                      Y {comments.length - 3} comentarios más...
                    </div>
                  )}
                </div>
              </Card>

              {/* Call to Action */}
              <Card className="p-4 sm:p-8 bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
                <div className="text-center">
                  <h3 className="text-lg sm:text-2xl font-bold mb-3 sm:mb-4">¿Te gustó lo que viste?</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto">
                    Accede a todo el contenido del curso, incluyendo todas las lecciones, ejercicios y soporte personalizado.
                  </p>
                  <Button size="lg" onClick={() => navigate("/cursos")} className="w-full sm:w-auto">
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