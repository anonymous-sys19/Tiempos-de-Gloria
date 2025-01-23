import { useState, useEffect } from 'react';
import { SermonType } from '@/types/postTypes/sermon';

export function useSermones() {
  const [sermones, setSermones] = useState<SermonType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSermones = async () => {
      try {
        const response = await fetch('https://api-cors-acept.onrender.com/api/sermones');
        if (!response.ok) throw new Error('Error al cargar los sermones');
        const data = await response.json();
        setSermones(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchSermones();
  }, []);

  return { sermones, loading, error };
}