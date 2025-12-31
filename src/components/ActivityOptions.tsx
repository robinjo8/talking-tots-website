import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { useArticulationTestStatus } from "@/hooks/useArticulationTestStatus";
import { toast } from "sonner";
import { format } from "date-fns";
import { sl } from "date-fns/locale";

export function ActivityOptions() {
  const navigate = useNavigate();
  const { isTestAvailable, nextTestDate, lastCompletedAt } = useArticulationTestStatus();
  
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

  const handleActivityClick = (activity: typeof activities[0]) => {
    // Check if it's the articulation test and if it's locked
    if (activity.id === 'test' && lastCompletedAt && !isTestAvailable) {
      const formattedDate = nextTestDate 
        ? format(nextTestDate, "d. MMMM yyyy", { locale: sl })
        : "";
      toast.info(`Test bo na voljo ${formattedDate}`);
      return;
    }
    navigate(activity.url);
  };

  const isTestLocked = lastCompletedAt !== null && !isTestAvailable;

  console.log('🎯 Rendering cards, count:', activities.length);
  
  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      style={{ minHeight: '500px' }}
    >
      {activities.map((activity, index) => {
        const isLocked = activity.id === 'test' && isTestLocked;
        console.log('🎯 Rendering card:', activity.title);
        return (
          <div key={activity.id} className="flex h-full">
            <div
              className={`bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 overflow-hidden group flex flex-col w-full ${
                isLocked 
                  ? 'opacity-60 cursor-not-allowed' 
                  : 'hover:shadow-2xl hover:scale-[1.02] cursor-pointer'
              }`}
              onClick={() => handleActivityClick(activity)}
            >
            {/* Card Image */}
            <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${activity.gradient}`}>
              {/* Recommended badge - statično na Moji izzivi */}
              {activity.id === 'challenges' && (
                <div className="absolute top-4 left-4 bg-dragon-green text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                  ⭐ Priporočeno
                </div>
              )}
              {/* Locked badge for test */}
              {isLocked && (
                <div className="absolute top-4 right-4 bg-gray-600 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 z-10">
                  <Lock className="w-3 h-3" />
                  Zaklenjeno
                </div>
              )}
              <div className="w-full h-full flex items-center justify-center">
                <img 
                  src={activity.image}
                  alt={activity.title}
                  className={`w-full h-full object-cover object-center transition-transform duration-300 ${
                    isLocked ? 'grayscale' : 'group-hover:scale-110'
                  }`}
                />
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex flex-col flex-grow">
              <h3 className={`text-xl font-bold mb-3 min-h-[3.5rem] flex items-center ${
                isLocked ? 'text-gray-500' : 'text-foreground group-hover:text-app-blue'
              } transition-colors`}>
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