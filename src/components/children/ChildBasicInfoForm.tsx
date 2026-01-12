
import { Button } from "@/components/ui/button";
import { AvatarSelector } from "@/components/AvatarSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ChildBasicInfoFormProps = {
  avatarId: number;
  onAvatarChange: (id: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack?: () => void;
  title?: string;
};

export function ChildBasicInfoForm({
  avatarId,
  onAvatarChange,
  onSubmit,
  onBack,
  title = "Izberi avatarja"
}: ChildBasicInfoFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <AvatarSelector 
            selectedAvatarId={avatarId} 
            onAvatarSelect={onAvatarChange} 
          />
          
          <div className="flex justify-between pt-4">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
              >
                Nazaj
              </Button>
            )}
            <Button
              type="submit"
              className={`bg-dragon-green hover:bg-dragon-green/90 ${!onBack ? 'w-full' : 'ml-auto'}`}
            >
              Naprej
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
