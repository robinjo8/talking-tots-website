
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
    <section className="py-8 px-4 md:py-12 md:px-10 bg-light-cloud w-full">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4 text-gray-900">Kaj o TomiTalk pravijo starši?</h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Pridružite se številnim družinam, ki so že odkrile moč TomiTalk aplikacije
          </p>
        </div>
        
        {/* Desktop Grid Layout */}
        {!isMobile && (
          <div className="grid grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 md:p-8 h-full flex flex-col justify-between min-h-[280px] relative overflow-hidden border-0">
                {/* Quote Icon */}
                <div className="absolute top-4 left-4 text-dragon-green/20">
                  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14,17H17L19,13V7H13V13H16M6,17H9L11,13V7H5V13H8L6,17Z" />
                  </svg>
                </div>
                
                {/* Quote Content */}
                <div className="flex-grow flex flex-col justify-center pt-6">
                  <blockquote className="text-foreground italic text-base md:text-lg leading-relaxed mb-6 text-center">
                    "{testimonial.quote}"
                  </blockquote>
                </div>
                
                {/* Author */}
                <div className="text-center">
                  <p className="text-muted-foreground text-sm font-medium">
                    {testimonial.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Mobile Carousel Layout */}
        {isMobile && <TestimonialsCarousel />}
      </div>
    </section>
  );
};
