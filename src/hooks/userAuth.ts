import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "../supabaseClient";

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
    // Iniciar sesión con Google, siempre redirigiendo al dashboard
    // La lógica para verificar si es un usuario nuevo se manejará en el Dashboard
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/dashboard"
      }
    });

    if (error) throw error;

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
