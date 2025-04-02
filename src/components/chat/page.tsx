import { useEffect } from "react";
import { ChatApp } from "./Chat";
// import { useAuthStore } from './store/AuthStore';
import { useAuth } from "@/data/hooks/userAuth";
import { supabase } from "@/supabaseClient";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

function Chat() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const fetchProfile = async (userId: string) => {
      try {
        // First try to fetch the existing profile
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        let profileData = data;
        if (error) {
          // If profile doesn't exist, create it
          if (error.code === "PGRST116") {
            const { data: userData } = await supabase.auth.getUser();
            if (userData.user) {
              const { data: newProfile, error: insertError } = await supabase
                .from("profiles")
                .insert([
                  {
                    id: userId,
                    display_name: userData.user.email?.split("@")[0] || "User",
                    avatar_url: null,
                  },
                ])
                .select()
                .single();

              if (insertError) {
                console.error("Error creating profile:", insertError);
                toast.error("Error setting up user profile");
                return;
              }

              profileData = newProfile;
            }
          } else {
            console.error("Error fetching profile:", error);
            toast.error("Error loading user profile");
            return;
          }
        }

        if (profileData) {
          setUser(profileData);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred");
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      <Toaster position="top-center" />
      {user ? <ChatApp /> : "Loading..."}
    </>
  );
}

export default Chat;
