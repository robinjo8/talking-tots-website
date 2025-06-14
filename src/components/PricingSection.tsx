
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example "naročnina" (subscription) data, adjust as needed:
const pricingPackages = [
  {
    name: "Osnovni paket",
    price: "14,90 € / mesec",
    description: "Vsi osnovni govori in vaje za otroke.",
    features: [
      "Dnevne AI vaje",
      "Napredovanje in analiza",
      "Več otroških profilov"
    ],
    cta: "Izberi"
  },
  {
    name: "Družinski paket",
    price: "19,90 € / mesec",
    description: "Še več možnosti za napredovanje cele družine.",
    features: [
      "Vse iz osnovnega paketa",
      "Družinska podpora",
      "Prioritetna pomoč"
    ],
    cta: "Izberi"
  }
];

export function PricingSection() {
  return (
    <section
      id="cenik"
      className="w-full bg-white py-10 md:py-16 px-4 border-t border-gray-100"
    >
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Cenik</h2>
        <p className="text-lg text-muted-foreground">
          Enostavna, pregledna in prilagodljiva naročnina za vašo družino.
        </p>
      </div>
      {/* Mobile: side-by-side cards, fully visible, as per screenshot */}
      <div className="flex flex-row gap-4 justify-center items-stretch max-w-md mx-auto
        [&>*]:flex-1
        md:max-w-2xl
      ">
        {pricingPackages.map((pkg, idx) => (
          <Card
            key={pkg.name}
            className="flex flex-col items-center justify-between rounded-[24px] shadow-md px-2 py-4 bg-white
              md:px-6 md:py-8
            "
          >
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-lg md:text-2xl font-bold mb-1">{pkg.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center p-0 mb-2 w-full">
              <div className="text-2xl md:text-3xl font-extrabold text-dragon-green mb-2">{pkg.price}</div>
              <div className="text-xs md:text-sm text-muted-foreground mb-2 text-center">{pkg.description}</div>
              <ul className="mb-3 w-full px-3 md:px-0">
                {pkg.features.map((f) => (
                  <li key={f} className="text-[12px] md:text-base text-gray-800 mb-1 flex items-center">
                    <span className="inline-block w-2 h-2 bg-dragon-green rounded-full mr-2" /> {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <Button className="w-full mt-auto bg-dragon-green hover:bg-dragon-green/80 rounded-full text-white font-bold">
              {pkg.cta}
            </Button>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default PricingSection;
