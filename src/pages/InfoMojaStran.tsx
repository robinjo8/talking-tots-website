import Header from "@/components/Header";

const InfoMojaStran = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8 pt-24 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold text-dragon-green mb-8">Moja stran</h1>
        <img 
          src="https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_stran_v_izdelavi.webp"
          alt="Zmajček - stran v izdelavi"
          className="w-64 h-64 object-contain mb-6"
        />
        <p className="text-lg text-muted-foreground">
          Stran je trenutno v izdelavi. Kmalu bo na voljo.
        </p>
      </div>
    </div>
  );
};

export default InfoMojaStran;
