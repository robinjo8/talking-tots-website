import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";

export default function Sestavljanke() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Sestavljanke" backPath="/govorne-igre" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8 text-center">
          Rešuj križanke in vadi logično razmišljanje ter besedišče.
        </p>

        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <iframe 
              src="https://puzzel.org/en/crossword/embed?p=-N7G3WdPBEnNh4jW6-Q7" 
              width="600" 
              height="900" 
              frameBorder="0"
              className="w-full border rounded-lg shadow-lg"
              title="Križanka"
            />
          </div>
        </div>
      </div>
    </div>
  );
}