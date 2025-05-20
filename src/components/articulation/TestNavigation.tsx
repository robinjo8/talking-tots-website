
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface TestNavigationProps {
  onNext: () => void;
  onPrevious: () => void;
}

const TestNavigation = ({ onNext, onPrevious }: TestNavigationProps) => {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center justify-center space-x-4">
        <Button 
          onClick={onPrevious}
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14 border-2 hidden sm:flex"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        
        <Button 
          onClick={onNext}
          size="icon"
          className="bg-app-blue hover:bg-app-blue/90 rounded-full h-16 w-16"
        >
          <ArrowRight className="h-8 w-8" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">Naslednja beseda</p>
    </div>
  );
};

export default TestNavigation;
