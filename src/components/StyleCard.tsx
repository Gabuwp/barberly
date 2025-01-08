interface StyleCardProps {
  image: string;
  title: string;
  description: string;
}

export const StyleCard = ({ image, title, description }: StyleCardProps) => {
  return (
    <div className="group relative overflow-hidden rounded-xl bg-card backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="aspect-[3/4] w-full">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm opacity-90">{description}</p>
      </div>
    </div>
  );
};