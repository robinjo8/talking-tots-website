// Consolidated configuration for all VideoNavodila pages
// This replaces 9 individual page files

export interface VideoNavodilaConfig {
  letter: string;
  displayLetter: string;
  title: string;
  videoUrl: string;
}

// Configuration map - URL key -> config
// Uses ASCII digraphs for diacritics: č->ch, š->sh, ž->zh
export const videoNavodilaConfigs: Record<string, VideoNavodilaConfig> = {
  'c': {
    letter: 'C',
    displayLetter: 'C',
    title: 'Video navodila - C',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20C%20(video).mp4'
  },
  'ch': {
    letter: 'Č',
    displayLetter: 'Č',
    title: 'Video navodila - Č',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20%C4%8C%20(video).mp4'
  },
  'k': {
    letter: 'K',
    displayLetter: 'K',
    title: 'Video navodila - K',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20K%20(video).mp4'
  },
  'l': {
    letter: 'L',
    displayLetter: 'L',
    title: 'Video navodila - L',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20L%20(video).mp4'
  },
  'r': {
    letter: 'R',
    displayLetter: 'R',
    title: 'Video navodila - R',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20R%20(video).mp4'
  },
  's': {
    letter: 'S',
    displayLetter: 'S',
    title: 'Video navodila - S',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20S%20(video).mp4'
  },
  'sh': {
    letter: 'Š',
    displayLetter: 'Š',
    title: 'Video navodila - Š',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20%C5%A0%20(video).mp4'
  },
  'z': {
    letter: 'Z',
    displayLetter: 'Z',
    title: 'Video navodila - Z',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20Z%20(video).mp4'
  },
  'zh': {
    letter: 'Ž',
    displayLetter: 'Ž',
    title: 'Video navodila - Ž',
    videoUrl: 'https://ecmtctwovkheohqwahvt.supabase.co/storage/v1/object/public/video-navodila/Glas%20%C5%BD%20(video).mp4'
  }
};

// Helper to convert URL param to config key
export function getVideoConfigKey(urlParam: string): string {
  // Handle legacy URLs with diacritics
  const normalized = urlParam.toLowerCase()
    .replace('č', 'ch')
    .replace('š', 'sh')
    .replace('ž', 'zh');
  return normalized;
}

// Get config by URL param
export function getVideoNavodilaConfig(urlParam: string): VideoNavodilaConfig | null {
  const key = getVideoConfigKey(urlParam);
  return videoNavodilaConfigs[key] || null;
}
