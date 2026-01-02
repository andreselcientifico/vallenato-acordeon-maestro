// src/pages/SubscriptionsPage.tsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Crown, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSubscriptionPlans, SubscriptionPlan } from "@/api/subscriptions";
import { getCurrentUser } from "@/api/auth";
import PaypalSubscription from "@/components/PaypalSubscription";

const SubscriptionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [plansData, userData] = await Promise.all([
          getSubscriptionPlans(),
          getCurrentUser().catch(() => null)
        ]);
        setPlans(plansData);
        setUser(userData);
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
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para suscribirte",
        variant: "destructive",
      });
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
                <p className="text-muted-foreground">Accede a contenido premium ilimitado</p>
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
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Premium
            </span>
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
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4">
                  <Button
                    className="w-full"
                    variant={plan.name.toLowerCase().includes('premium') ? 'default' : 'outline'}
                    onClick={() => handleSubscribe(plan)}
                  >
                    {user ? 'Suscribirse' : 'Inicia Sesión para Suscribirte'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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