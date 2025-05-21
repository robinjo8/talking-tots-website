
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check } from "lucide-react";

type PaymentConfirmationFormProps = {
  selectedPlan: string;
};

export function PaymentConfirmationForm({ selectedPlan }: PaymentConfirmationFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Format the price and billing frequency based on the selected plan
  const getPlanDetails = () => {
    if (selectedPlan.includes("Letna naročnina")) {
      return {
        name: "Letna naročnina",
        price: "9,90 €",
        frequency: "mesec (plačilo letno)"
      };
    } else {
      return {
        name: "Mesečna naročnina",
        price: "19,90 €",
        frequency: "mesec (plačilo mesečno)"
      };
    }
  };

  const planDetails = getPlanDetails();

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Add space after every 4 digits
    let formatted = "";
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += digits[i];
    }
    
    // Limit to 19 characters (16 digits + 3 spaces)
    return formatted.substring(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, "");
    
    // Format as MM/YY
    if (digits.length <= 2) {
      return digits;
    }
    return `${digits.substring(0, 2)}/${digits.substring(2, 4)}`;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpiryDate(formatExpiryDate(e.target.value));
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, "").substring(0, 4);
    setCvc(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">Začnite 7-dnevni brezplačni preizkus</h1>
      </div>
      
      <Card className="p-6 border-green-200 bg-green-50">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 p-1.5 rounded-full text-green-700 mt-1">
            <Check className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Izbrani paket: {planDetails.name}</h3>
            <p className="text-gray-600 mt-1">
              <span className="font-medium">{planDetails.price} / {planDetails.frequency}</span>
            </p>
            <p className="text-gray-600 mt-1">
              Vaš 7-dnevni brezplačni preizkus se začne danes. Po tem obdobju bo zaračunana izbrana naročnina.
            </p>
          </div>
        </div>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardName">Ime na kartici</Label>
          <Input
            id="cardName"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Janez Novak"
            className="rounded-md text-base"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Številka kartice</Label>
          <Input
            id="cardNumber"
            value={cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className="rounded-md text-base"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiryDate">Velja do</Label>
            <Input
              id="expiryDate"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/LL"
              className="rounded-md text-base"
              maxLength={5}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvc">CVC/CVV</Label>
            <Input
              id="cvc"
              value={cvc}
              onChange={handleCvcChange}
              placeholder="123"
              className="rounded-md text-base"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}
