import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import OpenAI from "openai";

export const UploadArea = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userPrompt, setUserPrompt] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

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
      <div className="space-y-4">
        <Input
          placeholder="Qual a imagem que você deseja passar?"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          className="w-full"
        />
        
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
            isDragging
              ? "border-primary bg-primary/10"
              : "border-gray-300 hover:border-primary"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          {!preview ? (
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">Arraste sua foto aqui</h3>
              <p className="mt-2 text-sm text-gray-500">
                ou clique para selecionar um arquivo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <img
                src={preview}
                alt="Preview"
                className="mx-auto max-h-64 rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
      
      {preview && (
        <div className="flex flex-col gap-3 animate-fade-up">
          <Button
            size="lg"
            className="font-semibold w-full"
            onClick={handleDiscover}
            disabled={isUploading || isLoading}
          >
            {isLoading ? "Gerando sugestões..." : isUploading ? "Enviando..." : "Descobrir meu estilo"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-semibold w-full"
            onClick={handleNewImage}
            disabled={isUploading || isLoading}
          >
            Nova Imagem
          </Button>
        </div>
      )}

      {suggestions.length > 0 && (
        <div className="mt-8 animate-fade-up">
          <h3 className="text-xl font-semibold mb-4">Sugestões para você:</h3>
          <Carousel className="w-full">
            <CarouselContent>
              {suggestions.map((url, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative rounded-lg overflow-hidden">
                      <img 
                        src={url} 
                        alt={`Sugestão ${index + 1}`}
                        className="w-full aspect-square object-cover"
                      />
                      <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
};