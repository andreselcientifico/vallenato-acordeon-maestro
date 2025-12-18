import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock,
  Play,
  CheckCircle,
  Clock,
  Users,
  Star,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchCourses_API } from "@/api/admin"; // Asegúrate de que la ruta sea correcta
import { getCurrentUser } from "@/api/auth";
import { toast } from "sonner";

// Simulando estados de usuario
type UserState = "guest" | "logged-in";
type CourseType = "basic" | "premium";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<UserState>("guest");
  const [courses, setCourses] = useState<any[]>([]); // Cursos que vamos a cargar
  const [loadingUser, setLoadingUser] = useState(true);

  // Verificar autenticación
  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const user = await getCurrentUser();
        setUserState(user ? "logged-in" : "guest");
      } catch {
        setUserState("guest");
      } finally {
        setLoadingUser(false);
      }
    };

    checkUserAuthentication();
  }, []);

  // Cargar cursos
  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await fetchCourses_API();
        setCourses(coursesData);
      } catch (error) {
        toast.error(`Error al cargar los cursos. ${(error as Error).message}`);
      }
    };

    loadCourses();
  }, []);

  const getActionButton = (course: any) => {
    if (userState === "guest") {
      return (
        <Button
          variant="outline"
          className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          onClick={() => navigate("/#inicio")} // 🔥 YA NO CAMBIA EL ESTADO
        >
          <Lock className="h-4 w-4 mr-2" />
          Inicia Sesión para Acceder
        </Button>
      );
    }

    return (
      <Button
        variant="hero"
        className="w-full shadow-elegant"
        size="lg"
        onClick={() => navigate(`/curso/${course.id}`)}
      >
        <Play className="h-4 w-4 mr-2" />
        Comenzar Curso
      </Button>
    );
  };

  if (loadingUser) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="text-lg text-muted-foreground">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header Navigation */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary mb-4"
          >
            ← Volver
          </Button>
        </div>

        <main className="pb-20">
          <div className="container mx-auto px-4">
            {/* Header Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                <span className="text-primary">Cursos</span>{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">
                  de Acordeón
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Explora nuestros cursos gratuitos y premium de acordeón
                vallenato
              </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Card
                  key={course.id}
                  className="bg-gradient-card shadow-elegant border-primary/20 overflow-hidden group hover:shadow-warm transition-all duration-300 hover:scale-105"
                >
                  <div className={`h-2 bg-${course.color}`}></div>

                  <div className="p-8 relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className={`bg-${course.color}/10 text-${course.color} border-${course.color}/20`}
                        >
                          {course.level} {/* Básico, Intermedio, Avanzado */}
                        </Badge>

                        {!(
                          course.level.toLowerCase() === "básico" &&
                          course.type !== "premium"
                        ) && (
                          <Badge
                            variant={
                              course.type === "premium" ? "default" : "outline"
                            }
                            className={
                              course.type === "premium"
                                ? "bg-gradient-accent text-white"
                                : ""
                            }
                          >
                            {course.type === "premium"
                              ? "⭐ Premium"
                              : "🆓 Básico"}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-primary mb-3">
                      {course.title}
                    </h3>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between mb-6 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{course.students} estudiantes</span>
                      </div>
                    </div>

                    {/* Course Features */}
                    <div className="space-y-3 mb-8">
                      {course.features
                        .slice(0, 3)
                        .map((feature: string, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3"
                          >
                            <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {feature}
                            </span>
                          </div>
                        ))}
                      {course.features.length > 3 && (
                        <p className="text-xs text-muted-foreground pl-7">
                          +{course.features.length - 3} características más
                        </p>
                      )}
                    </div>

                    {/* Progress for logged-in users */}
                    {userState !== "guest" && (
                      <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">
                            Progreso
                          </span>
                          <span className="text-primary font-medium">
                            {course.type === "basic"
                              ? Math.floor(Math.random() * 50) + 20
                              : Math.floor(Math.random() * 30) + 5}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                course.type === "basic"
                                  ? Math.floor(Math.random() * 50) + 20
                                  : Math.floor(Math.random() * 30) + 5
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {getActionButton(course)}

                      {userState !== "guest" && (
                        <Button
                          variant="outline"
                          className="w-full border-primary/30 text-muted-foreground hover:bg-muted"
                        >
                          Ver Detalles del Curso
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            {userState === "guest" && (
              <div className="text-center mt-16">
                <Card className="bg-gradient-accent text-white p-8 max-w-2xl mx-auto shadow-elegant">
                  <h3 className="text-2xl font-bold mb-4">
                    ¿Listo para comenzar tu journey musical?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Únete a nuestra academia y accede a cursos básicos gratuitos
                    y contenido premium de acordeón vallenato.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90"
                    onClick={() => navigate("/#inicio")}
                  >
                    Crear Cuenta Gratis
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CoursesPage;
