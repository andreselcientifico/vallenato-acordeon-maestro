// src/pages/SubscriptionsPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle, Crown, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionPlans, getUserSubscriptions, SubscriptionPlan } from "@/api/subscriptions";
import { getCurrentUser } from "@/api/auth";
import PaypalSubscription from "@/components/PaypalSubscription";
import AuthDialog from "@/components/AuthDialog";

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<SubscriptionPlan | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);


  useEffect(() => {
    const loadData = async () => {
      try {
        const [plansData, userData] = await Promise.all([
          getSubscriptionPlans(),
          getCurrentUser().catch(() => null)
        ]);
        setPlans(plansData);
        setUser(userData);

        // Cargar suscripciones válidas si hay usuario
        if (userData) {
          try {
            const subs = await getUserSubscriptions();
            const now = new Date();
            const validSubs = subs.filter(sub => 
              sub.status === true || (sub.status === false && sub.end_time && new Date(sub.end_time) > now)
            );
            setActiveSubscriptions(validSubs);
          } catch (error) {
            console.warn("Error loading subscriptions:", error);
            setActiveSubscriptions([]);
          }
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudieron cargar los planes de suscripción",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!user) {
      setPendingPlan(plan);
      setAuthDialogOpen(true);
      return;
    }
    setSelectedPlan(plan);
  };

  const handleSubscriptionSuccess = () => {
    toast({
      title: "¡Suscripción exitosa!",
      description: "Tu suscripción ha sido activada correctamente",
    });
    setSelectedPlan(null);
    // Recargar datos del usuario
    window.location.reload();
  };

  /**
   * Devuelve true si la feature es negativa
   */
  function isNegativeFeature(feature: string): boolean {
    return feature.startsWith("!");
  }

  /**
   * Devuelve el texto limpio para mostrar
   */
  function displayFeature(feature: string): string {
    return feature.replace(/^!/, "");
  }


 
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-t-transparent border-primary rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate(-1)}>
                ← Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Planes de Suscripción</h1>
                <p className="text-muted-foreground">Accede a contenido ilimitado</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <Crown className="h-16 w-16 text-yellow-500" />
          </div>
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-primary">Suscríbete</span>{" "}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Obtén acceso ilimitado a todos nuestros cursos, contenido exclusivo y soporte personalizado.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                plan.name.toLowerCase().includes('premium') ? 'border-primary shadow-lg' : ''
              }`}
            >
              {plan.name.toLowerCase().includes('premium') && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-medium rounded-bl-lg">
                  Más Popular
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="text-3xl font-bold text-primary mb-1">
                  ${plan.price}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.duration_months} {plan.duration_months === 1 ? 'mes' : 'meses'}
                  </span>
                </div>
                {plan.description && (
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                 {plan.features.map((feature, index) => {
                    const negative = isNegativeFeature(feature);

                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 ${
                          negative ? "text-muted-foreground line-through" : ""
                        }`}
                      >
                        {negative ? (
                          <X className="h-4 w-4 text-red-500 flex-shrink-0" />
                        ) : (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}

                        <span className="text-sm">
                          {displayFeature(feature)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4">
                  {(() => {
                    const activeSub = activeSubscriptions.find(sub => sub.status === true);
                    const cancelledSub = activeSubscriptions.find(sub => sub.status === false);
                    
                    if (activeSub) {
                      return (
                        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                          <p className="text-green-800 font-medium">¡Ya tienes una suscripción activa!</p>
                          <p className="text-green-600 text-sm">Disfruta de acceso ilimitado a todos los cursos</p>
                        </div>
                      );
                    } else if (cancelledSub) {
                      return (
                        <div className="text-center p-4 bg-orange-50 border border-orange-200 rounded-lg">
                          <CheckCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                          <p className="text-orange-800 font-medium">Suscripción cancelada</p>
                          <p className="text-orange-600 text-sm">
                            Acceso garantizado hasta {new Date(cancelledSub.end_time!).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })()}
                  {!activeSubscriptions.length && (
                    <Button
                      className="w-full"
                      variant={plan.name.toLowerCase().includes('premium') ? 'default' : 'outline'}
                      onClick={() => handleSubscribe(plan)}
                    >
                      {user ? 'Suscribirse' : 'Inicia Sesión para Suscribirte'}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          <AuthDialog
            open={authDialogOpen}
            onOpenChange={setAuthDialogOpen}
            onLogin={async () => {
              try {
                // Volvemos a consultar el usuario autenticado
                const userData = await getCurrentUser();
                setUser(userData);

                setAuthDialogOpen(false);

                toast({
                  title: "¡Bienvenido!",
                  description: "Has iniciado sesión correctamente",
                });

                // Si había un plan pendiente, continuamos con la suscripción
                if (pendingPlan) {
                  setSelectedPlan(pendingPlan);
                  setPendingPlan(null);
                }
              } catch (error) {
                toast({
                  title: "Error",
                  description: "No se pudo obtener el usuario autenticado",
                  variant: "destructive",
                });
              }
            }}
          />
        </div>

        {/* Benefits Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-8">¿Por qué suscribirte?</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Acceso Ilimitado</h4>
              <p className="text-muted-foreground text-sm">
                Todos los cursos y lecciones disponibles sin restricciones
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Crown className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Contenido Exclusivo</h4>
              <p className="text-muted-foreground text-sm">
                Material adicional y actualizaciones exclusivas para suscriptores
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <h4 className="font-semibold mb-2">Soporte Premium</h4>
              <p className="text-muted-foreground text-sm">
                Atención personalizada y respuestas prioritarias
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Puedo cancelar mi suscripción en cualquier momento?</h4>
                <p className="text-muted-foreground text-sm">
                  Sí, puedes cancelar tu suscripción en cualquier momento desde tu perfil. Mantendrás el acceso hasta el final del período pagado.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Qué métodos de pago aceptan?</h4>
                <p className="text-muted-foreground text-sm">
                  Aceptamos pagos con PayPal y tarjetas de crédito a través de PayPal.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Los cursos son descargables?</h4>
                <p className="text-muted-foreground text-sm">
                  Actualmente, el contenido está disponible para streaming. Estamos trabajando en opciones de descarga offline.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* PayPal Subscription Modal */}
      {selectedPlan && (
        <PaypalSubscription
          plan={selectedPlan}
          onClose={() => setSelectedPlan(null)}
          onSuccess={handleSubscriptionSuccess}
        />
      )}
    </div>
  );
};

export default SubscriptionsPage;