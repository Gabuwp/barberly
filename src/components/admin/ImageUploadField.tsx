import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";

interface ImageUploadFieldProps {
  control: Control<any>;
}

export function ImageUploadField({ control }: ImageUploadFieldProps) {
  return (
    <FormField
      control={control}
      name="image"
      render={({ field: { onChange, ...field } }) => (
        <FormItem>
          <FormLabel>Imagem</FormLabel>
          <FormControl>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  onChange(e.target.files);
                }
              }}
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}