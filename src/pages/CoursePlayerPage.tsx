// src/pages/CoursePlayerPage.tsx

import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Play, 
  Pause, 
  RotateCcw,
  RotateCw,
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
  Trash2,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Quizz } from "@/components/Quiz";
// Importar los tipos actualizados
import { CourseDetails, getCourseDetails, Lesson, Module, Comment, getLessonComments, createLessonComment, deleteLessonComment, CourseRating, getCourseRating, rateCourse } from "@/api/courses";
import { getQuizByLesson, QuizResultDto } from "@/api/quiz";
import { API_URL } from "@/config/api";
import { checkLessonCompletion, checkCourseCompletion } from "@/lib/achievementSystem";
import { useAuth } from "@/context/AuthContext";
import { useGlobalError } from "@/context/ErrorContext";

// --- Componente de Renderizado de Contenido de la Lección ---
interface LessonContentRendererProps {
  lesson: Lesson;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  markComplete: () => void;
}

const LessonContentRenderer: React.FC<LessonContentRendererProps> = ({
  lesson,
  isPlaying,
  setIsPlaying,
  markComplete
}) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const isVideo = lesson.type === 'video' && lesson.content_url;

  // Sincronizar estado externo con el video nativo
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
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  useEffect(() => {
    // Cargar quiz si la lección es de tipo quiz
    if (lesson.type === 'quiz' && lesson.id) {
      loadQuiz();
    }
  }, [lesson.id, lesson.type]);

  const loadQuiz = async () => {
    try {
      setLoadingQuiz(true);
      const quizData = await getQuizByLesson(lesson.id);
      setQuiz(quizData);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar el quiz",
        variant: "destructive",
      });
    } finally {
      setLoadingQuiz(false);
    }
  };

  const handleQuizComplete = (result: QuizResultDto) => {
    if (result.passed) markComplete();
  };


  if (isVideo) {
    return (
      <div className="group relative aspect-video bg-black w-full overflow-hidden">
        {/* Etiqueta de Video Nativa (Peso 0 KB) */}
        <video
          ref={videoRef}
          src={lesson.content_url}
          className="w-full h-full"
          playsInline
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            markComplete(); // Marcar al terminar el video
          }}
        />

        {/* Overlay de Controles Personalizados (Aparece al hacer hover) */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-4 bg-black/40 p-4 rounded-full backdrop-blur-sm">
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => skip(-10)}>
              <RotateCcw className="h-6 w-6" />
            </Button>
            
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 h-12 w-12" onClick={togglePlay}>
              {isPlaying ? <Pause className="h-8 w-8 fill-current" /> : <Play className="h-8 w-8 fill-current" />}
            </Button>

            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => skip(10)}>
              <RotateCw className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Barra de progreso nativa (opcional, el navegador ya muestra una si pones controls) */}
        {/* Aquí podrías usar videoRef.current.currentTime para una barra propia */}
      </div>
    );
  }

  // --- Renderizado de Contenido de Quiz ---
  if (lesson.type === 'quiz') {
    if (loadingQuiz) {
      return (
        <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center text-center space-y-4">
          <div className="animate-spin">
            <Star className="h-10 w-10 text-primary" />
          </div>
          <p>Cargando quiz...</p>
        </div>
      );
    }

    if (lesson.type === 'quiz') {
    if (loadingQuiz) return (
      <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin"><Star className="h-10 w-10 text-primary" /></div>
        <p>Cargando quiz...</p>
      </div>
    );
    if (!quiz) return (
      <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center space-y-4">
        <Star className="h-10 w-10 text-red-500" />
        <h3 className="text-3xl font-bold">Quiz no disponible</h3>
      </div>
    );
    return <div className="p-6 bg-white dark:bg-gray-800 w-full"><Quizz quiz={quiz} onQuizComplete={handleQuizComplete} /></div>;
  }

  return (
    <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center text-center space-y-4">
      <ClipboardCheck className="h-10 w-10 text-primary" />
      <h3 className="text-3xl font-bold">Ejercicio: {lesson.title}</h3>
      <p className="text-lg text-muted-foreground max-w-2xl">{lesson.description || "Completa este ejercicio."}</p>
      <Button size="lg" onClick={() => lesson.content_url && window.open(lesson.content_url, '_blank')}>Ver Ejercicio</Button>
      {!lesson.completed && (
        <Button variant="secondary" size="sm" onClick={markComplete} className="mt-4">Marcar como Completado manualmente</Button>
      )}
    </div>
  );
};

  // --- Renderizado de Contenido No-Video (Exercise) ---
  const icon = <ClipboardCheck className="h-10 w-10 text-primary" />;
  const title = 'Ejercicio';
  const description = lesson.description || `Esta lección es un ejercicio que debes completar.`;

  useEffect(() => {
    if (lesson && lesson.type === "video") {
      setIsPlaying(false);
    }
  }, [lesson]);


  return (
    <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center text-center space-y-4">
      {icon}
      <h3 className="text-3xl font-bold">{title}: {lesson.title}</h3>
      <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
      
      {/* Botón de acción para el contenido */}
      <Button size="lg" onClick={() => lesson.content_url && window.open(lesson.content_url, '_blank')}>
        Ver Ejercicio
      </Button>

      {/* Botón de Completado (Fuera del flujo normal) */}
      {!lesson.completed && (
        <Button 
          variant="secondary" 
          size="sm"
          onClick={markComplete}
          className="mt-4"
        >
          Marcar como Completado manualmente
        </Button>
      )}
    </div>
  );
};

