import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  preview: string | null;
  isUploading: boolean;
  isLoading: boolean;
  onDiscover: () => void;
  onNewImage: () => void;
}

export const ActionButtons = ({ preview, isUploading, isLoading, onDiscover, onNewImage }: ActionButtonsProps) => {
  if (!preview) return null;

  return (
    <div className="flex flex-col gap-3 animate-fade-up">
      <Button
        size="lg"
        className="font-semibold w-full"
        onClick={onDiscover}
        disabled={isUploading || isLoading}
      >
        {isLoading ? "Gerando sugestões..." : isUploading ? "Enviando..." : "Descobrir meu estilo"}
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="font-semibold w-full"
        onClick={onNewImage}
        disabled={isUploading || isLoading}
      >
        Nova Imagem
      </Button>
    </div>
  );
};