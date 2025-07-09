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
        // Construct the Supabase storage URL with correct project ID
        const imageUrl = `https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/sestavljanke/${option.imageName}`;
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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {puzzleOptions.map((option) => (
            <Card 
              key={option.id}
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer hover:scale-105 overflow-hidden"
              onClick={() => handleOptionClick(option)}
            >
              <div className="aspect-square w-full bg-white flex items-center justify-center p-4">
                {images[option.id] ? (
                  <img 
                    src={images[option.id]} 
                    alt={option.title}
                    className="w-full h-full object-contain rounded-lg"
                    onError={(e) => {
                      // Fallback if image doesn't load
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-text');
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">Nalagam...</span>
                  </div>
                )}
                <div className={`fallback-text w-full h-full flex items-center justify-center text-6xl font-bold ${option.color} ${images[option.id] ? 'hidden' : ''}`}>
                  {option.title[0]}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}