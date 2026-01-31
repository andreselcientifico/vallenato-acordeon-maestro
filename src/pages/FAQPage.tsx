import { useEffect, useState } from "react";
import { Search, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [searchTerm, setSearchTerm] = useState("");

  const faqs: FAQ[] = [
    {
      id: "1",
      category: "General",
      question: "¿Quién es Andrea Paola Argote Chávez?",
      answer:
        "Andrea es una maestra en Música con énfasis en Ingeniería de Sonido de la Pontificia Universidad Javeriana. Es una artista, educadora y emprendedora apasionada por preservar y compartir la tradición del vallenato con estudiantes de todo el mundo.",
    },
    {
      id: "2",
      category: "Cursos",
      question: "¿Cómo puedo acceder a los cursos?",
      answer:
        "Primero debes crear una cuenta registrándote en nuestro sitio. Luego puedes explorar los cursos disponibles, ver sus previsualizaciones y comprar los que te interesen. Una vez comprados, tendrás acceso ilimitado al contenido.",
    },
    {
      id: "3",
      category: "Cursos",
      question: "¿Cuánto tiempo puedo acceder a los cursos después de comprar?",
      answer:
        "Una vez que compras un curso, tienes acceso ilimitado de por vida. Puedes acceder cuando quieras, desde cualquier dispositivo, sin restricciones de tiempo.",
    },
    {
      id: "4",
      category: "Cursos",
      question: "¿Puedo descargar los videos de los cursos?",
      answer:
        "Sí, puedes descargar los materiales de los cursos para verlos sin conexión. Sin embargo, el contenido descargado es solo para uso personal y no puede compartirse.",
    },
    {
      id: "5",
      category: "Suscripción",
      question: "¿Qué incluye la suscripción premium?",
      answer:
        "La suscripción premium incluye acceso a todos los cursos, contenido exclusivo, actualizaciones en tiempo real, certificados descargables, soporte prioritario y acceso a la comunidad exclusiva.",
    },
    {
      id: "6",
      category: "Suscripción",
      question: "¿Cómo cancelo mi suscripción?",
      answer:
        "Puedes cancelar tu suscripción en cualquier momento desde tu panel de perfil, en la sección 'Suscripciones'. La cancelación es efectiva inmediatamente y no recibirás más cargos.",
    },
    {
      id: "7",
      category: "Suscripción",
      question: "¿Hay período de prueba gratuita?",
      answer:
        "Algunos planes incluyen períodos de prueba gratuita de 7 días. Verás esta información al seleccionar tu plan de suscripción.",
    },
    {
      id: "8",
      category: "Pagos",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos pagos a través de PayPal, tarjetas de crédito y débito (Visa, Mastercard, American Express). Todos los pagos son procesados de forma segura con encriptación SSL.",
    },
    {
      id: "9",
      category: "Pagos",
      question: "¿Puedo obtener un reembolso?",
      answer:
        "Sí, ofrecemos una garantía de satisfacción de 14 días. Si no estás satisfecho con tu compra y has accedido a menos del 30% del contenido, podemos procesar un reembolso completo.",
    },
    {
      id: "10",
      category: "Pagos",
      question: "¿Es seguro usar mi tarjeta de crédito?",
      answer:
        "Sí, absolutamente. Usamos encriptación SSL de nivel de banco y procesamos pagos a través de PayPal, que cumple con los estándares internacionales de seguridad. Nunca guardamos los datos completos de tu tarjeta.",
    },
    {
      id: "11",
      category: "Cuenta",
      question: "¿Olvidé mi contraseña, ¿qué hago?",
      answer:
        "Haz clic en 'Olvidé mi contraseña' en la página de inicio de sesión. Recibirás un correo con instrucciones para resetear tu contraseña. El enlace es válido por 1 hora.",
    },
    {
      id: "12",
      category: "Cuenta",
      question: "¿Cómo cambio mi información de perfil?",
      answer:
        "Accede a tu perfil desde el menú principal. Puedes editar tu nombre, foto, biografía y otras informaciones. Los cambios se guardan automáticamente.",
    },
    {
      id: "13",
      category: "Cuenta",
      question: "¿Cómo elimino mi cuenta?",
      answer:
        "Puedes solicitar la eliminación de tu cuenta desde la configuración de tu perfil. Tus datos se eliminarán de nuestros servidores dentro de 30 días. Esta acción es irreversible.",
    },
    {
      id: "14",
      category: "Certificados",
      question: "¿Cómo obtengo un certificado?",
      answer:
        "Después de completar un curso y pasar la evaluación final, recibirás automáticamente un certificado digital. Puedes descargarlo desde tu sección de logros.",
    },
    {
      id: "15",
      category: "Certificados",
      question: "¿Puedo compartir mi certificado?",
      answer:
        "Sí, puedes descargar tu certificado en formato PDF y compartirlo. Cada certificado tiene un código único que puede verificarse en nuestro sitio.",
    },
    {
      id: "16",
      category: "Técnico",
      question: "¿Qué navegadores son compatibles?",
      answer:
        "Nuestro sitio es compatible con Chrome, Firefox, Safari, Edge y Opera. Recomendamos mantener tu navegador actualizado para la mejor experiencia.",
    },
    {
      id: "17",
      category: "Técnico",
      question: "¿Funciona en dispositivos móviles?",
      answer:
        "Sí, nuestro sitio es completamente responsivo y funciona perfectamente en teléfonos y tablets. También puedes descargar nuestra app móvil para una mejor experiencia.",
    },
    {
      id: "18",
      category: "Técnico",
      question: "¿Qué hago si tengo problemas técnicos?",
      answer:
        "Intenta refrescar la página o limpiar el caché de tu navegador. Si el problema persiste, contacta a nuestro equipo de soporte. Responderemos dentro de 24 horas.",
    },
    {
      id: "19",
      category: "Contenido",
      question: "¿Se agregan nuevos cursos regularmente?",
      answer:
        "Sí, agregamos nuevo contenido regularmente. Los suscriptores premium reciben notificaciones sobre nuevos cursos y actualizaciones exclusivas.",
    },
    {
      id: "20",
      category: "Comunidad",
      question: "¿Puedo interactuar con otros estudiantes?",
      answer:
        "Sí, nuestra comunidad exclusiva permite a los estudiantes conectarse, compartir experiencias y resolver dudas. Fomentamos un ambiente respectuoso y colaborativo.",
    },
  ];

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Preguntas</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Frecuentes
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Encuentra respuestas a las preguntas más comunes sobre nuestros cursos, 
              suscripciones y servicios.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12 bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Busca preguntas o respuestas..."
              className="pl-10 h-12 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <Card className="p-12 text-center bg-primary/5">
                <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold mb-2">No encontramos resultados</h3>
                <p className="text-muted-foreground">
                  Intenta con otros términos o contáctanos si no encuentras lo que buscas.
                </p>
              </Card>
            ) : (
              <div className="space-y-8">
                {categories.map((category) => {
                  const categoryFAQs = filteredFAQs.filter(
                    (faq) => faq.category === category
                  );

                  if (categoryFAQs.length === 0) return null;

                  return (
                    <div key={category}>
                      <h2 className="text-2xl font-bold mb-6 text-primary">
                        {category}
                      </h2>

                      <Accordion type="single" collapsible className="space-y-3">
                        {categoryFAQs.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border border-primary/20 rounded-lg px-6"
                          >
                            <AccordionTrigger className="hover:text-primary py-4">
                              <span className="text-left font-semibold">
                                {faq.question}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground pb-4">
                              {faq.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Contact CTA */}
            <div className="mt-20 bg-primary/10 p-8 rounded-lg border border-primary/20 text-center">
              <h3 className="text-2xl font-bold mb-2">¿No encontraste tu respuesta?</h3>
              <p className="text-muted-foreground mb-6">
                Estamos aquí para ayudarte. Contáctanos directamente.
              </p>
              <a
                href="/contacto"
                className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Contactar Soporte
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQPage;
