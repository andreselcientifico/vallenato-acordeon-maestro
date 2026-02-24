import React from "react";

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  srcSmall?: string;
  srcMedium?: string;
  srcLarge?: string;
  alt: string;
  className?: string;
  sizes?: string;
  loading?: "lazy" | "eager";
  widths?: {
    small: number;
    medium: number;
    large: number;
  };
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  srcSmall,
  srcMedium,
  srcLarge,
  alt,
  className = "",
  sizes = "100vw",
  loading = "lazy",
  widths = { small: 400, medium: 750, large: 1200 },
  ...props
}) => {
  // Generar srcSet basado en props explícitos o fallback a lógica de nombres
  let finalSrcSet = "";
  let finalSrc = src;

  if (srcSmall && srcMedium && srcLarge) {
    // Si tenemos los props explícitos (método recomendado ahora)
    finalSrcSet = `
      ${srcSmall} ${widths.small}w,
      ${srcMedium} ${widths.medium}w,
      ${srcLarge} ${widths.large}w
    `.trim();
    finalSrc = srcMedium;
  } else {
    // Fallback: Lógica de resolución inteligente anterior (útil para compatibilidad)
    const regex =
      /^(.+\/)(.+?)(?:-([a-zA-Z0-9_-]{8,}))?(\.(webp|jpg|jpeg|png))(?:\?.*)?$/i;
    const matches = src.match(regex);

    if (matches) {
      const fileName = matches[2];
      const ext = matches[4];
      const cleanDirectory = "/assets/"; // Ajustado para coincidir con optimize-images.js

      finalSrcSet = `
        ${cleanDirectory}${fileName}-small${ext} ${widths.small}w,
        ${cleanDirectory}${fileName}-medium${ext} ${widths.medium}w,
        ${cleanDirectory}${fileName}-large${ext} ${widths.large}w
      `.trim();
      finalSrc = `${cleanDirectory}${fileName}-medium${ext}`;
    }
  }

  return (
    <picture>
      <source type="image/webp" srcSet={finalSrcSet} sizes={sizes} />
      <img
        src={finalSrc}
        srcSet={finalSrcSet}
        sizes={sizes}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        {...props}
      />
    </picture>
  );
};
