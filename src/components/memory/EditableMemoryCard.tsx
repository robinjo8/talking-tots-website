
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileInput, AudioLines, Link, Image, Text } from "lucide-react";

interface EditableMemoryCardProps {
  word: string;
  imageUrl: string | null;
  audioUrl: string | null;
  onUpdate: (data: {
    word: string;
    imageUrl: string | null;
    audioUrl: string | null;
  }) => void;
}

export function EditableMemoryCard({
  word,
  imageUrl,
  audioUrl,
  onUpdate,
}: EditableMemoryCardProps) {
  const [currentWord, setCurrentWord] = useState(word);
  const [currentImageUrl, setCurrentImageUrl] = useState(imageUrl);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(audioUrl);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload to Supabase storage
      console.log("Image file selected:", file);
    }
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Here you would typically upload to Supabase storage
      console.log("Audio file selected:", file);
    }
  };

  const handleUpdate = () => {
    onUpdate({
      word: currentWord,
      imageUrl: currentImageUrl,
      audioUrl: currentAudioUrl,
    });
  };

  return (
    <Card className="h-full">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="word" className="text-sm font-medium flex items-center gap-2">
            <Text className="h-4 w-4" />
            Beseda
          </Label>
          <Input
            id="word"
            value={currentWord}
            onChange={(e) => {
              setCurrentWord(e.target.value);
              handleUpdate();
            }}
            className="w-full"
            placeholder="Vnesite besedo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUpload" className="text-sm font-medium flex items-center gap-2">
            <FileInput className="h-4 w-4" />
            Naloži sliko
          </Label>
          <Input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="imageUrl" className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL slike
          </Label>
          <Input
            id="imageUrl"
            value={currentImageUrl || ""}
            onChange={(e) => {
              setCurrentImageUrl(e.target.value);
              handleUpdate();
            }}
            className="w-full"
            placeholder="https://..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioUpload" className="text-sm font-medium flex items-center gap-2">
            <AudioLines className="h-4 w-4" />
            Naloži zvok
          </Label>
          <Input
            id="audioUpload"
            type="file"
            accept="audio/*"
            onChange={handleAudioFileChange}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="audioUrl" className="text-sm font-medium flex items-center gap-2">
            <Link className="h-4 w-4" />
            URL zvoka
          </Label>
          <Input
            id="audioUrl"
            value={currentAudioUrl || ""}
            onChange={(e) => {
              setCurrentAudioUrl(e.target.value);
              handleUpdate();
            }}
            className="w-full"
            placeholder="https://..."
          />
        </div>

        {currentImageUrl && (
          <div className="mt-2">
            <img
              src={currentImageUrl}
              alt={currentWord}
              className="w-full h-32 object-contain rounded border"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
