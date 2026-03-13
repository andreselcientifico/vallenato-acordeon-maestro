import { useEffect, useState } from "react";
import {
  Music,
  Calendar,
  MapPin,
  Users,
  Send,
  CheckCircle,
  Heart,
  Star,
  PartyPopper,
  Building2,
  Mic2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { sendEventRequest } from "@/api/events";

const eventTypes = [
  {
    id: "boda",
    icon: Heart,
    title: "Bodas",
    description:
      "Música vallenata en vivo para hacer tu boda un momento inolvidable.",
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "cumpleaños",
    icon: PartyPopper,
    title: "Cumpleaños",
    description:
      "Celebra tu cumpleaños con la mejor música vallenata y el acordeón en vivo.",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "festival",
    icon: Music,
    title: "Festivales",
    description:
      "Presentaciones profesionales para festivales y eventos culturales.",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "corporativo",
    icon: Building2,
    title: "Corporativos",
    description:
      "Ameniza tu evento empresarial con música profesional de acordeón vallenato.",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "serenata",
    icon: Mic2,
    title: "Serenatas",
    description:
      "Sorprende a esa persona especial con una serenata vallenata personalizada.",
    color: "from-purple-500 to-violet-500",
  },
  {
    id: "otro",
    icon: Star,
    title: "Otros Eventos",
    description:
      "¿Tienes otro tipo de evento en mente? ¡Contáctanos y lo hacemos posible!",
    color: "from-slate-500 to-gray-600",
  },
];

const EventsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedType, setSelectedType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    location: "",
    guests: "",
    message: "",
    budget: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !selectedType ||
      !formData.message
    ) {
      toast.error("Por favor completa los campos obligatorios");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un email válido");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await sendEventRequest({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        eventType: selectedType,
        eventDate: formData.eventDate || undefined,
        location: formData.location || undefined,
        guests: formData.guests ? parseInt(formData.guests) : undefined,
        message: formData.message,
        budget: formData.budget || undefined,
      });

      if (response.ok) {
        setIsSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          eventDate: "",
          location: "",
          guests: "",
          message: "",
          budget: "",
        });
        setSelectedType("");
        toast.success("¡Solicitud enviada exitosamente!");
        setTimeout(() => setIsSuccess(false), 8000);
      } else {
        const data = await response.json().catch(() => null);
        toast.error(
          data?.message ||
            "Error al enviar la solicitud. Por favor intenta más tarde.",
        );
      }
    } catch (error) {
      console.error("Error sending event request:", error);
      toast.error("Error al enviar la solicitud. Por favor intenta más tarde.");
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
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-6">
              <Music className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Eventos en vivo
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Lleva la música</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">
                Vallenata
              </span>{" "}
              <span className="text-primary">a tu evento</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              ¿Quieres que tu evento sea inolvidable? Contrata a Andrea Paola
              Argote Chávez para llenar de alegría y tradición tu celebración
              con el sonido auténtico del acordeón vallenato.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>Disponible para eventos</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Nacional e Internacional</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                <span>Eventos de cualquier tamaño</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Tipos de Eventos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrezco presentaciones profesionales para todo tipo de
              celebraciones. Selecciona el tipo de evento que te interesa.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {eventTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <Card
                  key={type.id}
                  className={`p-6 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                    isSelected
                      ? "ring-2 ring-primary shadow-lg scale-[1.02]"
                      : "hover:ring-1 hover:ring-primary/30"
                  }`}
                  onClick={() => {
                    setSelectedType(type.id);
                    const form = document.getElementById("event-form");
                    if (form) {
                      setTimeout(
                        () =>
                          form.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                          }),
                        200,
                      );
                    }
                  }}
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{type.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                  {isSelected && (
                    <div className="mt-3 text-sm font-medium text-primary flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Seleccionado
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="py-16 bg-muted/30" id="event-form">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 lg:p-12">
              <h2 className="text-3xl font-bold mb-2">
                Solicita tu Cotización
              </h2>
              <p className="text-muted-foreground mb-8">
                Completa el formulario y me pondré en contacto contigo para
                coordinar todos los detalles de tu evento.
              </p>

              {isSuccess ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">
                    ¡Solicitud Enviada!
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Hemos recibido tu solicitud de evento. Me pondré en contacto
                    contigo pronto para coordinar los detalles.
                  </p>
                  <Button onClick={() => setIsSuccess(false)}>
                    Enviar otra solicitud
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Event type display */}
                  {selectedType && (
                    <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                      {(() => {
                        const et = eventTypes.find(
                          (t) => t.id === selectedType,
                        );
                        if (!et) return null;
                        const Icon = et.icon;
                        return (
                          <>
                            <div
                              className={`w-8 h-8 rounded-lg bg-gradient-to-br ${et.color} flex items-center justify-center`}
                            >
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">
                                Tipo de evento
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {et.title}
                              </p>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="ml-auto text-xs"
                              onClick={() => setSelectedType("")}
                            >
                              Cambiar
                            </Button>
                          </>
                        );
                      })()}
                    </div>
                  )}

                  {!selectedType && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        👆 Selecciona un tipo de evento arriba para continuar
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Nombre *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Email *
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Teléfono
                      </label>
                      <Input
                        type="tel"
                        name="phone"
                        placeholder="+57 300 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Fecha del evento
                      </label>
                      <Input
                        type="date"
                        name="eventDate"
                        value={formData.eventDate}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Ubicación
                      </label>
                      <Input
                        type="text"
                        name="location"
                        placeholder="Ciudad, lugar del evento"
                        value={formData.location}
                        onChange={handleChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Invitados estimados
                      </label>
                      <Input
                        type="number"
                        name="guests"
                        placeholder="Ej: 100"
                        min="1"
                        value={formData.guests}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Presupuesto estimado
                    </label>
                    <Input
                      type="text"
                      name="budget"
                      placeholder="Ej: $500.000 - $1.000.000 COP"
                      value={formData.budget}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Mensaje *
                    </label>
                    <Textarea
                      name="message"
                      placeholder="Cuéntame más sobre tu evento: horarios, tipo de música preferido, requisitos especiales..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting || !selectedType}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin h-4 w-4 mr-2 border-2 border-t-transparent border-white rounded-full"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Solicitud
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Los campos marcados con * son obligatorios. Me pondré en
                    contacto contigo en un plazo de 24-48 horas.
                  </p>
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

export default EventsPage;
