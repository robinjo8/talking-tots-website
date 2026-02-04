import { useParams, useNavigate } from "react-router-dom";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { useIsMobile } from "@/hooks/use-mobile";
import { getAllWheelConfigs } from "@/data/artikulacijaVajeConfig";

// Get letters from wheel config for display
const getLetterCards = () => {
  const configs = getAllWheelConfigs();
  const letters = configs.map(({ key, config }) => ({
    id: key,
    letter: config.letter,
    displayLetter: config.displayLetter,
    gradient: "from-app-orange/10 to-app-yellow/10",
    image: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/zmajcek_crka_${config.letter === 'Č' ? 'CH' : config.letter === 'Š' ? 'SH' : config.letter === 'Ž' ? 'ZH' : config.letter}.png`
  }));
  return letters;
};

export default function AdminArtikulacijaVaje() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const letterCards = getLetterCards();

  const handleLetterClick = (letterId: string) => {
    navigate(`/admin/children/${childId}/exercises/artikulacija/${letterId}`);
  };

  return (
    <AdminGameWrapper 
      title="Vaje za izgovorjavo glasov"
      backPath={`/admin/children/${childId}/exercises`}
    >
      {isMobile ? (
        <div className="grid grid-cols-2 gap-4">
          {letterCards.map(letter => (
            <div
              key={letter.id}
              className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => handleLetterClick(letter.id)}
            >
              <div className="relative aspect-square overflow-hidden">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)'
                  }}
                />
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={letter.image}
                    alt={`Glas ${letter.displayLetter}`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-app-blue transition-colors leading-tight text-center">
                  Glas {letter.displayLetter}
                </h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {letterCards.map(letter => (
            <div
              key={letter.id}
              className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => handleLetterClick(letter.id)}
            >
              <div className="relative aspect-video overflow-hidden">
                <div 
                  className="absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse at center, hsl(45, 100%, 95%) 0%, hsl(42, 100%, 90%) 30%, hsl(38, 90%, 80%) 60%, hsl(35, 85%, 70%) 100%)'
                  }}
                />
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src={letter.image}
                    alt={`Glas ${letter.displayLetter}`}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
                  Glas {letter.displayLetter}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  Vaje za izgovorjavo črke {letter.displayLetter}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminGameWrapper>
  );
}
