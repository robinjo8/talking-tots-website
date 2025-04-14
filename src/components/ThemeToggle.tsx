
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme("light")}
      className="hidden" // Hide the toggle since we're only using light mode
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
