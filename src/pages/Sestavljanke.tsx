import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Sestavljanke() {
  const navigate = useNavigate();

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>
      {/* Minimal back button floating over the iframe */}
      <Button 
        variant="ghost" 
        size="icon"
        className="absolute top-4 left-4 z-50 w-10 h-10 bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-colors shadow-md"
        onClick={() => navigate("/govorne-igre")}
      >
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-foreground"
        >
          <path 
            d="M19 12H5M12 19L5 12L12 5" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </Button>
      
      <iframe 
        src="https://puzzel.org/en/crossword/embed?p=-N7G3WdPBEnNh4jW6-Q7" 
        style={{ width: "100%", height: "100%", border: "none" }}
        title="Križanka"
        allowFullScreen
      />
    </div>
  );
}