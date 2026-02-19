import { Award, Music2, Heart } from "lucide-react";
import { Card } from "./ui/card";

const Biography = () => {
  return (
    <section
      id="biografia"
      className="py-24 lg:py-32 bg-gradient-to-b from-background via-vallenato-cream/5 to-background"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto pt-24 lg:pt-0">
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 lg:mb-8 tracking-tight">
            <span className="text-primary drop-shadow-sm">Andrea Paola</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Argote Chávez
            </span>
          </h2>
          <p className="text-lg lg:text-2xl text-muted-foreground leading-relaxed font-light">
            Maestra en Música con énfasis en Ingeniería de Sonido. Acordeonista
            profesional y embajadora de la cultura vallenata.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-16 items-start max-w-7xl mx-auto">
          <div className="space-y-8 lg:space-y-12">
            <div className="group transition-all duration-300">
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 p-3 lg:p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                  <Music2 className="h-8 w-8 lg:h-10 lg:w-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2 lg:mb-4">
                    Formación Académica
                  </h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                    Maestra en Música con énfasis en Ingeniería de Sonido de la
                    Pontificia Universidad Javeriana. Certificada por{" "}
                    <strong>EMMAT Berklee</strong> en Grabación de Música y
                    Sonido, y por la{" "}
                    <strong>Fundación Universitaria del Área Andina</strong> en
                    Pedagogía Docencia.
                  </p>
                </div>
              </div>
            </div>

            <div className="group transition-all duration-300">
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 p-3 lg:p-4 bg-vallenato-red/5 rounded-2xl group-hover:bg-vallenato-red/10 transition-colors">
                  <Award className="h-8 w-8 lg:h-10 lg:w-10 text-vallenato-red" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2 lg:mb-4">
                    Trayectoria Artística
                  </h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                    Desde los 13 años en el Festival de la Leyenda Vallenata.
                    Reconocida como Embajadora Cultural de Colombia y premiada
                    por su aporte como gestora cultural y autora en la música
                    vallenata.
                  </p>
                </div>
              </div>
            </div>

            <div className="group transition-all duration-300">
              <div className="flex items-start space-x-4 lg:space-x-6">
                <div className="flex-shrink-0 p-3 lg:p-4 bg-vallenato-gold/5 rounded-2xl group-hover:bg-vallenato-gold/10 transition-colors">
                  <Heart className="h-8 w-8 lg:h-10 lg:w-10 text-vallenato-gold" />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold text-primary mb-2 lg:mb-4">
                    Experiencia Profesional
                  </h3>
                  <p className="text-base lg:text-lg text-muted-foreground leading-relaxed">
                    Ingeniera de sonido y acordeonista profesional en escenarios
                    icónicos como Gaira Café. Domina la grabación, mezcla y
                    dirección de agrupaciones instrumentales y vocales.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="md:sticky md:top-24">
            <Card className="bg-gradient-to-br from-primary/95 to-vallenato-red/95 text-white p-8 lg:p-12 shadow-2xl rounded-[1.5rem] lg:rounded-[2rem] border-none overflow-hidden relative">
              <div className="absolute top-0 right-0 w-24 h-24 lg:w-32 lg:h-32 bg-white/10 rounded-full -mr-12 -mt-12 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 lg:w-32 lg:h-32 bg-black/10 rounded-full -ml-12 -mb-12 blur-3xl"></div>

              <div className="relative space-y-6 lg:space-y-8">
                <Music2 className="h-10 w-10 lg:h-12 lg:w-12 text-white/40" />
                <blockquote className="text-xl lg:text-3xl italic leading-relaxed font-medium">
                  "El acordeón es el corazón del vallenato. No enseño solo
                  notas, enseño a mis estudiantes a contar historias a través de
                  la música."
                </blockquote>
                <div className="pt-6 border-t border-white/20">
                  <footer className="font-bold text-lg lg:text-xl text-white">
                    Andrea Paola Argote
                  </footer>
                  <p className="text-white/70 text-xs lg:text-sm mt-1 uppercase tracking-widest font-semibold">
                    Maestra de Acordeón
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;
