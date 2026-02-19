import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KaceDifficulty, KacePlayers, DRAGON_AVATARS } from "@/data/kaceLestveConfig";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

const difficultyOptions: { value: KaceDifficulty; label: string; description: string; color: string }[] = [
  { value: "lahka", label: "LAHKA", description: "+2 polji za pravilno besedo", color: "#22C55E" },
  { value: "srednja", label: "SREDNJA", description: "+1 polje za pravilno besedo", color: "#3B82F6" },
  { value: "tezka", label: "TEŽKA", description: "Brez bonusa", color: "#F97316" },
];

interface KaceLestveSettingsModalProps {
  isOpen: boolean;
  isInGame: boolean;
  onStart: (players: KacePlayers, difficulty: KaceDifficulty, avatars: string[]) => void;
  onUpdateSettings: (difficulty: KaceDifficulty) => void;
  currentDifficulty: KaceDifficulty;
  currentAvatars: string[];
}

export function KaceLestveSettingsModal({
  isOpen,
  isInGame,
  onStart,
  onUpdateSettings,
  currentDifficulty,
  currentAvatars,
}: KaceLestveSettingsModalProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<KacePlayers>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<KaceDifficulty>(currentDifficulty);
  const [avatars, setAvatars] = useState<string[]>([...currentAvatars]);

  const handleAvatarSelect = (playerIdx: number, avatar: string) => {
    const next = [...avatars];
    next[playerIdx] = avatar;
    setAvatars(next);
  };

  const handleConfirm = () => {
    if (isInGame) {
      onUpdateSettings(selectedDifficulty);
    } else {
      onStart(selectedPlayers, selectedDifficulty, avatars);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-5 py-2">
          <div className="text-center">
            <h2 className="text-2xl font-black mb-1">🐍 KAČE IN LESTVE 🪜</h2>
            <p className="text-muted-foreground text-sm">
              {isInGame ? "Prilagodi nastavitve" : "Izberi nastavitve igre"}
            </p>
          </div>

          {/* Number of players - only on start */}
          {!isInGame && (
            <div className="w-full">
              <h3 className="font-bold text-center mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                ŠTEVILO IGRALCEV
              </h3>
              <div className="flex gap-3 justify-center">
                {([1, 2] as KacePlayers[]).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSelectedPlayers(n)}
                    className={`flex-1 py-3 rounded-xl font-black text-sm border-2 transition-all ${
                      selectedPlayers === n
                        ? "bg-dragon-green text-white border-dragon-green scale-105 shadow-md"
                        : "bg-muted text-muted-foreground border-transparent hover:border-dragon-green/50"
                    }`}
                  >
                    {n === 1 ? "1 IGRALEC" : "2 IGRALCA"}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Avatar selection - only on start */}
          {!isInGame && (
            <div className="w-full">
              <h3 className="font-bold text-center mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                IZBERI ZMAJČKA
              </h3>
              {Array.from({ length: selectedPlayers }, (_, playerIdx) => (
                <div key={playerIdx} className="mb-4">
                  <p className="text-xs font-bold text-center mb-2 text-muted-foreground">
                    {playerIdx === 0 ? "ZMAJČEK 1 (🔵)" : "ZMAJČEK 2 (🔴)"}
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {DRAGON_AVATARS.map((av) => (
                      <button
                        key={av}
                        onClick={() => handleAvatarSelect(playerIdx, av)}
                        className={`aspect-square rounded-xl overflow-hidden border-3 transition-all ${
                          avatars[playerIdx] === av
                            ? "border-dragon-green scale-110 shadow-lg"
                            : "border-transparent hover:border-dragon-green/40"
                        }`}
                        style={{ borderWidth: avatars[playerIdx] === av ? 3 : 2 }}
                      >
                        <img
                          src={`${SUPABASE_URL}/zmajcki/${av}`}
                          alt={av}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Difficulty */}
          <div className="w-full">
            <h3 className="font-bold text-center mb-3 text-sm text-muted-foreground uppercase tracking-wide">
              TEŽAVNOST
            </h3>
            <div className="flex flex-col gap-2">
              {difficultyOptions.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDifficulty(d.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                    selectedDifficulty === d.value
                      ? "border-current scale-[1.02] shadow-md"
                      : "border-transparent bg-muted hover:bg-muted/80"
                  }`}
                  style={selectedDifficulty === d.value ? {
                    backgroundColor: d.color + '20',
                    borderColor: d.color,
                    color: d.color,
                  } : {}}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0"
                    style={{ backgroundColor: d.color }}
                  >
                    {d.label.charAt(0)}
                  </div>
                  <div>
                    <div className="font-black text-sm" style={{ color: selectedDifficulty === d.value ? d.color : undefined }}>
                      {d.label}
                    </div>
                    <div className="text-xs text-muted-foreground">{d.description}</div>
                  </div>
                  {selectedDifficulty === d.value && (
                    <div className="ml-auto text-lg">✓</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <Button
            onClick={handleConfirm}
            className="w-full font-black text-base py-4 rounded-xl text-white shadow-lg"
            style={{ backgroundColor: '#22C55E', fontSize: '16px' }}
          >
            {isInGame ? "✓ POTRDI" : "🎲 ZAČNI IGRO"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
