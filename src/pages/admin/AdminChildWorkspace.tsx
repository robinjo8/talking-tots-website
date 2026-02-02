import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, Users } from 'lucide-react';
import { useLogopedistChild, useLogopedistChildren } from '@/hooks/useLogopedistChildren';
import { ChildSwitcher } from '@/components/admin/children/ChildSwitcher';
import { cn } from '@/lib/utils';

// Aktivnosti - enake kot v uporabniškem portalu
const activities = [
  {
    id: 'games',
    title: 'Govorne igre',
    description: 'Zabavne igre za izboljšanje izgovorjave.',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_igre_4.webp',
    gradient: 'from-dragon-green/20 to-dragon-green/20',
    badge: '🎮',
    url: '/govorne-igre'
  },
  {
    id: 'exercises',
    title: 'Govorne vaje',
    description: 'Prilagojene aktivnosti za izboljšanje izgovorjave.',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_vaje_6.webp',
    gradient: 'from-app-blue/20 to-app-teal/20',
    badge: '📝',
    url: '/govorno-jezikovne-vaje'
  },
  {
    id: 'test',
    title: 'Preverjanje izgovorjave',
    description: 'Preverjanje izgovorjave za vse slovenske soglasnike.',
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
  },
  {
    id: 'challenges',
    title: 'Moj osebni načrt',
    description: 'Priporočila pametnega asistenta.',
    image: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_izzivi_6.webp',
    gradient: 'from-app-orange/20 to-app-yellow/20',
    badge: '⭐',
    url: '/moji-izzivi'
  },
];

export default function AdminChildWorkspace() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const { data: child, isLoading } = useLogopedistChild(childId);
  const { children: allChildren } = useLogopedistChildren();
  
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleActivityClick = (activity: typeof activities[0]) => {
    // TODO: V prihodnosti implementirati vgrajen način dela z aktivnostjo
    // Za zdaj preusmeri na uporabniško stran z query parametrom za logopeda
    const targetUrl = `${activity.url}?logopedistChildId=${childId}`;
    window.open(targetUrl, '_blank');
  };

  const handleSwitchChild = (newChildId: string) => {
    navigate(`/admin/children/${newChildId}/workspace`);
    setShowSwitcher(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
      </div>
    );
  }

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Otrok ni bil najden.</p>
        <Button variant="link" onClick={() => navigate('/admin/children')}>
          Nazaj na seznam
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header z navigacijo nazaj */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin/children')}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Nazaj na seznam
        </Button>
      </div>

      {/* Aktivni otrok */}
      <Card className="border-dragon-green/30 bg-dragon-green/5">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-12 w-12 rounded-full flex items-center justify-center",
                child.gender === 'male' ? 'bg-app-blue/10' : 'bg-app-pink/10'
              )}>
                <span className="text-2xl">
                  {child.gender === 'male' ? '🧒' : '👧'}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">Aktivni otrok: {child.name}</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Starost: {child.age} {child.age === 1 ? 'leto' : child.age < 5 ? 'leta' : 'let'}
                  {child.speech_difficulties && child.speech_difficulties.length > 0 && (
                    <> • Težave: {child.speech_difficulties.join(', ')}</>
                  )}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowSwitcher(true)}
              className="self-start sm:self-auto"
            >
              <Users className="h-4 w-4 mr-2" />
              Zamenjaj otroka
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Aktivnosti */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Izberi aktivnost</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <Card 
              key={activity.id}
              className="overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
              onClick={() => handleActivityClick(activity)}
            >
              {/* Slika */}
              <div className={`relative aspect-video overflow-hidden bg-gradient-to-br ${activity.gradient}`}>
                <img 
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              {/* Vsebina */}
              <CardContent className="p-4">
                <h4 className="font-semibold mb-1">{activity.title}</h4>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {activity.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info o shranjevanju */}
      <Card className="border-muted">
        <CardContent className="py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <Star className="h-4 w-4 text-app-orange" />
          <span>Rezultati aktivnosti se bodo samodejno shranili v napredek otroka {child.name}</span>
        </CardContent>
      </Card>

      {/* Switcher modal */}
      <ChildSwitcher
        open={showSwitcher}
        onOpenChange={setShowSwitcher}
        children={allChildren}
        currentChildId={child.id}
        onSelect={handleSwitchChild}
      />
    </div>
  );
}
