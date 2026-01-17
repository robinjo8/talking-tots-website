/**
 * Image data for all Sestavljanke games
 * Centralized configuration to avoid duplication across 36 page files
 */

export interface GameImage {
  filename: string;
  word: string;
  audio?: string;
}

export const SESTAVLJANKE_IMAGES: Record<string, GameImage[]> = {
  c: [
    { filename: 'cedilo.png', word: 'CEDILO' },
    { filename: 'cekin.png', word: 'CEKIN' },
    { filename: 'cerkev.png', word: 'CERKEV' },
    { filename: 'cesta.png', word: 'CESTA' },
    { filename: 'cev.png', word: 'CEV' },
    { filename: 'cirkus.png', word: 'CIRKUS' },
    { filename: 'cisterna.png', word: 'CISTERNA' },
    { filename: 'cokla.png', word: 'COKLA' },
    { filename: 'copat.png', word: 'COPAT' },
    { filename: 'cvet.png', word: 'CVET' }
  ],
  č: [
    { filename: 'caj.png', word: 'ČAJ', audio: 'caj.m4a' },
    { filename: 'casopis.png', word: 'ČASOPIS', audio: 'casopis.m4a' },
    { filename: 'cebela.png', word: 'ČEBELA', audio: 'cebela.m4a' },
    { filename: 'cebula.png', word: 'ČEBULA', audio: 'cebula.m4a' },
    { filename: 'cesen.png', word: 'ČESEN', audio: 'cesen.m4a' },
    { filename: 'cevlji.png', word: 'ČEVLJI', audio: 'cevlji.m4a' },
    { filename: 'cokolada.png', word: 'ČOKOLADA', audio: 'cokolada.m4a' },
    { filename: 'coln.png', word: 'ČOLN', audio: 'coln.m4a' },
    { filename: 'copic.png', word: 'ČOPIČ', audio: 'copic.m4a' },
    { filename: 'crke.png', word: 'ČRKE', audio: 'crke.m4a' }
  ],
  k: [
    { filename: 'kaca.png', word: 'KAČA' },
    { filename: 'kaktus.png', word: 'KAKTUS' },
    { filename: 'kamen.png', word: 'KAMEN' },
    { filename: 'kamela.png', word: 'KAMELA' },
    { filename: 'kapa.png', word: 'KAPA' },
    { filename: 'kava.png', word: 'KAVA' },
    { filename: 'klobuk.png', word: 'KLOBUK' },
    { filename: 'knjiga.png', word: 'KNJIGA' },
    { filename: 'kokoska.png', word: 'KOKOŠKA' },
    { filename: 'konji.png', word: 'KONJI' }
  ],
  l: [
    { filename: 'labod.png', word: 'LABOD' },
    { filename: 'ladja.png', word: 'LADJA' },
    { filename: 'lama.png', word: 'LAMA' },
    { filename: 'lampa.png', word: 'LAMPA' },
    { filename: 'lasje.png', word: 'LASJE' },
    { filename: 'lev.png', word: 'LEV' },
    { filename: 'lipa.png', word: 'LIPA' },
    { filename: 'lista.png', word: 'LISTA' },
    { filename: 'lok.png', word: 'LOK' },
    { filename: 'luna.png', word: 'LUNA' }
  ],
  r: [
    { filename: 'raca.png', word: 'RACA' },
    { filename: 'rak.png', word: 'RAK' },
    { filename: 'raketa.png', word: 'RAKETA' },
    { filename: 'rama.png', word: 'RAMA' },
    { filename: 'reka.png', word: 'REKA' },
    { filename: 'riba.png', word: 'RIBA' },
    { filename: 'robot.png', word: 'ROBOT' },
    { filename: 'roka.png', word: 'ROKA' },
    { filename: 'roza.png', word: 'ROŽA' },
    { filename: 'runo.png', word: 'RUNO' }
  ],
  s: [
    { filename: 'saksofon.png', word: 'SAKSOFON' },
    { filename: 'salama.png', word: 'SALAMA' },
    { filename: 'sandali.png', word: 'SANDALI' },
    { filename: 'seno.png', word: 'SENO' },
    { filename: 'sir.png', word: 'SIR' },
    { filename: 'sladoled.png', word: 'SLADOLED' },
    { filename: 'slap.png', word: 'SLAP' },
    { filename: 'soba.png', word: 'SOBA' },
    { filename: 'sonce.png', word: 'SONCE' },
    { filename: 'stol.png', word: 'STOL' }
  ],
  š: [
    { filename: 'sala.png', word: 'ŠALA', audio: 'sala.m4a' },
    { filename: 'sapka.png', word: 'ŠAPKA', audio: 'sapka.m4a' },
    { filename: 'sarpica.png', word: 'ŠARPICA', audio: 'sarpica.m4a' },
    { filename: 'sestar.png', word: 'ŠESTAR', audio: 'sestar.m4a' },
    { filename: 'sivanka.png', word: 'ŠIVANKA', audio: 'sivanka.m4a' },
    { filename: 'skarje.png', word: 'ŠKARJE', audio: 'skarje.m4a' },
    { filename: 'skatla.png', word: 'ŠKATLA', audio: 'skatla.m4a' },
    { filename: 'skoljka.png', word: 'ŠKOLJKA', audio: 'skoljka.m4a' },
    { filename: 'spargl.png', word: 'ŠPARGEL', audio: 'spargl.m4a' },
    { filename: 'sola.png', word: 'ŠOLA', audio: 'sola.m4a' }
  ],
  z: [
    { filename: 'zabica.png', word: 'ŽABICA' },
    { filename: 'zajec.png', word: 'ZAJEC' },
    { filename: 'zebra.png', word: 'ZEBRA' },
    { filename: 'zelje.png', word: 'ZELJE' },
    { filename: 'zemlja.png', word: 'ZEMLJA' },
    { filename: 'zidar.png', word: 'ZIDAR' },
    { filename: 'zlato.png', word: 'ZLATO' },
    { filename: 'zmaj.png', word: 'ZMAJ' },
    { filename: 'zobje.png', word: 'ZOBJE' },
    { filename: 'zvezda.png', word: 'ZVEZDA' }
  ],
  ž: [
    { filename: 'zaba.png', word: 'ŽABA' },
    { filename: 'zaga.png', word: 'ŽAGA' },
    { filename: 'zaluzije.png', word: 'ŽALUZIJE' },
    { filename: 'zebra.png', word: 'ŽEBRA' },
    { filename: 'zelod.png', word: 'ŽELOD' },
    { filename: 'zelva.png', word: 'ŽELVA' },
    { filename: 'zep.png', word: 'ŽEP' },
    { filename: 'zerjev.png', word: 'ŽERJAV' },
    { filename: 'zirafa.png', word: 'ŽIRAFA' },
    { filename: 'zlica.png', word: 'ŽLICA' }
  ]
};

// Grid configurations per age group
export interface GridConfig {
  gridCols: number;
  gridRows: number;
  progressId: string;
}

export const AGE_GRID_CONFIG: Record<string, GridConfig> = {
  '': { gridCols: 3, gridRows: 3, progressId: '6' },      // 3-4 age group (default)
  '56': { gridCols: 4, gridRows: 5, progressId: '12' },   // 5-6 age group
  '78': { gridCols: 5, gridRows: 5, progressId: '15' },   // 7-8 age group
  '910': { gridCols: 6, gridRows: 5, progressId: '20' },  // 9-10 age group
};

import type { AgeGroup } from '@/utils/ageUtils';

export const AGE_GROUP_MAP: Record<string, AgeGroup> = {
  '': '3-4',
  '56': '5-6',
  '78': '7-8',
  '910': '9-10',
};

export function getRandomImage(letter: string): GameImage {
  const images = SESTAVLJANKE_IMAGES[letter] || SESTAVLJANKE_IMAGES['c'];
  return images[Math.floor(Math.random() * images.length)];
}
