import { Button } from "@/components/ui/button";
import { useProgressMigration } from "@/hooks/useProgressMigration";
import { toast } from "sonner";

export function MigrationButton() {
  const { migrateExistingProgress, selectedChild } = useProgressMigration();

  const handleMigration = () => {
    if (!selectedChild) {
      toast.error("No child selected");
      return;
    }

    migrateExistingProgress();
    toast.success("Progress migrated to database!");
  };

  return (
    <Button 
      onClick={handleMigration}
      variant="outline"
      size="sm"
      className="mt-2"
    >
      Migrate Existing Progress
    </Button>
  );
}