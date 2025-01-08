import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

interface StyleSuggestionsProps {
  suggestions: string[];
}

export const StyleSuggestions = ({ suggestions }: StyleSuggestionsProps) => {
  if (suggestions.length === 0) return null;

  return (
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
  );
};