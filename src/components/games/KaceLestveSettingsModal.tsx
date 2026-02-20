import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Gamepad2 } from "lucide-react";
import { KaceDifficulty, KacePlayers } from "@/data/kaceLestveConfig";
import { MemoryExitConfirmationDialog } from "@/components/games/MemoryExitConfirmationDialog";

const SUPABASE_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public";

const BLUE_AVATAR = "Zmajcek_modra_figura_1.webp";
const RED_AVATAR = "Zmajcek_rdeca_figura_1.webp";

const difficultyOptions: { value: KaceDifficulty; label: string; badge?: string; description: string }[] = [
  { value: "lahka", label: "Lahka", description: "+2 polji za pravilno besedo" },
  { value: "srednja", label: "Srednja", badge: "priporočeno", description: "+1 polje za pravilno besedo" },
  { value: "tezka", label: "Težka", description: "Brez bonusa za pravilno besedo" },
];

interface KaceLestveSettingsModalProps {
  isOpen: boolean;
  isInGame: boolean;
  onStart: (players: KacePlayers, difficulty: KaceDifficulty, avatars: string[]) => void;
  onUpdateSettings: (difficulty: KaceDifficulty) => void;
  currentDifficulty: KaceDifficulty;
  currentAvatars: string[];
  onBack?: () => void;
}

export function KaceLestveSettingsModal({
  isOpen,
  isInGame,
  onStart,
  onUpdateSettings,
  currentDifficulty,
  currentAvatars,
  onBack,
}: KaceLestveSettingsModalProps) {
  const [selectedPlayers, setSelectedPlayers] = useState<KacePlayers>(1);
  const [selectedDifficulty, setSelectedDifficulty] = useState<KaceDifficulty>(currentDifficulty);
  // Player 1 avatar choice (blue or red); player 2 gets the opposite
  const [player1Avatar, setPlayer1Avatar] = useState<string>(currentAvatars[0] || BLUE_AVATAR);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const player2Avatar = player1Avatar === BLUE_AVATAR ? RED_AVATAR : BLUE_AVATAR;

  const handleConfirm = () => {
    if (isInGame) {
      onUpdateSettings(selectedDifficulty);
    } else {
      const avatars = selectedPlayers === 1
        ? [player1Avatar, player2Avatar]
        : [player1Avatar, player2Avatar];
      onStart(selectedPlayers, selectedDifficulty, avatars);
    }
  };

  const handleBack = () => {
    setShowExitConfirm(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md max-h-[90vh] overflow-y-auto [&>button:first-child]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <Gamepad2 className="w-5 h-5 text-teal-600" />
              {isInGame ? "Nastavitve igre" : "Nastavitve igre"}
            </DialogTitle>
            <DialogDescription>
              {isInGame
                ? "Prilagodite težavnost igre."
                : "Izberite število igralcev, zmajčka in težavnost igre."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-6 pt-2">

            {/* Number of players - only on start */}
            {!isInGame && (
              <div className="space-y-3">
                <p className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  Število igralcev
                </p>
                <div className="flex gap-3">
                  {([1, 2] as KacePlayers[]).map((n) => (
                    <button
                      key={n}
                      onClick={() => setSelectedPlayers(n)}
                      className={`flex-1 py-3 rounded-lg font-semibold text-sm border-2 transition-all ${
                        selectedPlayers === n
                          ? "bg-teal-50 text-teal-700 border-teal-500"
                          : "bg-background text-muted-foreground border-border hover:border-gray-300"
                      }`}
                    >
                      {n === 1 ? "1 Igralec" : "2 Igralca"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Avatar selection - only on start */}
            {!isInGame && (
              <div className="space-y-3">
                <p className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                  {selectedPlayers === 1 ? "Izberi zmajčka" : "Izberi zmajčka (Igralec 1)"}
                </p>
                <div className="flex gap-3">
                  {[BLUE_AVATAR, RED_AVATAR].map((av) => (
                    <button
                      key={av}
                      onClick={() => setPlayer1Avatar(av)}
                      className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-lg border-2 transition-all ${
                        player1Avatar === av
                          ? "bg-teal-50 border-teal-500"
                          : "bg-background border-border hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={`${SUPABASE_URL}/zmajcki/${av}`}
                        alt={av}
                        className="w-14 h-14 object-contain"
                      />
                      <span className={`text-xs font-medium ${player1Avatar === av ? "text-teal-700" : "text-muted-foreground"}`}>
                        {av === BLUE_AVATAR ? "Modri" : "Rdeči"}
                      </span>
                    </button>
                  ))}
                </div>
                {selectedPlayers === 2 && (
                  <div className="flex items-center gap-3 bg-muted/50 rounded-lg px-3 py-2">
                    <img
                      src={`${SUPABASE_URL}/zmajcki/${player2Avatar}`}
                      alt="player2"
                      className="w-8 h-8 object-contain"
                    />
                    <span className="text-sm text-muted-foreground">
                      Igralec 2: <span className="font-medium text-foreground">{player2Avatar === BLUE_AVATAR ? "Modri" : "Rdeči"} zmajček</span>
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Difficulty */}
            <div className="space-y-3">
              <p className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                Težavnost igre
              </p>
              <RadioGroup
                value={selectedDifficulty}
                onValueChange={(v) => setSelectedDifficulty(v as KaceDifficulty)}
                className="space-y-2"
              >
                {difficultyOptions.map((d) => (
                  <div
                    key={d.value}
                    className={`flex items-center gap-3 border-2 rounded-lg p-3 cursor-pointer transition-all ${
                      selectedDifficulty === d.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-border hover:border-gray-300 bg-background"
                    }`}
                    onClick={() => setSelectedDifficulty(d.value)}
                  >
                    <RadioGroupItem value={d.value} id={`diff-${d.value}`} className="text-teal-600 border-teal-400" />
                    <Label htmlFor={`diff-${d.value}`} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm ${selectedDifficulty === d.value ? "text-teal-700" : "text-foreground"}`}>
                          {d.label}
                        </span>
                        {d.badge && (
                          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                            {d.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{d.description}</div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              {!isInGame && onBack && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1"
                >
                  ← Nazaj
                </Button>
              )}
              <Button
                onClick={handleConfirm}
                className={`font-semibold bg-teal-600 hover:bg-teal-700 text-white ${!isInGame && onBack ? "flex-1" : "w-full"}`}
              >
                {isInGame ? "✓ Potrdi" : "🎲 Začni igro"}
              </Button>
            </div>

          </div>
        </DialogContent>
      </Dialog>

      {/* Exit confirmation when NAZAJ is clicked */}
      {!isInGame && onBack && (
        <MemoryExitConfirmationDialog
          open={showExitConfirm}
          onOpenChange={setShowExitConfirm}
          onConfirm={() => {
            setShowExitConfirm(false);
            onBack();
          }}
        >
          <span />
        </MemoryExitConfirmationDialog>
      )}
    </>
  );
}
