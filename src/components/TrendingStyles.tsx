import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const trendingStyles = [
  {
    id: 1,
    name: "Fade Moderno",
    description: "Corte degradê com acabamento preciso",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
  },
  {
    id: 2,
    name: "Barba Clássica",
    description: "Estilo tradicional bem aparado",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
  },
  {
    id: 3,
    name: "Undercut Contemporâneo",
    description: "Visual moderno e versátil",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
  },
];

export const TrendingStyles = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {trendingStyles.map((style) => (
        <Card key={style.id} className="trending-style-card">
          <CardHeader className="p-0">
            <img
              src={style.image}
              alt={style.name}
              className="w-full h-48 object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="text-lg mb-2">{style.name}</CardTitle>
            <p className="text-sm text-gray-600">{style.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};