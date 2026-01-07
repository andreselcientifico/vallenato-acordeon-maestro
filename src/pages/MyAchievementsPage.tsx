import { useEffect, useState } from "react";
import { Trophy, Calendar, Star, Award } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { getUserAchievements } from "@/api/subscriptions";
import { UserAchievement} from "@/api/subscriptions";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MyAchievementsPage = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<UserAchievement[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return;

      try {
        const userAchievements = await getUserAchievements(user.id);
        setAchievements(userAchievements);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Cargando logros...</p>
          </div>
        </div>
      </div>
    );
  }

  const earnedAchievements = achievements.filter(a => a.earned);
  const lastEarnedDate =
  earnedAchievements.length > 0
    ? new Date(
        Math.max(
          ...earnedAchievements
            .filter(a => a.earned_at)
            .map(a => new Date(a.earned_at as string).getTime())
        )
      ).toLocaleDateString("es-ES")
    : "Ninguno";
  const totalAchievements = achievements.length;
  const completionRate = totalAchievements > 0 ? (earnedAchievements.length / totalAchievements) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className=" sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Volver
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-bold text-primary">Mis Logros</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            ¡Felicitaciones por tus avances en la Academia Vallenato!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Logros Obtenidos</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{earnedAchievements.length}</div>
              <p className="text-xs text-muted-foreground">
                de {totalAchievements} logros disponibles
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completionRate.toFixed(0)}%</div>
              <p className="text-xs text-muted-foreground">
                completado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Logro</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {earnedAchievements.length > 0
                  ? new Date(Math.max(...earnedAchievements.map(a => new Date(a.earned_at || '').getTime()))).toLocaleDateString('es-ES')
                  : 'Ninguno'
                }
              </div>
              <p className="text-xs text-muted-foreground">
                fecha de obtención
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((userAchievement) => (
            <Card
              key={userAchievement.id}
              className={`transition-all duration-300 ${
                userAchievement.earned
                  ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                  : 'bg-gray-50 dark:bg-gray-800/50 opacity-60'
              }`}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto mb-3 p-3 rounded-full ${
                  userAchievement.earned
                    ? 'bg-yellow-100 dark:bg-yellow-900/30'
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  <Trophy className={`h-8 w-8 ${
                    userAchievement.earned
                      ? 'text-yellow-600 dark:text-yellow-400'
                      : 'text-gray-400'
                  }`} />
                </div>
                <CardTitle className={`text-lg ${
                  userAchievement.earned
                    ? 'text-yellow-800 dark:text-yellow-200'
                    : 'text-gray-500'
                }`}>
                  {userAchievement.name}
                </CardTitle>
                <CardDescription className="text-sm">
                  {userAchievement.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                {userAchievement.earned ? (
                  <div>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                      ¡Obtenido!
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(userAchievement.earned_at || '').toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    Pendiente
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No hay logros disponibles</h3>
            <p className="text-muted-foreground">
              Los logros aparecerán aquí cuando completes cursos y lecciones.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAchievementsPage;