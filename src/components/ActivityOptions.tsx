import { useNavigate } from "react-router-dom";

export function ActivityOptions() {
  const navigate = useNavigate();
  
  console.log('🎯 ActivityOptions rendering');

  const activities = [
    {
      id: 'challenges',
      title: 'Moji izzivi',
      description: 'Priporočila pametnega asistenta.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_izzivi_6.png',
      gradient: 'from-app-orange/20 to-app-yellow/20',
      badge: '⭐',
      url: '/moji-izzivi'
    },
    {
      id: 'games',
      title: 'Govorne igre',
      description: 'Zabavne igre za izboljšanje izgovorjave.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre_4.png',
      gradient: 'from-dragon-green/20 to-dragon-green/20',
      badge: '🎮',
      url: '/govorne-igre'
    },
    {
      id: 'exercises',
      title: 'Govorne vaje',
      description: 'Prilagojene aktivnosti za izboljšanje izgovorjave.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje_6.png',
      gradient: 'from-app-blue/20 to-app-teal/20',
      badge: '📝',
      url: '/govorno-jezikovne-vaje'
    },
    {
      id: 'test',
      title: 'Test izgovorjave',
      description: 'Test izgovorjave za vse slovenske soglasnike.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_artikulacija_4.png',
      gradient: 'from-app-purple/20 to-app-teal/20',
      badge: '🎯',
      url: '/artikulacijski-test'
    },
    {
      id: 'video',
      title: 'Video navodila',
      description: 'Poglej kako logoped pravilno izgovori posamezne črke.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike-ostalo/Zmajcek_video_7.png',
      gradient: 'from-app-teal/20 to-dragon-green/20',
      badge: '🎥',
      url: '/video-navodila'
    },
    {
      id: 'advice',
      title: 'Logopedski nasveti',
      description: 'Koristni nasveti in informacije o govornem razvoju.',
      image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_logoped_4.png',
      gradient: 'from-app-purple/20 to-app-blue/20',
      badge: '💡',
      url: '/logopedski-koticek'
    }
  ];

  const handleActivityClick = (url: string) => {
    navigate(url);
  };

  console.log('🎯 Rendering cards, count:', activities.length);
  
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      style={{ minHeight: '500px' }}
    >
      {activities.map((activity, index) => {
        console.log('🎯 Rendering card:', activity.title);
        return (
          <div key={activity.id} className="flex h-full">
            <div
              className="bg-white rounded-xl shadow-xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden group flex flex-col w-full"
              onClick={() => handleActivityClick(activity.url)}
            >
            {/* Card Image */}
            <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${activity.gradient}`}>
              {/* Recommended badge - statično na Moji izzivi */}
              {activity.id === 'challenges' && (
                <div className="absolute top-4 left-4 bg-app-orange text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                  ⭐ Priporočeno
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors min-h-[3.5rem] flex items-center">
                {activity.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {activity.description}
              </p>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}