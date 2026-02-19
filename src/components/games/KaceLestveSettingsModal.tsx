import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { KaceDifficulty, KacePlayers } from "@/data/kaceLestveConfig";

interface KaceLestveSettingsModalProps {
  isOpen: boolean;
  onStart: (players: KacePlayers, difficulty: KaceDifficulty) => void;
}

const difficultyOptions: { value: KaceDifficulty; label: string; description: string }[] = [
  { value: "lahka", label: "LAHKA", description: "Za vsako pravilno besedo se premakneš za 2 dodatni polji" },
  { value: "srednja", label: "SREDNJA", description: "Za vsako pravilno besedo se premakneš za 1 dodatno polje" },
  { value: "tezka", label: "TEŽKA", description: "Brez dodatnih polj za pravilno besedo" },
];

export function KaceLestveSettingsModal({ isOpen, onStart }: KaceLestveSettingsModalProps) {
  const handleStart = (players: KacePlayers, difficulty: KaceDifficulty) => {
    onStart(players, difficulty);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-dragon-green mb-2">🐍 KAČE IN LESTVE 🪜</h2>
            <p className="text-muted-foreground text-sm">Izberi nastavitve igre</p>
          </div>

          {/* Player count */}
          <div className="w-full">
            <h3 className="font-bold text-foreground mb-3 text-center text-lg">ŠTEVILO IGRALCEV</h3>
            <div className="grid grid-cols-2 gap-3">
              {([1, 2] as KacePlayers[]).map((n) => (
                <div key={n}>
                  <h4 className="font-bold text-center mb-2 text-sm text-muted-foreground">{n === 1 ? "1 IGRALEC" : "2 IGRALCA"}</h4>
                  <div className="space-y-2">
                    {difficultyOptions.map((diff) => (
                      <Button
                        key={diff.value}
                        onClick={() => handleStart(n, diff.value)}
                        className={`w-full text-white font-bold py-3 text-sm ${
                          diff.value === "lahka"
                            ? "bg-dragon-green hover:bg-dragon-green/90"
                            : diff.value === "srednja"
                            ? "bg-app-blue hover:bg-app-blue/90"
                            : "bg-app-orange hover:bg-app-orange/90"
                        }`}
                      >
                        {diff.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty legend */}
          <div className="w-full bg-muted/50 rounded-lg p-3 space-y-2">
            <p className="text-xs font-bold text-center text-muted-foreground mb-2">BONUS ZA PRAVILNO BESEDO</p>
            {difficultyOptions.map((d) => (
              <div key={d.value} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span className={`font-bold shrink-0 ${
                  d.value === "lahka" ? "text-dragon-green" : d.value === "srednja" ? "text-app-blue" : "text-app-orange"
                }`}>
                  {d.label}:
                </span>
                <span>{d.description}</span>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
