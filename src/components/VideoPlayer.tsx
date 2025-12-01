interface VideoPlayerProps {
  src: string;
}

const VideoPlayer = ({ src }: VideoPlayerProps) => {
  if (!src) return <div>No hay video disponible</div>;

  // Detecta si es YouTube
  const youtubeIdMatch = src.match(/(?:youtu\.be\/|v=)([a-zA-Z0-9_-]{11})/);
  const youtubeId = youtubeIdMatch?.[1];

  if (youtubeId) {
    return (
      <div className="aspect-video">
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="Video del curso"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  // Video directo
  return (
    <div>
      <video src={src} controls width="100%" />
    </div>
  );
};

export default VideoPlayer;
