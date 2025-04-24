
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Izberi profil otroka</DialogTitle>
          <DialogDescription>
            Za nadaljevanje izberi profil otroka.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          {profile?.children?.map((child, index) => (
            <div key={index} className="w-full">
              <ChildProfileCard
                child={child}
                isSelected={selectedIndex === index}
                onSelect={() => handleSelectChild(index)}
                hideActions
              />
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate("/profile");
            }}
          >
            Ustvari nov profil
          </Button>
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
