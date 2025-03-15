import { useState, useEffect, type ChangeEvent, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/supabaseClient';
// Asegúrate de tener configurado el cliente de Supabase

interface EditProfileDialogProps {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function EditProfileDialog({ defaultOpen = false, onOpenChange }: EditProfileDialogProps = {}) {
  const [displayName, setDisplayName] = useState("")
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)
  const [open, setOpen] = useState(defaultOpen)


  useEffect(() => {
    const fetchProfile = async () => {
      const userId = (await supabase.auth.getUser()).data.user?.id;
      if (!userId) return;
  
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url, portada_url")
        .eq("id", userId)
        .single();
  
      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setDisplayName(data.display_name);
        setAvatarPreview(data.avatar_url || "https://via.placeholder.com/150");
        setCoverPreview(data.portada_url || "https://via.placeholder.com/150");
      }
    };
  
    fetchProfile();
  }, []);
  

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void,
    setPreview: (preview: string | null) => void,
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    let avatar_url = avatarPreview;
    let portada_url = coverPreview;
  
    // Obtener ID del usuario
    const userId = (await supabase.auth.getUser()).data.user?.id;
    if (!userId) {
      console.error("User not authenticated");
      return;
    }
  
    // Subir avatar si hay un nuevo archivo
    if (avatarFile) {
      const filePath = `profiles/${userId}.png`; // Cambia el formato si es necesario
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });
  
      if (error) {
        console.error("Error uploading avatar:", error);
      } else {
        avatar_url = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      }
    }
  
    // Subir portada si hay un nuevo archivo
    if (coverFile) {
      const filePath = `portada/${userId}.png`;
      const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, coverFile, { upsert: true });
  
      if (error) {
        console.error("Error uploading cover:", error);
      } else {
        portada_url = supabase.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;
      }
    }
  
    // Actualizar perfil en la base de datos con la URL pública
    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName,
        avatar_url,
        portada_url,
      })
      .eq("id", userId);
  
    if (error) {
      console.error("Error updating profile:", error);
    } else {
      console.log("Profile updated successfully");
      setOpen(false);
    }
  };
  

  // Use the onOpenChange prop if provided
  const handleOpenChange = (value: boolean) => {
    setOpen(value);
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="default">Editar Perfil</Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Editar perfil</SheetTitle>
          <SheetDescription>Haz cambios en tu perfil aquí. Haz clic en Guardar cuando termines.</SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-8 py-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nombre completo</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label>Imagen de perfil</Label>
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 overflow-hidden rounded-full bg-gray-100">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview || "/placeholder.svg"}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setAvatarFile, setAvatarPreview)}
                    className="hidden"
                  />
                  <Label
                    htmlFor="avatar"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4"
                  >
                    Cargar perfil
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Imagen de portada</Label>
              <div className="space-y-2">
                <div className="relative w-full h-40 overflow-hidden rounded-lg bg-gray-100">
                  {coverPreview ? (
                    <img
                      src={coverPreview || "/placeholder.svg"}
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg
                        className="w-12 h-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    id="cover"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setCoverFile, setCoverPreview)}
                    className="hidden"
                  />
                  <Label
                    htmlFor="cover"
                    className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 py-2 px-4"
                  >
                    Cargar portada
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <SheetFooter>
            <Button type="submit">Guardar informacion</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

