import { useState, useEffect } from "react";
import { SermonType } from "@/data/types/postTypes/sermon";

export function useSermones() {
  const [sermones, setSermones] = useState<SermonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermones = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sermones`
        );
        if (!response.ok) throw new Error("Error al cargar los sermones");
        const data = await response.json();
        setSermones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchSermones();
  }, []);

  return { sermones, loading, error };
}
