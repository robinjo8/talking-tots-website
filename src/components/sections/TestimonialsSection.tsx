
import { useIsMobile } from "@/hooks/use-mobile";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";

export const TestimonialsSection = () => {
  const isMobile = useIsMobile();

  // Testimonials data
  const testimonials = [
    {
      quote: "Moj sin je imel težave z izgovorjavo črke R. Po enem mesecu vaj z zmajčkom Tomijem jo izgovarja brez težav! Toplo priporočam!",
      author: "— Tanja, mama 6-letnika"
    }, {
      quote: "Končno nekaj, kar je narejeno za slovenske otroke! Govorne vaje so zabavne in hčerka komaj čaka, da jih dela vsak dan.",
      author: "— Mateja, mama 5-letnice"
    }, {
      quote: "Čakalna doba za logopeda je bila več kot pol leta. TomiTalk nama je pomagal takoj. Napredek je očiten že po 10 dneh.",
      author: "— Andrej, oče 4-letnika"
    }, {
      quote: "Najbolj všeč mi je, da lahko dodam oba otroka in vsak ima svoj profil. Vaje so res prilagojene posamezniku.",
      author: "— Nina, mama 3- in 7-letnika"
    }, {
      quote: "Z aplikacijo smo govorjenje spremenili v igro. Sin se smeje, vadi in napreduje – brez joka in pregovarjanja.",
      author: "— Maja, mama 5-letnika"
    }, {
      quote: "Z govornimi vajami se je mojemu otroku odprlo tudi na drugih področjih in ni več tako zaprt.",
      author: "— Peter, oče 6-letnika"
    }
  ];

  return (
    <section className={`w-full bg-gradient-to-b from-light-cloud/30 to-background ${isMobile ? 'py-12 px-4' : 'py-16 px-6 md:py-20 md:px-10'}`}>
      <div className="max-w-7xl mx-auto">
        <div className={`text-center ${isMobile ? 'mb-8' : 'mb-12 md:mb-16'}`}>
          <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl mb-3' : 'text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6'}`}>
            Kaj o TomiTalk pravijo starši?
          </h2>
          <p className={`${isMobile ? 'text-base' : 'text-lg md:text-xl'} text-gray-600 max-w-3xl mx-auto leading-relaxed`}>
            Pridružite se številnim družinam, ki so že odkrile moč TomiTalk aplikacije
          </p>
        </div>
        
        {/* Mobile Carousel Layout */}
        {isMobile && (
          <div className="mb-0">
            <TestimonialsCarousel />
          </div>
        )}
        
        {/* Tablet Layout - 2 columns */}
        {!isMobile && (
          <div className="hidden md:block lg:hidden">
            <div className="grid grid-cols-2 gap-6">
              {testimonials.slice(0, 4).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between min-h-[300px] relative overflow-hidden border border-gray-100 group hover:scale-105">
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 text-dragon-green/20 group-hover:text-dragon-green/30 transition-colors duration-300">
                    <svg className="h-10 w-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                  
                  {/* Quote Content */}
                  <div className="flex-grow flex flex-col justify-center pt-8">
                    <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-6 text-center font-medium">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  {/* Author */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-base font-semibold">
                      {testimonial.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Desktop Layout - 3 columns */}
        {!isMobile && (
          <div className="hidden lg:block">
            <div className="grid grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 h-full flex flex-col justify-between min-h-[320px] relative overflow-hidden border border-gray-100 group hover:scale-105">
                  {/* Quote Icon */}
                  <div className="absolute top-6 left-6 text-dragon-green/20 group-hover:text-dragon-green/30 transition-colors duration-300">
                    <svg className="h-12 w-12" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                    </svg>
                  </div>
                  
                  {/* Quote Content */}
                  <div className="flex-grow flex flex-col justify-center pt-10">
                    <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-8 text-center font-medium">
                      "{testimonial.quote}"
                    </blockquote>
                  </div>
                  
                  {/* Author */}
                  <div className="text-center pt-4 border-t border-gray-100">
                    <p className="text-gray-600 text-base font-semibold">
                      {testimonial.author}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
