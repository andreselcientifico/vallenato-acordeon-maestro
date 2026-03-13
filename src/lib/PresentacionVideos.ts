// Hero videos configuration
// YouTube embedding format: https://www.youtube-nocookie.com/embed/{VIDEO_ID}
// Facebook Reel embedding: Can be embedded via iframe or as image preview

export interface PresentacionVideo {
  id: string;
  title: string;
  date: Date;
  source: "youtube" | "facebook";
  eventType: "bodas" | "cumpleaños" | "festival" | "corporativo" | "serenata" | "otro";
  videoUrl: string;
  embedUrl: string;
  description?: string;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Función para convertir URL de Facebook a embed URL
export function getFacebookEmbedUrl(facebookUrl: string): string {
  // Extrae el ID del reel de la URL
  const reelMatch = facebookUrl.match(/facebook\.com\/reel\/(\d+)/);
  if (reelMatch && reelMatch[1]) {
    const reelId = reelMatch[1];
    return `https://www.facebook.com/plugins/video.php?href=https://www.facebook.com/reel/${reelId}&show_text=false&width=550`;
  }
  return facebookUrl;
}

export function getYouTubeEmbedUrl(youtubeUrl: string): string {
  // Extrae el ID del video de la URL
  const videoIdMatch = youtubeUrl.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/
  );
  if (videoIdMatch && videoIdMatch[1]) {
    return `https://www.youtube-nocookie.com/embed/${videoIdMatch[1]}`;
  }
  return youtubeUrl;
}
