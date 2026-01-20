
export const playAudio = (audioUrl: string, audioRef: React.RefObject<HTMLAudioElement>) => {
  if (audioRef.current) {
    audioRef.current.src = audioUrl;
    audioRef.current.play().catch(error => {
      console.error("Error playing audio:", error);
    });
  }
};

export const handlePlayRozaAudio = (audioRef: React.RefObject<HTMLAudioElement>) => {
  const audioUrl = "https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/roza.m4a";
  playAudio(audioUrl, audioRef);
};
