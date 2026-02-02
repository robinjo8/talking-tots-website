import React from 'react';
import { Button } from '@/components/ui/button';
import { AvatarSelector } from '@/components/AvatarSelector';

interface AdminChildAvatarStepProps {
  avatarId: number;
  onAvatarChange: (id: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export function AdminChildAvatarStep({
  avatarId,
  onAvatarChange,
  onBack,
  onNext,
}: AdminChildAvatarStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-bold">Izberi avatarja</h2>
        <p className="text-muted-foreground">
          Izberite zmajčka, ki bo predstavljal otroka
        </p>
      </div>

      <AvatarSelector
        selectedAvatarId={avatarId}
        onAvatarSelect={onAvatarChange}
        variant="grid"
      />

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Nazaj
        </Button>
        <Button
          type="button"
          onClick={onNext}
          className="bg-dragon-green hover:bg-dragon-green/90"
        >
          Naprej
        </Button>
      </div>
    </div>
  );
}
