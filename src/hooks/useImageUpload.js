import { useState } from "react";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file, isEditing = false) => {
    console.log("Archivo seleccionado:", file);
    
    if (!file) {
      console.warn("No se seleccionó ningún archivo.");
      return null;
    }

    if (isEditing) {
      console.log("Modo edición: imagen guardada localmente.");
      return { file, url: null };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "infusion2");

    setIsUploading(true);

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dntqcucm0/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al subir imagen a Cloudinary:", errorData);
        return null;
      }

      const data = await res.json();
      console.log("Respuesta de Cloudinary:", data);

      if (data.secure_url) {
        return { file, url: data.secure_url };
      } else {
        console.error("Cloudinary no devolvió una URL segura:", data);
        return null;
      }
    } catch (error) {
      console.error("Error inesperado al subir imagen:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
}