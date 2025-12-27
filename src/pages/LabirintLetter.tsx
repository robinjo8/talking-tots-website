import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MazeGame } from "@/components/games/MazeGame";
import { MatchingCompletionDialog } from "@/components/matching/MatchingCompletionDialog";
import { InstructionsModal } from "@/components/puzzle/InstructionsModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Home } from "lucide-react";
import { useEnhancedProgress } from "@/hooks/useEnhancedProgress";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co";

// Images data for each letter - using bucket "slike"
const labirintImages: Record<string, Array<{ filename: string; word: string }>> = {
  'c': [
    { filename: 'cedilo.png', word: 'Cedilo' },
    { filename: 'cekin.png', word: 'Cekin' },
    { filename: 'cerkev.png', word: 'Cerkev' },
    { filename: 'cesta.png', word: 'Cesta' },
    { filename: 'cev.png', word: 'Cev' },
    { filename: 'cirkus.png', word: 'Cirkus' },
    { filename: 'cisterna.png', word: 'Cisterna' },
    { filename: 'cokla.png', word: 'Cokla' },
    { filename: 'copat.png', word: 'Copat' },
    { filename: 'cvet.png', word: 'Cvet' },
  ],
  'č': [
    { filename: 'caj.png', word: 'Čaj' },
    { filename: 'casopis.png', word: 'Časopis' },
    { filename: 'cebela.png', word: 'Čebela' },
    { filename: 'cebula.png', word: 'Čebula' },
    { filename: 'cesen.png', word: 'Česen' },
    { filename: 'cevlji.png', word: 'Čevlji' },
    { filename: 'cokolada.png', word: 'Čokolada' },
    { filename: 'coln.png', word: 'Čoln' },
    { filename: 'copic.png', word: 'Čopič' },
    { filename: 'crke.png', word: 'Črke' },
  ],
  'k': [
    { filename: 'kaca.png', word: 'Kača' },
    { filename: 'kapa.png', word: 'Kapa' },
    { filename: 'kava.png', word: 'Kava' },
    { filename: 'klavir.png', word: 'Klavir' },
    { filename: 'kljuc.png', word: 'Ključ' },
    { filename: 'klop.png', word: 'Klop' },
    { filename: 'knjiga.png', word: 'Knjiga' },
    { filename: 'kocka.png', word: 'Kocka' },
    { filename: 'kokos_sadez.png', word: 'Kokos' },
    { filename: 'kokos.png', word: 'Kokoš' },
    { filename: 'kolac.png', word: 'Kolač' },
    { filename: 'kolo.png', word: 'Kolo' },
    { filename: 'koruza.png', word: 'Koruza' },
    { filename: 'kost.png', word: 'Kost' },
    { filename: 'kos.png', word: 'Koš' },
    { filename: 'kosara.png', word: 'Košara' },
    { filename: 'koza.png', word: 'Koza' },
    { filename: 'kozarec.png', word: 'Kozarec' },
    { filename: 'koza_skin.png', word: 'Koža' },
    { filename: 'krava.png', word: 'Krava' },
    { filename: 'krof.png', word: 'Krof' },
    { filename: 'krog.png', word: 'Krog' },
    { filename: 'kroznik.png', word: 'Krožnik' },
    { filename: 'kruh.png', word: 'Kruh' },
    { filename: 'kumara.png', word: 'Kumara' },
    { filename: 'kuza.png', word: 'Kuža' },
  ],
  'l': [
    { filename: 'ladja.png', word: 'Ladja' },
    { filename: 'lasje.png', word: 'Lasje' },
    { filename: 'led.png', word: 'Led' },
    { filename: 'lesnik.png', word: 'Lešnik' },
    { filename: 'letalo.png', word: 'Letalo' },
    { filename: 'lev.png', word: 'Lev' },
    { filename: 'les.png', word: 'Les' },
    { filename: 'list.png', word: 'List' },
    { filename: 'lizika.png', word: 'Lizika' },
    { filename: 'lonec.png', word: 'Lonec' },
    { filename: 'lopar.png', word: 'Lopar' },
    { filename: 'lubenica.png', word: 'Lubenica' },
    { filename: 'luc.png', word: 'Luč' },
    { filename: 'luza.png', word: 'Luža' },
  ],
  'r': [
    { filename: 'raca.png', word: 'Raca' },
    { filename: 'rak.png', word: 'Rak' },
    { filename: 'raketa.png', word: 'Raketa' },
    { filename: 'ravnilo.png', word: 'Ravnilo' },
    { filename: 'rep.png', word: 'Rep' },
    { filename: 'repa.png', word: 'Repa' },
    { filename: 'riba.png', word: 'Riba' },
    { filename: 'ribez.png', word: 'Ribez' },
    { filename: 'ribic.png', word: 'Ribič' },
    { filename: 'ris.png', word: 'Ris' },
    { filename: 'riz.png', word: 'Riž' },
    { filename: 'robot.png', word: 'Robot' },
    { filename: 'roka.png', word: 'Roka' },
    { filename: 'rokometas.png', word: 'Rokometaš' },
    { filename: 'rolka.png', word: 'Rolka' },
    { filename: 'ropotuljica.png', word: 'Ropotuljica' },
    { filename: 'roza.png', word: 'Roža' },
  ],
  's': [
    { filename: 'sedem.png', word: 'Sedem' },
    { filename: 'sir.png', word: 'Sir' },
    { filename: 'sladoled.png', word: 'Sladoled' },
    { filename: 'slika.png', word: 'Slika' },
    { filename: 'slon.png', word: 'Slon' },
    { filename: 'sluz.png', word: 'Sluz' },
    { filename: 'smreka.png', word: 'Smreka' },
    { filename: 'sneg.png', word: 'Sneg' },
    { filename: 'snezak.png', word: 'Snežak' },
    { filename: 'snezinka.png', word: 'Snežinka' },
    { filename: 'sok.png', word: 'Sok' },
    { filename: 'sonce.png', word: 'Sonce' },
    { filename: 'sova.png', word: 'Sova' },
    { filename: 'stol.png', word: 'Stol' },
    { filename: 'svetilka.png', word: 'Svetilka' },
    { filename: 'svincnik.png', word: 'Svinčnik' },
  ],
  'š': [
    { filename: 'sah.png', word: 'Šah' },
    { filename: 'sal.png', word: 'Šal' },
    { filename: 'scetka.png', word: 'Ščetka' },
    { filename: 'skarje.png', word: 'Škarje' },
    { filename: 'skatla.png', word: 'Škatla' },
    { filename: 'skoljka.png', word: 'Školjka' },
    { filename: 'sopek.png', word: 'Šopek' },
    { filename: 'sotor.png', word: 'Šotor' },
    { filename: 'stampiljka.png', word: 'Štampiljka' },
    { filename: 'storklja.png', word: 'Štorklja' },
  ],
  'z': [
    { filename: 'zajec.png', word: 'Zajec' },
    { filename: 'zaslon.png', word: 'Zaslon' },
    { filename: 'zavesa.png', word: 'Zavesa' },
    { filename: 'zebra.png', word: 'Zebra' },
    { filename: 'zlato.png', word: 'Zlato' },
    { filename: 'zmaj.png', word: 'Zmaj' },
    { filename: 'zob.png', word: 'Zob' },
    { filename: 'zobotrebec.png', word: 'Zobotrebec' },
    { filename: 'zvezda.png', word: 'Zvezda' },
    { filename: 'zvezek.png', word: 'Zvezek' },
    { filename: 'zvocnik.png', word: 'Zvočnik' },
  ],
  'ž': [
    { filename: 'zaba.png', word: 'Žaba' },
    { filename: 'zaga.png', word: 'Žaga' },
    { filename: 'zarnica.png', word: 'Žarnica' },
    { filename: 'zebelj.png', word: 'Žebelj' },
    { filename: 'zelva.png', word: 'Želva' },
    { filename: 'zerjav.png', word: 'Žerjav' },
    { filename: 'zirafa.png', word: 'Žirafa' },
    { filename: 'zlica.png', word: 'Žlica' },
    { filename: 'zoga.png', word: 'Žoga' },
    { filename: 'zolna.png', word: 'Žolna' },
  ],
};

