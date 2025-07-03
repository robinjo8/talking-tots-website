
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
          {/* Back Button - Curved arrow */}
          <Button 
            variant="ghost" 
            size="icon"
            className="w-auto h-auto p-2 hover:bg-dragon-green/10 transition-colors flex-shrink-0"
            onClick={handleBack}
          >
            <svg 
              width="32" 
              height="32" 
              viewBox="0 0 32 32" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-dragon-green"
            >
              <path 
                d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14c3.866 0 7.37-1.567 9.899-4.101L23.071 23.07C21.17 24.97 18.715 26 16 26c-5.523 0-10-4.477-10-10S10.477 6 16 6c2.715 0 5.17 1.03 7.071 2.929l2.828-2.828C23.37 3.567 19.866 2 16 2z" 
                fill="currentColor"
              />
              <path 
                d="M12 11l-6 5 6 5v-3h8v-4h-8v-3z" 
                fill="currentColor"
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
