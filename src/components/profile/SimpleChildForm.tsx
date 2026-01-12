import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddChildForm } from "@/components/AddChildForm";

interface SimpleChildFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function SimpleChildForm({ onSuccess, onCancel }: SimpleChildFormProps) {
  const [showNameOnly, setShowNameOnly] = useState(true);
  const [childName, setChildName] = useState("");

  const handleContinue = () => {
    if (!childName.trim()) return;
    setShowNameOnly(false);
  };

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    }
  };

  if (!showNameOnly) {
    return <AddChildForm onSuccess={onSuccess} initialName={childName} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dodaj otroka</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="childName">Ime otroka ali vzdevek</Label>
          <Input
            id="childName"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Vnesite ime otroka"
          />
        </div>
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
          >
            Nazaj
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!childName.trim()}
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            Nadaljuj
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}