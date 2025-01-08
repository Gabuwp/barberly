import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { useRef } from "react";

interface ImageUploadFieldProps {
  control: Control<any>;
}

export function ImageUploadField({ control }: ImageUploadFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <FormField
      control={control}
      name="image"
      render={({ field: { onChange, value, ...field } }) => (
        <FormItem>
          <FormLabel>Imagem</FormLabel>
          <FormControl>
            <Input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  onChange(e.target.files);
                }
              }}
              {...field}
              value={undefined} // This prevents the controlled/uncontrolled warning
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}