import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TrendingStyle {
  id: string;
  title: string;
  description: string;
  image_path: string;
}

export function TrendingStylesList() {
  const [styles, setStyles] = useState<TrendingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStyles();
  }, []);

  async function fetchStyles() {
    try {
      const { data, error } = await supabase
        .from("trending_styles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStyles(data || []);
    } catch (error) {
      console.error("Error fetching styles:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar estilos",
        description: "Não foi possível carregar a lista de estilos.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("trending_styles").delete().eq("id", id);
      if (error) throw error;

      setStyles((prev) => prev.filter((style) => style.id !== id));
      toast({
        title: "Estilo removido",
        description: "O estilo foi removido com sucesso.",
      });
    } catch (error) {
      console.error("Error deleting style:", error);
      toast({
        variant: "destructive",
        title: "Erro ao remover estilo",
        description: "Ocorreu um erro ao tentar remover o estilo.",
      });
    }
  };

  if (isLoading) {
    return <div>Carregando estilos...</div>;
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6">Estilos em Alta</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Imagem</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {styles.map((style) => (
              <TableRow key={style.id}>
                <TableCell>
                  <img
                    src={style.image_path}
                    alt={style.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                </TableCell>
                <TableCell>{style.title}</TableCell>
                <TableCell>{style.description}</TableCell>
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(style.id)}
                  >
                    Remover
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}