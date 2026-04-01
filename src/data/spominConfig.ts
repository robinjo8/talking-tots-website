// Spomin (Memory) Game Configuration
// Maps URL keys to Supabase table names and display letters

export interface SpominConfig {
  urlKey: string;         // ASCII-safe URL key (e.g., 'c', 'ch', 'k')
  displayLetter: string;  // Display letter (e.g., 'C', 'Č', 'K')
  displayName?: string;   // Optional full display name (e.g., 'R - začetne vaje')
  tableName?: string;     // Supabase table name (optional if localData provided)
  queryKey: string;       // React Query cache key
  localData?: { word: string; image_url: string; audio_url: string }[]; // Local data fallback
}

export const spominConfig: Record<string, SpominConfig> = {
  'c': {
    urlKey: 'c',
    displayLetter: 'C',
    tableName: 'memory_cards_c',
    queryKey: 'memoryCardsC',
  },
  'ch': {
    urlKey: 'ch',
    displayLetter: 'Č',
    tableName: 'memory_cards_Č',
    queryKey: 'memoryCardsCH',
  },
  'k': {
    urlKey: 'k',
    displayLetter: 'K',
    tableName: 'memory_cards_K',
    queryKey: 'memoryCardsK',
  },
  'l': {
    urlKey: 'l',
    displayLetter: 'L',
    tableName: 'memory_cards_l',
    queryKey: 'memoryCardsL',
  },
  'r': {
    urlKey: 'r',
    displayLetter: 'R',
    tableName: 'memory_cards_r',
    queryKey: 'memoryCardsR',
  },
  's': {
    urlKey: 's',
    displayLetter: 'S',
    tableName: 'memory_cards_S',
    queryKey: 'memoryCardsS',
  },
  'sh': {
    urlKey: 'sh',
    displayLetter: 'Š',
    tableName: 'memory_cards_Š_duplicate',
    queryKey: 'memoryCardsSH',
  },
  'z': {
    urlKey: 'z',
    displayLetter: 'Z',
    tableName: 'memory_cards_z',
    queryKey: 'memoryCardsZ',
  },
  'zh': {
    urlKey: 'zh',
    displayLetter: 'Ž',
    tableName: 'memory_cards_Ž',
    queryKey: 'memoryCardsZH',
  },
  'f': {
    urlKey: 'f',
    displayLetter: 'F',
    queryKey: 'memoryCardsF',
    localData: [
      { word: 'FARAON', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/faraon.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Faraon.mp3' },
      { word: 'FAZAN', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fazan.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fazan.mp3' },
      { word: 'FEFERON', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/feferon.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Feferon.mp3' },
      { word: 'FIGA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/figa.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Figa.mp3' },
      { word: 'FLAVTA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/flavta.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Flavta.mp3' },
      { word: 'FORMULA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/formula.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Formula.mp3' },
      { word: 'FOTELJ', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fotelj.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fotelj.mp3' },
      { word: 'FRAČA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fraca.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fraca.mp3' },
      { word: 'FRIZER', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/frizer.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Frizer.mp3' },
      { word: 'FRNIKOLA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/frnikola.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Frnikola.mp3' },
      { word: 'FANT', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fant1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fant.mp3' },
      { word: 'FEN', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fen1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fen.mp3' },
      { word: 'FIŽOL', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/fizol1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Fizol.mp3' },
    ],
  },
  'g': {
    urlKey: 'g',
    displayLetter: 'G',
    queryKey: 'memoryCardsG',
    localData: [
      { word: 'GASILEC', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gasilec.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gasilec.mp3' },
      { word: 'GLAVNIK', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/glavnik.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Glavnik.mp3' },
      { word: 'GOLOB', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/golob.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Golob.mp3' },
      { word: 'GOS', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gos.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gos.mp3' },
      { word: 'GOZDAR', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gozdar.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gozdar.mp3' },
      { word: 'GRAD', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/grad.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Grad.mp3' },
      { word: 'GRAH', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/grah.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Grah.mp3' },
      { word: 'GUGALNICA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gugalnica.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gugalnica.mp3' },
      { word: 'GUSAR', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gusar.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gusar.mp3' },
      { word: 'GOBA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/goba1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Goba.mp3' },
      { word: 'GOL', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gol1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gol.mp3' },
      { word: 'GUMA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/guma1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Guma.mp3' },
      { word: 'GARAŽA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/garaza1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Garaza.mp3' },
      { word: 'GNEZDO', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/gnezdo1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Gnezdo.mp3' },
      { word: 'GROZDJE', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/grozdje1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Grozdje.mp3' },
      { word: 'GLAVA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/glava1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Glava.mp3' },
    ],
  },
  'h': {
    urlKey: 'h',
    displayLetter: 'H',
    queryKey: 'memoryCardsH',
    localData: [
      { word: 'HARFA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/harfa.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Harfa.mp3' },
      { word: 'HARMONIKA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/harmonika.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Harmonika.mp3' },
      { word: 'HELIKOPTER', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/helikopter.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Helikopter.mp3' },
      { word: 'HIJENA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hijena.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hijena.mp3' },
      { word: 'HLEV', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hlev.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hlev.mp3' },
      { word: 'HOBOTNICA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hobotnica.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hobotnica.mp3' },
      { word: 'HOKEJ', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hokej.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hokej.mp3' },
      { word: 'HOTEL', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hotel.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hotel.mp3' },
      { word: 'HRČEK', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hrcek.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hrcek.mp3' },
      { word: 'HRIB', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hrib.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hrib.mp3' },
      { word: 'HUPA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hupa.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hupa.mp3' },
      { word: 'HIŠA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hisa1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hisa.mp3' },
      { word: 'HLAČE', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hlace1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hlace.mp3' },
      { word: 'HRUŠKA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/hruska1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Hruska.mp3' },
    ],
  },
  'v': {
    urlKey: 'v',
    displayLetter: 'V',
    queryKey: 'memoryCardsV',
    localData: [
      { word: 'VAFELJ', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vafelj.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vafelj.mp3' },
      { word: 'VEDRO', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vedro.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vedro.mp3' },
      { word: 'VESLO', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/veslo.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Veslo.mp3' },
      { word: 'VEVERICA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/veverica.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Veverica.mp3' },
      { word: 'VILE', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vile.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vile.mp3' },
      { word: 'VITEZ', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vitez.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vitez.mp3' },
      { word: 'VOLK', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/volk.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Volk.mp3' },
      { word: 'VOLNA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/volna.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Volna.mp3' },
      { word: 'VOZIČEK', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vozicek.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vozicek.mp3' },
      { word: 'VRATA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vrata.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vrata.mp3' },
      { word: 'VULKAN', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vulkan.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vulkan.mp3' },
      { word: 'VAZA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vaza1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vaza.mp3' },
      { word: 'VEJA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/veja1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Veja.mp3' },
      { word: 'VETRNICA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/veternica1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vetrnica.mp3' },
      { word: 'VILICE', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vilica1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vilice.mp3' },
      { word: 'VODA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/voda1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Voda.mp3' },
      { word: 'VOLAN', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/volan1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Volan.mp3' },
      { word: 'VOZ', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/voz1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Voz.mp3' },
      { word: 'VERIŽICA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/verizica1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Verizica.mp3' },
      { word: 'VEZALKE', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vezalke1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vezalke.mp3' },
      { word: 'VIŠNJA', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/visnja1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Visnja.mp3' },
      { word: 'VRABEC', image_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/slike/vrabec1.webp', audio_url: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/zvocni-posnetki/Vrabec.mp3' },
    ],
  },
  'r-zacetek': {
    urlKey: 'r-zacetek',
    displayLetter: 'R',
    displayName: 'R - začetne vaje',
    tableName: 'memory_cards_r_zacetek',
    queryKey: 'memoryCardsRZacetek',
  },
};

// Helper to get config from URL gameId (e.g., 'spomin-c' -> config for 'c')
export const getSpominConfigFromGameId = (gameId: string): SpominConfig | null => {
  // Extract letter key from gameId (e.g., 'spomin-c' -> 'c', 'spomin-ch' -> 'ch')
  const letterKey = gameId.replace('spomin-', '').toLowerCase();
  return spominConfig[letterKey] || null;
};

// Get all available letter keys
export const getSpominLetterKeys = (): string[] => Object.keys(spominConfig);
