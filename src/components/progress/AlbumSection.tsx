import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles } from "lucide-react";
import { useAlbumData } from "@/components/album/useAlbumData";

const ALBUM_COVER_URL = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zmajcki/Zmajcek_album_naslovna.webp";

export function AlbumSection() {
  const navigate = useNavigate();
  const { totalStickers, ownedCount, isLoading } = useAlbumData();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xs font-bold tracking-widest text-muted-foreground mb-4 uppercase">
        Album zmajčka Tomija
      </h2>

      <div
        className="relative rounded-2xl overflow-hidden border border-border shadow-md cursor-pointer group"
        onClick={() => navigate("/album")}
      >
        {/* Cover image */}
        <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
          <img
            src={ALBUM_COVER_URL}
            alt="Album zmajčka Tomija"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Content overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-yellow-400" />
                <p className="text-white/90 text-sm font-medium">
                  Zbiraj sličice s Tomijem po čarobnih svetovih!
                </p>
              </div>
              {!isLoading && (
                <p className="text-white/70 text-xs">
                  {ownedCount} / {totalStickers} sličic
                </p>
              )}
            </div>

            <Button
              size="sm"
              className="shrink-0 bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/30"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/album");
              }}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Odpri
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