const getImageUrl = (filename: string) => 
  `${SUPABASE_URL}/storage/v1/object/public/slike/${filename}`;

const getAudioUrl = (word: string) => {
  const normalizedWord = word
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, ''); // Remove diacritics (č→c, š→s, ž→z)
  return `${SUPABASE_URL}/storage/v1/object/public/zvocni-posnetki/${normalizedWord}.m4a`;
};

const LabirintLetter = () => {
  const { letter: rawLetter } = useParams<{ letter: string }>();
  // Decode URL-encoded letters (e.g., %C4%8D → č)
  const letter = rawLetter ? decodeURIComponent(rawLetter) : undefined;
  const navigate = useNavigate();
  const [gameKey, setGameKey] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [cards, setCards] = useState<Array<{ image_url: string; word: string; audio_url: string }>>([]);
  const { recordGameCompletion } = useEnhancedProgress();
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const { user, selectedChild } = useAuth();
  const gameCompletedRef = useRef(false);
  
  // Reliable touch device detection using physical screen size
  useEffect(() => {
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = Math.min(window.screen.width, window.screen.height) <= 900;
    setIsTouchDevice(hasTouch && isSmallScreen);
  }, []);

  // Reliable orientation detection using screen.orientation
  useEffect(() => {
    const checkOrientation = () => {
      if (window.screen.orientation) {
        setIsPortrait(window.screen.orientation.type.includes('portrait'));
      } else {
        setIsPortrait(window.screen.height > window.screen.width);
      }
    };
    
    checkOrientation();
    
    const handleOrientationChange = () => {
      setTimeout(checkOrientation, 100);
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    if (window.screen.orientation) {
      window.screen.orientation.addEventListener('change', checkOrientation);
    }
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      if (window.screen.orientation) {
        window.screen.orientation.removeEventListener('change', checkOrientation);
      }
    };
  }, []);

  const effectiveFullscreen = isTouchDevice;

  // Load cards from static data based on letter - using bucket "slike"
  useEffect(() => {
    if (!letter) return;
    
    const images = labirintImages[letter.toLowerCase()];
    if (!images) {
      console.error('No images found for letter:', letter);
      return;
    }
    
    const cardsData = images.map(img => ({
      image_url: getImageUrl(img.filename),
      word: img.word,
      audio_url: getAudioUrl(img.word)
    }));
    
    setCards(cardsData);
  }, [letter]);

  const completionImages = useMemo(() => {
    if (cards.length === 0) return [];
    
    // Shuffle and pick 4 random cards
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 4);
    
    return selected.map(card => ({
      filename: card.word || '',
      url: card.image_url || '',
      word: card.word || '',
      audio_url: card.audio_url || ''
    }));
  }, [cards, gameKey]);

  const handleGameComplete = () => {
    if (!gameCompletedRef.current) {
      gameCompletedRef.current = true;
      setShowCompletion(true);
    }
  };

  const handleNewGame = () => {
    gameCompletedRef.current = false;
    setGameKey(prev => prev + 1);
    setShowCompletion(false);
    setMenuOpen(false);
  };

  const handleBack = () => {
    setMenuOpen(false);
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    navigate('/govorne-igre/labirint');
  };

  const handleStarClaimed = async () => {
    await recordGameCompletion('memory_game', `labirint-${letter?.toLowerCase()}`);
    // Don't close dialog - let user see "Nova igra" button
  };

  const backgroundImageUrl = `${SUPABASE_URL}/storage/v1/object/public/ozadja/svetlomodro_ozadje.png`;

  useEffect(() => {
    if (effectiveFullscreen) {
      const requestFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          }
        } catch (error) {
          console.log('Fullscreen not supported:', error);
        }
      };

      const lockLandscape = async () => {
        try {
          if (screen.orientation && 'lock' in screen.orientation) {
            try {
              await (screen.orientation as any).lock('landscape-primary');
            } catch {
              await (screen.orientation as any).lock('landscape');
            }
          }
        } catch (error) {
          console.log('Landscape lock not supported:', error);
        }
      };

      requestFullscreen();
      lockLandscape();
      
      return () => {
        if (document.fullscreenElement) {
          document.exitFullscreen?.();
        }
        try {
          if (screen.orientation && 'unlock' in screen.orientation) {
            (screen.orientation as any).unlock();
          }
        } catch (error) {
          console.log('Portrait unlock not supported:', error);
        }
      };
    }
  }, [effectiveFullscreen]);

  // Mobile fullscreen version
  if (effectiveFullscreen) {
    return (
      <div className="fixed inset-0 overflow-hidden select-none">
        <div 
          className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
        />
        
        <div className="relative z-10 flex-1 flex items-stretch justify-center overflow-hidden h-full w-full">
          {!isPortrait ? (
            <MazeGame key={gameKey} onComplete={handleGameComplete} cols={16} rows={9} />
          ) : (
            <div className="w-full h-full flex items-center justify-center px-6 text-center">
              <p className="text-base font-semibold text-foreground">
                Za igranje labirinta prosim obrni telefon v ležeči položaj.
              </p>
            </div>
          )}
        </div>

        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
              <Home className="w-8 h-8 text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="start" 
            side="top"
            sideOffset={8}
            className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
          >
            <button
              onClick={handleBack}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🏠</span>
              <span>Nazaj</span>
            </button>
            <button
              onClick={handleNewGame}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
            >
              <span className="text-2xl">🔄</span>
              <span>Nova igra</span>
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                setShowInstructions(true);
              }}
              className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
            >
              <span className="text-2xl">📖</span>
              <span>Navodila</span>
            </button>
          </DropdownMenuContent>
        </DropdownMenu>

        <MemoryExitConfirmationDialog
          open={showExitDialog}
          onOpenChange={setShowExitDialog}
          onConfirm={handleConfirmExit}
        >
          <div />
        </MemoryExitConfirmationDialog>

        <InstructionsModal
          isOpen={showInstructions}
          onClose={() => setShowInstructions(false)}
          type="maze"
        />

        {completionImages.length > 0 && (
          <MatchingCompletionDialog
            isOpen={showCompletion}
            onClose={() => setShowCompletion(false)}
            images={completionImages}
            onStarClaimed={handleStarClaimed}
            onNewGame={handleNewGame}
            instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE"
            autoPlayAudio={false}
          />
        )}
      </div>
    );
  }

  // Desktop version
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col">
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImageUrl}')` }}
      />
      
      <div className="relative z-10 flex-1 overflow-hidden w-full h-full">
        <MazeGame key={gameKey} onComplete={handleGameComplete} cols={16} rows={9} alignTop />
      </div>

      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button className="fixed bottom-4 left-4 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform">
            <Home className="w-8 h-8 text-white" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="start" 
          side="top"
          sideOffset={8}
          className="ml-4 w-56 p-2 bg-white/95 border-2 border-orange-200 shadow-xl"
        >
          <button
            onClick={handleBack}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🏠</span>
            <span>Nazaj</span>
          </button>
          <button
            onClick={handleNewGame}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium border-b border-orange-100"
          >
            <span className="text-2xl">🔄</span>
            <span>Nova igra</span>
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              setShowInstructions(true);
            }}
            className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 text-base font-medium"
          >
            <span className="text-2xl">📖</span>
            <span>Navodila</span>
          </button>
        </DropdownMenuContent>
      </DropdownMenu>

      <MemoryExitConfirmationDialog
        open={showExitDialog}
        onOpenChange={setShowExitDialog}
        onConfirm={handleConfirmExit}
      >
        <div />
      </MemoryExitConfirmationDialog>

      <InstructionsModal
        isOpen={showInstructions}
        onClose={() => setShowInstructions(false)}
        type="maze"
      />

      {completionImages.length > 0 && (
        <MatchingCompletionDialog
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          images={completionImages}
          onStarClaimed={handleStarClaimed}
          onNewGame={handleNewGame}
          instructionText="KLIKNI NA SPODNJE SLIKE IN PONOVI BESEDE"
          autoPlayAudio={false}
        />
      )}
    </div>
  );
};

export default LabirintLetter;
