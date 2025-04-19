
export interface PracticeWord {
  id: number;
  word: string;
  translation?: string;
  audioUrl?: string;
}

export const letterPracticeWords: Record<string, PracticeWord[]> = {
  "R": [
    { id: 1, word: "Riba", translation: "fish" },
    { id: 2, word: "Roka", translation: "hand" },
    { id: 3, word: "Roža", translation: "flower" },
    { id: 4, word: "Robot", translation: "robot" },
    { id: 5, word: "Račka", translation: "duck" },
  ],
  "L": [
    { id: 1, word: "Luna", translation: "moon" },
    { id: 2, word: "Lev", translation: "lion" },
    { id: 3, word: "Ladja", translation: "ship" },
    { id: 4, word: "Lopata", translation: "shovel" },
    { id: 5, word: "List", translation: "leaf" },
  ],
  "S": [
    { id: 1, word: "Sonce", translation: "sun" },
    { id: 2, word: "Soba", translation: "room" },
    { id: 3, word: "Sladoled", translation: "ice cream" },
    { id: 4, word: "Svinčnik", translation: "pencil" },
    { id: 5, word: "Sova", translation: "owl" },
  ],
  "Š": [
    { id: 1, word: "Šola", translation: "school" },
    { id: 2, word: "Šal", translation: "scarf" },
    { id: 3, word: "Špageti", translation: "spaghetti" },
    { id: 4, word: "Škarje", translation: "scissors" },
    { id: 5, word: "Številka", translation: "number" },
  ],
  "Č": [
    { id: 1, word: "Čebela", translation: "bee" },
    { id: 2, word: "Čokolada", translation: "chocolate" },
    { id: 3, word: "Čevelj", translation: "shoe" },
    { id: 4, word: "Čarovnik", translation: "wizard" },
    { id: 5, word: "Čoln", translation: "boat" },
  ],
  "Ž": [
    { id: 1, word: "Žaba", translation: "frog" },
    { id: 2, word: "Žoga", translation: "ball" },
    { id: 3, word: "Žirafa", translation: "giraffe" },
    { id: 4, word: "Žep", translation: "pocket" },
    { id: 5, word: "Življenje", translation: "life" },
  ],
  "C": [
    { id: 1, word: "Cesta", translation: "road" },
    { id: 2, word: "Copat", translation: "slipper" },
    { id: 3, word: "Cvet", translation: "flower" },
    { id: 4, word: "Cilj", translation: "goal" },
    { id: 5, word: "Center", translation: "center" },
  ],
  "Z": [
    { id: 1, word: "Zajec", translation: "rabbit" },
    { id: 2, word: "Zebra", translation: "zebra" },
    { id: 3, word: "Zvezda", translation: "star" },
    { id: 4, word: "Zob", translation: "tooth" },
    { id: 5, word: "Zima", translation: "winter" },
  ]
};
