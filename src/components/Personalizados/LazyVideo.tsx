// Dependencies
import { useState, useEffect, useRef } from "react";
import { VolumeControl } from "../Posts/ClipPost/VolumeControl";

interface LazyVideoProps {
  className?: string;
  urlItem: string;
  placeholder?: string;
  EventCLick?: () => void | string;
  refs?: React.Ref<HTMLVideoElement>;
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
  const setIsVisible = useState(false)[1];
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const [ isMuted, setIsMuted ] = useState(false);
const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          videoRef.current?.play(); // Reproduce si está visible
          
          
        } else {
          setIsVisible(false);
          videoRef.current?.pause(); // Pausa si deja de ser visible
        }
      },
      { threshold: 0.5 } // 50% del video debe estar en pantalla para activarse
    );

    if (videoRef.current) {
      observerRef.current.observe(videoRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  // 
  
  useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsInView(entry.isIntersecting);
          if (mediaRef.current) {
            if (entry.isIntersecting) {
              mediaRef.current.play().catch(() => {});
            } else {
              mediaRef.current.pause();
            }
          }
        },
        { threshold: 0.5 }
      );
  
      if (mediaRef.current) observer.observe(mediaRef.current);
  
      return () => observer.disconnect();
    }, []);
  
    useEffect(() => {
      const handleKeyPress = (event: KeyboardEvent) => {
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
          if (isInView && mediaRef.current) {
            event.preventDefault();
            setIsMuted((prev) => {
              mediaRef.current!.muted = !prev; // Aplicamos el cambio antes de actualizar el estado
              return !prev;
            });
          }
        }
      };
  
      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isInView]);
  
  const handleToggleMute = () => {
    if (mediaRef.current) {
      setIsMuted((prev) => {
        mediaRef.current!.muted = !prev;
        return !prev;
      });
    }
  };
  return (
    <div className={`${className} relative`}>
      <video
        ref={(el) => {
          videoRef.current = el;
          if (refs && typeof refs === 'function') refs(el);
        }}
        className={`w-full h-full transition-opacity duration-500`}
        loop
        muted={muteds}
        playsInline
        preload="metadata"
        poster={placeholder}
        onClick={EventCLick}
      >
        <source src={urlItem} type="video/mp4" />
      </video>
      <VolumeControl isMuted={isMuted} onToggleMute={handleToggleMute} />
    </div>
  );
};
