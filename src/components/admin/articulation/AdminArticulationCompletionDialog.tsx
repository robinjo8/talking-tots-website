import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useLogopedistArticulationSession } from "@/hooks/useLogopedistArticulationSession";
import { toast } from "sonner";

interface AdminArticulationCompletionDialogProps {
  open: boolean;
  onClose: () => void;
  childId: string;
  sessionNumber: number;
}

/**
 * Completion dialog for admin/logopedist articulation tests.
 * Saves the session with organization_id and logopedist_child_id
 * for proper filtering in the pending queue.
 */
const AdminArticulationCompletionDialog = ({
  open,
  onClose,
  childId,
  sessionNumber,
}: AdminArticulationCompletionDialogProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const navigate = useNavigate();
  const { saveSession, isSaving } = useLogopedistArticulationSession();

  useEffect(() => {
    const fetchImage = async () => {
      const { data } = supabase.storage
        .from("zmajcki")
        .getPublicUrl("Zmajcek_7.webp");
      if (data) {
        setImageUrl(data.publicUrl);
      }
    };
    fetchImage();
  }, []);

  const handleClose = async () => {
    try {
      const result = await saveSession(childId, sessionNumber);
      if (result.success) {
        toast.success("Preverjanje izgovorjave je bilo uspešno shranjeno!");
      } else {
        toast.error("Napaka pri shranjevanju: " + (result.error || "Neznana napaka"));
      }
    } catch (error) {
      console.error("Error saving test result:", error);
      toast.error("Napaka pri shranjevanju preverjanja");
    } finally {
      onClose();
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
            <p className="text-lg text-muted-foreground">
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

export default AdminArticulationCompletionDialog;
