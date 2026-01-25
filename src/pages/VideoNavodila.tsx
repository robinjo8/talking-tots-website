import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useIsMobile } from "@/hooks/use-mobile";

const videoLetters = [
  { 
    letter: "C", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke C"
  },
  { 
    letter: "Č", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Č"
  },
  { 
    letter: "K", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke K"
  },
  { 
    letter: "L", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke L"
  },
  { 
    letter: "R", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke R"
  },
  { 
    letter: "S", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke S"
  },
  { 
    letter: "Š", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Š"
  },
  { 
    letter: "Z", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Z"
  },
  { 
    letter: "Ž", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Ž"
  },
];

const VideoNavodila = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [emblaRef] = useEmblaCarousel({ 
    align: 'start',
    dragFree: true,
    containScroll: 'trimSnaps'
  });

  // Pretvorba šumnikov v ASCII za URL
  const toAsciiUrl = (letter: string): string => {
    return letter.toLowerCase()
      .replace('č', 'ch')
      .replace('š', 'sh')
      .replace('ž', 'zh');
  };

  const handleLetterClick = (letter: string) => {
    navigate(`/video-navodila/${toAsciiUrl(letter)}`);
  };

  const LetterCard = ({ letter }: { letter: typeof videoLetters[0] }) => (
    <div
      className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => handleLetterClick(letter.letter)}
    >
      {/* Card Image - Orange gradient background like Kolo sreče */}
      <div className={isMobile ? "relative aspect-square overflow-hidden" : "relative aspect-video overflow-hidden"}>
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)'
          }}
        />
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={letter.image}
            alt={`Črka ${letter.letter}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      {/* Card Content */}
      <div className={isMobile ? "p-3 flex flex-col flex-grow" : "p-6 flex flex-col flex-grow"}>
        <h3 className={isMobile 
          ? "text-base font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors leading-tight text-center" 
          : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors"
        }>
          Črka {letter.letter}
        </h3>
        {!isMobile && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {letter.description}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-6xl mx-auto pt-28 md:pt-32 pb-20 px-4">
        {/* Page Title */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            Video navodila
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        {/* Breadcrumb - positioned like LogopedskiKoticek */}
        <div className="mb-8">
          <BreadcrumbNavigation />
        </div>

        {/* Letters grid/carousel */}
        <div className="mb-12">
          {isMobile ? (
            /* Mobile: 2-column grid like Kolo sreče */
            <div className="grid grid-cols-2 gap-4">
              {videoLetters.map(letter => (
                <LetterCard key={letter.letter} letter={letter} />
              ))}
            </div>
          ) : (
            /* Desktop: Grid layout */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {videoLetters.map(letter => (
                <LetterCard key={letter.letter} letter={letter} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoNavodila;
