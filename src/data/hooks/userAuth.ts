import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

export interface UserData {
  id: string;
  display_name: string;
  avatar_url: string | null;
  portada_url: string | null;
  // Agrega aquí cualquier otro campo que necesites de tus usuarios
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener la sesión actual y suscribirse a los cambios
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) throw error;

    // Esperar a que termine la autenticación
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;

    if (user) {
      try {
        // Buscar el usuario en la tabla profiles
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user.id)
          .single();

        if (!existingProfile && !profileError) {
          // Insertar el usuario en la tabla profiles si no existe
          const { error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              display_name:
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                "Usuario de Google",
              avatar_url: user.user_metadata?.avatar_url || null,
              portada_url:
                "https://janbrtgwtomzffqqcmfo.supabase.co/storage/v1/object/public/idec-public/idec/portadaZona.jpg",
              is_online: true,
              last_seen: new Date().toISOString(),
            });

          if (insertError) throw insertError;
        }
      } catch (err) {
        console.error("Error gestionando el perfil del usuario:", err);
      }
    }

    return data;
  };

  const signUp = async (email: string, password: string, fullname: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase.from("profiles").insert({
          id: authData.user.id,
          display_name: fullname,
          avatar_url: null,
          portada_url: null,
        });

        if (profileError) throw profileError;
      }

      return authData;
    } catch (error) {
      console.error("Error al registrar al usuario:", error);
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const getUser = async (): Promise<UserData | null> => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user?.id)
      .single(); // Queremos solo un registro, ya que el ID es único

    if (error) {
      console.error(error);
      return null;
    }
    return data;
  };
  const getAllUsers = async (): Promise<UserData[]> => {
    const { data, error } = await supabase.from("profiles").select("*");

    if (error) throw error;
    return data;
  };

  return {
    user,
    setUser,
    session,
    loading,
    signIn,
    signInWithGoogle, // Nuevo método para Google
    signUp,
    signOut,
    getUser,
    getAllUsers,
  };
}
