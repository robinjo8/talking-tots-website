
import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, BookText, FileVideo2 } from "lucide-react";

const VideoNavodila = () => {
  const navigate = useNavigate();
  const [videoCategories, setVideoCategories] = useState([
    {
      id: "soglasniki",
      title: "Soglasniki",
      description: "Video navodila za izgovorjavo soglasnikov",
      icon: Volume2,
      path: "/video-navodila/soglasniki",
    },
    {
      id: "samoglasniki",
      title: "Samoglasniki",
      description: "Video navodila za izgovorjavo samoglasnikov",
      icon: BookText,
      path: "/video-navodila/samoglasniki",
    },
    {
      id: "drugo",
      title: "Drugo",
      description: "Video navodila za ostale govorne vaje",
      icon: FileVideo2,
      path: "/video-navodila/drugo",
    },
  ]);

  useEffect(() => {
    // Fetch video categories from API or database here
    // For now, using hardcoded data
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Video navodila" backPath="/moja-stran" />
      
      <div className="container max-w-5xl mx-auto pt-8 pb-20 px-4">
        <p className="text-muted-foreground mb-8">
          Oglejte si video navodila za pravilno izgovorjavo glasov.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoCategories.map((category) => (
            <Card
              key={category.id}
              className="transition-all duration-300 hover:shadow-lg rounded-2xl border-2 border-gray-200 cursor-pointer h-full flex flex-col"
              onClick={() => navigate(category.path)}
            >
              <CardHeader className="bg-gradient-to-r from-app-orange/10 to-app-yellow/10 rounded-t-2xl pb-4">
                <CardTitle className="text-xl flex items-center justify-center gap-2 text-center">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200">
                    <category.icon className="h-6 w-6 text-app-orange" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 pb-4 flex-grow text-center">
                <h3 className="text-lg font-semibold mb-2 text-app-orange">
                  {category.title}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoNavodila;
