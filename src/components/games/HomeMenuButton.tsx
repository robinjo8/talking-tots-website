import { Home } from "lucide-react";

interface HomeMenuButtonProps {
  onClick?: () => void;
}

export function HomeMenuButton({ onClick }: HomeMenuButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg border-2 border-white/50 backdrop-blur-sm hover:scale-105 transition-transform"
    >
      <Home className="w-8 h-8 text-white" />
    </button>
  );
}
