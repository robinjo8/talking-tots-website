import { useEffect, useRef, useState } from "react";
import { Trophy, Medal, Award } from "lucide-react";
const ProgressComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.3
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);
  const therapyData = [{
    name: "TomiTalk",
    hours: 180,
    color: "bg-green-500",
    icon: Trophy,
    iconColor: "text-yellow-600"
  }, {
    name: "Samoplačniško",
    hours: 50,
    color: "bg-orange-500",
    icon: Medal,
    iconColor: "text-gray-600"
  }, {
    name: "Javno zdravstvo",
    hours: 25,
    color: "bg-purple-500",
    icon: Award,
    iconColor: "text-purple-600"
  }];
  const maxHours = 180;
  return <section ref={sectionRef} className="py-16 bg-light-cloud">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Izboljšajte otrokov govor – preprosto in brez stresa
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                Hitrejši napredek kot pri tradicionalnih pristopih
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">Z redno uporabo otroci dosežejo hitrejši napredek kot pri klasičnih logopedskih obravnavah.</p>
            </div>

            <div className="space-y-8 mb-8">
              {therapyData.map((therapy, index) => <div key={therapy.name} className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                    <therapy.icon className={`w-6 h-6 ${therapy.iconColor}`} />
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{therapy.name}</span>
                      <span className="text-sm font-semibold text-gray-700">(povp. {therapy.hours} ur/leto)</span>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
                      <div className={`h-full ${therapy.color} transition-all duration-[35000ms] ease-in-out`} style={{
                    width: isVisible ? `${therapy.hours / maxHours * 100}%` : '0%'
                  }} />
                      {/* Icons positioned across the bar */}
                      <div className="absolute inset-0 flex items-center justify-evenly px-2">
                        <therapy.icon className="w-4 h-4 text-white drop-shadow-sm" />
                        <therapy.icon className="w-4 h-4 text-white drop-shadow-sm" />
                        <therapy.icon className="w-4 h-4 text-white drop-shadow-sm" />
                        <therapy.icon className="w-4 h-4 text-white drop-shadow-sm" />
                        <therapy.icon className="w-4 h-4 text-white drop-shadow-sm" />
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>

            <div className="text-center">
              <p className="text-gray-600 leading-relaxed">
                Primerjava temelji na tipični letni uporabi. Z aplikacijo TomiTalk otrok lahko vsak dan vadi govorne spretnosti v varnem in igrivem okolju – kjerkoli in kadarkoli.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProgressComparisonSection;