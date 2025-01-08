import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const PhotoUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    } else {
      toast({
        title: "Erro",
        description: "Por favor envie apenas arquivos de imagem.",
        variant: "destructive"
      });
    }
  };

  const handleFile = (file: File) => {
    toast({
      title: "Foto recebida!",
      description: "Analisando suas características...",
    });
    // TODO: Implement actual file handling and AI analysis
  };

  return (
    <div
      className={`upload-area ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <h3 className="text-lg font-semibold">Arraste sua foto aqui</h3>
        <p className="text-sm text-gray-500">ou clique para selecionar um arquivo</p>
      </div>
    </div>
  );
};