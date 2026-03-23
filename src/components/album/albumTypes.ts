export type StickerWorld = 'tomijev_gozd' | 'carobni_grad' | 'vesolje' | 'dzungla' | 'pod_morjem' | 'dino_svet' | 'super_junaki';
export type StickerRarity = 'common' | 'special' | 'rare' | 'legendary';

export interface AlbumSticker {
  id: string;
  world: StickerWorld;
  name: string;
  description: string | null;
  image_url: string | null;
  rarity: StickerRarity;
  sort_order: number;
  is_golden: boolean;
}

export interface ChildSticker {
  id: string;
  child_id: string;
  sticker_id: string;
  earned_at: string;
  earned_reason: string;
  is_golden_version: boolean;
}

export interface ChildAlbumStats {
  child_id: string;
  total_stickers: number;
  total_golden: number;
  last_sticker_at: string | null;
}

export interface OwnedSticker extends AlbumSticker {
  owned: true;
  earned_at: string;
  earned_reason: string;
  is_golden_version: boolean;
}

export interface EmptySticker extends AlbumSticker {
  owned: false;
}

export type DisplaySticker = OwnedSticker | EmptySticker;

export const WORLD_CONFIG: Record<StickerWorld, { label: string; icon: string; color: string; bgGradient: string }> = {
  tomijev_gozd: { label: 'Tomijev gozd', icon: '🌲', color: 'hsl(122, 39%, 49%)', bgGradient: 'from-green-800 to-green-500' },
  carobni_grad: { label: 'Čarobni grad', icon: '🏰', color: 'hsl(291, 64%, 42%)', bgGradient: 'from-purple-800 to-purple-500' },
  vesolje: { label: 'Vesolje', icon: '🚀', color: 'hsl(207, 90%, 54%)', bgGradient: 'from-blue-900 to-blue-600' },
  dzungla: { label: 'Džungla', icon: '🌴', color: 'hsl(122, 39%, 35%)', bgGradient: 'from-emerald-800 to-emerald-500' },
  pod_morjem: { label: 'Pod morjem', icon: '🐠', color: 'hsl(174, 100%, 29%)', bgGradient: 'from-cyan-800 to-cyan-500' },
  dino_svet: { label: 'Dino svet', icon: '🦕', color: 'hsl(36, 100%, 50%)', bgGradient: 'from-orange-800 to-orange-500' },
  super_junaki: { label: 'Super junaki', icon: '🦸', color: 'hsl(4, 90%, 58%)', bgGradient: 'from-red-800 to-red-500' },
};

export const RARITY_CONFIG: Record<StickerRarity, { label: string; borderColor: string; bgColor: string; glow: string }> = {
  common: { label: 'Navadna', borderColor: 'border-gray-300', bgColor: 'bg-gray-100', glow: '' },
  special: { label: 'Posebna', borderColor: 'border-blue-400', bgColor: 'bg-blue-50', glow: 'shadow-blue-200/50' },
  rare: { label: 'Redka', borderColor: 'border-purple-500', bgColor: 'bg-purple-50', glow: 'shadow-purple-300/50' },
  legendary: { label: 'Legendarna', borderColor: 'border-yellow-500', bgColor: 'bg-yellow-50', glow: 'shadow-yellow-300/60' },
};

export const WORLDS_ORDER: StickerWorld[] = [
  'tomijev_gozd', 'carobni_grad', 'vesolje', 'dzungla', 'pod_morjem', 'dino_svet', 'super_junaki'
];
