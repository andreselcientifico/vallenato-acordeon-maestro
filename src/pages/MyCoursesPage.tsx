import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Play,
  ArrowLeft,
  CheckCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronRight,
  MonitorPlay,
  Star as StarIcon,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getUserProfile } from "@/api/user";
import { getCourseDetails } from "@/api/courses";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MyCoursesPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(new Set());

  const toggleCourseExpansion = (courseId: string) => {
    const newSet = new Set(expandedCourses);
    if (newSet.has(courseId)) {
      newSet.delete(courseId);
    } else {
      newSet.add(courseId);
    }
    setExpandedCourses(newSet);
  };

  const filteredCourses = coursesData.filter(course =>
    (course.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getModuleProgress = (module: any) => {
    const completedLessons = module.lessons?.filter((lesson: any) => lesson.completed).length || 0;
    const totalLessons = module.lessons?.length || 0;
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  const getLessonIcon = (lesson: any) => {
    if (lesson.type === 'exercise') return <BookOpen className="h-4 w-4" />;
    if (lesson.type === 'quiz') return <StarIcon className="h-4 w-4" />;
    return <MonitorPlay className="h-4 w-4" />;
  };

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await getUserProfile();
        const basicCourses = res.data.courses || [];

        // Cargar detalles completos de cada curso para obtener progreso real
        const detailedCourses = await Promise.all(
          basicCourses.map(async (course: any) => {
            try {
              const details = await getCourseDetails(course.id);
              return {
                ...course,
                modules: details.modules || [],
                totalLessons: details.total_lessons || 0,
                completedLessons: details.completed_lessons || 0,
                progress: details.total_lessons > 0 ? Math.round((details.completed_lessons / details.total_lessons) * 100) : 0,
              };
            } catch (error) {
              // Si falla cargar detalles, usar datos básicos
              console.warn(`Failed to load details for course ${course.id}:`, error);
              return course;
            }
          })
        );

        setCoursesData(detailedCourses);
      } catch (err) {
        toast({
          title: "Error",
          description: "No se pudieron cargar tus cursos.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchCourses();
    } else {
      navigate("/login");
    }
  }, [user, navigate, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completado":
        return (
          <Badge variant="default" className="bg-green-500 text-white">
            <CheckCircle className="h-3 w-3 mr-1" />
            Completado
          </Badge>
        );
      case "en_progreso":
        return (
          <Badge variant="secondary" className="bg-blue-500 text-white">
            <Clock className="h-3 w-3 mr-1" />
            En Progreso
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "premium":
        return (
          <Badge variant="default" className="bg-yellow-500 text-white">
            ⭐ Premium
          </Badge>
        );
      case "básico":
        return (
          <Badge variant="outline">
            🆓 Básico
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {type}
          </Badge>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="text-lg text-muted-foreground">Cargando tus cursos…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            <span className="text-primary">Mis</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Cursos
            </span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Continúa aprendiendo y revisa tu progreso en los cursos adquiridos.
          </p>
        </div>

        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar mis cursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredCourses.length === 0 ? (
            <Card className="p-8 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {coursesData.length === 0 ? "No tienes cursos aún" : "No se encontraron cursos"}
              </h3>
              <p className="text-muted-foreground mb-4">
                {coursesData.length === 0
                  ? "Explora nuestros cursos y comienza tu aprendizaje."
                  : "Intenta con otra búsqueda."
                }
              </p>
              <Button onClick={() => navigate("/cursos")}>
                Explorar Cursos
              </Button>
            </Card>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Tus Cursos ({filteredCourses.length})
                </h2>
              </div>

              <div className="space-y-6">
                {filteredCourses.map((course) => {
                  const isExpanded = expandedCourses.has(course.id);
                  return (
                    <Card key={course.id} className="overflow-hidden hover:shadow-elegant transition-all">
                      <div className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          {/* Course Image */}
                          <div className="flex-shrink-0">
                            {course.image ? (
                              <img
                                src={course.image}
                                alt={course.name || 'Curso'}
                                className="w-32 h-32 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
                                <BookOpen className="h-8 w-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                              <div className="mb-2 sm:mb-0">
                                <h3 className="text-xl font-bold text-primary mb-2">
                                  {course.name || 'Curso sin nombre'}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2">
                                  {getStatusBadge(course.status)}
                                  {getTypeBadge(course.type)}
                                </div>
                              </div>
                              <Button
                                variant="hero"
                                onClick={() => navigate(`/curso/${course.id}`)}
                                className="w-full sm:w-auto"
                              >
                                <Play className="h-4 w-4 mr-2" />
                                {course.status === "completado" ? "Revisar" : "Continuar"}
                              </Button>
                            </div>

                            {/* Progress */}
                            <div className="space-y-3 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progreso General</span>
                                <span className="font-medium">
                                  {course.completedLessons || 0}/{course.totalLessons || 0} lecciones
                                </span>
                              </div>
                              <Progress value={course.progress || 0} className="h-3" />
                              <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{course.progress || 0}% completado</span>
                                <span>Último acceso: {course.lastAccessed || 'N/A'}</span>
                              </div>
                            </div>

                            {/* Expandable Modules */}
                            <div>
                              <Button
                                variant="ghost"
                                onClick={() => toggleCourseExpansion(course.id)}
                                className="w-full justify-between p-0 h-auto"
                              >
                                <span className="text-sm font-medium">
                                  Ver módulos y lecciones ({course.modules?.length || 0} módulos)
                                </span>
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                              </Button>
                              {isExpanded && (
                                <div className="mt-4 space-y-4">
                                  {course.modules?.map((module: any, mIndex: number) => (
                                    <Card key={mIndex} className="border-l-4 border-l-primary/50">
                                      <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="font-semibold text-primary">{module.title || 'Módulo sin título'}</h4>
                                          <Badge variant="outline">
                                            {getModuleProgress(module)}% completado
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          {module.lessons?.map((lesson: any, lIndex: number) => (
                                            <div key={lIndex} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                                              {lesson.completed ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                              ) : (
                                                <Circle className="h-4 w-4 text-muted-foreground" />
                                              )}
                                              {getLessonIcon(lesson)}
                                              <span className={`text-sm ${lesson.completed ? 'line-through text-muted-foreground' : ''}`}>
                                                {lesson.title || 'Lección sin título'}
                                              </span>
                                              <Badge variant="secondary" className="ml-auto text-xs">
                                                {lesson.duration || 'N/A'}
                                              </Badge>
                                            </div>
                                          )) || []}
                                        </div>
                                      </div>
                                    </Card>
                                  )) || []}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <div className="text-center mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate("/cursos")}
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  Explorar Más Cursos
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCoursesPage;