// import SharedPost from '../ShareComponents/SharedPost';
import { PostTypes } from "@/data/types/postTypes/posts";
import { LazyImage } from "@/components/Personalizados/ImagePost";
import { LazyVideo } from "@/components/Personalizados/LazyVideo";
// import { useRef } from "react";

export function MediaViewer({ post }: { post: PostTypes }) {
  // const [isInView, setIsInView] = useState(false);
  // const [isMuted, setIsMuted] = useState(false);

  const shareUrl = `${window.location.origin}/post/${post?.slug}`;

  // useEffect(() => {
  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       setIsInView(entry.isIntersecting);
  //       if (mediaRef.current) {
  //         if (entry.isIntersecting) {
  //           mediaRef.current.play().catch(() => {});
  //         } else {
  //           mediaRef.current.pause();
  //         }
  //       }
  //     },
  //     { threshold: 0.5 }
  //   );

  //   if (mediaRef.current) observer.observe(mediaRef.current);

  //   return () => observer.disconnect();
  // }, []);

  // useEffect(() => {
  //   const handleKeyPress = (event: KeyboardEvent) => {
  //     if (event.key === "ArrowUp" || event.key === "ArrowDown") {
  //       if (isInView && mediaRef.current) {
  //         event.preventDefault();
  //         setIsMuted((prev) => {
  //           mediaRef.current!.muted = !prev; // Aplicamos el cambio antes de actualizar el estado
  //           return !prev;
  //         });
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyPress);
  //   return () => window.removeEventListener("keydown", handleKeyPress);
  // }, [isInView]);

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
              EventCLick={() => (window.location.href = shareUrl)}
            />
            //Probando un nuevo componente para cargar videos optimizados
            {/* <VolumeControl isMuted={isMuted} onToggleMute={handleToggleMute} /> */}
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
