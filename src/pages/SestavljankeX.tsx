import { AppLayout } from "@/components/AppLayout";
import { SimpleJigsaw } from "@/components/puzzle/SimpleJigsaw";

export default function SestavljankeX() {
  const imageUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_6.png";
  
  const handleComplete = () => {
    console.log("Puzzle completed!");
  };

  return (
    <AppLayout>
      <div className="w-full h-screen bg-background p-4">
        <SimpleJigsaw 
          imageUrl={imageUrl}
          gridCols={3}
          gridRows={2}
          onComplete={handleComplete}
        />
      </div>
    </AppLayout>
  );
}