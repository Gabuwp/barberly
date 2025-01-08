import { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const UploadArea = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  const handleDiscover = () => {
    // This will be implemented in the next step
    console.log("Discover style clicked");
  };

  const handleNewImage = () => {
    setPreview(null);
    setIsUploading(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
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
      
      {preview && (
        <div className="flex flex-col gap-3 animate-fade-up">
          <Button
            size="lg"
            className="font-semibold w-full"
            onClick={handleDiscover}
            disabled={isUploading}
          >
            {isUploading ? "Enviando..." : "Descobrir meu estilo"}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="font-semibold w-full"
            onClick={handleNewImage}
            disabled={isUploading}
          >
            Nova Imagem
          </Button>
        </div>
      )}
    </div>
  );
};