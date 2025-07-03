import Header from "@/components/Header";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";

const VideoNavodilaCrkaR = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoUrl = "https://dc6f3012-b411-4c62-93c0-292d63747df0.supabase.co/storage/v1/object/public/video-navodila/crka-RR.avi";

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PageHeader title="Video navodila - Črka R" backPath="/video-navodila" />
      
      <div className="container max-w-4xl mx-auto pt-8 pb-20 px-4">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-app-purple">
              Izgovorjava črke R
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black rounded-lg mb-6 overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-contain"
                onEnded={handleVideoEnd}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                controls={false}
              >
                <source src={videoUrl} type="video/mp4" />
                Vaš brskalnik ne podpira video predvajanja.
              </video>
            </div>
            
            <div className="flex justify-center gap-4 flex-wrap">
              <Button
                onClick={handlePlay}
                disabled={isPlaying}
                className="bg-app-purple hover:bg-app-purple/90"
              >
                <Play className="h-4 w-4 mr-2" />
                Predvajaj
              </Button>
              
              <Button
                onClick={handlePause}
                disabled={!isPlaying}
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-2" />
                Premor
              </Button>
              
              <Button
                onClick={handleStop}
                variant="outline"
              >
                <Square className="h-4 w-4 mr-2" />
                Ustavi
              </Button>
              
              <Button
                onClick={handleRestart}
                variant="outline"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Ponovi
              </Button>
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default VideoNavodilaCrkaR;