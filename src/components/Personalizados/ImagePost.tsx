import { useState, useEffect } from "react";

interface LazyImageProps {
  className?: string;
  urlItem: string;
    placeholder?: string;
    EventClick?: () => void | string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
    className = "",
    urlItem,
    placeholder = "https://via.placeholder.com/150",
    EventClick,
}) => {
    const [imageSrc, setImageSrc] = useState<string>(placeholder);
    const optimizedAvatarUrl = `${imageSrc}?width=300&quality=80`;
    const [loading, setLoading] = useState<boolean>(true);
    
  useEffect(() => {
    const img = new Image();
    img.src = urlItem;
    img.onload = () => {
      setImageSrc(urlItem);
      setLoading(false);
    };
    img.onerror = () => {
      setImageSrc(placeholder);
      setLoading(false);
    };
  }, [urlItem]);

  return (
    <img
      src={optimizedAvatarUrl}
      className={`${className} ${loading ? "opacity-50" : "opacity-100"} transition-opacity duration-300`}
          alt="Imagen"
          
    loading="lazy"
    onClick={EventClick}
    />
  );
};