// --- Componente Principal ---

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { showError } = useGlobalError();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);
  const [newComment, setNewComment] = useState('');
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [courseRating, setCourseRating] = useState<CourseRating | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Lógica de carga de datos
useEffect(() => {
  if (!courseId) return;
  setLoading(true);
  Promise.all([
    getCourseDetails(courseId),
    getCourseRating(courseId).catch(() => null), // Rating opcional
  ])
    .then(([data, ratingData]) => {
      setCourseData(data);
      setCourseRating(ratingData);
      setUserRating(ratingData?.user_rating || null);

      // Buscar la primera lección no completada
      const firstIncompleteLesson = data.modules
        .flatMap(m => m.lessons)
        .sort((a, b) => a.order - b.order) // Asegurarse de respetar el orden
        .find(l => !l.completed);

      // Si todas las lecciones están completadas, usar la última
      const initialLesson =
        firstIncompleteLesson ||
        data.modules
          .flatMap(m => m.lessons)
          .sort((a, b) => a.order - b.order)
          .slice(-1)[0];

      setCurrentLesson(initialLesson || null); // null si no hay lecciones
    }
  )
    .catch((err) => {
      const errorMessage = err.message || "Error desconocido al obtener el curso.";
      if (errorMessage.includes("Permission denied") || errorMessage.includes("403")) {
        toast({ title: "Acceso denegado", description: "No tienes permiso para ver este curso." });
        navigate("/", { replace: true });
      } else {
        toast({ title: "Error", description: errorMessage, variant: "destructive" });
      }
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
    setCurrentLesson(lesson);
    // Reinicia la reproducción al cambiar de lección
    setIsPlaying(false); 
  };

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await fetch(`${API_URL}/api/courses/${courseId}/lessons/${currentLesson.id}/progress`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isCompleted: true,
          progress: 1.0, // 100% completado
        }),
      });

      if (!response.ok) {
        throw new Error('Error al marcar la lección como completada');
      }

      setCourseData(prevData => {
        if (!prevData) return null;
        let newCompletedLessons = prevData.completed_lessons;
        
        const updatedModules = prevData.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson => {
            if (lesson.id === lessonId && !lesson.completed) {
              newCompletedLessons++;
              return { ...lesson, completed: true };
            }
            return lesson;
          })
        }));

        // Calcular la siguiente lección usando el estado actualizado
        const allLessons = updatedModules
          .flatMap(m => m.lessons)
          .sort((a, b) => a.order - b.order);
        
        const currentIndex = allLessons.findIndex(l => l.id === lessonId);
        const nextLesson = allLessons[currentIndex + 1];

        // Cambiar a la siguiente lección si existe
        if (nextLesson) {
          setCurrentLesson(nextLesson);
          setIsPlaying(false); // Reiniciar reproducción
        }

        return { 
          ...prevData, 
          modules: updatedModules,
          completed_lessons: newCompletedLessons
        };
      });
    
    // Verificar logros
    await checkLessonCompletion(lessonId);
    
    // Verificar si el curso se completó
    const updatedData = courseData; // Usar el estado actualizado
    if (updatedData && updatedData.completed_lessons + 1 >= updatedData.total_lessons) {
      await checkCourseCompletion(courseId);
    }
    
    toast({
      title: "¡Lección completada!",
      description: "Has completado esta lección exitosamente.",
    });
    } catch (error) {
      showError(error, "No se pudo marcar la lección como completada");
    }
  };

  const addComment = async () => {
    if (!newComment.trim() || !courseId) return;

    setLoadingComments(true);
    try {
      const comment = await createLessonComment(currentLesson.id, newComment.trim());
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      toast({
        title: "Comentario agregado",
        description: "Tu comentario ha sido publicado.",
      });
    } catch (error) {
      showError(error, "No se pudo agregar el comentario");
    } finally {
      setLoadingComments(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!currentLesson) return;

    try {
      await deleteLessonComment(currentLesson.id, commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast({
        title: "Comentario eliminado",
        description: "Tu comentario ha sido eliminado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `No se pudo eliminar el comentario: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleRating = async (rating: number) => {
    if (!courseId) return;

    try {
      await rateCourse(courseId, rating);
      setUserRating(rating);
      // Recargar rating para actualizar el promedio
      const newRating = await getCourseRating(courseId);
      setCourseRating(newRating);
      toast({
        title: "Calificación enviada",
        description: "Gracias por calificar el curso.",
      });
    } catch (error) {
      showError(error, "No se pudo enviar la calificación");
    }
  };

  // Cálculo de progreso
  const getProgressPercentage = useMemo(() => {
    if (!courseData || courseData.total_lessons === 0) return 0;
    return Math.round((courseData.completed_lessons / courseData.total_lessons) * 100);
  }, [courseData]);

  const getModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    if (module.lessons.length === 0) return 0;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.type === 'exercise') return <BookOpen className="h-4 w-4" />;
    if (lesson.type === 'quiz') return <Star className="h-4 w-4" />;
    return <MonitorPlay className="h-4 w-4" />; // Ícono para video
  };

  // Manejo de estados de carga y datos
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="text-lg text-muted-foreground">Cargando contenido del curso...</p>
    </div>
  ); 
  if (!courseData) return 
  <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>;
  if (!currentLesson) return (
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Button 
                variant="ghost" 
                onClick={() => navigate(-1)}
                className="text-muted-foreground hover:text-primary flex-shrink-0 h-8 w-8 px-0 sm:h-10 sm:w-auto sm:px-2"
              >
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
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <div className="min-w-0 flex-1">
                <h1 className="font-semibold text-sm sm:text-lg truncate">{courseData.title}</h1>
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{courseData.instructor}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-between sm:justify-end">
              <div className="text-right text-xs sm:text-sm">
                <div className="font-medium whitespace-nowrap">
                  {courseData.completed_lessons}/{courseData.total_lessons}
                </div>
                <Progress value={getProgressPercentage} className="w-20 sm:w-32 h-1" />
              </div>
              <Badge variant="secondary" className="text-xs sm:text-sm py-1 px-2 whitespace-nowrap">
                {getProgressPercentage}%
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative min-h-screen bg-background">
        {/* Sidebar - Módulos y Lecciones */}
        <aside className={`fixed inset-y-0 left-0 z-40 w-64 sm:w-72 md:w-80 border-r border-border bg-background min-h-screen transform transition-transform duration-300 md:relative md:translate-x-0 md:block ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-3 sm:p-4 pt-20 md:pt-4 h-full flex flex-col">
            <h2 className="font-semibold mb-4 text-sm sm:text-base flex items-center">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              <span className="hidden sm:inline">Contenido del Curso</span>
              <span className="sm:hidden">Módulos</span>
            </h2>
            
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {courseData.modules.map((module) => (
                  <Card key={module.id} className="p-0 overflow-hidden">
                    <Button
                      variant="ghost"
                      className="w-full justify-between p-4 h-auto"
                      onClick={() => toggleModule(module.id)}
                    >
                      <div className="flex items-center space-x-3">
                        {expandedModules.includes(module.id) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div className="text-left">
                          <div className="font-medium text-sm">{module.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {module.lessons.length} lecciones • {getModuleProgress(module)}% completado
                          </div>
                        </div>
                      </div>
                      {/* Aquí se puede calcular si el módulo está completo */}
                      {getModuleProgress(module) === 100 && (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                    </Button>
                    
                    {expandedModules.includes(module.id) && (
                      <div className="border-t">
                        {module.lessons.map((lesson) => (
                          <Button
                            key={lesson.id}
                            variant="ghost"
                            className={`w-full justify-start p-4 h-auto border-l-2 rounded-none ${
                              currentLesson.id === lesson.id 
                                ? 'border-l-primary bg-primary/5' 
                                : 'border-l-transparent'
                            }`}
                            onClick={() => {
                              selectLesson(lesson);
                              setSidebarOpen(false); // Cerrar sidebar en móviles
                            }}
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className="flex-shrink-0">
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Circle className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-shrink-0">
                                {getLessonIcon(lesson)}
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
                  </Card>
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
        <main className="flex-1 min-h-screen overflow-hidden flex flex-col bg-background">
          <div className="p-2 sm:p-4 md:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
            {/* Reproductor / Contenido de la Lección */}
            <Card className="overflow-hidden">
              <LessonContentRenderer
                lesson={currentLesson}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                markComplete={() => markLessonComplete(currentLesson.id)}
              />
            </Card>

            {/* Información de la Lección */}
            <Card className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-2 sm:gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-2xl font-bold mb-2">{currentLesson.title}</h2>
                  {/* Usamos currentLesson.description, que viene del BE */}
                  <p className="text-xs sm:text-sm text-muted-foreground">{currentLesson.description}</p> 
                </div>
                <Badge variant={currentLesson.completed ? "default" : "secondary"} className="text-xs sm:text-sm w-fit whitespace-nowrap">
                  {currentLesson.completed ? "Completado" : "En progreso"}
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

            {/* Sección de Comentarios */}
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
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">Tu calificación:</span>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`h-5 w-5 ${
                              star <= (userRating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300 hover:text-yellow-400'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              <Separator className="my-4" />
              
              <h3 className="text-base sm:text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Comentarios y Discusión
              </h3>
              
              {/* Agregar Comentario */}
              <div className="mb-6">
                <Textarea
                  placeholder="Escribe tu comentario o pregunta sobre esta lección..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3 text-sm"
                />
                <Button onClick={addComment} disabled={!newComment.trim() || loadingComments} className="w-full sm:w-auto">
                  {loadingComments ? "Publicando..." : "Publicar Comentario"}
                </Button>
              </div>

              {/* Lista de Comentarios */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-2 sm:gap-3 p-2 sm:p-4 rounded-lg bg-muted/30">
                    <div className="text-lg sm:text-2xl flex-shrink-0">👤</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
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
                        {user && comment.user_id === user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteComment(comment.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursePlayerPage;