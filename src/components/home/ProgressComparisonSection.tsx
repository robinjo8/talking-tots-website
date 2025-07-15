import { useEffect, useRef, useState } from "react";
import { Trophy, Award, Crown } from "lucide-react";
const ProgressComparisonSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), 200);
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
    iconColor: "text-yellow-600",
    duration: "6s",
    delay: "0.2s"
  }, {
    name: "Samoplačniško",
    hours: 50,
    color: "bg-orange-500",
    icon: Trophy,
    iconColor: "text-gray-600",
    duration: "4s",
    delay: "0.5s"
  }, {
    name: "Javno zdravstvo",
    hours: 25,
    color: "bg-purple-500",
    icon: Trophy,
    iconColor: "text-purple-600",
    duration: "3s",
    delay: "0.8s"
  }];
  const maxHours = 180;
  return <section ref={sectionRef} className="py-16 bg-light-cloud">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Izboljšajte otrokov govor – preprosto in brez stresa
          </h2>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* First box - Progress comparison */}
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
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{therapy.name}</span>
                        <span className="text-sm font-semibold text-gray-700">(povp. {therapy.hours} ur/leto)</span>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden relative">
                        <div className={`h-full ${therapy.color}`} style={{
                      width: isVisible ? `${therapy.hours / maxHours * 100}%` : '0%',
                      transitionProperty: 'width',
                      transitionDuration: therapy.duration,
                      transitionDelay: therapy.delay,
                      transitionTimingFunction: 'ease-out',
                      willChange: 'width'
                    }} />
                         {/* Icons positioned at specific percentages */}
                         <div className="absolute inset-0 flex items-center">
                           <Trophy className={`w-4 h-4 drop-shadow-sm absolute ${index === 0 ? 'text-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-white'}`} style={{
                        left: '45%',
                        transform: 'translateX(-50%)'
                      }} />
                           <Award className={`w-4 h-4 drop-shadow-sm absolute ${index === 0 ? 'text-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-white'}`} style={{
                        left: '70%',
                        transform: 'translateX(-50%)'
                      }} />
                           <Crown className={`w-4 h-4 drop-shadow-sm absolute ${index === 0 ? 'text-yellow-400 filter drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : 'text-white'}`} style={{
                        left: '90%',
                        transform: 'translateX(-50%)'
                      }} />
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

            {/* Second box - Cost comparison */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
                  Neomejene TomiTalk vaje in igre vs. samoplačniške metode
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">Za ceno le 1,5 obiska pri samoplačniškem obisku prejmete neomejeno celoletno naročnino na TomiTalk.</p>
              </div>

              {/* Bar chart */}
              <div className="flex justify-center items-end gap-8 mb-12 h-40 mt-8">
                {/* TomiTalk bar */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 text-center">
                    <span className="text-sm font-semibold text-green-600">30× in več ceneje</span>
                  </div>
                  <div className="bg-green-500 w-16 rounded-t-lg transition-all duration-1000 ease-out" style={{
                  height: isVisible ? '40px' : '0px',
                  transitionDelay: '0.3s'
                }} />
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium text-gray-900">TomiTalk</span>
                  </div>
                </div>

                {/* Samoplačniško bar */}
                <div className="flex flex-col items-center">
                  <div className="mb-2 text-center h-5">
                    {/* Empty space for label alignment */}
                  </div>
                  <div className="bg-gray-500 w-16 rounded-t-lg transition-all duration-1500 ease-out" style={{
                  height: isVisible ? '160px' : '0px',
                  transitionDelay: '0.5s'
                }} />
                  <div className="mt-2 text-center">
                    <span className="text-sm font-medium text-gray-900">Samoplačniško</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="text-center mb-8 mt-4">
                <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                  Prihranite in začnite zdaj
                </button>
              </div>

              <div className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Temelji na 50 individualnih urah letno pri zasebni logopedski obravnavi. Več kot ima otrok individualnih obravnav, bolj izrazita je cenovna prednost TomiTalk
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ProgressComparisonSection;