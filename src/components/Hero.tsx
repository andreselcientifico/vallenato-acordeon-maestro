import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { heroBackground } from "@/util/imageImports";
import { ResponsiveImage } from "./ui/ResponsiveImage";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section
      id="inicio"
      className="relative min-h-[calc(100vh-4rem)] flex items-start lg:items-center justify-center px-4 pt-10 sm:pt-20 pb-20 overflow-hidden"
    >
      {/** Imagen REAL para el fondo del Hero (LCP) */}
      <ResponsiveImage
        src={heroBackground.original}
        srcSmall={heroBackground.small}
        srcMedium={heroBackground.medium}
        srcLarge={heroBackground.original}
        alt="Fondo musical vallenato"
        className="absolute inset-0 w-full h-full object-cover object-right lg:object-center"
        loading="eager"
        fetchPriority="high"
        widths={{ small: 640, medium: 1280, large: 1920 }}
        sizes="100vw"
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
            <div className="flex flex-col md:flex-row gap-4 pt-2 justify-center lg:justify-start">
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
              <Button
                variant="outline"
                className="border-white/40 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm w-full h-14 text-lg font-bold shadow-lg"
                size="lg"
                onClick={() => navigate("/galeria-presentaciones")}
              >
                Mis Presentaciones
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
