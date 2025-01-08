import { useEffect, useState } from "react";
import { StyleCard } from "./StyleCard";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface TrendingStyle {
  id: string;
  title: string;
  description: string;
  image_path: string;
}

export const TrendingStyles = () => {
  const [styles, setStyles] = useState<TrendingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingStyles();
  }, []);

  const fetchTrendingStyles = async () => {
    try {
      const { data, error } = await supabase
        .from("trending_styles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      console.error("Error fetching trending styles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-12">
      <h2 className="mb-8 text-center text-3xl font-semibold">Estilos em Alta</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading skeletons
          [...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <Skeleton className="aspect-[3/4] w-full rounded-xl" />
            </div>
          ))
        ) : styles.length > 0 ? (
          styles.map((style, index) => (
            <div
              key={style.id}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <StyleCard
                image={style.image_path}
                title={style.title}
                description={style.description}
              />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            Nenhum estilo encontrado
          </div>
        )}
      </div>
    </div>
  );
};