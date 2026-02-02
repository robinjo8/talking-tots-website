import { useParams, useNavigate } from "react-router-dom";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { useIsMobile } from "@/hooks/use-mobile";

const videoLetters = [
  { 
    letter: "C", 
    urlKey: "c",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_C.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke C"
  },
  { 
    letter: "Č", 
    urlKey: "ch",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_CH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Č"
  },
  { 
    letter: "K", 
    urlKey: "k",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_K.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke K"
  },
  { 
    letter: "L", 
    urlKey: "l",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_L.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke L"
  },
  { 
    letter: "R", 
    urlKey: "r",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_R.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke R"
  },
  { 
    letter: "S", 
    urlKey: "s",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_S.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke S"
  },
  { 
    letter: "Š", 
    urlKey: "sh",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_SH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Š"
  },
  { 
    letter: "Z", 
    urlKey: "z",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_Z.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Z"
  },
  { 
    letter: "Ž", 
    urlKey: "zh",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_ZH.png",
    description: "Poglej video navodila za pravilno izgovorjavo črke Ž"
  },
];

export default function AdminVideoNavodila() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLetterClick = (urlKey: string) => {
    navigate(`/admin/children/${childId}/video-navodila/${urlKey}`);
  };

  const LetterCard = ({ letter }: { letter: typeof videoLetters[0] }) => (
    <div
      className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
      onClick={() => handleLetterClick(letter.urlKey)}
    >
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
    <AdminGameWrapper 
      title="Video navodila"
      backPath={`/admin/children/${childId}/workspace`}
    >
      {isMobile ? (
        <div className="grid grid-cols-2 gap-4">
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
    </AdminGameWrapper>
  );
}
