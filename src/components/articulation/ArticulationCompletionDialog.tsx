import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useArticulationTestStatus } from "@/hooks/useArticulationTestStatus";
import { toast } from "sonner";

interface ArticulationCompletionDialogProps {
  open: boolean;
  onClose: () => void;
}

const ArticulationCompletionDialog = ({
  open,
  onClose,
}: ArticulationCompletionDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { saveTestResult } = useArticulationTestStatus();

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

  const handleClose = async () => {
    setIsSaving(true);
    try {
      const success = await saveTestResult();
      if (success) {
        toast.success("Test izgovorjave je bil uspešno shranjen!");
      }
    } catch (error) {
      console.error("Error saving test result:", error);
    } finally {
      setIsSaving(false);
      onClose();
      navigate("/moje-aplikacije");
    }
  };

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
              Preverjanje izgovorjave je uspešno zaključeno.
            </p>
          </div>

          {/* Close button */}
          <Button
            onClick={handleClose}
            disabled={isSaving}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full text-lg font-medium"
            size="lg"
          >
            {isSaving ? "Shranjujem..." : "Zapri"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArticulationCompletionDialog;
