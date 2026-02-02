import { useParams, Navigate } from "react-router-dom";
import { getVideoNavodilaConfig } from "@/data/videoNavodilaConfig";
import { AdminGameWrapper } from "@/components/admin/games/AdminGameWrapper";
import { ArrowLeft, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";

export default function AdminVideoNavodilaRouter() {
  const { childId, letter } = useParams<{ childId: string; letter: string }>();
  const config = getVideoNavodilaConfig(letter || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  if (!config) {
    return <Navigate to={`/admin/children/${childId}/video-navodila`} replace />;
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <AdminGameWrapper 
      title={`Video navodila - ${config.displayLetter}`}
      backPath={`/admin/children/${childId}/video-navodila`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            <video
              ref={videoRef}
              src={config.videoUrl}
              className="w-full h-full object-contain"
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              controls
              playsInline
            />
          </div>

          {/* Video Info */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Črka {config.displayLetter}
                </h2>
                <p className="text-muted-foreground">
                  Video navodila za pravilno izgovorjavo črke {config.displayLetter}
                </p>
              </div>
              <Button
                onClick={handlePlayPause}
                size="lg"
                className="bg-dragon-green hover:bg-dragon-green/90 text-white"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pavza
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Predvajaj
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminGameWrapper>
  );
}
