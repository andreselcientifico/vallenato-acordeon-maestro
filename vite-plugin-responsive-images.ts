import type { Plugin } from 'vite';

export function responsiveImagesPlugin(): Plugin {
  return {
    name: 'vite-plugin-responsive-images',
    enforce: 'pre',
    
    resolveId(id) {
      // Interceptar imports de imágenes con sufijos responsive
      if (id.match(/-(?:small|medium|large)\.(webp|jpg|jpeg|png)$/i)) {
        return id;
      }
      return null;
    },
    
    load(id) {
      // Dejar que Vite maneje las imágenes responsive normalmente
      if (id.match(/-(?:small|medium|large)\.(webp|jpg|jpeg|png)$/i)) {
        return null; // Vite lo procesará
      }
      return null;
    },
  };
}
