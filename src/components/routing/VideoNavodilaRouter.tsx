// Dynamic router for VideoNavodila pages
// Replaces 9 individual page files with a single router
import { useParams, Navigate } from "react-router-dom";
import { getVideoNavodilaConfig } from "@/data/videoNavodilaConfig";
import { GenericVideoNavodila } from "@/components/games/GenericVideoNavodila";

export default function VideoNavodilaRouter() {
  const { letter } = useParams<{ letter: string }>();
  
  if (!letter) {
    return <Navigate to="/video-navodila" replace />;
  }

  const config = getVideoNavodilaConfig(letter);
  
  if (!config) {
    console.warn(`No config found for video navodila letter: ${letter}`);
    return <Navigate to="/video-navodila" replace />;
  }

  return (
    <GenericVideoNavodila
      title={config.title}
      videoUrl={config.videoUrl}
    />
  );
}
