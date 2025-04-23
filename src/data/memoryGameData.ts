
export type MemoryCard = {
  id: number;
  word: string;
  type: 'image' | 'text';
  image?: string;
  audioUrl?: string | null;
  matched: boolean;
  flipped: boolean;
};
