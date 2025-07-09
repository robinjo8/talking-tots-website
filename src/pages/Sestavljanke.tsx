import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";

export default function Sestavljanke() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <PageHeader title="Sestavljanke" backPath="/govorne-igre" />
      
      <div className="flex-1 container max-w-6xl mx-auto px-4 py-4">
        <p className="text-muted-foreground mb-4 text-center">
          Rešuj križanke in vadi logično razmišljanje ter besedišče.
        </p>

        <div className="flex justify-center h-full">
          <div className="w-full max-w-4xl">
            <iframe 
              src="https://puzzel.org/en/crossword/embed?p=-N7G3WdPBEnNh4jW6-Q7" 
              className="w-full border rounded-lg shadow-lg"
              style={{ height: 'calc(100vh - 200px)' }}
              frameBorder="0"
              title="Križanka"
            />
          </div>
        </div>
      </div>
    </div>
  );
}