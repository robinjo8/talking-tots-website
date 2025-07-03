
import React from "react";
import { Button } from "@/components/ui/button";
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
          {/* Back Button - Curved arrow in green circle */}
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 rounded-full bg-dragon-green hover:bg-dragon-green/90 text-white flex items-center justify-center transition-colors flex-shrink-0"
            onClick={handleBack}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path 
                d="M20 12H4M4 12L10 18M4 12L10 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M4 12C4 12 6 10 8 8C10 6 12 4 12 4" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                fill="none"
                opacity="0.6"
              />
            </svg>
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
