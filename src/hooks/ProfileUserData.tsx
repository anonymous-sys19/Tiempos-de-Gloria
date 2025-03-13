import { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // Asegúrate de importar bien Supabase
import { UserType } from "@/types/postTypes/posts"; // Importar la interfaz UserProfile
// Definir la interfaz del usuario


export const useUserProfile = () => {
  const [nUser, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userId = (await supabase.auth.getUser()).data.user?.id;
        if (!userId) {
          console.error("User not authenticated");
          return;
        }
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;

        setUser(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { nUser, loading, error, setUser };
};
