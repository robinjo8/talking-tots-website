
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
        <div className="flex items-center justify-between relative">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 text-dragon-green hover:text-dragon-green/80 hover:bg-dragon-green/10 transition-colors"
            onClick={handleBack}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="font-medium">Nazaj</span>
          </Button>
          
          {/* Centered Title */}
          <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl md:text-2xl font-bold text-foreground">
            {title}
          </h1>
          
          {/* Empty space for balance */}
          <div className="w-20"></div>
        </div>
      </div>
    </div>
  );
}
