
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string;
  onBack?: () => void;
  backPath?: string;
}

export function PageHeader({ title, onBack, backPath }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (backPath) {
      navigate(backPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-background border-b border-gray-100 sticky top-20 z-40">
      <div className="container max-w-5xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Back Button - Arrow in green circle */}
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-dragon-green hover:bg-dragon-green/90 text-white flex items-center justify-center transition-colors flex-shrink-0"
            onClick={handleBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          {/* Centered Title */}
          <h1 className="text-xl md:text-2xl font-bold text-foreground text-center whitespace-nowrap overflow-hidden text-ellipsis flex-1 mx-4">
            {title}
          </h1>
          
          {/* Empty space for balance */}
          <div className="w-10 flex-shrink-0"></div>
        </div>
      </div>
    </div>
  );
}
