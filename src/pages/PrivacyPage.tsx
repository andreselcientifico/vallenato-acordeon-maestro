import { useEffect } from "react";
import { Shield, Lock, Eye, Share2, Trash2, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Política de</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Privacidad
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tu privacidad es importante para nosotros. Conoce cómo recopilamos, 
              utilizamos y protegemos tu información personal.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Última actualización: 17 de enero de 2026
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <Shield className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold mb-2">Seguridad de Datos</h3>
                    <p className="text-sm text-muted-foreground">
                      Cómo protegemos tu información
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <Eye className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold mb-2">Recopilación de Datos</h3>
                    <p className="text-sm text-muted-foreground">
                      Qué información recopilamos
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <Share2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold mb-2">Compartir Información</h3>
                    <p className="text-sm text-muted-foreground">
                      Cuándo compartimos tus datos
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="flex items-start gap-4">
                  <Trash2 className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  <div>
                    <h3 className="font-bold mb-2">Tus Derechos</h3>
                    <p className="text-sm text-muted-foreground">
                      Control sobre tu información
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Detailed Content */}
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">1. Información que Recopilamos</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">Información Personal</h3>
                    <p className="text-muted-foreground">
                      Cuando te registras, recopilamos:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                      <li>Nombre completo</li>
                      <li>Dirección de correo electrónico</li>
                      <li>Contraseña (encriptada)</li>
                      <li>Información de perfil (foto, biografía)</li>
                      <li>Información de suscripción y pago</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Información de Uso</h3>
                    <p className="text-muted-foreground">
                      Recopilamos automáticamente:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-2">
                      <li>Datos de navegación (IP, navegador, dispositivo)</li>
                      <li>Cursos visitados y progreso de aprendizaje</li>
                      <li>Videos reproducidos y duración</li>
                      <li>Logros y certificados obtenidos</li>
                      <li>Cookies y tecnologías similares</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">2. Cómo Usamos tu Información</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-3">
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Proporcionar y mejorar nuestros servicios educativos</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Procesar pagos y transacciones</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Personalizar tu experiencia de aprendizaje</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Enviar notificaciones y actualizaciones</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Cumplir con requisitos legales y regulatorios</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-muted-foreground">Prevenir fraude y proteger la seguridad</span>
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">3. Seguridad de la Información</h2>
                <Card className="p-6 bg-primary/5">
                  <p className="text-muted-foreground mb-4">
                    Implementamos medidas de seguridad técnicas, administrativas y físicas para proteger tu información personal:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Encriptación SSL/TLS para todas las comunicaciones</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Contraseñas almacenadas con hash seguro</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Acceso restringido a bases de datos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>Auditorías de seguridad regulares</span>
                    </li>
                  </ul>
                </Card>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">4. Compartir Información</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-4">
                  <p className="text-muted-foreground">
                    No vendemos tu información personal. Solo compartimos información cuando es necesario para:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <span className="font-semibold">Proveedores de pago:</span> Para procesar transacciones (PayPal, Stripe)</li>
                    <li>• <span className="font-semibold">Análisis:</span> Para entender cómo usas nuestros servicios</li>
                    <li>• <span className="font-semibold">Requisitos legales:</span> Cuando la ley nos lo requiera</li>
                    <li>• <span className="font-semibold">Protección:</span> Para prevenir fraude o abuso</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">5. Tus Derechos</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-3">
                  <p className="font-semibold text-foreground">Tienes derecho a:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Acceder a tu información personal</li>
                    <li>✓ Corregir información inexacta</li>
                    <li>✓ Solicitar la eliminación de tu cuenta</li>
                    <li>✓ Exportar tus datos</li>
                    <li>✓ Revocar el consentimiento en cualquier momento</li>
                    <li>✓ Contactarnos para preguntas sobre privacidad</li>
                  </ul>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">6. Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Utilizamos cookies para mejorar tu experiencia. Puedes controlar las cookies a través 
                  de la configuración de tu navegador. Sin embargo, algunos servicios pueden no funcionar correctamente 
                  si desactivas las cookies.
                </p>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">7. Cambios a esta Política</h2>
                <p className="text-muted-foreground">
                  Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre cambios 
                  significativos mediante correo electrónico o un aviso destacado en nuestro sitio.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-primary/10 p-8 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">¿Preguntas sobre Privacidad?</h3>
                    <p className="text-muted-foreground mb-4">
                      Si tienes preguntas o preocupaciones sobre esta política de privacidad, 
                      no dudes en contactarnos.
                    </p>
                    <a
                      href="/contacto"
                      className="text-primary hover:text-primary/80 font-semibold"
                    >
                      Contactar Soporte →
                    </a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPage;
