import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import OpenAI from "openai";
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
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true
      });

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: `Based on this description: ${userPrompt}, generate a hairstyle or beard style suggestion. The style should be modern and realistic.`,
        n: 5,
        size: "1024x1024",
      });

      const generatedImages = response.data.map(img => img.url);
      setSuggestions(generatedImages);

      toast({
        title: "Sucesso!",
        description: "Sugestões geradas com sucesso!",
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        variant: "destructive",
        title: "Erro!",
        description: "Erro ao gerar sugestões. Tente novamente.",
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