import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { sendContactEmail } from "@/api/email";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar campos
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsSubmitting(true);

    try {
      // Usar la función de API para enviar el email
      const response = await sendContactEmail(formData);

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        toast.success("¡Mensaje enviado exitosamente!");

        // Resetear el estado de éxito después de 5 segundos
        setTimeout(() => setIsSuccess(false), 5000);
      } else {
        toast.error("Error al enviar el mensaje. Por favor intenta más tarde.");
      }
    } catch (error) {
      console.error("Error sending contact form:", error);
      toast.error("Error al enviar el mensaje. Por favor intenta más tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <div className="pt-24 pb-16 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Ponte en</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Contacto
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes preguntas o sugerencias? Me encantaría escucharte. 
              Completa el formulario y nos pondremos en contacto contigo pronto.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {/* Contact Info Cards */}
            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-muted-foreground mb-4">
                contacto@andreovallenato.com
              </p>
              <a
                href="mailto:contacto@andreovallenato.com"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Enviar Email
              </a>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Teléfono</h3>
              <p className="text-muted-foreground mb-4">
                +57 (1) 1234-5678
              </p>
              <a
                href="tel:+573001234567"
                className="text-primary hover:text-primary/80 font-semibold"
              >
                Llamar Ahora
              </a>
            </Card>

            <Card className="p-8 text-center hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ubicación</h3>
              <p className="text-muted-foreground mb-4">
                Bogotá, Colombia
              </p>
              <p className="text-sm text-muted-foreground">
                Disponible para consultas en línea en todo el mundo
              </p>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-8">Envíanos tu Mensaje</h2>

              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">¡Gracias por tu mensaje!</h3>
                  <p className="text-muted-foreground mb-6">
                    Hemos recibido tu contacto y nos pondremos en contacto pronto.
                  </p>
                  <Button onClick={() => setIsSuccess(false)}>
                    Enviar otro mensaje
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nombre
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Tu nombre"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <Input
                        type="email"
                        name="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Asunto
                    </label>
                    <Input
                      type="text"
                      name="subject"
                      placeholder="¿De qué se trata?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje
                    </label>
                    <Textarea
                      name="message"
                      placeholder="Cuéntanos tu mensaje..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Mensaje
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactPage;
