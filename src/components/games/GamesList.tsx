import { useNavigate } from "react-router-dom";

const otherGames = [
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Igraj spomin in vadi izgovorjavo",
    image: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_4.png?t=${new Date().getTime()}`,
    gradient: "from-app-purple/20 to-app-blue/20",
    path: "/govorne-igre/spomin",
    available: true
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Igraj sestavljanke in vadi logično razmišljanje",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_4.png",
    gradient: "from-app-teal/20 to-dragon-green/20",
    path: "/govorne-igre/sestavljanke",
    available: true
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Uredi zaporedje slik in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja.png",
    gradient: "from-dragon-green/20 to-app-teal/20",
    path: "/govorne-igre/zaporedja",
    available: true
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA SESTAVLJANKA",
    description: "Drsne sestavljanke za vajo izgovorjave",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_4.png",
    gradient: "from-app-orange/20 to-app-yellow/20",
    path: "/govorne-igre/drsna-sestavljanka",
    available: true
  },
  {
    id: "povezi-pare-matching",
    title: "IGRA UJEMANJA",
    description: "Poveži enake slike med stolpci",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/povezi_pare_4.png",
    gradient: "from-app-blue/20 to-app-purple/20",
    path: "/govorne-igre/igra-ujemanja",
    available: true
  },
  {
    id: "labirint",
    title: "LABIRINT",
    description: "Poišči pot skozi labirint in vadi izgovorjavo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/labirint_4.png",
    gradient: "from-app-yellow/20 to-app-orange/20",
    path: "/govorne-igre/labirint",
    available: true
  },
  {
    id: "igra9",
    title: "Igra 9",
    description: "Kmalu na voljo",
    gradient: "from-app-teal/20 to-dragon-green/20",
    available: false
  },
  {
    id: "igra10",
    title: "Igra 10",
    description: "Kmalu na voljo",
    gradient: "from-app-purple/20 to-app-blue/20",
    available: false
  }
];

export function GamesList() {
  const navigate = useNavigate();
  const activeGames = otherGames.filter(game => game.available);
  const inactiveGames = otherGames.filter(game => !game.available);

  const handleGameClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="space-y-16">
      {/* Available Games Section */}
      <section>
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Igre na voljo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {activeGames.map((game) => (
            <div
              key={game.id}
              onClick={() => handleGameClick(game.path)}
              className="group cursor-pointer"
            >
              <div className={`bg-gradient-to-br ${game.gradient} bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300`}>
                {/* Image Container */}
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                
                {/* Text Content */}
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-[hsl(122,39%,49%)] transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {game.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Coming Soon Section */}
      {inactiveGames.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            KMALU NA VOLJO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {inactiveGames.map((game) => (
              <div
                key={game.id}
                className="opacity-60 cursor-not-allowed"
              >
                <div className={`bg-gradient-to-br ${game.gradient} bg-card rounded-xl overflow-hidden shadow-md`}>
                  {/* Image Container with orange gradient for inactive */}
                  <div className="aspect-video relative overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100">
                    {game.image ? (
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover object-center grayscale"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-6xl">🎮</div>
                    )}
                  </div>
                  
                  {/* Text Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      {game.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {game.description}
                    </p>
                    <p className="text-app-orange font-semibold text-sm">
                      Kmalu na voljo
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
