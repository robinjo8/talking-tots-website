
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
          {/* Back Button - Professional arrow */}
          <Button 
            variant="ghost" 
            size="icon"
            className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors flex-shrink-0"
            onClick={handleBack}
          >
            <svg 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-gray-700"
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
