
import React from 'react';
import Header from '@/components/Header';
import { AdaptivePuzzleGame } from '@/components/puzzle/AdaptivePuzzleGame';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdaptivePuzzlePage() {
  const { profile, selectedChildIndex } = useAuth();
  const selectedChild = selectedChildIndex !== null && profile?.children 
    ? profile.children[selectedChildIndex] 
    : null;
  const childName = selectedChild?.name;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container max-w-7xl mx-auto pt-20 md:pt-24 pb-20 px-4">
        {/* Instruction speech-bubble */}
        <Card className="mb-8 bg-gradient-to-r from-sky-50 to-green-50 border-dragon-green/30 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-dragon-green">
              <MessageSquare className="h-5 w-5 text-dragon-green" />
              HEJ, {childName?.toUpperCase() || "TIAN"}!
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 flex items-center gap-4">
            <div className="hidden sm:block w-20 h-20">
              <img 
                src="/lovable-uploads/4377ec70-1996-47a9-bf05-8093cffcaf0b.png" 
                alt="Zmajček Tomi" 
                className="w-full h-full object-contain animate-bounce-gentle"
              />
            </div>
            <div className="flex-1">
              <p className="text-lg font-medium italic">
                POVLECI KOSE SESTAVLJANKE IN SESTAVI ČUDOVITO SLIKO! 
                SESTAVLJANKA SE PRILAGAJA TVOJI STAROSTI ZA PRAVO IZZIVNOST.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                POSTOPOMA BOŠTRAJAL/A VEDNO BOLJ ZAPLETENE SESTAVLJANKE!
              </p>
            </div>
          </CardContent>
        </Card>

        <AdaptivePuzzleGame />
      </div>
    </div>
  );
}
