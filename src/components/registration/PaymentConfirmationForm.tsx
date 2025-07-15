
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type PaymentConfirmationFormProps = {
  selectedPlan: string;
  onBack: () => void;
};

export function PaymentConfirmationForm({
  selectedPlan,
  onBack
}: PaymentConfirmationFormProps) {
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Registracija končana</h2>
        <p className="text-lg text-muted-foreground">
          Vaš račun je bil uspešno ustvarjen. Dobrodošli!
        </p>
      </div>

      <Button onClick={onBack} variant="outline" size="sm" className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Nazaj
      </Button>
    </div>
  );
}
