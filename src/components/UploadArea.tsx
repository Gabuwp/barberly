import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadInput } from "./ImageUploader/UploadInput";
import { StyleSuggestions } from "./ImageUploader/StyleSuggestions";
import { ActionButtons } from "./ImageUploader/ActionButtons";

export const UploadArea = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = async (file: File) => {
    if (file.type.startsWith("image/")) {
      setIsUploading(true);
      try {
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        toast({
          title: "Sucesso!",
          description: "Imagem enviada com sucesso",
        });

        console.log("File uploaded successfully:", fileName);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast({
          variant: "destructive",
          title: "Erro!",
          description: "Erro ao enviar a imagem. Tente novamente.",
        });
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDiscover = async () => {
    if (!preview || !userPrompt) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, preencha o texto e faça upload de uma imagem.",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log("Making request to generate-styles function...");
      const { data, error } = await supabase.functions.invoke('generate-styles', {
        body: { prompt: userPrompt }
      });

      if (error) {
        console.error("Error response:", error);
        throw new Error(error.message || 'Failed to generate suggestions');
      }

      console.log("Response data:", data);
      
      if (data.error) {
        throw new Error(data.error);
      }

      setSuggestions(data.imageUrl ? [data.imageUrl] : []);

      toast({
        title: "Sucesso!",
        description: "Sugestões geradas com sucesso!",
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        variant: "destructive",
        title: "Erro!",
        description: `Erro ao gerar sugestões: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewImage = () => {
    setPreview(null);
    setIsUploading(false);
    setSuggestions([]);
    setUserPrompt("");
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <UploadInput
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        onFileSelect={handleFile}
        isUploading={isUploading}
      />
      
      {preview && (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-cover"
          />
        </div>
      )}
      
      <ActionButtons
        preview={preview}
        isUploading={isUploading}
        isLoading={isLoading}
        onDiscover={handleDiscover}
        onNewImage={handleNewImage}
      />

      <StyleSuggestions suggestions={suggestions} />
    </div>
  );
};