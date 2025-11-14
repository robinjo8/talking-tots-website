import { useNavigate } from "react-router-dom";

const otherGames = [
  {
    id: "spomin",
    title: "SPOMIN",
    description: "Igraj spomin in vadi izgovorjavo",
    image: `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/spomin_2.png?t=${new Date().getTime()}`,
    gradient: "from-app-purple/20 to-app-blue/20",
    path: "/govorne-igre/spomin",
    available: true
  },
  {
    id: "sestavljanke",
    title: "SESTAVLJANKE",
    description: "Igraj sestavljanke in vadi logično razmišljanje",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/sestavljanka_2.png",
    gradient: "from-app-teal/20 to-dragon-green/20",
    path: "/govorne-igre/sestavljanke",
    available: true
  },
  {
    id: "zaporedja",
    title: "ZAPOREDJA",
    description: "Kmalu na voljo",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/zaporedja.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    available: false
  },
  {
    id: "drsna-sestavljanka",
    title: "DRSNA SESTAVLJANKA",
    description: "Drsne sestavljanke za vajo izgovorjave",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/drsna_2.png",
    gradient: "from-app-orange/20 to-app-yellow/20",
    path: "/govorne-igre/drsna-sestavljanka",
    available: true
  },
  {
    id: "povezi-pare-matching",
    title: "IGRA UJEMANJA",
    description: "Poveži enake slike med stolpci",
    image: "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/povezi_pare_1.png",
    gradient: "from-app-purple/20 to-app-blue/20",
    path: "/govorne-igre/igra-ujemanja",
    available: true
  },
  {
    id: "igra8",
    title: "Igra 8",
    description: "Kmalu na voljo",
    gradient: "from-app-orange/20 to-app-yellow/20",
    available: false
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
    <>
      {/* Available Games Section */}
      <div className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeGames.map((game) => (
            <div
              key={game.id}
              className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
              onClick={() => handleGameClick(game.path)}
            >
              {/* Card Image */}
              <div 
                className="relative aspect-video overflow-hidden"
                style={{
                  background: 'radial-gradient(circle, rgb(255, 171, 0) 0%, rgb(234, 88, 12) 100%)'
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img 
                    src={game.image}
                    alt={game.title}
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
                  {game.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {game.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unavailable Games Section */}
      {inactiveGames.length > 0 && (
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-muted-foreground">
            KMALU NA VOLJO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {inactiveGames.map((game) => (
              <div
                key={game.id}
                className="bg-card rounded-xl shadow-md transition-all duration-300 overflow-hidden opacity-60 cursor-not-allowed"
              >
                {/* Card Image */}
                <div 
                  className="relative aspect-video overflow-hidden"
                  style={{
                    background: 'radial-gradient(circle, rgb(255, 171, 0) 0%, rgb(234, 88, 12) 100%)'
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {game.image ? (
                      <img 
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-6xl">🎮</div>
                    )}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {game.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed italic">
                    Kmalu na voljo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
