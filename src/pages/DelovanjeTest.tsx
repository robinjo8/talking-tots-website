import Header from "@/components/Header";
import { FooterSection } from "@/components/home/FooterSection";

const DelovanjeTest = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4 md:px-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8">
            Kako deluje test izgovorjave?
          </h1>
          
          <div className="prose prose-lg max-w-none text-justify">
            <p className="text-muted-foreground">
              Vsebina strani bo kmalu na voljo.
            </p>
          </div>
        </div>
      </main>

      <FooterSection />
    </div>
  );
};

export default DelovanjeTest;
