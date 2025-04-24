
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChildProfileCard } from "@/components/ChildProfileCard";

type SelectChildDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SelectChildDialog({ open, onOpenChange }: SelectChildDialogProps) {
  const navigate = useNavigate();
  const { profile, setSelectedChildIndex } = useAuth();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelectChild = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    if (selectedIndex !== null) {
      setSelectedChildIndex(selectedIndex);
      localStorage.setItem('selectedChildIndex', selectedIndex.toString());
      onOpenChange(false);
      navigate("/moja-stran");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Izberi profil otroka</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-1 gap-4 my-4 px-1">
            {profile?.children?.map((child, index) => (
              <div 
                key={index} 
                className="w-full cursor-pointer" 
                onClick={() => handleSelectChild(index)}
              >
                <ChildProfileCard
                  child={child}
                  isSelected={selectedIndex === index}
                  onSelect={() => handleSelectChild(index)}
                  hideActions={true}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
        
        <div className="flex justify-end gap-3 mt-4 pt-4 border-t">
          <Button
            onClick={handleConfirm}
            disabled={selectedIndex === null}
            className="bg-dragon-green hover:bg-dragon-green/90"
          >
            Potrdi izbiro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
