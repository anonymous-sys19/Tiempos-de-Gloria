import { useEffect, useState } from "react";

// Custom hook para obtener los datos de la transmisión de radio
const useRadioStream = () => {
  const [streamInfo, setStreamInfo] = useState({
    title: "",
    description: "",
    currentSong: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamData = async () => {
      const url = "https://gruponovaradial.azuracast.com.es/listen/influencia_positiva_radio_/";

      try {
        const response = await fetch(url);
        const text = await response.text(); // Obtiene el HTML como texto

        // Parsear el HTML usando DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        // Extraer datos usando selectores
        const title = doc.querySelectorAll("td.streamdata")[0]?.textContent || "";
        const description = doc.querySelectorAll("td.streamdata")[1]?.textContent || "";
        const currentSong = doc.querySelectorAll("td.streamdata")[9]?.textContent || "";

        setStreamInfo({ title, description, currentSong });
      } catch (err) {
        setError("Error al obtener los datos de transmisión");
        console.error(err);
      }
    };

    fetchStreamData();
  }, []);

  return { streamInfo, error };
};

export default useRadioStream;
