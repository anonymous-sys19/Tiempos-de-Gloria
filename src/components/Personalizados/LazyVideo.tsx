import { useState, useEffect } from "react";

interface LazyVideoProps {
  className?: string;
  urlItem: string;
    placeholder?: string;
  EventCLick?: () => void | string;
  refs?: React.RefObject<HTMLVideoElement> | null | undefined | string;
  muteds?: boolean;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  className = "",
  urlItem,
    placeholder = "https://via.placeholder.com/300x200?text=Cargando+Video",
  EventCLick,
  refs,
  muteds,
}) => {
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = urlItem;
    video.onloadeddata = () => {
      setVideoSrc(urlItem);
      setLoading(false);
    };
    video.onerror = () => {
      setVideoSrc(""); // No muestra video si hay error
      setLoading(false);
    };
  }, [urlItem]);

  return (
    <div className={`${className} relative`}>
      {loading && (
        <img
          src={placeholder}
          alt="Placeholder"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      )}
      {videoSrc ? (
        <video
          src={videoSrc}
          className={`w-full h-full ${loading ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
          
          autoPlay
          loop
          onClick={EventCLick}
          ref={refs}
          muted={muteds}
          playsInline
          
        />
      ) : (
        <p className="text-center text-gray-500">Error al cargar el video</p>
      )}
    </div>
  );
};
