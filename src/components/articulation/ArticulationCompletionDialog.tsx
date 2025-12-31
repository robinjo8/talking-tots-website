import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface ArticulationCompletionDialogProps {
  open: boolean;
  onClose: () => void;
}

const ArticulationCompletionDialog = ({
  open,
  onClose,
}: ArticulationCompletionDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = supabase.storage
        .from("zmajcki")
        .getPublicUrl("Zmajcek_7.png");
      if (data) {
        setImageUrl(data.publicUrl);
      }
    };
    fetchImage();
  }, []);

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md text-center p-8 [&>button]:hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Dragon image */}
          {imageUrl && (
            <img
              src={imageUrl}
              alt="Zmajček"
              className="w-40 h-40 object-contain"
            />
          )}

          {/* Congratulations text */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-green-600">Čestitamo!</h2>
            <p className="text-lg text-gray-700">
              Test izgovorjave je uspešno zaključen.
            </p>
          </div>

          {/* Close button */}
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full text-lg font-medium"
            size="lg"
          >
            Zapri
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationCompletionDialog;
