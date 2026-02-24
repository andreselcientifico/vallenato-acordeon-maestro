// Helper para importar sets de imágenes responsive
export interface ResponsiveImageSet {
  original: string;
  small: string;
  medium: string;
  large: string;
}

// Photos
import photo1Original from "@/assets/photos/photo1.webp";
import photo1Small from "@/assets/photos/photo1-small.webp";
import photo1Medium from "@/assets/photos/photo1-medium.webp";
import photo1Large from "@/assets/photos/photo1-large.webp";

import photo2Original from "@/assets/photos/photo2.webp";
import photo2Small from "@/assets/photos/photo2-small.webp";
import photo2Medium from "@/assets/photos/photo2-medium.webp";
import photo2Large from "@/assets/photos/photo2-large.webp";

import photo3Original from "@/assets/photos/photo3.webp";
import photo3Small from "@/assets/photos/photo3-small.webp";
import photo3Medium from "@/assets/photos/photo3-medium.webp";
import photo3Large from "@/assets/photos/photo3-large.webp";

import photo4Original from "@/assets/photos/photo4.webp";
import photo4Small from "@/assets/photos/photo4-small.webp";
import photo4Medium from "@/assets/photos/photo4-medium.webp";
import photo4Large from "@/assets/photos/photo4-large.webp";

export const photos: ResponsiveImageSet[] = [
  {
    original: photo1Original,
    small: photo1Small,
    medium: photo1Medium,
    large: photo1Large,
  },
  {
    original: photo2Original,
    small: photo2Small,
    medium: photo2Medium,
    large: photo2Large,
  },
  {
    original: photo3Original,
    small: photo3Small,
    medium: photo3Medium,
    large: photo3Large,
  },
  {
    original: photo4Original,
    small: photo4Small,
    medium: photo4Medium,
    large: photo4Large,
  },
];

// Hero background
import heroOriginal from "@/assets/hero-background.webp";
import heroSmall from "@/assets/hero-background-small.webp";
import heroMedium from "@/assets/hero-background-medium.webp";
import heroLarge from "@/assets/hero-background-large.webp";

export const heroBackground: ResponsiveImageSet = {
  original: heroOriginal,
  small: heroSmall,
  medium: heroMedium,
  large: heroLarge,
};

// Logo
import logoOriginal from "@/assets/vallenato-logo.webp";
import logoSmall from "@/assets/vallenato-logo-small.webp";
import logoMedium from "@/assets/vallenato-logo-medium.webp";
import logoLarge from "@/assets/vallenato-logo-large.webp";

export const logo: ResponsiveImageSet = {
  original: logoOriginal,
  small: logoSmall,
  medium: logoMedium,
  large: logoLarge,
};
