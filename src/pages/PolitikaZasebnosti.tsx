import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { FooterSection } from "@/components/home/FooterSection";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PolitikaZasebnosti = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPdfUrl = async () => {
      try {
        const { data } = supabase.storage
          .from('dokumenti')
          .getPublicUrl('Politika zasebnosti TomiTalk.pdf');
        
        if (data?.publicUrl) {
          setPdfUrl(data.publicUrl);
        }
      } catch (error) {
        console.error('Error fetching PDF URL:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPdfUrl();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24 flex-1 w-full">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Politika zasebnosti</h1>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-dragon-green" />
          </div>
        ) : pdfUrl ? (
          <div className="w-full">
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full h-[80vh] border border-border rounded-lg"
              title="Politika zasebnosti TomiTalk"
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-justify">
            Dokument ni na voljo. Prosimo, poskusite znova kasneje.
          </p>
        )}
      </div>
      <FooterSection />
    </div>
  );
};

export default PolitikaZasebnosti;
