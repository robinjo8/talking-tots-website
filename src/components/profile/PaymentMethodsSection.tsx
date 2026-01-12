import { CreditCard } from "lucide-react";

export function PaymentMethodsSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-dragon-green/20 overflow-hidden">
      {/* Header */}
      <div className="bg-dragon-green text-white p-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Plačilne metode
        </h2>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-sm text-muted-foreground text-center py-6">
          Trenutno ni dodanih plačilnih metod. Dodaj svojo plačilno metodo za hitrejše plačevanje.
        </p>
      </div>
    </div>
  );
}
