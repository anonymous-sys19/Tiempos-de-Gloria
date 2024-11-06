import { useEffect, useState } from 'react';

function useStreamUrl(): string {
  const [streamUrl, setStreamUrl] = useState<string>('');


  useEffect(() => {
    // Usar la variable de entorno para obtener la URL según el entorno
    const url = import.meta.env.VITE_STREAM_URL;

    
    if (url) {
      setStreamUrl(url);
    } else {
      console.error('URL del stream no configurada correctamente');
    }
  }, []);

  return streamUrl;
}

export default useStreamUrl;



