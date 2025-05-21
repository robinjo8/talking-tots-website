
import React from "react";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SubscriptionOption {
  id: string;
  title: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

interface SubscriptionOptionsProps {
  selectedOption: string;
  onOptionChange: (value: string) => void;
}

export function SubscriptionOptions({ selectedOption, onOptionChange }: SubscriptionOptionsProps) {
  const subscriptionOptions: SubscriptionOption[] = [
    {
      id: "monthly",
      title: "Mesečna naročnina",
      price: "9,99 €",
      period: "mesečno",
    },
    {
      id: "yearly",
      title: "Letna naročnina",
      price: "89,99 €",
      period: "letno",
      savings: "Prihranite 30%",
      isPopular: true,
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-center mb-2">Začnite 7-dnevni brezplačni preizkus</h2>
        <p className="text-center text-muted-foreground mb-4">
          Izberite naročnino, ki vam najbolj ustreza
        </p>
      </div>
      
      <RadioGroup 
        value={selectedOption} 
        onValueChange={onOptionChange}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {subscriptionOptions.map((option) => (
          <Label
            key={option.id}
            htmlFor={`subscription-${option.id}`}
            className={`flex flex-col p-4 border rounded-lg cursor-pointer transition-all ${
              selectedOption === option.id 
                ? 'border-dragon-green bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium">{option.title}</div>
              {option.isPopular && (
                <Badge className="bg-dragon-green text-white">Najbolj priljubljeno</Badge>
              )}
            </div>
            
            <div className="flex items-baseline mb-1">
              <span className="text-2xl font-bold">{option.price}</span>
              <span className="text-muted-foreground ml-1">/{option.period}</span>
            </div>
            
            {option.savings && (
              <span className="text-sm text-dragon-green font-medium">{option.savings}</span>
            )}
            
            <div className="flex items-center mt-3">
              <RadioGroupItem 
                value={option.id} 
                id={`subscription-${option.id}`}
                className="mr-2"
              />
              <span className="text-sm">Izberi</span>
            </div>
          </Label>
        ))}
      </RadioGroup>
      
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm">
        <p className="font-medium text-blue-800 mb-1">7-dnevni brezplačni preizkus</p>
        <p className="text-blue-700">
          Prvih 7 dni je brezplačnih. Naročnino lahko kadarkoli prekličete.
        </p>
      </div>
    </div>
  );
}
