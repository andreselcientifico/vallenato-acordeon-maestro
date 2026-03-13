// Helper para importar sets de imágenes responsive
export interface ResponsiveImageSet {
  original: string;
  small: string;
  medium: string;
}

// Photos
import photo1Original from "@/assets/photos/photo1.avif";
import photo1Small from "@/assets/photos/photo1-small.avif";
import photo1Medium from "@/assets/photos/photo1-medium.avif";

import photo2Original from "@/assets/photos/photo2.avif";
import photo2Small from "@/assets/photos/photo2-small.avif";
import photo2Medium from "@/assets/photos/photo2-medium.avif";

import photo3Original from "@/assets/photos/photo3.avif";
import photo3Small from "@/assets/photos/photo3-small.avif";
import photo3Medium from "@/assets/photos/photo3-medium.avif";

import photo4Original from "@/assets/photos/photo4.avif";
import photo4Small from "@/assets/photos/photo4-small.avif";
import photo4Medium from "@/assets/photos/photo4-medium.avif";

import photo5Original from "@/assets/photos/photo5.avif";
import photo5Small from "@/assets/photos/photo5-small.avif";
import photo5Medium from "@/assets/photos/photo5-medium.avif";

export const photos: ResponsiveImageSet[] = [
  {
    original: photo1Original,
    small: photo1Small,
    medium: photo1Medium,
  },
  {
    original: photo2Original,
    small: photo2Small,
    medium: photo2Medium,
  },
  {
    original: photo3Original,
    small: photo3Small,
    medium: photo3Medium,
  },
  {
    original: photo4Original,
    small: photo4Small,
    medium: photo4Medium,
  },
  {
    original: photo5Original,
    small: photo5Small,
    medium: photo5Medium,
  },
];

// Hero background
import heroOriginal from "@/assets/hero-background.avif";
import heroSmall from "@/assets/hero-background-small.avif";
import heroMedium from "@/assets/hero-background-medium.avif";

export const heroBackground: ResponsiveImageSet = {
  original: heroOriginal,
  small: heroSmall,
  medium: heroMedium,
};

// Logo
import logoOriginal from "@/assets/vallenato-logo.avif";
import logoSmall from "@/assets/vallenato-logo-small.avif";
import logoMedium from "@/assets/vallenato-logo-medium.avif";

export const logo: ResponsiveImageSet = {
  original: logoOriginal,
  small: logoSmall,
  medium: logoMedium,
};
