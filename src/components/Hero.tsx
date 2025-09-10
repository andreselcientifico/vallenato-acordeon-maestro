import { Play, Star, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  return (
    <section 
      id="inicio" 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${heroBackground})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-primary">Maestro</span>{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  del Acordeón
                </span>
              </h1>
              <p className="text-xl lg:text-2xl text-muted-foreground max-w-lg">
                Aprende vallenato auténtico con más de 20 años de experiencia enseñando el corazón de la música colombiana.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="flex items-center space-x-2 shadow-elegant">
                <Play className="h-5 w-5" />
                <span>Ver Demo Gratuito</span>
              </Button>
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                Conoce Mi Historia
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <Card className="bg-gradient-card p-6 text-center shadow-warm">
                <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">Estudiantes</div>
              </Card>
              <Card className="bg-gradient-card p-6 text-center shadow-warm">
                <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">20+</div>
                <div className="text-sm text-muted-foreground">Años Enseñando</div>
              </Card>
              <Card className="bg-gradient-card p-6 text-center shadow-warm">
                <Play className="h-8 w-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">100+</div>
                <div className="text-sm text-muted-foreground">Videos Lecciones</div>
              </Card>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl transform rotate-3 animate-float"></div>
              <Card className="relative bg-card/90 backdrop-blur-sm p-8 rounded-3xl shadow-elegant border-2 border-primary/20">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary mb-2">Clase Gratuita</h3>
                    <p className="text-muted-foreground">Aprende tu primera canción en 30 minutos</p>
                  </div>
                  <div className="aspect-video bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <Button variant="hero" className="w-full" size="lg">
                    Comenzar Ahora Gratis
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;