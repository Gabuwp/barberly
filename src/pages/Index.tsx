import { PhotoUpload } from "@/components/PhotoUpload";
import { TrendingStyles } from "@/components/TrendingStyles";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Descubra Seu Estilo Perfeito
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Envie sua foto e deixe nossa IA sugerir o penteado perfeito que combine com suas
            características e personalidade.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <PhotoUpload />
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Estilos em Alta
          </h2>
          <TrendingStyles />
        </div>
      </div>
    </div>
  );
};

export default Index;