import { useState } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";

interface UploadInputProps {
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const UploadInput = ({ userPrompt, setUserPrompt, onFileSelect, isUploading }: UploadInputProps) => {
  const [isDragging, setIsDragging] = useState(false);

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
    if (file) onFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
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
          disabled={isUploading}
        />
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium">Arraste sua foto aqui</h3>
          <p className="mt-2 text-sm text-gray-500">
            ou clique para selecionar um arquivo
          </p>
        </div>
      </div>
    </div>
  );
};