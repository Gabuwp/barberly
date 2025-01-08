import { StyleCard } from "./StyleCard";

const trendingStyles = [
  {
    image: "/placeholder.svg",
    title: "Degradê Moderno",
    description: "Linhas limpas e nítidas com transição gradual",
  },
  {
    image: "/placeholder.svg",
    title: "Corte Texturizado",
    description: "Textura natural com um toque contemporâneo",
  },
  {
    image: "/placeholder.svg",
    title: "Pompadour Clássico",
    description: "Estilo atemporal com volume moderno",
  },
];

export const TrendingStyles = () => {
  return (
    <div className="py-12">
      <h2 className="mb-8 text-center text-3xl font-semibold">
        Estilos em Alta
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trendingStyles.map((style, index) => (
          <div key={index} className="animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
            <StyleCard {...style} />
          </div>
        ))}
      </div>
    </div>
  );
};