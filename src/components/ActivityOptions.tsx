import { useNavigate } from "react-router-dom";
import zmajcekVaje from "@/assets/zmajcek_vaje_16x9.png";
import zmajcekIgre from "@/assets/zmajcek_igre_16x9.png";
import zmajcekArtikulacija from "@/assets/zmajcek_artikulacija_16x9.png";
import zmajcekIzzivi from "@/assets/zmajcek_izzivi_16x9.png";
import zmajcekVideo from "@/assets/zmajcek_video_16x9.png";
import zmajcekLogoped from "@/assets/zmajcek_logoped_16x9.png";

export function ActivityOptions() {
  const navigate = useNavigate();

  const activities = [
    {
      id: 'exercises',
      title: 'Govorne vaje',
      description: 'Prilagojene aktivnosti za izboljšanje izgovorjave.',
      image: zmajcekVaje,
      badge: '📝',
      url: '/govorno-jezikovne-vaje'
    },
    {
      id: 'games',
      title: 'Govorne igre',
      description: 'Zabavne igre za izboljšanje izgovorjave.',
      image: zmajcekIgre,
      badge: '🎮',
      url: '/govorne-igre'
    },
    {
      id: 'test',
      title: 'Test izgovorjave',
      description: 'Test izgovorjave za vse slovenske soglasnike.',
      image: zmajcekArtikulacija,
      badge: '🎯',
      url: '/artikulacijski-test'
    },
    {
      id: 'challenges',
      title: 'Moji izzivi',
      description: 'Priporočila pametnega asistenta.',
      image: zmajcekIzzivi,
      badge: '⭐',
      url: '/moji-izzivi'
    },
    {
      id: 'video',
      title: 'Video navodila',
      description: 'Poglej kako logoped pravilno izgovori posamezne črke.',
      image: zmajcekVideo,
      badge: '🎥',
      url: '/video-navodila'
    },
    {
      id: 'advice',
      title: 'Logopedski nasveti',
      description: 'Koristni nasveti in informacije o govornem razvoju.',
      image: zmajcekLogoped,
      badge: '💡',
      url: '/logopedski-koticek'
    }
  ];

  const handleActivityClick = (url: string) => {
    navigate(url);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden group"
          onClick={() => handleActivityClick(activity.url)}
        >
          {/* Card Image */}
          <div className="relative aspect-video overflow-hidden">
            <img 
              src={activity.image}
              alt={activity.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Card Content */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-app-blue transition-colors">
              {activity.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {activity.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}