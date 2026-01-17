import { Award, Music2, Heart, Trophy } from "lucide-react";
import { Card } from "./ui/card";

const Biography = () => {
  return (
    <section id="biografia" className="py-20 bg-gradient-to-b from-background to-vallenato-cream/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Andrea Paola</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Argote Chávez
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Maestra en Música con énfasis en Ingeniería de Sonido de la Pontificia Universidad Javeriana. 
            Acordeonista profesional, compositora, gestora cultural y embajadora del vallenato colombiano.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Music2 className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-4">Formación Académica</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Se graduó como Maestra en Música con énfasis en Ingeniería de Sonido de la 
                    Pontificia Universidad Javeriana en Bogotá (2019). Combina formación integral 
                    en teoría musical, análisis e interpretación con competencias técnicas en 
                    acústica, producción audiovisual y diseño de aplicaciones en software y hardware. 
                    Habla español nativamente e inglés nivel B1.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Award className="h-12 w-12 text-vallenato-red" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-4">Trayectoria Artística</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Participó a los 13 años en la categoría infantil del 42° Festival de la Leyenda 
                    Vallenata. Nuevamente compitió en categoría juvenil bajo la instrucción del Maestro 
                    Navín López. Reconocida como Embajadora Cultural de Colombia en Puerto Rico por el 
                    Centro Cultural Colombiano durante el VI Festival de la Independencia de Colombia. 
                    En 2021, recibió reconocimiento de la Alcaldía de Agustín Codazzi por su aporte como 
                    gestora cultural y autora en la música vallenata.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Heart className="h-12 w-12 text-vallenato-gold" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-4">Experiencia Profesional</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Ha trabajado en producción audiovisual e ingeniería de sonido a través de Estudios 
                    Music Record (2019-2020) realizando talleres en producción, audio digital y sonido 
                    en vivo. Se ha desempeñado como asistente de grabación en el Estudio CH de Carlos 
                    Huertas y como acordeonista profesional en Gaira Café. Domina grabación, mezcla, 
                    composición, arreglos y dirección de agrupaciones instrumentales y vocales.
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-2xl transform -rotate-3 animate-float"></div>
              <Card className="relative bg-card p-8 rounded-2xl shadow-elegant">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-primary mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">20+</div>
                    <div className="text-sm text-muted-foreground">Reconocimientos</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-vallenato-red mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">1000+</div>
                    <div className="text-sm text-muted-foreground">Estudiantes Entrenados</div>
                  </div>
                  <div className="text-center">
                    <Music2 className="h-8 w-8 text-vallenato-gold mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">20</div>
                    <div className="text-sm text-muted-foreground">Años de Docencia</div>
                  </div>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">3</div>
                    <div className="text-sm text-muted-foreground">Continentes Alcanzados</div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-accent text-white p-8 shadow-elegant">
              <blockquote className="text-lg italic leading-relaxed">
                "El acordeón es el corazón del vallenato. No enseño solo notas, enseño a mis 
                estudiantes a contar historias a través de la música, a conectar con sus emociones 
                y con la cultura que nos define."
              </blockquote>
              <footer className="mt-4 font-semibold">— Andrea Maestra de Acordeón</footer>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;