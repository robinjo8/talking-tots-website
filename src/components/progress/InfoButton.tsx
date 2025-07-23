import { Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface InfoButtonProps {
  title: string;
  content: string;
}
export function InfoButton({
  title,
  content
}: InfoButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return <>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(true)} className="absolute top-2 right-2 h-6 w-6 p-0 rounded-full text-muted-foreground hover:text-foreground shadow-sm bg-white/0 text-base font-semibold">
        <Info className="h-3 w-3" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center mb-4">
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="px-2 pb-4">
            <div className="space-y-4">
              {content.split('\n\n').map((paragraph, index) => <p key={index} className="text-foreground leading-relaxed text-sm">
                  {paragraph}
                </p>)}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
}