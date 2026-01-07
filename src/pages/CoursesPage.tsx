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
  Search,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { fetchCourses_API } from "@/api/admin";
import { getCurrentUser } from "@/api/auth";
import { getUserSubscriptions, Subscription } from "@/api/subscriptions";
import { toast } from "sonner";
import PaypalCheckout from "@/components/Paypalbutton";
import AuthDialog from "@/components/AuthDialog";
import { API_URL } from "@/config/api";
import { CourseRating, getCourseRating } from "@/api/courses";

type UserState = "guest" | "logged-in";

const CoursesPage = () => {
  const navigate = useNavigate();
  const [userState, setUserState] = useState<UserState>("guest");
  const [courses, setCourses] = useState<any[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<Set<string>>(
    new Set()
  );
  const [loadingUser, setLoadingUser] = useState(true);
  const [courseToPay, setCourseToPay] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<
    "all" | "básico" | "premium"
  >("all");
  const [filterLevel, setFilterLevel] = useState<
    "all" | "básico" | "intermedio" | "avanzado"
  >("all");
  const [filterRating, setFilterRating] = useState<
    "all" | "4" | "3" | "2" | "1"
  >("all");
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [loadingAccess, setLoadingAccess] = useState(true);
  const [courseRatings, setCourseRatings] = useState<Record<string, CourseRating>>({});
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<Subscription | null>(null);

  const loadPurchasedCourses = async () => {
    const response = await fetch(`${API_URL}/api/mycourses`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("No se pudieron cargar los cursos comprados");
    }

    const data = await response.json();
    setPurchasedCourses(new Set(data.courseIds));
  };

  // Verificar autenticación
  useEffect(() => {
    const loadUserAndPurchases = async () => {
      try {
        const user = await getCurrentUser();

        if (!user) {
          setUserState("guest");
          return;
        }

        setUserState("logged-in");

        await loadPurchasedCourses();

        // Verificar si tiene suscripción activa o cancelada pero no expirada
        try {
          const subs = await getUserSubscriptions();
          const now = new Date();
          const hasValidSubscription = subs.some(sub => 
            sub.status === true || (sub.status === false && sub.end_time && new Date(sub.end_time) > now)
          );
          setHasActiveSubscription(hasValidSubscription);
          
          // Guardar información de suscripción para mostrar mensajes
          const activeSub = subs.find(sub => sub.status === true);
          const expiredCancelledSub = subs.find(sub => 
            sub.status === false && sub.end_time && new Date(sub.end_time) > now
          );
          setSubscriptionInfo(activeSub || expiredCancelledSub);
        } catch (error) {
          console.warn("Error checking subscriptions:", error);
          setHasActiveSubscription(false);
          setSubscriptionInfo(null);
        }
      } catch {
        setUserState("guest");
      } finally {
        setLoadingAccess(false);
      }
    };

    loadUserAndPurchases();
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

  useEffect(() => {
  const loadRatings = async () => {
    const ratings: Record<string, CourseRating> = {};

    await Promise.all(
      courses.map(async (course) => {
        try {
          const rating = await getCourseRating(course.id);
          ratings[course.id] = rating;
        } catch {
          ratings[course.id] = {
            average: 0,
            count: 0,
            user_rating: null,
          };
        }
      })
    );

    setCourseRatings(ratings);
  };

  if (courses.length > 0) {
    loadRatings();
  }
}, [courses]);

  const CourseCategoryBadge = ({ category }: { category: "premium" | "básico" }) => {
    if (category === "premium") {
      return (
        <div className="flex items-center space-x-1">
          <Star className="h-3 w-3 fill-current text-yellow-500" />
          <span>Premium</span>
        </div>
      );
    }
    
    return (
      <div className="flex items-center space-x-1">
        <Unlock className="h-3 w-3 text-primary" />
        <span>Básico</span>
      </div>
    );
  };


  const getActionButton = (course) => {
    if (loadingAccess) {
      return (
        <Button disabled className="w-full opacity-70">
          Cargando...
        </Button>
      );
    }

    if (userState === "guest") {
      return (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setAuthDialogOpen(true)}
        >
          <Lock className="h-4 w-4 mr-2" />
          Inicia sesión
        </Button>
      );
    }

    if (purchasedCourses.has(course.id) || hasActiveSubscription) {
      return (
        <Button
          variant="hero"
          className="w-full"
          onClick={() => navigate(`/curso/${course.id}`)}
        >
          <Play className="h-4 w-4 mr-2" />
          Ver curso
        </Button>
      );
    }

    return (
      <div className="space-y-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => navigate(`/curso/${course.id}/preview`)}
            >
              <Play className="h-4 w-4 mr-2" />
              Ver Vista Previa
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ve una muestra del curso antes de comprarlo</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="hero"
              className="w-full shadow-elegant"
              onClick={() => setCourseToPay(course)}
            >
              Comprar Curso
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Adquiere acceso completo a este curso premium</p>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  };

  const filteredCourses = courses
    .filter(
      (course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (course) => filterCategory === "all" || course.category === filterCategory
    )
    .filter((course) => filterLevel === "all" || course.level === filterLevel)
    .filter((course) => {
      if (filterRating === "all") return true;

      const rating = courseRatings[course.id]?.average ?? 0;
      return rating >= parseInt(filterRating);
    });

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
                  de la Academia
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Explora nuestros cursos gratuitos y premium
              </p>
              <div className="flex justify-center mb-8">
                <div className="flex flex-wrap gap-4 w-full max-w-4xl justify-center">
                  <div className="relative flex-1 min-w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar cursos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={filterCategory}
                        onValueChange={(value: "all" | "básico" | "premium") =>
                          setFilterCategory(value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="básico">Básico</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Filtrar por tipo de curso: Básico (gratuito) o Premium
                        (de pago)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={filterLevel}
                        onValueChange={(
                          value: "all" | "básico" | "intermedio" | "avanzado"
                        ) => setFilterLevel(value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Nivel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="básico">Básico</SelectItem>
                          <SelectItem value="intermedio">Intermedio</SelectItem>
                          <SelectItem value="avanzado">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Filtrar por nivel de dificultad del curso</p>
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Select
                        value={filterRating}
                        onValueChange={(value: "all" | "4" | "3" | "2" | "1") =>
                          setFilterRating(value)
                        }
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Estrellas" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas</SelectItem>
                          <SelectItem value="4">4+ ⭐</SelectItem>
                          <SelectItem value="3">3+ ⭐</SelectItem>
                          <SelectItem value="2">2+ ⭐</SelectItem>
                          <SelectItem value="1">1+ ⭐</SelectItem>
                        </SelectContent>
                      </Select>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Mostrar cursos con al menos esta calificación en
                        estrellas
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCourses.map((course) => {const category = course.category?.toLowerCase().trim(); return (
                <Card
                  key={course.id}
                  className="bg-gradient-card shadow-elegant border-primary/20 overflow-hidden group hover:shadow-warm transition-all duration-300 hover:scale-105 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={course.image || "/placeholder-course.jpg"}
                      alt={course.title}
                      className="w-full h-32 object-cover rounded-t-lg"
                    />
                  </div>

                  <div className="p-4 relative flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{course.level}</Badge>

                        {!(
                          course.level.toLowerCase() === "básico" &&
                          course.category !== "premium"
                        ) && (
                          <Badge
                            variant={
                              category === "premium"
                                ? "default"
                                : "outline"
                            }
                            className={
                              category === "premium"
                                ? "bg-gradient-accent text-white"
                                : ""
                            }
                          >
                            <CourseCategoryBadge category={category} />
                          </Badge>

                        )}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 fill-current text-yellow-500" />
                        <span>
                          {
                            courseRatings[course.id]
                            ? courseRatings[course.id].average.toFixed(1)
                            : "0.0"
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({courseRatings[course.id]?.count ?? 0})
                        </span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">
                        {course.title}
                      </h3>

                      <p className="text-muted-foreground mb-3 leading-relaxed text-sm line-clamp-3">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-3 w-3" />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{course.students} estudiantes</span>
                        </div>
                      </div>

                      {/* Course Features */}
                      <div className="space-y-2 mb-4">
                        {course.features
                          .slice(0, 2)
                          .map((feature: string, index: number) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {feature}
                              </span>
                            </div>
                          ))}
                        {course.features.length > 2 && (
                          <p className="text-xs text-muted-foreground pl-5">
                            +{course.features.length - 2} características más
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-auto space-y-3">
                      {getActionButton(course)}
                    </div>
                  </div>
                </Card>
              )})}
              {courseToPay && (
                <PaypalCheckout
                  course={courseToPay}
                  onClose={() => setCourseToPay(null)}
                  onSuccess={async () => {
                    try {
                      await loadPurchasedCourses();

                      toast.success("¡Curso comprado con éxito! 🎉");
                    } finally {
                      setCourseToPay(null);
                    }
                  }}
                />
              )}
              <AuthDialog
                open={authDialogOpen}
                onOpenChange={setAuthDialogOpen}
                onLogin={() => {
                  setUserState("logged-in");
                  setAuthDialogOpen(false);
                  toast.success(
                    "¡Bienvenido! Has iniciado sesión correctamente."
                  );
                }}
              />
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
                    onClick={() => setAuthDialogOpen(true)}
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
