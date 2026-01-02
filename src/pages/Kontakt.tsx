import Header from "@/components/Header";
import { FooterSection } from "@/components/home/FooterSection";

const Kontakt = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Kontakt</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-justify">
          <p className="text-muted-foreground leading-relaxed">
            Če imate vprašanje, potrebujete dodatne informacije ali želite podati povratne informacije, se lahko kadarkoli obrnete na nas. Odgovorili vam bomo v najkrajšem možnem času.
          </p>
          
          <div className="mt-8 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Elektronski naslov:</strong> info@tomitalk.si
            </p>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Naslov:</strong> Dobrnič 13, 8211 Dobrnič, Slovenija
            </p>
          </div>
        </div>
      </div>
      
      <FooterSection />
    </div>
  );
};

export default Kontakt;
