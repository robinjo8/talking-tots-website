import Header from "@/components/Header";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const videoLetters = [
  { 
    letter: "S", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke S"
  },
  { 
    letter: "Z", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Z"
  },
  { 
    letter: "C", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke C"
  },
  { 
    letter: "Š", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Š"
  },
  { 
    letter: "Ž", 
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Ž"
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
];

const toAsciiUrl = (letter: string): string => {
  return letter.toLowerCase()
    .replace('č', 'ch')
    .replace('š', 'sh')
    .replace('ž', 'zh');
};

const VideoNavodila = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLetterClick = (letter: string) => {
    navigate(`/video-navodila/${toAsciiUrl(letter)}`);
  };

  const LetterCard = ({ letter }: { letter: typeof videoLetters[0] }) => (
    <div
      className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => handleLetterClick(letter.letter)}
    >
      <div className={cn(
        "relative overflow-hidden",
        isMobile ? "aspect-[4/3]" : "aspect-video"
      )}>
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)'
          }}
        />
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={letter.image}
            alt={`Glas ${letter.letter}`}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>

      <div className={isMobile ? "p-1.5 flex flex-col flex-grow" : "p-6 flex flex-col flex-grow"}>
        <h3 className={isMobile 
          ? "text-xs font-bold text-foreground group-hover:text-app-blue transition-colors leading-tight text-center" 
          : "text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors"
        }>
          Glas {letter.letter}
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
    <div className={cn(
      "bg-background",
      isMobile ? "fixed inset-0 overflow-hidden flex flex-col" : "min-h-screen"
    )}>
      <Header />
      
      <div className={cn(
        "container max-w-6xl mx-auto px-4",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        {/* Page Title */}
        <div className={cn("text-center", isMobile ? "mb-2" : "mb-6")}>
          <h1 className={cn(
            "font-bold text-foreground mb-2",
            isMobile ? "text-2xl" : "text-4xl md:text-5xl"
          )}>
            Video navodila
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>
        
        {/* Breadcrumb - only on desktop */}
        {!isMobile && (
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
        )}

        {/* Letters grid */}
        <div className={isMobile ? "flex-1 overflow-hidden" : "mb-12"}>
          {isMobile ? (
            <div className="grid grid-cols-3 gap-2 h-full content-start">
              {videoLetters.map(letter => (
                <LetterCard key={letter.letter} letter={letter} />
              ))}
            </div>
          ) : (
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
