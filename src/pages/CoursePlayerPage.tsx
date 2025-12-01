// src/pages/CoursePlayerPage.tsx

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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
// Importar los tipos actualizados
import { CourseDetails, getCourseDetails, Lesson, Module } from "@/api/courses"; 
import VideoPlayer from "@/components/VideoPlayer";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

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
  const isVideo = lesson.type === 'video' && lesson.content_url;

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:https?:\/\/(?:www\.)?youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Si es un video de YouTube, generamos el URL del poster
  const getVideoPosterUrl = (url: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`; // Poster de YouTube
    }
    return '/placeholder-video.jpg'; // Fallback en caso de que no sea un video de YouTube
  };

  if (isVideo) {
    return (
      <>
        {/* Reproductor de Video (simple iframe o <video>) */}
        <div className="aspect-video bg-black relative">
          <ReactPlayer
            src={lesson.content_url} 
            ref={(videoElement) => {
              if (videoElement) {
                if (isPlaying) {
                  videoElement.play(); // Reproducir
                } else {
                  videoElement.pause(); // Pausar
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
        
        {/* Controles de Video (Opcional si usas los controles nativos del <video>) */}
        <div className="p-4 bg-muted/50">
          <div className="flex items-center justify-between">
            {/* Controles básicos para el ejemplo */}
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
              {/* Botón de Completado */}
              {!lesson.completed && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={markComplete}
                >
                  Marcar como Completado
                </Button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- Renderizado de Contenido No-Video (Quiz/Exercise) ---
  const icon = lesson.type === 'quiz' ? <Star className="h-10 w-10 text-primary" /> : <ClipboardCheck className="h-10 w-10 text-primary" />;
  const title = lesson.type === 'quiz' ? 'Cuestionario' : 'Ejercicio';
  const description = lesson.description || `Esta lección es un ${title.toLowerCase()} que debes completar.`;

  useEffect(() => {
    if (lesson && lesson.type === "video") {
      console.log("Video URL: ", lesson.content_url);
    }
  }, [lesson]);


  return (
    <div className="p-10 bg-white dark:bg-gray-800 h-[600px] flex flex-col items-center justify-center text-center space-y-4">
      {icon}
      <h3 className="text-3xl font-bold">{title}: {lesson.title}</h3>
      <p className="text-lg text-muted-foreground max-w-2xl">{description}</p>
      
      {/* Botón de acción para el contenido */}
      <Button size="lg" onClick={() => console.log(`Iniciar ${title}`)}>
        {lesson.type === 'quiz' ? 'Iniciar Cuestionario' : 'Ver Ejercicio'}
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
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);
  const [newComment, setNewComment] = useState('');
  const [courseData, setCourseData] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // ... (Comentarios de ejemplo) ...
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      user: 'María González',
      avatar: '👩',
      content: 'Excelente explicación sobre las escalas básicas. Me ayudó mucho a entender la digitación.',
      timestamp: 'hace 2 horas',
      likes: 12
    },
    {
      id: '2',
      user: 'Carlos Ruiz',
      avatar: '👨',
      content: '¿Podrían explicar un poco más sobre el acompañamiento en esta lección?',
      timestamp: 'hace 5 horas',
      likes: 3
    }
  ]);
  
  // Lógica de carga de datos
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);

    getCourseDetails(courseId)
      .then((data) => {
        setCourseData(data);
        // Selecciona la primera lección del primer módulo
        if (data.modules.length > 0 && data.modules[0].lessons.length > 0) {
          setCurrentLesson(data.modules[0].lessons[0]);
        }
      })
      .catch((err) => {
        // Manejo de errores (similar a tu código original)
        console.error(err);
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

  const markLessonComplete = (lessonId: string) => {
    // Aquí iría la llamada a la API para actualizar el estado en el backend
    // Por ahora, solo actualizamos el estado local para la demostración
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
      
      return { 
        ...prevData, 
        modules: updatedModules,
        completed_lessons: newCompletedLessons
      };
    });
    
    toast({
      title: "¡Lección completada!",
      description: "Has completado esta lección exitosamente.",
    });
  };

  const addComment = () => { /* ... lógica de comentarios ... */ };

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
  if (!courseData) return <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-gray-600">Oops! Page not found</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>;
  if (!currentLesson) return (
    <div className="p-10 text-center">
        <h2 className="text-2xl font-bold">{courseData.title}</h2>
        <p className="text-lg text-muted-foreground mt-2">Este curso no tiene lecciones para mostrar.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/cursos')}
              className="text-muted-foreground hover:text-primary"
            >
              ← Volver a Cursos
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="font-semibold text-lg">{courseData.title}</h1>
              <p className="text-sm text-muted-foreground">{courseData.instructor}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm font-medium">
                {courseData.completed_lessons} de {courseData.total_lessons} lecciones
              </div>
              <Progress value={getProgressPercentage} className="w-32" />
            </div>
            <Badge variant="secondary">
              {getProgressPercentage}% completado
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Módulos y Lecciones */}
        <aside className="w-80 border-r bg-muted/30 min-h-screen">
          <div className="p-4">
            <h2 className="font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Contenido del Curso
            </h2>
            
            <ScrollArea className="h-[calc(100vh-12rem)]">
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
                            onClick={() => selectLesson(lesson)}
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

        {/* Contenido Principal */}
        <main className="flex-1">
          <div className="p-6 space-y-6">
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
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                  {/* Usamos currentLesson.description, que viene del BE */}
                  <p className="text-muted-foreground">{currentLesson.description}</p> 
                </div>
                <Badge variant={currentLesson.completed ? "default" : "secondary"}>
                  {currentLesson.completed ? "Completado" : "En progreso"}
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

            {/* Sección de Comentarios */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2" />
                Comentarios y Discusión
              </h3>
              
              {/* Agregar Comentario */}
              <div className="mb-6">
                <Textarea
                  placeholder="Escribe tu comentario o pregunta sobre esta lección..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="mb-3"
                />
                <Button onClick={addComment} disabled={!newComment.trim()}>
                  Publicar Comentario
                </Button>
              </div>

              {/* Lista de Comentarios */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-4 rounded-lg bg-muted/30">
                    <div className="text-2xl">{comment.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{comment.user}</span>
                        <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{comment.content}</p>
                      <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          👍 {comment.likes}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          Responder
                        </Button>
                      </div>
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