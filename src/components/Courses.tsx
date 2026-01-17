import { useNavigate } from "react-router-dom";
import { BookOpen, Star, Zap, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

const Courses = () => {
  const navigate = useNavigate();

  return (
    <section id="cursos" className="py-20 bg-gradient-to-b from-background via-vallenato-cream/5 to-background">
      <div className="container mx-auto px-4">
        {/* Encabezado Principal */}
        <div className="text-center mb-20">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            <span className="text-primary">Aprende a Tocar</span>{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              el Acordeón
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4 leading-relaxed">
            Cursos diseñados por una Maestra en Música con experiencia internacional. 
            Desde principiantes hasta niveles avanzados, con metodología probada y reconocimientos internacionales.
          </p>
        </div>

        {/* Características Principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20 hover:shadow-warm transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Cursos de Calidad</h3>
            </div>
            <p className="text-muted-foreground">
              Metodología probada con miles de estudiantes satisfechos alrededor del mundo
            </p>
          </Card>

          <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20 hover:shadow-warm transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-vallenato-red/10 rounded-lg">
                <Users className="h-6 w-6 text-vallenato-red" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Comunidad Global</h3>
            </div>
            <p className="text-muted-foreground">
              Aprende con estudiantes de 3 continentes diferentes en un ambiente inclusivo
            </p>
          </Card>

          <Card className="bg-gradient-card p-8 shadow-elegant border-primary/20 hover:shadow-warm transition-all duration-300">
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 bg-vallenato-gold/10 rounded-lg">
                <Zap className="h-6 w-6 text-vallenato-gold" />
              </div>
              <h3 className="text-lg font-semibold text-primary">Acceso 24/7</h3>
            </div>
            <p className="text-muted-foreground">
              Aprende a tu propio ritmo con acceso ilimitado a todo el material del curso
            </p>
          </Card>
        </div>

        {/* CTA Principal - Botón Grande Atractivo */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-hero rounded-3xl transform -rotate-2 blur-2xl opacity-30"></div>
          <Card className="relative bg-gradient-to-r from-primary/90 to-vallenato-red/90 backdrop-blur-xl border-primary/50 p-12 md:p-16 shadow-elegant overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-vallenato-gold/10 rounded-full -mr-36 -mt-36"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full -ml-48 -mb-48"></div>

            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="lg:w-1/2">
                  <h3 className="text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                    Comienza Tu Viaje Musical Hoy
                  </h3>
                  <p className="text-lg text-white/90 mb-8 leading-relaxed">
                    Explora nuestro catálogo completo de cursos de acordeón vallenato. 
                    Cada curso está diseñado con cuidado para llevarte del aprendizaje básico 
                    a la maestría musical. Acceso inmediato a todas las lecciones y materiales.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="secondary"
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold shadow-elegant text-base"
                      onClick={() => navigate('/cursos')}
                    >
                      <BookOpen className="h-5 w-5 mr-2" />
                      Ver Todos los Cursos
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-white text-white hover:bg-white/10 font-semibold text-base"
                      onClick={() => navigate('/cursos')}
                    >
                      Detalles de Precios
                    </Button>
                  </div>
                </div>

                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white">
                        <div className="text-6xl mb-4">🎵</div>
                        <p className="text-xl font-semibold text-center">Aprende Acordeón</p>
                        <p className="text-sm text-white/80 text-center mt-2">De forma online</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">1000+</div>
                  <div className="text-sm text-white/80">Estudiantes Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">20+</div>
                  <div className="text-sm text-white/80">Cursos Disponibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">4.9★</div>
                  <div className="text-sm text-white/80">Puntuación Promedio</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sección de Testimonio / Llamado adicional */}
        <div className="mt-16 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            "Cada estudiante merece aprender música de una manera inspiradora y efectiva"
          </p>
          <div className="flex justify-center items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-hero"></div>
            <div className="text-left">
              <p className="font-semibold text-primary">Andrea Paola Argote Chávez</p>
              <p className="text-sm text-muted-foreground">Maestra en Música, Ingeniería de Sonido</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Courses;
