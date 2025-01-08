import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadInput } from "./ImageUploader/UploadInput";
import { StyleSuggestions } from "./ImageUploader/StyleSuggestions";
import { ActionButtons } from "./ImageUploader/ActionButtons";

export const UploadArea = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiscover = async () => {
    if (!preview || !userPrompt || !selectedFile) {
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Por favor, preencha o texto e faça upload de uma imagem.",
      });
      return;
    }

    setIsUploading(true);
    setIsLoading(true);

    try {
      // Upload to Supabase
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      // Get the public URL of the uploaded image
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName);

      setUploadedImageUrl(publicUrl);

      // Generate styles
      console.log("Making request to generate-styles function...");
      const { data, error } = await supabase.functions.invoke('generate-styles', {
        body: { 
          prompt: userPrompt,
          imageUrl: publicUrl
        }
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
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Erro!",
        description: `Erro ao processar a imagem: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
      setIsLoading(false);
    }
  };

  const handleNewImage = () => {
    setPreview(null);
    setSelectedFile(null);
    setUploadedImageUrl(null);
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