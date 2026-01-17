import { useEffect } from "react";
import { Award, Music2, Heart, Trophy, Briefcase, BookOpen, Globe, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutPage = () => {
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
              <span className="text-primary">Andrea Paola</span>{" "}
              <span className="bg-gradient-accent bg-clip-text text-transparent">Argote Chávez</span>
            </h1>
            <p className="text-2xl text-vallenato-red font-semibold mb-4">
              Maestra en Música con énfasis en Ingeniería de Sonido
            </p>
            <div className="flex justify-center gap-3 flex-wrap mb-6">
              <Badge className="bg-primary/20 text-primary border-primary/30">Pontificia Universidad Javeriana</Badge>
              <Badge className="bg-vallenato-red/20 text-vallenato-red border-vallenato-red/30">Embajadora Cultural</Badge>
              <Badge className="bg-vallenato-gold/20 text-vallenato-gold border-vallenato-gold/30">Acordeón Vallenato</Badge>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Artista, educadora y emprendedora apasionada por preservar y compartir la tradición del vallenato 
              con estudiantes de todo el mundo a través de metodología innovadora.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          {/* Formación Académica */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-primary">Formación</span>{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">Académica</span>
              </h2>
              <p className="text-lg text-muted-foreground">Educación formal en música y tecnología de sonido</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Maestra en Música</h3>
                    <p className="text-sm text-muted-foreground mb-3">Pontificia Universidad Javeriana</p>
                    <p className="text-sm text-muted-foreground mb-2">Énfasis: Ingeniería de Sonido</p>
                    <p className="text-sm font-semibold text-primary">Graduada: 16 de marzo de 2019</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-vallenato-gold/10 rounded-lg">
                    <Globe className="h-8 w-8 text-vallenato-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Idiomas</h3>
                    <div className="space-y-2">
                      <p className="text-sm"><span className="font-semibold">Español:</span> Idioma Natal</p>
                      <p className="text-sm"><span className="font-semibold">Inglés:</span> Nivel B1</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Competencias Profesionales */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-primary">Competencias</span>{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">Profesionales</span>
              </h2>
              <p className="text-lg text-muted-foreground">Habilidades desarrolladas a través de formación y experiencia</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { icon: Music2, title: "Interpretación Musical", desc: "Acordeón diatónico y otros instrumentos" },
                { icon: Award, title: "Composición y Arreglos", desc: "Creación de repertorio para diversos formatos" },
                { icon: Briefcase, title: "Producción Audiovisual", desc: "Mezcla, grabación y diseño de sonido" },
                { icon: Heart, title: "Pedagogía Musical", desc: "Enseñanza y metodología de formación integral" },
                { icon: Star, title: "Acústica y Tecnología", desc: "Diseño de aplicaciones en software y hardware" },
                { icon: Trophy, title: "Gestión Cultural", desc: "Dirección de eventos y proyectos musicales" },
              ].map((skill, index) => (
                <Card key={index} className="bg-gradient-card p-6 shadow-elegant border-primary/20 hover:shadow-warm transition-all">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <skill.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">{skill.title}</h4>
                      <p className="text-sm text-muted-foreground">{skill.desc}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trayectoria Artística */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-primary">Trayectoria</span>{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">Artística</span>
              </h2>
              <p className="text-lg text-muted-foreground">Participaciones y reconocimientos internacionales</p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-vallenato-red/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-vallenato-red" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Festival de la Leyenda Vallenata</h3>
                    <p className="text-muted-foreground mb-2">
                      A los 13 años participó en la categoría infantil (2009). Nuevamente compitió en categoría juvenil (2011) 
                      bajo la instrucción del Maestro Navín López, expresando su aspiración de ser acordeonera profesional.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-vallenato-gold/10 rounded-lg">
                    <Award className="h-6 w-6 text-vallenato-gold" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Embajadora Cultural de Colombia</h3>
                    <p className="text-muted-foreground mb-2">
                      Reconocimiento del Centro Cultural Colombiano en Puerto Rico durante el VI Festival de la Independencia 
                      de Colombia en Guaynabo (2021). Reconocida por su contribución al fomento y desarrollo de la cultura musical 
                      y el vallenato, afianzando lazos y promocionando la buena imagen de Colombia en el exterior.
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Music2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Reconocimiento Oficial - Agustín Codazzi</h3>
                    <p className="text-muted-foreground">
                      Noviembre de 2021: La Alcaldía de Agustín Codazzi otorgó reconocimiento público por su aporte como 
                      gestora cultural y autora en la música vallenata en guitarra.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Experiencia Laboral */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">
                <span className="text-primary">Experiencia</span>{" "}
                <span className="bg-gradient-accent bg-clip-text text-transparent">Profesional</span>
              </h2>
              <p className="text-lg text-muted-foreground">Trabajo en producción, educación y gestión cultural</p>
            </div>

            <div className="space-y-6 max-w-4xl mx-auto">
              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-2">Estudios Music Record</h3>
                <p className="text-sm text-muted-foreground mb-3">Producción Audiovisual e Ingeniería de Sonido</p>
                <p className="text-sm text-muted-foreground mb-3">Abril 2019 - Enero 2020 | Agustín Codazzi, Colombia</p>
                <p className="text-muted-foreground">
                  Talleres en competencias de producción, audio digital, sonido en vivo y diseño sonoro. Formación especializada 
                  en producción de proyectos musicales, asistencia en grabación y mezcla, apoyo en proyectos compositivos y 
                  manejo de equipos de alta gama.
                </p>
              </Card>

              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-2">Estudio CH (Carlos Huertas)</h3>
                <p className="text-sm text-muted-foreground mb-3">Asistente de Grabación</p>
                <p className="text-muted-foreground">
                  Bogotá, Colombia. Asistencia en procesos de grabación, mezcla y producción musical en ambiente profesional.
                </p>
              </Card>

              <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
                <h3 className="text-xl font-bold text-primary mb-2">Gaira Café Música Local</h3>
                <p className="text-sm text-muted-foreground mb-3">Acordeonista Profesional</p>
                <p className="text-muted-foreground">
                  Presentaciones en vivo y actuaciones musicales con reconocimiento profesional en música vallenata tradicional.
                </p>
              </Card>
            </div>
          </div>

          {/* CTA Section */}
          <div className="max-w-2xl mx-auto text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-vallenato-red/10 p-12 shadow-elegant border-primary/20">
              <h3 className="text-3xl font-bold text-primary mb-4">Comienza tu viaje musical</h3>
              <p className="text-lg text-muted-foreground mb-8">
                Aprende de una Maestra en Música reconocida internacionalmente. Acceso a cursos de acordeón vallenato 
                de alta calidad diseñados para todos los niveles.
              </p>
              <Button variant="hero" size="lg" className="shadow-elegant">
                Explorar Cursos
              </Button>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
