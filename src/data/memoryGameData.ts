
export type MemoryCard = {
  id: number;
  word: string;
  type: 'image' | 'text';
  image?: string;
  matched: boolean;
  flipped: boolean;
};

export const memoryPairs = [
  { word: 'raketa', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb' },
  { word: 'riba', image: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4' },
  { word: 'roža', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e' },
  { word: 'roka', image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f' },
  { word: 'robot', image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e' },
  { word: 'rak', image: 'https://images.unsplash.com/photo-1518877593221-1f28583780b4' },
  { word: 'radič', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' },
  { word: 'račka', image: 'https://images.unsplash.com/photo-1441057206919-63d19fac2369' },
  { word: 'radio', image: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302' },
  { word: 'ravnilo', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb' },
  { word: 'rokavica', image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f' },
  { word: 'ring', image: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302' },
  { word: 'ruleta', image: 'https://images.unsplash.com/photo-1487252665478-49b61b47f302' },
  { word: 'rogač', image: 'https://images.unsplash.com/photo-1485833077593-4278bba3f11f' },
  { word: 'riž', image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' },
];

