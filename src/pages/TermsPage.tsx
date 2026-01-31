import { useEffect } from "react";
import { FileText, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TermsPage = () => {
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
              <span className="text-primary">Términos de</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Servicio
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Lee atentamente estos términos antes de usar nuestros servicios. 
              Al acceder a nuestro sitio, aceptas cumplir con estos términos.
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
            {/* Important Notice */}
            <Alert className="mb-8 border-vallenato-red/30 bg-vallenato-red/5">
              <AlertCircle className="h-4 w-4 text-vallenato-red" />
              <AlertDescription className="text-vallenato-red">
                Al usar este sitio, aceptas estos términos en su totalidad. Si no estás de acuerdo, 
                por favor no uses nuestros servicios.
              </AlertDescription>
            </Alert>

            {/* Quick Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
              <Card className="p-6">
                <CheckCircle2 className="w-6 h-6 text-primary mb-3" />
                <h3 className="font-bold mb-2">Permitido</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Usar contenido personal</li>
                  <li>✓ Descargar para aprender</li>
                  <li>✓ Compartir experiencias</li>
                  <li>✓ Proporcionar feedback</li>
                </ul>
              </Card>
              <Card className="p-6">
                <XCircle className="w-6 h-6 text-vallenato-red mb-3" />
                <h3 className="font-bold mb-2">No Permitido</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✗ Compartir acceso</li>
                  <li>✗ Resell contenido</li>
                  <li>✗ Contenido ilegal</li>
                  <li>✗ Vulnerar derechos</li>
                </ul>
              </Card>
            </div>

            {/* Detailed Sections */}
            <div className="space-y-12">
              {/* Section 1 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">1. Aceptación de Términos</h2>
                <p className="text-muted-foreground mb-4">
                  Al acceder y usar este sitio web y sus servicios, aceptas quedar vinculado por 
                  estos Términos de Servicio. Si no aceptas estos términos, no debes usar este sitio.
                </p>
                <p className="text-muted-foreground">
                  Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                  Tu uso continuado del sitio después de cambios constituye aceptación de los nuevos términos.
                </p>
              </section>

              {/* Section 2 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">2. Licencia de Uso</h2>
                <Card className="p-6 bg-primary/5">
                  <p className="text-muted-foreground mb-4">
                    Te otorgamos una licencia limitada, no exclusiva e intransferible para:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">→</span>
                      <span>Acceder y ver contenido educativo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">→</span>
                      <span>Descargar materiales para uso personal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary font-bold mt-0.5">→</span>
                      <span>Participar en interacciones comunitarias</span>
                    </li>
                  </ul>
                  <p className="text-muted-foreground mt-4 text-sm">
                    Esta licencia termina automáticamente si violas cualquiera de estos términos.
                  </p>
                </Card>
              </section>

              {/* Section 3 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">3. Prohibiciones</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-3">
                  <p className="font-semibold text-foreground">No puedes:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Modificar, copiar o distribuir contenido sin autorización</li>
                    <li>• Revender, alquilar u ofrecer acceso a otros usuarios</li>
                    <li>• Usar scraping o herramientas automatizadas</li>
                    <li>• Acceder a datos de otros usuarios</li>
                    <li>• Intentar hackear o vulnerar la seguridad</li>
                    <li>• Compartir credenciales de acceso</li>
                    <li>• Usar el servicio para propósitos ilegales</li>
                    <li>• Interferir con el funcionamiento del servicio</li>
                    <li>• Violar leyes aplicables</li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">4. Contenido del Usuario</h2>
                <Card className="p-6 bg-primary/5">
                  <p className="text-muted-foreground mb-4">
                    Eres responsable de cualquier contenido que publiques (comentarios, perfiles, etc.).
                  </p>
                  <div className="space-y-3 text-muted-foreground">
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Garantizas que tienes derechos sobre tu contenido</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>No puede violar derechos de terceros</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Nos concedes licencia para usar tu contenido</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="text-primary font-bold">•</span>
                      <span>Podemos eliminar contenido inapropiado</span>
                    </p>
                  </div>
                </Card>
              </section>

              {/* Section 5 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">5. Propiedad Intelectual</h2>
                <p className="text-muted-foreground mb-4">
                  Todo el contenido del sitio (videos, música, textos, gráficos) es propiedad de 
                  Andrea Paola Argote Chávez o sus licenciadores y está protegido por leyes de 
                  derechos de autor internacionales.
                </p>
                <Alert className="border-primary/30 bg-primary/5 mb-4">
                  <AlertDescription className="text-foreground">
                    <strong>Derechos de Autor © 2024-2026.</strong> Todos los derechos reservados. 
                    El contenido no puede reproducirse sin permiso explícito.
                  </AlertDescription>
                </Alert>
              </section>

              {/* Section 6 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">6. Suscripciones y Pago</h2>
                <Card className="p-6 bg-primary/5">
                  <div className="space-y-4 text-muted-foreground">
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Renovación Automática</h4>
                      <p>
                        Las suscripciones se renuevan automáticamente a menos que las canceles. 
                        Recibirás confirmación antes de cada renovación.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Reembolsos</h4>
                      <p>
                        Los reembolsos están disponibles dentro de 14 días de la compra, 
                        siempre que no hayas accedido más del 30% del contenido.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Cambios de Precio</h4>
                      <p>
                        Podemos cambiar los precios con notificación previa. Los cambios 
                        no aplican a suscripciones activas.
                      </p>
                    </div>
                  </div>
                </Card>
              </section>

              {/* Section 7 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">7. Limitación de Responsabilidad</h2>
                <Alert className="border-amber-500/30 bg-amber-500/5 mb-4">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <AlertDescription className="text-foreground">
                    El sitio se proporciona "tal cual" sin garantías. No somos responsables 
                    de daños indirectos o pérdidas de datos.
                  </AlertDescription>
                </Alert>
                <p className="text-muted-foreground">
                  En la máxima medida permitida por la ley, no somos responsables por 
                  daños especiales, indirectos, incidentales o consecuentes derivados del 
                  uso de nuestros servicios.
                </p>
              </section>

              {/* Section 8 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">8. Cuenta y Seguridad</h2>
                <div className="bg-primary/5 p-6 rounded-lg space-y-3">
                  <p className="text-muted-foreground">
                    Eres responsable de mantener la confidencialidad de tu cuenta:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>✓ Mantén tu contraseña segura</li>
                    <li>✓ Notifícanos de acceso no autorizado</li>
                    <li>✓ No compartas tu cuenta</li>
                    <li>✓ Eres responsable de toda actividad en tu cuenta</li>
                  </ul>
                </div>
              </section>

              {/* Section 9 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">9. Terminación</h2>
                <p className="text-muted-foreground mb-4">
                  Podemos suspender o terminar tu acceso si:
                </p>
                <ul className="space-y-2 text-muted-foreground mb-4">
                  <li>• Violas estos términos</li>
                  <li>• Incurres en conducta ilegal</li>
                  <li>• Acosas a otros usuarios</li>
                  <li>• Realizas múltiples violaciones</li>
                </ul>
                <p className="text-muted-foreground">
                  Puedes cancelar tu cuenta en cualquier momento desde tu panel de perfil.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">10. Cambios en los Términos</h2>
                <p className="text-muted-foreground">
                  Nos reservamos el derecho de actualizar estos términos en cualquier momento. 
                  Notificaremos cambios significativos por correo o aviso en el sitio. 
                  Tu uso continuado implica aceptación de los nuevos términos.
                </p>
              </section>

              {/* Section 11 */}
              <section>
                <h2 className="text-3xl font-bold mb-6">11. Ley Aplicable</h2>
                <p className="text-muted-foreground">
                  Estos términos se rigen por las leyes de Colombia. Cualquier disputa se 
                  resolverá en los tribunales competentes de Bogotá, Colombia.
                </p>
              </section>

              {/* Contact */}
              <section className="bg-primary/10 p-8 rounded-lg border border-primary/20">
                <div className="flex items-start gap-4">
                  <FileText className="w-6 h-6 text-primary mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">¿Preguntas sobre los Términos?</h3>
                    <p className="text-muted-foreground mb-4">
                      Si tienes preguntas sobre estos Términos de Servicio, contáctanos.
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

export default TermsPage;
