import { useState, useRef, useEffect } from "react";
// import { MediaModal } from './MediaModal';
import { VolumeControl } from "./VolumeControl";
// import SharedPost from '../ShareComponents/SharedPost';
import { PostTypes } from "@/types/postTypes/posts";
import { LazyImage } from "@/components/Personalizados/ImagePost";
import { LazyVideo } from "@/components/Personalizados/LazyVideo";

export function MediaViewer({ post }: { post: PostTypes }) {
  //   const [showModal, setShowModal] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const mediaRef = useRef<HTMLVideoElement | null>(null);
  const shareUrl = `${window.location.origin}/post/${post?.slug}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (mediaRef.current && entry.isIntersecting) {
          mediaRef.current.play().catch(() => {
            // Autoplay might be blocked by browser
          });
        }
      },
      { threshold: 0.5 }
    );

    if (mediaRef.current) {
      observer.observe(mediaRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (mediaRef.current) {
      if (isInView) {
        mediaRef.current.play().catch(() => {
          // Handle autoplay restriction
        });
      } else {
        mediaRef.current.pause();
      }
    }
  }, [isInView]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (isInView && mediaRef.current) {
          event.preventDefault();
          setIsMuted(!isMuted);
          mediaRef.current.muted = !isMuted;
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isInView, isMuted]);

  const handleToggleMute = () => {
    if (mediaRef.current) {
      setIsMuted(!isMuted);
      mediaRef.current.muted = !isMuted;
    }
  };

  return (
    <>
      <div className="relative w-full aspect-[4/3] bg-black cursor-pointer overflow-hidden">
        {post.fileType === "video" ? (
          <>
            {/* <video
              ref={mediaRef}
              src={post.url}
              className="absolute inset-0 w-full h-full object-contain"
              muted={isMuted}
              loop
              playsInline
              onClick={() => (window.location.href = shareUrl)}
            /> */}
            <LazyVideo
              urlItem={post.url}
              className="absolute inset-0 w-full h-full object-contain"
              muteds={isMuted}
              refs={mediaRef}
              EventCLick={() => (window.location.href = shareUrl)}
            />
            //Probando un nuevo componente para cargar videos optimizados

            <VolumeControl isMuted={isMuted} onToggleMute={handleToggleMute} />
          </>
        ) : (
          
          <LazyImage
            urlItem={post.url}
            className="absolute inset-0 w-full h-full object-cover"
          /> //Probando un nuevo componente para cargar imagenes optimizadas
        )}
      </div>
    </>
  );
}
