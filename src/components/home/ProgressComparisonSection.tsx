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
    { name: "🟩 TomiTalk", hours: 180, color: "bg-green-500" },
    { name: "🟧 Samoplačniško", hours: 50, color: "bg-orange-500" },
    { name: "🟪 Javno zdravstvo", hours: 25, color: "bg-purple-500" }
  ];

  const maxHours = 180;

  return (
    <section ref={sectionRef} className="py-16 bg-light-cloud">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Izboljšajte otrokov govor – preprosto in brez stresa
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Hitrejši napredek kot pri tradicionalnih pristopih
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              TomiTalk omogoča otrokom personalizirano govorno vadbo vsak dan. Z redno uporabo 30 minut dnevno otroci letno dosežejo več kot 180 ur govorne vaje, kar je do 7× več kot pri klasičnih logopedskih obravnavah.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="space-y-8">
              {therapyData.map((therapy, index) => (
                <div key={therapy.name} className="space-y-3">
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 mb-1">{therapy.name}</span>
                    <span className="text-sm font-semibold text-gray-700">{therapy.hours}h letno</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className={`h-full ${therapy.color} transition-all duration-4000 ease-out relative`}
                        style={{
                          width: isVisible ? `${(therapy.hours / maxHours) * 100}%` : '0%',
                          transitionDelay: `${index * 300}ms`
                        }}
                      >
                        <div className="absolute right-0 top-0 h-full w-1 bg-white/30"></div>
                      </div>
                    </div>
                    <div 
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 transition-all duration-4000 ease-out"
                      style={{
                        right: isVisible ? `${100 - (therapy.hours / maxHours) * 100}%` : '100%',
                        transitionDelay: `${index * 300}ms`
                      }}
                    >
                      <div className="w-2 h-8 bg-gray-800 rounded-sm shadow-md"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-600 leading-relaxed">
              Primerjava temelji na tipični letni uporabi. Z aplikacijo TomiTalk otrok lahko vsak dan vadi govorne spretnosti v varnem in igrivem okolju – kjerkoli in kadarkoli.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProgressComparisonSection;