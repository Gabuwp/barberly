import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Form } from "@/components/ui/form";
import { TextInputField } from "./TextInputField";
import { ImageUploadField } from "./ImageUploadField";

interface FormData {
  title: string;
  description: string;
  image: FileList;
}

export function TrendingStyleForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      const file = data.image[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("trending_styles")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("trending_styles")
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("trending_styles").insert({
        title: data.title,
        description: data.description,
        image_path: publicUrlData.publicUrl,
      });

      if (insertError) throw insertError;

      toast({
        title: "Estilo adicionado",
        description: "O novo estilo foi adicionado com sucesso.",
      });

      form.reset();
    } catch (error) {
      console.error("Error adding style:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar estilo",
        description: "Ocorreu um erro ao tentar adicionar o novo estilo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-6">Adicionar Novo Estilo</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TextInputField
            control={form.control}
            name="title"
            label="Título"
          />
          
          <TextInputField
            control={form.control}
            name="description"
            label="Descrição"
          />

          <ImageUploadField control={form.control} />

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar Estilo"}
          </Button>
        </form>
      </Form>
    </div>
  );
}