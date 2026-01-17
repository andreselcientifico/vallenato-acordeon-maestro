import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Camera,
  Trophy,
  Clock,
  BookOpen,
  Settings,
  Bell,
  Shield,
  LogOut,
  Play,
  CheckCircle,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getUserProfile, updateUserProfile, updateNotificationSettings } from "@/api/user";
import { getCourseDetails } from "@/api/courses";
import { getUserSubscriptions, cancelSubscription, Subscription } from "@/api/subscriptions";
import { fetchCourses_API } from "@/api/admin";
import { useAuth } from "@/context/AuthContext";
import { AvatarSelector } from "@/components/AvatarSelector";
import { getRandomAvatar } from "@/lib/avatars";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [notifications, setNotifications] = useState({
    emailNotifications: false,
    pushNotifications: false,
    courseReminders: false,
    newContent: false,
  });
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserProfile();
        setUserInfo(res.data.user);
        setSelectedAvatar(res.data.user.avatar || getRandomAvatar());

        // Cargar detalles completos de cada curso para obtener progreso real
        const basicCourses = res.data.courses || [];
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
        setAchievements(res.data.achievements || []);
        setNotifications({
          emailNotifications: res.data.user.email_notifications ?? true,
          pushNotifications: res.data.user.push_notifications ?? false,
          courseReminders: res.data.user.course_reminders ?? true,
          newContent: res.data.user.new_content ?? true,
        });

        // Cargar suscripciones y determinar cursos disponibles
        try {
          const subs = await getUserSubscriptions();
          setSubscriptions(subs);

          // Verificar si el usuario tiene una suscripción válida (activa o cancelada pero no expirada)
          const now = new Date();
          const hasValidSubscription = subs.some(sub => 
            sub.status === true || (sub.status === false && sub.end_time && new Date(sub.end_time) > now)
          );

          let allAvailableCourses = [];

          if (hasValidSubscription) {
            // Si tiene suscripción válida, cargar todos los cursos disponibles
            try {
              const allCourses = await fetchCourses_API();
              allAvailableCourses = allCourses;
            } catch (error) {
              console.warn("Error loading all courses:", error);
              allAvailableCourses = basicCourses; // Fallback a cursos asignados
            }
          } else {
            // Si no tiene suscripción válida, solo mostrar cursos asignados
            allAvailableCourses = basicCourses;
          }

          // Procesar cursos con detalles
          const detailedCourses = await Promise.all(
            allAvailableCourses.map(async (course: any) => {
              // Verificar si este curso ya está asignado al usuario
              const userCourse = basicCourses.find((uc: any) => uc.id === course.id);
              
              if (userCourse) {
                // Curso asignado: cargar detalles completos con progreso
                try {
                  const details = await getCourseDetails(course.id);
                  return {
                    ...course,
                    modules: details.modules || [],
                    totalLessons: details.total_lessons || 0,
                    completedLessons: details.completed_lessons || 0,
                    progress: details.total_lessons > 0 ? Math.round((details.completed_lessons / details.total_lessons) * 100) : 0,
                    isAssigned: true,
                    status: userCourse.status || 'en_progreso',
                    lastAccessed: userCourse.lastAccessed || 'Nunca',
                  };
                } catch (error) {
                  console.warn(`Failed to load details for assigned course ${course.id}:`, error);
                  return {
                    ...course,
                    isAssigned: true,
                    status: userCourse.status || 'en_progreso',
                    progress: 0,
                    totalLessons: 0,
                    completedLessons: 0,
                    lastAccessed: userCourse.lastAccessed || 'Nunca',
                  };
                }
              } else {
                // Curso disponible por suscripción pero no asignado
                return {
                  ...course,
                  isAssigned: false,
                  status: 'disponible',
                  progress: 0,
                  totalLessons: 0,
                  completedLessons: 0,
                  lastAccessed: 'Nunca',
                };
              }
            })
          );

          setCoursesData(detailedCourses);
        } catch (error) {
          console.warn("Error loading subscriptions:", error);
          setSubscriptions([]);
          // Fallback: solo cursos asignados
          setCoursesData(detailedCourses);
        }
      } catch (err) {
        toast({
          title: "Sesión no válida",
          description: "Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/NotFound");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate, toast]);

  const handleSave = async () => {
    try {
      const updatedUser = { ...userInfo, avatar: selectedAvatar };
      const _ = await updateUserProfile(updatedUser);
      setUserInfo(updatedUser);
      toast({
        title: "Perfil actualizado",
        description: "Tus cambios han sido guardados exitosamente.",
      });

      setIsEditing(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo actualizar tu perfil.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Aquí resetearías los cambios
  };
  const handleCancelSubscription = async (subscriptionId: string) => {
    // Mostrar diálogo de confirmación con advertencia
    const confirmed = window.confirm(
      "⚠️ ADVERTENCIA: Al cancelar tu suscripción:\n\n" +
      "• Perderás acceso a todos los cursos que no tienes asignados actualmente\n" +
      "• Solo mantendrás acceso a los cursos que has comprado\n" +
      "¿Estás seguro de que quieres cancelar tu suscripción?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelSubscription(subscriptionId);
      toast({
        title: "Suscripción cancelada",
        description: "Tu suscripción ha sido cancelada. Mantendrás acceso a los cursos comprados.",
      });
      // Recargar suscripciones
      const subs = await getUserSubscriptions();
      setSubscriptions(subs);
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo cancelar la suscripción.",
        variant: "destructive",
      });
    }
  };
  const handleNotificationChange = async (key: string, value: boolean) => {
    const previousValue = notifications[key as keyof typeof notifications];

    // Actualizar estado local inmediatamente para mejor UX
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));

    try {
      // Enviar cambios al backend
      await updateNotificationSettings({
        email_notifications: key === 'emailNotifications' ? value : notifications.emailNotifications,
        course_reminders: key === 'courseReminders' ? value : notifications.courseReminders,
        new_content: key === 'newContent' ? value : notifications.newContent,
      });

      toast({
        title: "Configuración guardada",
        description: "Tus preferencias de notificación han sido actualizadas.",
      });
    } catch (error) {
      // Revertir cambio si falla
      setNotifications((prev) => ({
        ...prev,
        [key]: previousValue,
      }));

      toast({
        title: "Error",
        description: "No se pudo guardar la configuración de notificaciones.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "completado") {
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
          Completado
        </Badge>
      );
    }
    return <Badge variant="secondary">En Progreso</Badge>;
  };

  const getTypeBadge = (type: string) => {
    if (type === "premium") {
      return (
        <Badge className="bg-gradient-accent text-white">⭐ Premium</Badge>
      );
    }
    return <Badge variant="outline">🆓 Básico</Badge>;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 text-center">
        <div className="animate-spin h-10 w-10 border-4 border-t-transparent border-primary rounded-full"></div>
        <p className="text-lg text-muted-foreground">Cargando perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header Navigation */}
        <div className="mb-4 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-muted-foreground hover:text-primary mb-4"
          >
            ← Volver
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <Card className="p-4 sm:p-8 mb-4 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-accent rounded-full flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                  {selectedAvatar || (userInfo?.name
                    ? userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U")}
                </div>
                <AvatarSelector
                  currentAvatar={selectedAvatar}
                  onAvatarSelect={setSelectedAvatar}
                  trigger={
                    <Button
                      size="sm"
                      className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 rounded-full w-8 h-8 sm:w-10 sm:h-10 p-0"
                      variant="outline"
                    >
                      <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  }
                />
              </div>

              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0 gap-2 sm:gap-4">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                      {userInfo?.name}
                    </h1>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Estudiante de Acordeón
                    </p>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    {isEditing ? (
                      <X className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    ) : (
                      <Edit3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                    )}
                    {isEditing ? "Cancelar" : "Editar Perfil"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">
                      Miembro desde {userInfo.created_at ?
                        new Date(userInfo.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        }) :
                        ''
                      }
                    </span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{userInfo.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{achievements.filter(a => a.earned).length} logros</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="courses" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-2 py-2">Mis Cursos</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2">Información</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm px-2 py-2">Logros</TabsTrigger>
              <TabsTrigger value="subscriptions" className="text-xs sm:text-sm px-2 py-2">Suscripciones</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 py-2">Configuración</TabsTrigger>
            </TabsList>

            {/* Mis Cursos */}
            <TabsContent value="courses" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Mis Cursos ({coursesData.length})
                </h2>

                <div className="space-y-4">
                  {coursesData.map((course) => (
                    <Card
                      key={course.id}
                      className={`p-4 sm:p-6 hover:shadow-elegant transition-all ${
                        !course.isAssigned ? 'border-dashed border-2' : ''
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-primary">
                            {course.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {course.isAssigned ? (
                              <>
                                {getStatusBadge(course.status)}
                                {getTypeBadge(course.type)}
                              </>
                            ) : (
                              <>
                                <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                                  Disponible
                                </Badge>
                                {getTypeBadge(course.type)}
                              </>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={course.isAssigned ? "outline" : "default"}
                          onClick={() => navigate(`/curso/${course.id}`)}
                          className="w-full sm:w-auto"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {course.isAssigned ? (
                            course.status === "completado" ? "Revisar" : "Continuar"
                          ) : (
                            "Comenzar"
                          )}
                        </Button>
                      </div>

                      {course.isAssigned ? (
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progreso
                            </span>
                            <span className="font-medium">
                              {course.completedLessons}/{course.totalLessons}{" "}
                              lecciones
                            </span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                          <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{course.progress}% completado</span>
                            <span>Último acceso: {course.lastAccessed}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground">
                          <Crown className="h-4 w-4 inline mr-1" />
                          Disponible con tu suscripción activa
                        </div>
                      )}
                    </Card>
                  ))}
                </div>

                <div className="mt-6 text-center">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/cursos")}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    Explorar Más Cursos
                  </Button>
                </div>
              </Card>
            </TabsContent>

            {/* Información Personal */}
            <TabsContent value="profile" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Información Personal
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre completo</Label>
                      <Input
                        id="name"
                        value={userInfo?.name}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, name: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={userInfo.email || ""}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, email: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={userInfo.phone}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, phone: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Ubicación</Label>
                      <Input
                        id="location"
                        value={userInfo.location}
                        onChange={(e) =>
                          setUserInfo({ ...userInfo, location: e.target.value })
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biografía</Label>
                    <Textarea
                      id="bio"
                      value={userInfo.bio}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, bio: e.target.value })
                      }
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                      <Button onClick={handleSave} className="w-full sm:w-auto">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            {/* Logros */}
            <TabsContent value="achievements" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Logros y Reconocimientos
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {achievements.map((achievement, index) => {
                    const earned = Boolean(achievement.earned);

                    return (
                      <Card
                        key={achievement.id ?? index}
                        className={`p-4 transition-all ${
                          earned
                            ? "bg-gradient-card border-primary/20"
                            : "bg-muted/50 border-muted opacity-60"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-2xl">
                            {achievement.icon ?? "🏆"}
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {achievement.name ?? "Logro"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {earned ? "Obtenido" : "Bloqueado"}
                            </p>
                          </div>
                          {earned && (
                            <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                          )}
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            {/* Suscripciones */}
            <TabsContent value="subscriptions" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <Crown className="h-5 w-5 mr-2" />
                  Suscripciones
                </h2>

                {(() => {
                  const now = new Date();
                  const activeSubs = subscriptions.filter(sub => sub.status === true);
                  const cancelledButActiveSubs = subscriptions.filter(sub => 
                    sub.status === false && sub.end_time && new Date(sub.end_time) > now
                  );
                  const allValidSubs = [...activeSubs, ...cancelledButActiveSubs];

                  return allValidSubs.length === 0 ? (
                  <div className="text-center py-8">
                    <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No tienes suscripciones activas</h3>
                    <p className="text-muted-foreground mb-4">
                      Suscríbete para acceder a contenido premium ilimitado
                    </p>
                    <Button onClick={() => navigate("/suscripciones")}>
                      Ver Planes de Suscripción
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allValidSubs.map((subscription) => (
                      <Card
                        key={subscription.id}
                        className={`p-4 sm:p-6 border-primary/20 ${
                          subscription.status === false ? 'bg-orange-50 border-orange-200' : 'bg-gradient-card'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-primary">
                              Suscripción Premium
                            </h3>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {subscription.status === true ? (
                                <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                                  Activa
                                </Badge>
                              ) : (
                                <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                                  Cancelada - Acceso hasta {new Date(subscription.end_time!).toLocaleDateString('es-ES')}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {subscription.status === true && (
                            <Button
                              variant="destructive"
                              onClick={() => handleCancelSubscription(subscription.id)}
                              className="w-full sm:w-auto"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Cancelar Suscripción
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Fecha de inicio:</span>
                            <p className="font-medium">
                              {new Date(subscription.start_time).toLocaleDateString('es-ES')}
                            </p>
                          </div>
                          {subscription.end_time && (
                            <div>
                              <span className="text-muted-foreground">Fecha de fin:</span>
                              <p className="font-medium">
                                {new Date(subscription.end_time).toLocaleDateString('es-ES')}
                              </p>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">ID de PayPal:</span>
                            <p className="font-medium font-mono text-xs">
                              {subscription.paypal_subscription_id}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                );
                })()}
              </Card>
            </TabsContent>

            {/* Configuración */}
            <TabsContent value="settings" className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Configuración de la Cuenta
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  {/* Notificaciones */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Bell className="h-4 w-4 mr-2" />
                      Notificaciones
                    </h3>
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <p className="font-medium">
                            Notificaciones por email
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Recibir actualizaciones por correo
                          </p>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(value) =>
                            handleNotificationChange(
                              "emailNotifications",
                              value
                            )
                          }
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <p className="font-medium">Recordatorios de cursos</p>
                          <p className="text-sm text-muted-foreground">
                            Recordatorios para continuar estudiando
                          </p>
                        </div>
                        <Switch
                          checked={notifications.courseReminders}
                          onCheckedChange={(value) =>
                            handleNotificationChange("courseReminders", value)
                          }
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <p className="font-medium">Nuevo contenido</p>
                          <p className="text-sm text-muted-foreground">
                            Notificar sobre nuevos cursos y lecciones
                          </p>
                        </div>
                        <Switch
                          checked={notifications.newContent}
                          onCheckedChange={(value) =>
                            handleNotificationChange("newContent", value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Seguridad */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Seguridad
                    </h3>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => navigate("/cambiar-contrasena")}
                      >
                        Cambiar Contraseña
                      </Button>
                      {/* <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Autenticación de Dos Factores
                      </Button> */}
                    </div>
                  </div>

                  <Separator />

                  {/* Zona Peligrosa */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-destructive">
                      Cerrar Sesión
                    </h3>
                    <div className="space-y-4">
                      <Button onClick={logout} variant="destructive" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
