import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";

export default function SestavljankeRiba() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Sestavljanka - Riba" backPath="/govorne-igre/sestavljanke/r" />
      
      <div className="w-full h-[calc(100vh-140px)] p-4">
        <iframe 
          src='https://puzzel.org/en/jigsaw/embed?p=-OUil2vhH3RR0sfbrViW' 
          width='100%' 
          height='100%' 
          frameBorder='0' 
          allowFullScreen
          title="Riba Sestavljanka"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}