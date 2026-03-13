import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ResponsiveImage } from "./ui/ResponsiveImage";

import { photos } from "@/util/imageImports";

const images = photos;

const PhotoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length,
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="text-primary">Andrea Paola</span> en Acción
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Momentos compartidos a través de la música y el acordeón.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto group">
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl shadow-elegant border-4 border-primary/10">
            {images.map((image, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <ResponsiveImage
                  src={image.original}
                  srcSmall={image.small}
                  srcMedium={image.medium}
                  srcLarge={image.original}
                  alt={`Andrea Paola ${index + 1}`}
                  className="w-full h-full object-cover"
                  widths={{ small: 480, medium: 900, large: 1600 }}
                  sizes="(max-width: 896px) 100vw, 896px"
                  width="896"
                  height="504"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={prevSlide}
            aria-label="Anterior imagen"
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={nextSlide}
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
            {images.map((_, index) => (
              <button
                key={index}
                className="group/dot p-3 -m-3"
                aria-label={`Ir a imagen ${index + 1}`}
                onClick={() => setCurrentIndex(index)}
              >
                <div
                  className={`h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? "w-8 bg-primary"
                      : "w-2 bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PhotoCarousel;
