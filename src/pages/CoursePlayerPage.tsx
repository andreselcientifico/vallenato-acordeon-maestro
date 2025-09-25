import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  User,
  Send,
  Star,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'exercise' | 'quiz';
  videoUrl?: string;
  description?: string;
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  completed: boolean;
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

const CoursePlayerPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['1']);
  const [newComment, setNewComment] = useState('');
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

  // Data simulada del curso
  const courseData = {
    id: courseId,
    title: "Fundamentos del Acordeón",
    instructor: "Maestro Vallenato",
    totalLessons: 24,
    completedLessons: 8,
    totalDuration: "8 semanas",
    modules: [
      {
        id: '1',
        title: 'Introducción al Acordeón',
        completed: true,
        lessons: [
          {
            id: '1-1',
            title: 'Historia del Vallenato',
            duration: '15:30',
            completed: true,
            type: 'video' as const,
            videoUrl: 'https://example.com/video1',
            description: 'Conoce los orígenes del vallenato y su evolución a través de la historia.'
          },
          {
            id: '1-2',
            title: 'Partes del Acordeón',
            duration: '12:45',
            completed: true,
            type: 'video' as const,
            videoUrl: 'https://example.com/video2',
            description: 'Aprende las diferentes partes del acordeón y su funcionamiento.'
          },
          {
            id: '1-3',
            title: 'Ejercicio: Identificar Partes',
            duration: '10:00',
            completed: false,
            type: 'exercise' as const,
            description: 'Ejercicio práctico para identificar las partes del acordeón.'
          }
        ]
      },
      {
        id: '2',
        title: 'Postura y Técnica Básica',
        completed: false,
        lessons: [
          {
            id: '2-1',
            title: 'Postura Correcta',
            duration: '18:20',
            completed: false,
            type: 'video' as const,
            videoUrl: 'https://example.com/video3',
            description: 'Aprende la postura correcta para tocar el acordeón.'
          },
          {
            id: '2-2',
            title: 'Digitación Básica',
            duration: '22:15',
            completed: false,
            type: 'video' as const,
            videoUrl: 'https://example.com/video4',
            description: 'Técnicas fundamentales de digitación para principiantes.'
          },
          {
            id: '2-3',
            title: 'Quiz: Técnica Básica',
            duration: '5:00',
            completed: false,
            type: 'quiz' as const,
            description: 'Evaluación de conocimientos sobre técnica básica.'
          }
        ]
      },
      {
        id: '3',
        title: 'Primeras Melodías',
        completed: false,
        lessons: [
          {
            id: '3-1',
            title: 'Escalas Fundamentales',
            duration: '25:10',
            completed: false,
            type: 'video' as const,
            videoUrl: 'https://example.com/video5',
            description: 'Aprende las escalas más importantes del vallenato.'
          },
          {
            id: '3-2',
            title: 'Primera Canción: La Gota Fría',
            duration: '30:45',
            completed: false,
            type: 'video' as const,
            videoUrl: 'https://example.com/video6',
            description: 'Aprende a tocar tu primera canción completa de vallenato.'
          }
        ]
      }
    ] as Module[]
  };

  useEffect(() => {
    // Establecer la primera lección como actual
    if (courseData.modules.length > 0 && !currentLesson) {
      setCurrentLesson(courseData.modules[0].lessons[0]);
    }
  }, [currentLesson, courseData.modules]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const selectLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setIsPlaying(false);
  };

  const markLessonComplete = (lessonId: string) => {
    toast({
      title: "¡Lección completada!",
      description: "Has completado esta lección exitosamente.",
    });
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: 'Usuario Actual',
        avatar: '🎵',
        content: newComment,
        timestamp: 'ahora',
        likes: 0
      };
      setComments([comment, ...comments]);
      setNewComment('');
      toast({
        title: "Comentario añadido",
        description: "Tu comentario ha sido publicado exitosamente.",
      });
    }
  };

  const getProgressPercentage = () => {
    return Math.round((courseData.completedLessons / courseData.totalLessons) * 100);
  };

  const getModuleProgress = (module: Module) => {
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  };

  const getLessonIcon = (lesson: Lesson) => {
    if (lesson.type === 'exercise') return <BookOpen className="h-4 w-4" />;
    if (lesson.type === 'quiz') return <Star className="h-4 w-4" />;
    return <Play className="h-4 w-4" />;
  };

  if (!currentLesson) return <div>Cargando...</div>;

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
                {courseData.completedLessons} de {courseData.totalLessons} lecciones
              </div>
              <Progress value={getProgressPercentage()} className="w-32" />
            </div>
            <Badge variant="secondary">
              {getProgressPercentage()}% completado
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
                      {module.completed && (
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
                              currentLesson?.id === lesson.id 
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
                                  {lesson.duration}
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
            {/* Video Player */}
            <Card className="overflow-hidden">
              <div className="aspect-video bg-black relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl mb-4">🎵</div>
                    <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                    <p className="text-muted-foreground mb-4">{currentLesson.description}</p>
                    <Button 
                      size="lg" 
                      className="bg-white/20 hover:bg-white/30"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="h-6 w-6 mr-2" />
                      ) : (
                        <Play className="h-6 w-6 mr-2" />
                      )}
                      {isPlaying ? 'Pausar' : 'Reproducir'}
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Video Controls */}
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
                    <span className="text-sm text-muted-foreground">0:00 / {currentLesson.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                    {!currentLesson.completed && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => markLessonComplete(currentLesson.id)}
                      >
                        Marcar como Completado
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Información de la Lección */}
            <Card className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{currentLesson.title}</h2>
                  <p className="text-muted-foreground">{currentLesson.description}</p>
                </div>
                <Badge variant={currentLesson.completed ? "default" : "secondary"}>
                  {currentLesson.completed ? "Completado" : "En progreso"}
                </Badge>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Duración: {currentLesson.duration}
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4 mr-1" />
                  Tipo: {currentLesson.type === 'video' ? 'Video' : currentLesson.type === 'exercise' ? 'Ejercicio' : 'Quiz'}
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
                  <Send className="h-4 w-4 mr-2" />
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