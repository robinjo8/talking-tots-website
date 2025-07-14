import { useEffect, useRef, useState } from "react";

const ProgressComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const therapyData = [
    { name: "🟩 TomiTalk AI", hours: 180, color: "bg-green-500" },
    { name: "🟧 Zasebno samoplačniško", hours: 50, color: "bg-orange-500" },
    { name: "🟪 Javno zdravstvo", hours: 25, color: "bg-purple-500" }
  ];

  const maxHours = 180;

  return (
    <section ref={sectionRef} className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Izboljšajte otrokov govor – preprosto in brez stresa
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Hitrejši napredek kot pri tradicionalnih pristopih
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              TomiTalk omogoča otrokom personalizirano govorno vadbo vsak dan. Z redno uporabo 30 minut dnevno otroci letno dosežejo več kot 180 ur govorne vaje, kar je do 7× več kot pri klasičnih logopedskih obravnavah.
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-6">
              {therapyData.map((therapy, index) => (
                <div key={therapy.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{therapy.name}</span>
                    <span className="text-sm font-semibold text-foreground">{therapy.hours}h</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-full ${therapy.color} transition-all duration-2000 ease-out`}
                      style={{
                        width: isVisible ? `${(therapy.hours / maxHours) * 100}%` : '0%',
                        transitionDelay: `${index * 200}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground leading-relaxed">
              Primerjava temelji na tipični letni uporabi. Z aplikacijo TomiTalk otrok lahko vsak dan vadi govorne spretnosti v varnem in igrivem okolju – kjerkoli in kadarkoli.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressComparisonSection;