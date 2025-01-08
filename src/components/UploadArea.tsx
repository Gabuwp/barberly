import { useImageUpload } from "@/hooks/useImageUpload";
import { UploadInput } from "./ImageUploader/UploadInput";
import { StyleSuggestions } from "./ImageUploader/StyleSuggestions";
import { ActionButtons } from "./ImageUploader/ActionButtons";

export const UploadArea = () => {
  const {
    preview,
    userPrompt,
    setUserPrompt,
    isUploading,
    isLoading,
    suggestions,
    handleFile,
    handleDiscover,
    handleNewImage,
  } = useImageUpload();

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <UploadInput
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        onFileSelect={handleFile}
        isUploading={isUploading}
      />
      
      {preview && (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="mx-auto max-h-64 rounded-lg object-cover"
          />
        </div>
      )}
      
      <ActionButtons
        preview={preview}
        isUploading={isUploading}
        isLoading={isLoading}
        onDiscover={handleDiscover}
        onNewImage={handleNewImage}
      />

      <StyleSuggestions suggestions={suggestions} />
    </div>
  );
};