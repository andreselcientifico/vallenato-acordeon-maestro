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
import { getUserProfile, updateUserProfile } from "@/api/user";
import { useAuth } from "@/context/AuthContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: false,
    pushNotifications: false,
    courseReminders: false,
    newContent: false,
  });
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await getUserProfile();
        setUserInfo(res.data.user);
        setCoursesData(res.data.courses || []);
        setAchievements(res.data.achievements || []);
        setNotifications({
          emailNotifications: res.data.user.email_notifications ?? true,
          pushNotifications: res.data.user.push_notifications ?? false,
          courseReminders: res.data.user.course_reminders ?? true,
          newContent: res.data.user.new_content ?? true,
        });
      } catch (err) {
        toast({
          title: "Sesión no válida",
          description: "Por favor inicia sesión nuevamente.",
          variant: "destructive",
        });
        navigate("/login");
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [navigate, toast]);

  const handleSave = async () => {
    try {
      const _ = await updateUserProfile(userInfo);
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

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: value,
    }));
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
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-accent rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                  {userInfo?.name
                    ? userInfo.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"}
                </div>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                  variant="outline"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 text-center sm:text-left w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-primary">
                      {userInfo?.name}
                    </h1>
                    <p className="text-muted-foreground">
                      Estudiante de Acordeón
                    </p>
                  </div>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className="w-full sm:w-auto"
                  >
                    {isEditing ? (
                      <X className="h-4 w-4 mr-2" />
                    ) : (
                      <Edit3 className="h-4 w-4 mr-2" />
                    )}
                    {isEditing ? "Cancelar" : "Editar Perfil"}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-sm">
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Miembro desde enero 2024</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{userInfo.location}</span>
                  </div>
                  <div className="flex items-center justify-center sm:justify-start space-x-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span>2 logros obtenidos</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Tabs Content */}
          <Tabs defaultValue="courses" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="courses" className="text-xs sm:text-sm px-2 py-2">Mis Cursos</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm px-2 py-2">Información</TabsTrigger>
              <TabsTrigger value="achievements" className="text-xs sm:text-sm px-2 py-2">Logros</TabsTrigger>
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
                      className="p-4 sm:p-6 hover:shadow-elegant transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-3 sm:space-y-0">
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-semibold text-primary">
                            {course.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {getStatusBadge(course.status)}
                            {getTypeBadge(course.type)}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => navigate(`/curso/${course.id}`)}
                          className="w-full sm:w-auto"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          {course.status === "completado"
                            ? "Revisar"
                            : "Continuar"}
                        </Button>
                      </div>

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
                  {achievements.map((achievement, index) => (
                    <Card
                      key={index}
                      className={`p-4 transition-all ${
                        achievement.earned
                          ? "bg-gradient-card border-primary/20"
                          : "bg-muted/50 border-muted opacity-60"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div>
                          <h3 className="font-medium">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.earned ? "Obtenido" : "Bloqueado"}
                          </p>
                        </div>
                        {achievement.earned && (
                          <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
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
                      >
                        Cambiar Contraseña
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        Autenticación de Dos Factores
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Zona Peligrosa */}
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-destructive">
                      Zona Peligrosa
                    </h3>
                    <div className="space-y-4">
                      <Button onClick={logout} variant="destructive" className="w-full">
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Eliminar Cuenta
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
