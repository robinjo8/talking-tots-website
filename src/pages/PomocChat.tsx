import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/ChatInterface";

const PomocChat = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-md">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-app-orange flex items-center justify-center">
            <span className="text-white text-sm font-bold">T</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold">Tomi – AI pomočnik</h1>
            <p className="text-xs text-muted-foreground">
              Govorno-jezikovni svetovalec
            </p>
          </div>
        </div>
      </header>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </div>
  );
};

export default PomocChat;
