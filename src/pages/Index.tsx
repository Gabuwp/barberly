import { UploadArea } from "@/components/UploadArea";
import { TrendingStyles } from "@/components/TrendingStyles";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container px-4 py-16">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-4xl font-bold mb-4">
            Descubra Seu Estilo Perfeito
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Envie sua foto e deixe nossa IA sugerir o penteado perfeito que
            combine com suas características e personalidade.
          </p>
        </div>
        
        <UploadArea />
        
        <div className="mt-24">
          <TrendingStyles />
        </div>
      </div>
    </div>
  );
};

export default Index;