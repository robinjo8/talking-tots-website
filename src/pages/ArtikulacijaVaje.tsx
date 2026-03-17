import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { BreadcrumbNavigation } from "@/components/BreadcrumbNavigation";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const artikulacijaLetters = [
  { letter: "C", urlKey: "c", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png", description: "Vaje za izgovorjavo glasu C" },
  { letter: "Č", urlKey: "ch", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png", description: "Vaje za izgovorjavo glasu Č" },
  { letter: "K", urlKey: "k", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png", description: "Vaje za izgovorjavo glasu K" },
  { letter: "L", urlKey: "l", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png", description: "Vaje za izgovorjavo glasu L" },
  { letter: "R", urlKey: "r", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png", description: "Vaje za izgovorjavo glasu R" },
  { letter: "S", urlKey: "s", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png", description: "Vaje za izgovorjavo glasu S" },
  { letter: "Š", urlKey: "sh", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png", description: "Vaje za izgovorjavo glasu Š" },
  { letter: "Z", urlKey: "z", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png", description: "Vaje za izgovorjavo glasu Z" },
  { letter: "Ž", urlKey: "zh", image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png", description: "Vaje za izgovorjavo glasu Ž" },
];

export default function ArtikulacijaVaje() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLetterClick = (urlKey: string) => {
    navigate(`/govorno-jezikovne-vaje/artikulacija/${urlKey}`);
  };

  const LetterCard = ({ letter }: { letter: typeof artikulacijaLetters[0] }) => (
    <div
      className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => handleLetterClick(letter.urlKey)}
    >
      <div className={cn("relative overflow-hidden", isMobile ? "aspect-[4/3]" : "aspect-video")}>
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
    <div className={cn("bg-background", isMobile ? "fixed inset-0 overflow-hidden flex flex-col" : "min-h-screen")}>
      <Header />

      <div className={cn(
        "container max-w-6xl mx-auto px-4",
        isMobile ? "flex-1 flex flex-col overflow-hidden pt-20 pb-2" : "pt-28 md:pt-32 pb-20"
      )}>
        <div className={cn("text-center", isMobile ? "mb-2" : "mb-6")}>
          <h1 className={cn("font-bold text-foreground mb-2", isMobile ? "text-2xl" : "text-4xl md:text-5xl")}>
            Artikulacija
          </h1>
          <div className="w-32 h-1 bg-app-yellow mx-auto rounded-full"></div>
        </div>

        {!isMobile && (
          <div className="mb-8">
            <BreadcrumbNavigation />
          </div>
        )}

        <div className={isMobile ? "flex-1 overflow-hidden" : "mb-12"}>
          {isMobile ? (
            <div className="grid grid-cols-3 gap-2 h-full content-start">
              {artikulacijaLetters.map(letter => (
                <LetterCard key={letter.urlKey} letter={letter} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artikulacijaLetters.map(letter => (
                <LetterCard key={letter.urlKey} letter={letter} />
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <button
          onClick={() => navigate("/govorno-jezikovne-vaje")}
          className="fixed bottom-4 left-4 z-50 rounded-full w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 shadow-lg border-2 border-white/50 backdrop-blur-sm flex items-center justify-center transition-all"
        >
          <ArrowLeft className="w-7 h-7 text-white" />
        </button>
      )}
    </div>
  );
}
