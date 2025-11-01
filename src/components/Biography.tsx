import { Award, Music2, Heart, Trophy } from "lucide-react";
import { Card } from "./ui/card";

const Biography = () => {
  return (
    <section id="biografia" className="py-20 bg-gradient-to-b from-background to-vallenato-cream/10">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Mi Historia</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Musical
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde las calles de Valledupar hasta enseñar a estudiantes de todo el mundo, 
            mi pasión por el vallenato ha sido el motor de mi vida.
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
                  <h3 className="text-2xl font-semibold text-primary mb-4">Los Primeros Pasos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Nací en el corazón del vallenato, donde el acordeón se escucha desde la cuna. 
                    A los 8 años, mi abuelo me regaló mi primer acordeón, y desde ese momento 
                    supe que mi vida estaría dedicada a esta hermosa música.
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
                  <h3 className="text-2xl font-semibold text-primary mb-4">Formación y Maestros</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Estudié con los grandes maestros del vallenato tradicional. Durante años 
                    perfeccioné mi técnica y desarrollé mi propio método de enseñanza que combina 
                    la tradición con técnicas modernas de aprendizaje.
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
                  <h3 className="text-2xl font-semibold text-primary mb-4">Pasión por Enseñar</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Mi verdadera pasión nació cuando comencé a enseñar. Ver cómo mis estudiantes 
                    se enamoran del vallenato y logran tocar sus primeras canciones es lo que 
                    me motiva cada día a seguir compartiendo este arte.
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
                    <div className="text-3xl font-bold text-primary">15</div>
                    <div className="text-sm text-muted-foreground">Premios Nacionales</div>
                  </div>
                  <div className="text-center">
                    <Award className="h-8 w-8 text-vallenato-red mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">500+</div>
                    <div className="text-sm text-muted-foreground">Estudiantes Exitosos</div>
                  </div>
                  <div className="text-center">
                    <Music2 className="h-8 w-8 text-vallenato-gold mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">25</div>
                    <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                  </div>
                  <div className="text-center">
                    <Heart className="h-8 w-8 text-accent mx-auto mb-3" />
                    <div className="text-3xl font-bold text-primary">∞</div>
                    <div className="text-sm text-muted-foreground">Pasión por el Vallenato</div>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="bg-gradient-accent text-white p-8 shadow-elegant">
              <blockquote className="text-lg italic leading-relaxed">
                "El vallenato no es solo música, es el alma de nuestro pueblo. Enseñar acordeón 
                es transmitir cultura, historia y sentimientos que van de generación en generación."
              </blockquote>
              <footer className="mt-4 font-semibold">— Maestro del Acordeón</footer>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Biography;