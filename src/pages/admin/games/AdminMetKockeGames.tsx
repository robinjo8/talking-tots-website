import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { useParams } from "react-router-dom";

// Placeholder - the actual game will start directly without letter selection
export default function AdminMetKockeGames() {
  const { childId } = useParams<{ childId: string }>();
  
  return (
    <AdminGameWrapper 
      title="Smešne povedi"
      backPath={`/admin/children/${childId}/games`}
    >
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">
            Ta igra se zažene neposredno.
          </p>
          <p className="text-sm text-muted-foreground">
            Igra bo implementirana v naslednjem koraku.
          </p>
        </div>
      </div>
    </AdminGameWrapper>
  );
}
