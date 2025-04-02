import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Newspaper, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/data/lib/utils";
import { Layout } from "./Loyout/Loyout";
import { Post } from "./Posts/Post";
import BlogPage from "./DayliVerse/PostDayliVerse";
import UseUploading from "./UploadingFiles/UseUploading";
import { useFetchPosts } from "@/data/hooks/PostHooks/useFetchPosts";
import { useAuth } from "@/data/hooks/userAuth";
import { supabase } from "@/supabaseClient";

export default function Dashboard() {
  const { posts } = useFetchPosts();
  const [activeMenu, setActiveMenu] = useState<"publicaciones" | "dayliverse">(
    "publicaciones"
  );
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const checkProfileAndRedirect = async () => {
      if (!session?.user) {
        console.log("No session user found");
        return;
      }

      console.log("Checking profile for user ID:", session.user.id);

      // Check if user profile exists - don't use single() to avoid error handling complexity
      const { data: profilesData, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", session.user.id);

      console.log("Profile check result:", { profilesData, profileError });

      // Profile doesn't exist if we got an empty array or null data
      const profileExists = profilesData && profilesData.length > 0;
      console.log("Profile exists?", profileExists);

      // If profile doesn't exist, create it and redirect to edit profile
      if (!profileExists && !profileError) {
        const user = session.user;
        // Insert the user in the profiles table if it doesn't exist
        const { error: insertError } = await supabase.from("profiles").insert({
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

        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          // Es un usuario nuevo, redirigir al perfil para editar
          navigate(`/profile/${user.id}?openProfileEdit=true`);
        }
      }
      // Si el perfil ya existe, no hacemos nada especial
    };

    checkProfileAndRedirect();
  }, [session, navigate]);

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const MenuButton: React.FC<{
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
  }> = ({ active, onClick, icon, label }) => (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out",
        active
          ? "bg-blue-600 text-white shadow-md m-auto"
          : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 m-auto"
      )}
    >
      {icon}
      <span className="font-medium">{label}</span>
      <ChevronRight
        className={cn(
          "ml-auto transition-transform",
          active && "transform rotate-90"
        )}
      />
    </button>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "publicaciones":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg m-auto">
            {posts.map((post) => (
              <Post
                key={post.id}
                post={{ ...post, likes: post.likes || 0 }}
                onUserClick={handleUserClick}
              />
            ))}
          </div>
        );
      case "dayliverse":
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg m-auto">
            <BlogPage />
          </div>
        );
      default:
        return (
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Selecciona una opción del menú para ver el contenido
            </p>
          </div>
        );
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <UseUploading />

        <div className="max-w-4xl mx-auto p-4">
          <div className="flex flex-col">
            <div className="flex mb-4 justify-start">
              <MenuButton
                active={activeMenu === "publicaciones"}
                onClick={() => setActiveMenu("publicaciones")}
                icon={<FileText className="w-5 h-5" />}
                label="Post"
              />
              <MenuButton
                active={activeMenu === "dayliverse"}
                onClick={() => setActiveMenu("dayliverse")}
                icon={<Newspaper className="w-5 h-5" />}
                label="Verse"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMenu || "empty"}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
}
