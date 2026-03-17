import { useParams, Navigate } from "react-router-dom";
import { GenericVideoNavodila } from "@/components/games/GenericVideoNavodila";

const VIDEO_BASE = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video/";

const letterConfig: Record<string, { display: string; file: string }> = {
  c:  { display: "C", file: "Glas_C.mp4" },
  ch: { display: "Č", file: "Glas_CH.mp4" },
  k:  { display: "K", file: "Glas_K.mp4" },
  l:  { display: "L", file: "Glas_L.mp4" },
  r:  { display: "R", file: "Glas_R.mp4" },
  s:  { display: "S", file: "Glas_S.mp4" },
  sh: { display: "Š", file: "Glas_SH.mp4" },
  z:  { display: "Z", file: "Glas_Z.mp4" },
  zh: { display: "Ž", file: "Glas_ZH.mp4" },
};

export default function ArtikulacijaVajeRouter() {
  const { gameId } = useParams<{ gameId: string }>();

  if (!gameId || !letterConfig[gameId]) {
    return <Navigate to="/govorno-jezikovne-vaje/artikulacija" replace />;
  }

  const config = letterConfig[gameId];

  return (
    <GenericVideoNavodila
      title={`Glas ${config.display}`}
      videoUrl={`${VIDEO_BASE}${config.file}`}
      displayLetter={config.display}
      backPath="/govorno-jezikovne-vaje/artikulacija"
    />
  );
}
