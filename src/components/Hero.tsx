import { useNavigate } from "react-router-dom";
import { useState, useEffect, memo } from "react";
import { Play, Star, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import heroBackground from "@/assets/hero-background.webp";
import { fetchCourses_API } from "@/api/admin";

/**
 * HERO optimizado para Lighthouse:
 * - Se reemplaza el background-image por un <img> real para permitir prioridad de carga.
 * - La imagen ahora puede usar fetchpriority="high" y loading="eager".
 * - Esto mejora drásticamente el Largest Contentful Paint (LCP).
 */
const Hero = memo(() => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const courses = await fetchCourses_API();
        const totalStudents = courses.reduce((sum: number, course: any) => sum + (course.students || 0), 0);
        const totalCourses = courses.length;
        
        setStats({
          totalStudents,
          totalCourses,
        });
      } catch (error) {
        console.warn("Error loading stats:", error);
        // Mantener valores por defecto si falla la carga
      }
    };

    loadStats();
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-[calc(100vh-5rem)] flex items-start lg:items-center justify-center px-4 pt-20 pb-20 overflow-hidden"
    >
      {/** Imagen REAL para el fondo del Hero (LCP) */}
      <img
        src={heroBackground}
        alt="Fondo musical vallenato"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"          // Cárgala inmediatamente
      />

      {/** Overlay para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent dark:from-black/70"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start lg:items-center max-w-7xl mx-auto">
          {/** CONTENIDO PRINCIPAL */}
          <div className="space-y-8 max-w-xl">
            <div className="space-y-4">
              <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-primary">Maestro</span>{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  del Acordeón
                </span>
              </h1>

              <p className="text-sm sm:text-base md:text-xl lg:text-2xl text-muted-foreground max-w-lg">
                Aprende vallenato auténtico con más de 20 años de experiencia
                enseñando el corazón de la música colombiana.
              </p>
            </div>

            {/** Botones */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="hero"
                size="lg"
                className="flex items-center justify-center space-x-2 shadow-elegant w-full sm:w-auto"
                onClick={() => navigate("/cursos")}
              >
                <Play className="h-5 w-5" />
                <span>Comenzar Ahora</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground w-full sm:w-auto"
                onClick={() => {
                  const biografiaSection = document.getElementById("biografia");
                  biografiaSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Conoce Mi Historia
              </Button>
            </div>

            {/** Estadísticas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <Card className="bg-gradient-card p-4 sm:p-6 text-center shadow-warm">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalStudents}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Estudiantes</div>
              </Card>

              <Card className="bg-gradient-card p-4 sm:p-6 text-center shadow-warm">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-primary mx-auto mb-2" />
                <div className="text-xl sm:text-2xl font-bold text-primary">{stats.totalCourses}+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Cursos</div>
              </Card>
            </div>
          </div>

          {/** CUADRO A LA DERECHA */}
          <div className="mt-8 lg:mt-0 flex lg:justify-center lg:items-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-hero rounded-3xl transform rotate-3 animate-float -z-10 opacity-90"></div>

              <Card className="relative z-10 bg-card/95 backdrop-blur-sm p-6 sm:p-8 rounded-3xl shadow-elegant border-2 border-primary/20 w-full max-w-md">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-primary mb-2">Clase Gratuita</h3>
                    <p className="text-muted-foreground">
                      Aprende tu primera canción en 30 minutos
                    </p>
                  </div>

                  <div className="aspect-video bg-gradient-accent rounded-lg flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                  </div>

                  <Button
                    variant="hero"
                    className="w-full"
                    size="lg"
                    onClick={() => navigate("/cursos")}
                  >
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
});

Hero.displayName = 'Hero';

export default Hero;
