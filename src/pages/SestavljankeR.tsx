import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

const puzzleOptions = [
  {
    id: "riba",
    title: "Riba",
    description: "Sestavi sliko ribe",
    imageName: "riba.png",
    color: "text-app-blue",
    gradient: "from-app-blue/10 to-app-purple/10"
  },
  {
    id: "roka",
    title: "Roka",
    description: "Sestavi sliko roke",
    imageName: "roka.png",
    color: "text-app-orange",
    gradient: "from-app-orange/10 to-app-yellow/10"
  },
  {
    id: "roza",
    title: "Roža",
    description: "Sestavi sliko rože",
    imageName: "roza.png",
    color: "text-dragon-green",
    gradient: "from-dragon-green/10 to-app-teal/10"
  }
];

export default function SestavljankeR() {
  const navigate = useNavigate();
  const [images, setImages] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Load images from Supabase storage
    const loadImages = async () => {
      const imageUrls: {[key: string]: string} = {};
      
      for (const option of puzzleOptions) {
        // Construct the Supabase storage URL
        const imageUrl = `https://dc6f3012-b411-4c62-93c0-292d63747df0.supabase.co/storage/v1/object/public/sestavljanke/${option.imageName}`;
        imageUrls[option.id] = imageUrl;
      }
      
      setImages(imageUrls);
    };

    loadImages();
  }, []);

  const handleOptionClick = (option: typeof puzzleOptions[0]) => {
    // For now, just log the selection - game logic will be added later
    console.log(`Selected puzzle: ${option.title}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Sestavljanke - črka R" backPath="/govorne-igre/sestavljanke" />
      
      <div className="container max-w-4xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8 text-center">
          Izberi eno izmed slik za sestavljanje in začni z igro.
        </p>

        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
          {puzzleOptions.map((option) => (
            <div
              key={option.id}
              className="group transition-all duration-300 hover:scale-105 cursor-pointer"
              onClick={() => handleOptionClick(option)}
            >
              <div className="w-48 h-48 bg-white rounded-3xl border-4 border-gray-800 flex items-center justify-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                {images[option.id] ? (
                  <img 
                    src={images[option.id]} 
                    alt={option.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Nalagam...</span>
                  </div>
                )}
                <div className={`fallback-text w-full h-full flex items-center justify-center text-6xl font-bold ${option.color} ${images[option.id] ? 'hidden' : ''}`}>
                  {option.title[0]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}