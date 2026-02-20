import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import heroBackground from "@/assets/hero-background.webp";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="inicio"
      className="relative min-h-[calc(100vh-4rem)] flex items-start lg:items-center justify-center px-4 pt-10 sm:pt-20 pb-20 overflow-hidden"
    >
      {/** Imagen REAL para el fondo del Hero (LCP) */}
      <img
        src={heroBackground}
        alt="Fondo musical vallenato"
        className="absolute inset-0 w-full h-full object-cover object-right lg:object-center"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        width="1920"
        height="1080"
      />

      {/** Overlay para legibilidad mejorada */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent dark:from-black/80"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start lg:items-center max-w-7xl mx-auto">
          {/** CONTENIDO PRINCIPAL */}
          <div className="space-y-6 sm:space-y-8 max-w-xl pt-12 lg:pt-0 text-center lg:text-left mx-auto lg:mx-0">
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)]">
                <span className="text-primary">Maestro</span>{" "}
                <span className="bg-gradient-hero bg-clip-text text-transparent">
                  del Acordeón
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium max-w-lg drop-shadow-md leading-relaxed mx-auto xl:mx-0">
                Aprende vallenato auténtico con la mejor experiencia enseñando
                el corazón de la música colombiana.
              </p>
            </div>

            {/** Botones */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2 justify-center lg:justify-start">
              <Button
                variant="hero"
                size="lg"
                className="flex items-center justify-center space-x-2 shadow-2xl w-full sm:w-auto text-lg h-14"
                onClick={() => navigate("/cursos")}
              >
                <Play className="h-6 w-6" />
                <span>Comenzar Ahora</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-white/40 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full sm:w-auto text-lg h-14"
                onClick={() => {
                  const biografiaSection = document.getElementById("biografia");
                  biografiaSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Conoce Mi Historia
              </Button>
            </div>
          </div>

          {/** CUADRO A LA DERECHA - VIDEO DE PRESENTACIÓN */}
          <div className="mt-8 lg:mt-0 flex lg:justify-center lg:items-center">
            <div className="relative w-full max-w-lg group">
              {/** Decoración animada de fondo */}
              <div className="absolute inset-0 bg-gradient-hero rounded-[2.5rem] transform rotate-3 scale-105 opacity-40 blur-2xl group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-vallenato-red/30 rounded-[2.5rem] transform -rotate-2 scale-100 opacity-30 animate-pulse -z-10"></div>

              <Card className="relative z-10 bg-black/40 backdrop-blur-xl p-5 sm:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-2xl border border-white/10 w-full overflow-hidden">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl lg:text-2xl font-bold text-white mb-2">
                      Presentación
                    </h2>
                    <p className="text-xs lg:text-sm text-white/80">
                      Conoce nuestra academia y metodología
                    </p>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-white/10 shadow-inner bg-black aspect-video relative">
                    <iframe
                      width="100%"
                      height="100%"
                      src="https://www.youtube-nocookie.com/embed/efFC9ROqTzM"
                      title="Video de presentación"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    ></iframe>
                  </div>

                  <Button
                    variant="hero"
                    className="w-full h-12 text-base font-bold shadow-lg"
                    size="lg"
                    onClick={() => navigate("/cursos")}
                  >
                    Explorar Cursos
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
