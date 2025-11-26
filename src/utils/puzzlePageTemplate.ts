// Template utility for batch updating Sestavljanke pages with consistent floating menu button
// This file documents the changes needed for all Sestavljanke pages

export const REQUIRED_IMPORTS = `
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Home } from "lucide-react";
`;

export const REQUIRED_STATE = `
const [menuOpen, setMenuOpen] = useState(false);
const [showExitDialog, setShowExitDialog] = useState(false);
`;

export const MOBILE_FLOATING_MENU = `
{/* Floating menu button */}
<DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
  <DropdownMenuTrigger asChild>
    <Button size="icon" className="fixed bottom-4 left-4 z-50 bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-2xl rounded-full w-16 h-16 border-2 border-white/20">
      <Home className="w-11 h-11" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent side="top" align="start" className="mb-2 ml-4 w-56 p-2 bg-background/95 backdrop-blur-sm border-2 shadow-xl z-[60]" sideOffset={8}>
    <div className="flex flex-col gap-2">
      <Button variant="outline" className="gap-2 w-full h-11 text-base justify-start" onClick={() => {
        setShowExitDialog(true);
        setMenuOpen(false);
      }}>
        <ArrowLeft className="w-5 h-5" />
        Nazaj
      </Button>
      
      <Button onClick={() => {
        handleNewGame();
        setMenuOpen(false);
      }} className="bg-dragon-green hover:bg-dragon-green/90 text-white gap-2 w-full h-11 text-base justify-start">
        <RotateCcw className="w-5 h-5" />
        Nova igra
      </Button>
      
      <Button variant="outline" onClick={() => {
        setShowInstructions(true);
        setMenuOpen(false);
      }} className="gap-2 w-full h-11 text-base justify-start">
        <BookOpen className="w-5 h-5" />
        Navodila
      </Button>
    </div>
  </DropdownMenuContent>
</DropdownMenu>

<MemoryExitConfirmationDialog 
  open={showExitDialog} 
  onOpenChange={setShowExitDialog} 
  onConfirm={() => navigate("/govorne-igre/sestavljanke")}
>
  <div />
</MemoryExitConfirmationDialog>
`;

export const MOBILE_MAIN_DIV_CLASSES = "fixed inset-0 overflow-hidden select-none touch-none overscroll-none relative";
