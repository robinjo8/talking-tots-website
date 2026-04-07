export interface ThreeColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .mp3 file in zvocni-posnetki bucket
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .webp file in slike bucket
}

export interface FourColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .mp3 file in zvocni-posnetki bucket
  writtenWord: string; // Written word in uppercase
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .webp file in slike bucket
}

// Only words starting with letter C - as per user specifications
export const threeColumnMatchingDataC: ThreeColumnMatchingItem[] = [
  { id: 'cedilo', word: 'CEDILO', audioFile: 'Cedilo.mp3', shadowImage: 'cedilo1_senca.png', originalImage: 'cedilo1.webp' },
  { id: 'cekin', word: 'CEKIN', audioFile: 'Cekin.mp3', shadowImage: 'cekin1_senca.png', originalImage: 'cekin1.webp' },
  { id: 'cerkev', word: 'CERKEV', audioFile: 'Cerkev.mp3', shadowImage: 'cerkev1_senca.png', originalImage: 'cerkev1.webp' },
  { id: 'cesta', word: 'CESTA', audioFile: 'Cesta.mp3', shadowImage: 'cesta1_senca.png', originalImage: 'cesta1.webp' },
  { id: 'cev', word: 'CEV', audioFile: 'Cev.mp3', shadowImage: 'cev1_senca.png', originalImage: 'cev1.webp' },
  { id: 'cirkus', word: 'CIRKUS', audioFile: 'Cirkus.mp3', shadowImage: 'cirkus1_senca.png', originalImage: 'cirkus1.webp' },
  { id: 'cisterna', word: 'CISTERNA', audioFile: 'Cisterna.mp3', shadowImage: 'cisterna1_senca.png', originalImage: 'cisterna1.webp' },
  { id: 'cokla', word: 'COKLA', audioFile: 'Cokla.mp3', shadowImage: 'cokla1_senca.png', originalImage: 'cokla1.webp' },
  { id: 'copat', word: 'COPAT', audioFile: 'Copat.mp3', shadowImage: 'copat1_senca.png', originalImage: 'copat1.webp' },
  { id: 'cvet', word: 'CVET', audioFile: 'Cvet.mp3', shadowImage: 'cvet1_senca.png', originalImage: 'cvet1.webp' }
];

// Data for letter Č
export const threeColumnMatchingDataČ: ThreeColumnMatchingItem[] = [
  { id: 'caj', word: 'ČAJ', audioFile: 'Caj.mp3', shadowImage: 'caj1_senca.png', originalImage: 'caj1.webp' },
  { id: 'carovnik', word: 'ČAROVNIK', audioFile: 'Carovnik.mp3', shadowImage: 'carovnik1_senca.png', originalImage: 'carovnik1.webp' },
  { id: 'casopis', word: 'ČASOPIS', audioFile: 'Casopis.mp3', shadowImage: 'casopis1_senca.png', originalImage: 'casopis1.webp' },
  { id: 'cebela', word: 'ČEBELA', audioFile: 'Cebela.mp3', shadowImage: 'cebela1_senca.png', originalImage: 'cebela1.webp' },
  { id: 'cebelar', word: 'ČEBELAR', audioFile: 'Cebelar.mp3', shadowImage: 'cebelar1_senca.png', originalImage: 'cebelar1.webp' },
  { id: 'cebula', word: 'ČEBULA', audioFile: 'Cebula.mp3', shadowImage: 'cebula1_senca.png', originalImage: 'cebula1.webp' },
  { id: 'cesen', word: 'ČESEN', audioFile: 'Cesen.mp3', shadowImage: 'cesen1_senca.png', originalImage: 'cesen1.webp' },
  { id: 'cevlji', word: 'ČEVLJI', audioFile: 'Cevlji.mp3', shadowImage: 'cevlji1_senca.png', originalImage: 'cevlji1.webp' },
  { id: 'cokolada', word: 'ČOKOLADA', audioFile: 'Cokolada.mp3', shadowImage: 'cokolada1_senca.png', originalImage: 'cokolada1.webp' },
  { id: 'coln', word: 'ČOLN', audioFile: 'Coln.mp3', shadowImage: 'coln1_senca.png', originalImage: 'coln1.webp' },
  { id: 'copic', word: 'ČOPIČ', audioFile: 'Copic.mp3', shadowImage: 'copic1_senca.png', originalImage: 'copic1.webp' },
  { id: 'crke', word: 'ČRKE', audioFile: 'Crke.mp3', shadowImage: 'crke1_senca.png', originalImage: 'crke1.webp' }
];

// Data for letter K
export const threeColumnMatchingDataK: ThreeColumnMatchingItem[] = [
  { id: 'kaca', word: 'KAČA', audioFile: 'Kaca.mp3', shadowImage: 'kaca1_senca.png', originalImage: 'kaca1.webp' },
  { id: 'kapa', word: 'KAPA', audioFile: 'Kapa.mp3', shadowImage: 'kapa1_senca.png', originalImage: 'kapa1.webp' },
  { id: 'kava', word: 'KAVA', audioFile: 'Kava.mp3', shadowImage: 'kava1_senca.png', originalImage: 'kava1.webp' },
  { id: 'klavir', word: 'KLAVIR', audioFile: 'Klavir.mp3', shadowImage: 'klavir1_senca.png', originalImage: 'klavir1.webp' },
  { id: 'kljuc', word: 'KLJUČ', audioFile: 'Kljuc.mp3', shadowImage: 'kljuc1_senca.png', originalImage: 'kljuc1.webp' },
  { id: 'klop', word: 'KLOP', audioFile: 'Klop.mp3', shadowImage: 'klop1_senca.png', originalImage: 'klop1.webp' },
  { id: 'knjiga', word: 'KNJIGA', audioFile: 'Knjiga.mp3', shadowImage: 'knjiga1_senca.png', originalImage: 'knjiga1.webp' },
  { id: 'kocka', word: 'KOCKA', audioFile: 'Kocka.mp3', shadowImage: 'kocka1_senca.png', originalImage: 'kocka1.webp' },
  { id: 'kokos_sadez', word: 'KOKOS', audioFile: 'Kokos_sadez.mp3', shadowImage: 'kokos_sadez1_senca.png', originalImage: 'kokos_sadez1.webp' },
  { id: 'kokos', word: 'KOKOŠ', audioFile: 'Kokos_zival.mp3', shadowImage: 'kokos1_senca.png', originalImage: 'kokos1.webp' },
  { id: 'kolac', word: 'KOLAČ', audioFile: 'Kolac.mp3', shadowImage: 'kolac1_senca.png', originalImage: 'kolac1.webp' },
  { id: 'kolo', word: 'KOLO', audioFile: 'Kolo.mp3', shadowImage: 'kolo1_senca.png', originalImage: 'kolo1.webp' },
  { id: 'koruza', word: 'KORUZA', audioFile: 'Koruza.mp3', shadowImage: 'koruza1_senca.png', originalImage: 'koruza1.webp' },
  { id: 'kost', word: 'KOST', audioFile: 'Kost.mp3', shadowImage: 'kost1_senca.png', originalImage: 'kost1.webp' },
  { id: 'kos', word: 'KOŠ', audioFile: 'Kos_predmet.mp3', shadowImage: 'kos1_senca.png', originalImage: 'kos1.webp' },
  { id: 'kosara', word: 'KOŠARA', audioFile: 'Kosara.mp3', shadowImage: 'kosara1_senca.png', originalImage: 'kosara1.webp' },
  { id: 'koza', word: 'KOZA', audioFile: 'Koza_zival.mp3', shadowImage: 'koza1_senca.png', originalImage: 'koza1.webp' },
  { id: 'kozarec', word: 'KOZAREC', audioFile: 'Kozarec.mp3', shadowImage: 'kozarec1_senca.png', originalImage: 'kozarec1.webp' },
  { id: 'koza_skin', word: 'KOŽA', audioFile: 'Koza_cutilo.mp3', shadowImage: 'koza_skin1_senca.png', originalImage: 'koza_skin1.webp' },
  { id: 'krava', word: 'KRAVA', audioFile: 'Krava.mp3', shadowImage: 'krava1_senca.png', originalImage: 'krava1.webp' },
  { id: 'krof', word: 'KROF', audioFile: 'Krof.mp3', shadowImage: 'krof1_senca.png', originalImage: 'krof1.webp' },
  { id: 'krog', word: 'KROG', audioFile: 'Krog.mp3', shadowImage: 'krog1_senca.png', originalImage: 'krog1.webp' },
  { id: 'kroznik', word: 'KROŽNIK', audioFile: 'Kroznik.mp3', shadowImage: 'kroznik1_senca.png', originalImage: 'kroznik1.webp' },
  { id: 'kruh', word: 'KRUH', audioFile: 'Kruh.mp3', shadowImage: 'kruh1_senca.png', originalImage: 'kruh1.webp' },
  { id: 'kumara', word: 'KUMARA', audioFile: 'Kumara.mp3', shadowImage: 'kumara1_senca.png', originalImage: 'kumara1.webp' },
  { id: 'kos_ptica', word: 'KOS', audioFile: 'Kos_ptica.mp3', shadowImage: 'kos_ptica1_senca.png', originalImage: 'kos_ptica1.webp' },
  { id: 'kuza', word: 'KUŽA', audioFile: 'Kuza.mp3', shadowImage: 'kuza1_senca.png', originalImage: 'kuza1.webp' }
];

// Data for letter L
export const threeColumnMatchingDataL: ThreeColumnMatchingItem[] = [
  { id: 'ladja', word: 'LADJA', audioFile: 'Ladja.mp3', shadowImage: 'ladja1_senca.png', originalImage: 'ladja1.webp' },
  { id: 'lasje', word: 'LASJE', audioFile: 'Lasje.mp3', shadowImage: 'lasje1_senca.png', originalImage: 'lasje1.webp' },
  { id: 'led', word: 'LED', audioFile: 'Led.mp3', shadowImage: 'led1_senca.png', originalImage: 'led1.webp' },
  { id: 'les', word: 'LES', audioFile: 'Les.mp3', shadowImage: 'les1_senca.png', originalImage: 'les1.webp' },
  { id: 'lesnik', word: 'LEŠNIK', audioFile: 'Lesnik.mp3', shadowImage: 'lesnik1_senca.png', originalImage: 'lesnik1.webp' },
  { id: 'letalo', word: 'LETALO', audioFile: 'Letalo.mp3', shadowImage: 'letalo1_senca.png', originalImage: 'letalo1.webp' },
  { id: 'lev', word: 'LEV', audioFile: 'Lev.mp3', shadowImage: 'lev1_senca.png', originalImage: 'lev1.webp' },
  { id: 'lisica', word: 'LISICA', audioFile: 'Lisica.mp3', shadowImage: 'lisica1_senca.png', originalImage: 'lisica1.webp' },
  { id: 'list', word: 'LIST', audioFile: 'List.mp3', shadowImage: 'list1_senca.png', originalImage: 'list1.webp' },
  { id: 'lizika', word: 'LIZIKA', audioFile: 'Lizika.mp3', shadowImage: 'lizika1_senca.png', originalImage: 'lizika1.webp' },
  { id: 'lonec', word: 'LONEC', audioFile: 'Lonec.mp3', shadowImage: 'lonec1_senca.png', originalImage: 'lonec1.webp' },
  { id: 'lopar', word: 'LOPAR', audioFile: 'Lopar.mp3', shadowImage: 'lopar1_senca.png', originalImage: 'lopar1.webp' },
  { id: 'los', word: 'LOS', audioFile: 'Los.mp3', shadowImage: 'los1_senca.png', originalImage: 'los1.webp' },
  { id: 'lovec', word: 'LOVEC', audioFile: 'Lovec.mp3', shadowImage: 'lovec1_senca.png', originalImage: 'lovec1.webp' },
  { id: 'lubenica', word: 'LUBENICA', audioFile: 'Lubenica.mp3', shadowImage: 'lubenica1_senca.png', originalImage: 'lubenica1.webp' },
  { id: 'luc', word: 'LUČ', audioFile: 'Luc.mp3', shadowImage: 'luc1_senca.png', originalImage: 'luc1.webp' },
  { id: 'luza', word: 'LUŽA', audioFile: 'Luza.mp3', shadowImage: 'luza1_senca.png', originalImage: 'luza1.webp' }
];

// Data for letter R
export const threeColumnMatchingDataR: ThreeColumnMatchingItem[] = [
  { id: 'raca', word: 'RACA', audioFile: 'Raca.mp3', shadowImage: 'raca1_senca.png', originalImage: 'raca1.webp' },
  { id: 'rak', word: 'RAK', audioFile: 'Rak.mp3', shadowImage: 'rak1_senca.png', originalImage: 'rak1.webp' },
  { id: 'raketa', word: 'RAKETA', audioFile: 'Raketa.mp3', shadowImage: 'raketa1_senca.png', originalImage: 'raketa1.webp' },
  { id: 'ravnilo', word: 'RAVNILO', audioFile: 'Ravnilo.mp3', shadowImage: 'ravnilo1_senca.png', originalImage: 'ravnilo1.webp' },
  { id: 'rep', word: 'REP', audioFile: 'Rep.mp3', shadowImage: 'rep1_senca.png', originalImage: 'rep1.webp' },
  { id: 'repa', word: 'REPA', audioFile: 'Repa.mp3', shadowImage: 'repa1_senca.png', originalImage: 'repa1.webp' },
  { id: 'riba', word: 'RIBA', audioFile: 'Riba.mp3', shadowImage: 'riba1_senca.png', originalImage: 'riba1.webp' },
  { id: 'ribez', word: 'RIBEZ', audioFile: 'Ribez.mp3', shadowImage: 'ribez1_senca.png', originalImage: 'ribez1.webp' },
  { id: 'ribic', word: 'RIBIČ', audioFile: 'Ribic.mp3', shadowImage: 'ribic1_senca.png', originalImage: 'ribic1.webp' },
  { id: 'ris', word: 'RIS', audioFile: 'Ris.mp3', shadowImage: 'ris1_senca.png', originalImage: 'ris1.webp' },
  { id: 'riz', word: 'RIŽ', audioFile: 'Riz.mp3', shadowImage: 'riz1_senca.png', originalImage: 'riz1.webp' },
  { id: 'robot', word: 'ROBOT', audioFile: 'Robot.mp3', shadowImage: 'robot1_senca.png', originalImage: 'robot1.webp' },
  { id: 'roka', word: 'ROKA', audioFile: 'Roka.mp3', shadowImage: 'roka1_senca.png', originalImage: 'roka1.webp' },
  { id: 'rokometas', word: 'ROKOMETAŠ', audioFile: 'Rokometas.mp3', shadowImage: 'rokometas1_senca.png', originalImage: 'rokometas1.webp' },
  { id: 'rolka', word: 'ROLKA', audioFile: 'Rolka.mp3', shadowImage: 'rolka1_senca.png', originalImage: 'rolka1.webp' },
  { id: 'ropotuljica', word: 'ROPOTULJICA', audioFile: 'Ropotuljica.mp3', shadowImage: 'ropotuljica1_senca.png', originalImage: 'ropotuljica1.webp' },
  { id: 'roza', word: 'ROŽA', audioFile: 'Roza.mp3', shadowImage: 'roza1_senca.png', originalImage: 'roza1.webp' }
];

// Data for letter S
export const threeColumnMatchingDataS: ThreeColumnMatchingItem[] = [
  { id: 'sedem', word: 'SEDEM', audioFile: 'Sedem.mp3', shadowImage: 'sedem1_senca.png', originalImage: 'sedem1.webp' },
  { id: 'sir', word: 'SIR', audioFile: 'Sir.mp3', shadowImage: 'sir1_senca.png', originalImage: 'sir1.webp' },
  { id: 'sladoled', word: 'SLADOLED', audioFile: 'Sladoled.mp3', shadowImage: 'sladoled1_senca.png', originalImage: 'sladoled1.webp' },
  { id: 'slika', word: 'SLIKA', audioFile: 'Slika.mp3', shadowImage: 'slika1_senca.png', originalImage: 'slika1.webp' },
  { id: 'slon', word: 'SLON', audioFile: 'Slon.mp3', shadowImage: 'slon1_senca.png', originalImage: 'slon1.webp' },
  { id: 'sluz', word: 'SLUZ', audioFile: 'Sluz.mp3', shadowImage: 'sluz1_senca.png', originalImage: 'sluz1.webp' },
  { id: 'smreka', word: 'SMREKA', audioFile: 'Smreka.mp3', shadowImage: 'smreka1_senca.png', originalImage: 'smreka1.webp' },
  { id: 'sneg', word: 'SNEG', audioFile: 'Sneg.mp3', shadowImage: 'sneg1_senca.png', originalImage: 'sneg1.webp' },
  { id: 'snezak', word: 'SNEŽAK', audioFile: 'Snezak.mp3', shadowImage: 'snezak1_senca.png', originalImage: 'snezak1.webp' },
  { id: 'snezinka', word: 'SNEŽINKA', audioFile: 'Snezinka.mp3', shadowImage: 'snezinka1_senca.png', originalImage: 'snezinka1.webp' },
  { id: 'sok', word: 'SOK', audioFile: 'Sok.mp3', shadowImage: 'sok1_senca.png', originalImage: 'sok1.webp' },
  { id: 'sonce', word: 'SONCE', audioFile: 'Sonce.mp3', shadowImage: 'sonce1_senca.png', originalImage: 'sonce1.webp' },
  { id: 'sova', word: 'SOVA', audioFile: 'Sova.mp3', shadowImage: 'sova1_senca.png', originalImage: 'sova1.webp' },
  { id: 'stol', word: 'STOL', audioFile: 'Stol.mp3', shadowImage: 'stol1_senca.png', originalImage: 'stol1.webp' },
  { id: 'svetilka', word: 'SVETILKA', audioFile: 'Svetilka.mp3', shadowImage: 'svetilka1_senca.png', originalImage: 'svetilka1.webp' },
  { id: 'svincnik', word: 'SVINČNIK', audioFile: 'Svincnik.mp3', shadowImage: 'svincnik1_senca.png', originalImage: 'svincnik1.webp' }
];

// Data for letter Š
export const threeColumnMatchingDataŠ: ThreeColumnMatchingItem[] = [
  { id: 'sah', word: 'ŠAH', audioFile: 'Sah.mp3', shadowImage: 'sah1_senca.png', originalImage: 'sah1.webp' },
  { id: 'sal', word: 'ŠAL', audioFile: 'Sal.mp3', shadowImage: 'sal1_senca.png', originalImage: 'sal1.webp' },
  { id: 'scetka', word: 'ŠČETKA', audioFile: 'Scetka.mp3', shadowImage: 'scetka1_senca.png', originalImage: 'scetka1.webp' },
  { id: 'skarje', word: 'ŠKARJE', audioFile: 'Skarje.mp3', shadowImage: 'skarje1_senca.png', originalImage: 'skarje1.webp' },
  { id: 'skatla', word: 'ŠKATLA', audioFile: 'Skatla.mp3', shadowImage: 'skatla1_senca.png', originalImage: 'skatla1.webp' },
  { id: 'skoljka', word: 'ŠKOLJKA', audioFile: 'Skoljka.mp3', shadowImage: 'skoljka1_senca.png', originalImage: 'skoljka1.webp' },
  { id: 'sofer', word: 'ŠOFER', audioFile: 'Sofer.mp3', shadowImage: 'sofer1_senca.png', originalImage: 'sofer1.webp' },
  { id: 'sopek', word: 'ŠOPEK', audioFile: 'Sopek.mp3', shadowImage: 'sopek1_senca.png', originalImage: 'sopek1.webp' },
  { id: 'sotor', word: 'ŠOTOR', audioFile: 'Sotor.mp3', shadowImage: 'sotor1_senca.png', originalImage: 'sotor1.webp' },
  { id: 'stampiljka', word: 'ŠTAMPILJKA', audioFile: 'Stampiljka.mp3', shadowImage: 'stampiljka1_senca.png', originalImage: 'stampiljka1.webp' },
  { id: 'storklja', word: 'ŠTORKLJA', audioFile: 'Storklja.mp3', shadowImage: 'storklja1_senca.png', originalImage: 'storklja1.webp' }
];

// Data for letter Z
export const threeColumnMatchingDataZ: ThreeColumnMatchingItem[] = [
  { id: 'zajec', word: 'ZAJEC', audioFile: 'Zajec.mp3', shadowImage: 'zajec1_senca.png', originalImage: 'zajec1.webp' },
  { id: 'zaslon', word: 'ZASLON', audioFile: 'Zaslon.mp3', shadowImage: 'zaslon1_senca.png', originalImage: 'zaslon1.webp' },
  { id: 'zavesa', word: 'ZAVESA', audioFile: 'Zavesa.mp3', shadowImage: 'zavesa1_senca.png', originalImage: 'zavesa1.webp' },
  { id: 'zebra', word: 'ZEBRA', audioFile: 'Zebra.mp3', shadowImage: 'zebra1_senca.png', originalImage: 'zebra1.webp' },
  { id: 'zlato', word: 'ZLATO', audioFile: 'Zlato.mp3', shadowImage: 'zlato1_senca.png', originalImage: 'zlato1.webp' },
  { id: 'zmaj', word: 'ZMAJ', audioFile: 'Zmaj.mp3', shadowImage: 'zmaj1_senca.png', originalImage: 'zmaj1.webp' },
  { id: 'zob', word: 'ZOB', audioFile: 'Zob.mp3', shadowImage: 'zob1_senca.png', originalImage: 'zob1.webp' },
  { id: 'zobotrebec', word: 'ZOBOTREBEC', audioFile: 'Zobotrebec.mp3', shadowImage: 'zobotrebec1_senca.png', originalImage: 'zobotrebec1.webp' },
  { id: 'zvezda', word: 'ZVEZDA', audioFile: 'Zvezda.mp3', shadowImage: 'zvezda1_senca.png', originalImage: 'zvezda1.webp' },
  { id: 'zvezek', word: 'ZVEZEK', audioFile: 'Zvezek.mp3', shadowImage: 'zvezek1_senca.png', originalImage: 'zvezek1.webp' },
  { id: 'zvocnik', word: 'ZVOČNIK', audioFile: 'Zvocnik.mp3', shadowImage: 'zvocnik1_senca.png', originalImage: 'zvocnik1.webp' }
];

// Data for letter Ž
export const threeColumnMatchingDataŽ: ThreeColumnMatchingItem[] = [
  { id: 'zaba', word: 'ŽABA', audioFile: 'Zaba.mp3', shadowImage: 'zaba1_senca.png', originalImage: 'zaba1.webp' },
  { id: 'zaga', word: 'ŽAGA', audioFile: 'Zaga.mp3', shadowImage: 'zaga1_senca.png', originalImage: 'zaga1.webp' },
  { id: 'zarnica', word: 'ŽARNICA', audioFile: 'Zarnica.mp3', shadowImage: 'zarnica1_senca.png', originalImage: 'zarnica1.webp' },
  { id: 'zebelj', word: 'ŽEBELJ', audioFile: 'Zebelj.mp3', shadowImage: 'zebelj1_senca.png', originalImage: 'zebelj1.webp' },
  { id: 'zelva', word: 'ŽELVA', audioFile: 'Zelva.mp3', shadowImage: 'zelva1_senca.png', originalImage: 'zelva1.webp' },
  { id: 'zerjav', word: 'ŽERJAV', audioFile: 'Zerjav.mp3', shadowImage: 'zerjav1_senca.png', originalImage: 'zerjav1.webp' },
  { id: 'zirafa', word: 'ŽIRAFA', audioFile: 'Zirafa.mp3', shadowImage: 'zirafa1_senca.png', originalImage: 'zirafa1.webp' },
  { id: 'zlica', word: 'ŽLICA', audioFile: 'Zlica.mp3', shadowImage: 'zlica1_senca.png', originalImage: 'zlica1.webp' },
  { id: 'zoga', word: 'ŽOGA', audioFile: 'Zoga.mp3', shadowImage: 'zoga1_senca.png', originalImage: 'zoga1.webp' },
  { id: 'zolna', word: 'ŽOLNA', audioFile: 'Zolna.mp3', shadowImage: 'zolna1_senca.png', originalImage: 'zolna1.webp' }
];

// Four-column data for 7-8 age group (letter C)
export const fourColumnMatchingDataC: FourColumnMatchingItem[] = [
  { id: 'cedilo', word: 'cedilo', audioFile: 'Cedilo.mp3', writtenWord: 'CEDILO', shadowImage: 'cedilo1_senca.png', originalImage: 'cedilo1.webp' },
  { id: 'cekin', word: 'cekin', audioFile: 'Cekin.mp3', writtenWord: 'CEKIN', shadowImage: 'cekin1_senca.png', originalImage: 'cekin1.webp' },
  { id: 'cerkev', word: 'cerkev', audioFile: 'Cerkev.mp3', writtenWord: 'CERKEV', shadowImage: 'cerkev1_senca.png', originalImage: 'cerkev1.webp' },
  { id: 'cesta', word: 'cesta', audioFile: 'Cesta.mp3', writtenWord: 'CESTA', shadowImage: 'cesta1_senca.png', originalImage: 'cesta1.webp' },
  { id: 'cev', word: 'cev', audioFile: 'Cev.mp3', writtenWord: 'CEV', shadowImage: 'cev1_senca.png', originalImage: 'cev1.webp' },
  { id: 'cirkus', word: 'cirkus', audioFile: 'Cirkus.mp3', writtenWord: 'CIRKUS', shadowImage: 'cirkus1_senca.png', originalImage: 'cirkus1.webp' },
  { id: 'cisterna', word: 'cisterna', audioFile: 'Cisterna.mp3', writtenWord: 'CISTERNA', shadowImage: 'cisterna1_senca.png', originalImage: 'cisterna1.webp' },
  { id: 'cokla', word: 'cokla', audioFile: 'Cokla.mp3', writtenWord: 'COKLA', shadowImage: 'cokla1_senca.png', originalImage: 'cokla1.webp' },
  { id: 'copat', word: 'copat', audioFile: 'Copat.mp3', writtenWord: 'COPAT', shadowImage: 'copat1_senca.png', originalImage: 'copat1.webp' },
  { id: 'cvet', word: 'cvet', audioFile: 'Cvet.mp3', writtenWord: 'CVET', shadowImage: 'cvet1_senca.png', originalImage: 'cvet1.webp' }
];

// Four-column data for letter Č
export const fourColumnMatchingDataČ: FourColumnMatchingItem[] = [
  { id: 'caj', word: 'čaj', audioFile: 'Caj.mp3', writtenWord: 'ČAJ', shadowImage: 'caj1_senca.png', originalImage: 'caj1.webp' },
  { id: 'casopis', word: 'časopis', audioFile: 'Casopis.mp3', writtenWord: 'ČASOPIS', shadowImage: 'casopis1_senca.png', originalImage: 'casopis1.webp' },
  { id: 'cebela', word: 'čebela', audioFile: 'Cebela.mp3', writtenWord: 'ČEBELA', shadowImage: 'cebela1_senca.png', originalImage: 'cebela1.webp' },
  { id: 'cebula', word: 'čebula', audioFile: 'Cebula.mp3', writtenWord: 'ČEBULA', shadowImage: 'cebula1_senca.png', originalImage: 'cebula1.webp' },
  { id: 'cesen', word: 'česen', audioFile: 'Cesen.mp3', writtenWord: 'ČESEN', shadowImage: 'cesen1_senca.png', originalImage: 'cesen1.webp' },
  { id: 'cevlji', word: 'čevlji', audioFile: 'Cevlji.mp3', writtenWord: 'ČEVLJI', shadowImage: 'cevlji1_senca.png', originalImage: 'cevlji1.webp' },
  { id: 'cokolada', word: 'čokolada', audioFile: 'Cokolada.mp3', writtenWord: 'ČOKOLADA', shadowImage: 'cokolada1_senca.png', originalImage: 'cokolada1.webp' },
  { id: 'coln', word: 'čoln', audioFile: 'Coln.mp3', writtenWord: 'ČOLN', shadowImage: 'coln1_senca.png', originalImage: 'coln1.webp' },
  { id: 'copic', word: 'čopič', audioFile: 'Copic.mp3', writtenWord: 'ČOPIČ', shadowImage: 'copic1_senca.png', originalImage: 'copic1.webp' },
  { id: 'carovnik', word: 'čarovnik', audioFile: 'Carovnik.mp3', writtenWord: 'ČAROVNIK', shadowImage: 'carovnik1_senca.png', originalImage: 'carovnik1.webp' },
  { id: 'cebelar', word: 'čebelar', audioFile: 'Cebelar.mp3', writtenWord: 'ČEBELAR', shadowImage: 'cebelar1_senca.png', originalImage: 'cebelar1.webp' },
  { id: 'crke', word: 'črke', audioFile: 'Crke.mp3', writtenWord: 'ČRKE', shadowImage: 'crke1_senca.png', originalImage: 'crke1.webp' }
];

// Four-column data for letter K
export const fourColumnMatchingDataK: FourColumnMatchingItem[] = [
  { id: 'kaca', word: 'kača', audioFile: 'Kaca.mp3', writtenWord: 'KAČA', shadowImage: 'kaca1_senca.png', originalImage: 'kaca1.webp' },
  { id: 'kapa', word: 'kapa', audioFile: 'Kapa.mp3', writtenWord: 'KAPA', shadowImage: 'kapa1_senca.png', originalImage: 'kapa1.webp' },
  { id: 'kava', word: 'kava', audioFile: 'Kava.mp3', writtenWord: 'KAVA', shadowImage: 'kava1_senca.png', originalImage: 'kava1.webp' },
  { id: 'klavir', word: 'klavir', audioFile: 'Klavir.mp3', writtenWord: 'KLAVIR', shadowImage: 'klavir1_senca.png', originalImage: 'klavir1.webp' },
  { id: 'kljuc', word: 'ključ', audioFile: 'Kljuc.mp3', writtenWord: 'KLJUČ', shadowImage: 'kljuc1_senca.png', originalImage: 'kljuc1.webp' },
  { id: 'klop', word: 'klop', audioFile: 'Klop.mp3', writtenWord: 'KLOP', shadowImage: 'klop1_senca.png', originalImage: 'klop1.webp' },
  { id: 'knjiga', word: 'knjiga', audioFile: 'Knjiga.mp3', writtenWord: 'KNJIGA', shadowImage: 'knjiga1_senca.png', originalImage: 'knjiga1.webp' },
  { id: 'kocka', word: 'kocka', audioFile: 'Kocka.mp3', writtenWord: 'KOCKA', shadowImage: 'kocka1_senca.png', originalImage: 'kocka1.webp' },
  { id: 'kokos_sadez', word: 'kokos', audioFile: 'Kokos_sadez.mp3', writtenWord: 'KOKOS', shadowImage: 'kokos_sadez1_senca.png', originalImage: 'kokos_sadez1.webp' },
  { id: 'kokos', word: 'kokoš', audioFile: 'Kokos_zival.mp3', writtenWord: 'KOKOŠ', shadowImage: 'kokos1_senca.png', originalImage: 'kokos1.webp' },
  { id: 'kolac', word: 'kolač', audioFile: 'Kolac.mp3', writtenWord: 'KOLAČ', shadowImage: 'kolac1_senca.png', originalImage: 'kolac1.webp' },
  { id: 'kolo', word: 'kolo', audioFile: 'Kolo.mp3', writtenWord: 'KOLO', shadowImage: 'kolo1_senca.png', originalImage: 'kolo1.webp' },
  { id: 'koruza', word: 'koruza', audioFile: 'Koruza.mp3', writtenWord: 'KORUZA', shadowImage: 'koruza1_senca.png', originalImage: 'koruza1.webp' },
  { id: 'kost', word: 'kost', audioFile: 'Kost.mp3', writtenWord: 'KOST', shadowImage: 'kost1_senca.png', originalImage: 'kost1.webp' },
  { id: 'kos', word: 'koš', audioFile: 'Kos_predmet.mp3', writtenWord: 'KOŠ', shadowImage: 'kos1_senca.png', originalImage: 'kos1.webp' },
  { id: 'kosara', word: 'košara', audioFile: 'Kosara.mp3', writtenWord: 'KOŠARA', shadowImage: 'kosara1_senca.png', originalImage: 'kosara1.webp' },
  { id: 'koza', word: 'koza', audioFile: 'Koza_zival.mp3', writtenWord: 'KOZA', shadowImage: 'koza1_senca.png', originalImage: 'koza1.webp' },
  { id: 'kozarec', word: 'kozarec', audioFile: 'Kozarec.mp3', writtenWord: 'KOZAREC', shadowImage: 'kozarec1_senca.png', originalImage: 'kozarec1.webp' },
  { id: 'koza_skin', word: 'koža', audioFile: 'Koza_cutilo.mp3', writtenWord: 'KOŽA', shadowImage: 'koza_skin1_senca.png', originalImage: 'koza_skin1.webp' },
  { id: 'krava', word: 'krava', audioFile: 'Krava.mp3', writtenWord: 'KRAVA', shadowImage: 'krava1_senca.png', originalImage: 'krava1.webp' },
  { id: 'krof', word: 'krof', audioFile: 'Krof.mp3', writtenWord: 'KROF', shadowImage: 'krof1_senca.png', originalImage: 'krof1.webp' },
  { id: 'krog', word: 'krog', audioFile: 'Krog.mp3', writtenWord: 'KROG', shadowImage: 'krog1_senca.png', originalImage: 'krog1.webp' },
  { id: 'kroznik', word: 'krožnik', audioFile: 'Kroznik.mp3', writtenWord: 'KROŽNIK', shadowImage: 'kroznik1_senca.png', originalImage: 'kroznik1.webp' },
  { id: 'kruh', word: 'kruh', audioFile: 'Kruh.mp3', writtenWord: 'KRUH', shadowImage: 'kruh1_senca.png', originalImage: 'kruh1.webp' },
  { id: 'kumara', word: 'kumara', audioFile: 'Kumara.mp3', writtenWord: 'KUMARA', shadowImage: 'kumara1_senca.png', originalImage: 'kumara1.webp' },
  { id: 'kos_ptica', word: 'kos', audioFile: 'Kos_ptica.mp3', writtenWord: 'KOS', shadowImage: 'kos_ptica1_senca.png', originalImage: 'kos_ptica1.webp' },
  { id: 'kuza', word: 'kuža', audioFile: 'Kuza.mp3', writtenWord: 'KUŽA', shadowImage: 'kuza1_senca.png', originalImage: 'kuza1.webp' }
];

// Four-column data for letter L
export const fourColumnMatchingDataL: FourColumnMatchingItem[] = [
  { id: 'ladja', word: 'ladja', audioFile: 'Ladja.mp3', writtenWord: 'LADJA', shadowImage: 'ladja1_senca.png', originalImage: 'ladja1.webp' },
  { id: 'lasje', word: 'lasje', audioFile: 'Lasje.mp3', writtenWord: 'LASJE', shadowImage: 'lasje1_senca.png', originalImage: 'lasje1.webp' },
  { id: 'led', word: 'led', audioFile: 'Led.mp3', writtenWord: 'LED', shadowImage: 'led1_senca.png', originalImage: 'led1.webp' },
  { id: 'lesnik', word: 'lešnik', audioFile: 'Lesnik.mp3', writtenWord: 'LEŠNIK', shadowImage: 'lesnik1_senca.png', originalImage: 'lesnik1.webp' },
  { id: 'letalo', word: 'letalo', audioFile: 'Letalo.mp3', writtenWord: 'LETALO', shadowImage: 'letalo1_senca.png', originalImage: 'letalo1.webp' },
  { id: 'lev', word: 'lev', audioFile: 'Lev.mp3', writtenWord: 'LEV', shadowImage: 'lev1_senca.png', originalImage: 'lev1.webp' },
  { id: 'les', word: 'les', audioFile: 'Les.mp3', writtenWord: 'LES', shadowImage: 'les1_senca.png', originalImage: 'les1.webp' },
  { id: 'list', word: 'list', audioFile: 'List.mp3', writtenWord: 'LIST', shadowImage: 'list1_senca.png', originalImage: 'list1.webp' },
  { id: 'lizika', word: 'lizika', audioFile: 'Lizika.mp3', writtenWord: 'LIZIKA', shadowImage: 'lizika1_senca.png', originalImage: 'lizika1.webp' },
  { id: 'lonec', word: 'lonec', audioFile: 'Lonec.mp3', writtenWord: 'LONEC', shadowImage: 'lonec1_senca.png', originalImage: 'lonec1.webp' },
  { id: 'lopar', word: 'lopar', audioFile: 'Lopar.mp3', writtenWord: 'LOPAR', shadowImage: 'lopar1_senca.png', originalImage: 'lopar1.webp' },
  { id: 'los', word: 'los', audioFile: 'Los.mp3', writtenWord: 'LOS', shadowImage: 'los1_senca.png', originalImage: 'los1.webp' },
  { id: 'lovec', word: 'lovec', audioFile: 'Lovec.mp3', writtenWord: 'LOVEC', shadowImage: 'lovec1_senca.png', originalImage: 'lovec1.webp' },
  { id: 'lisica', word: 'lisica', audioFile: 'Lisica.mp3', writtenWord: 'LISICA', shadowImage: 'lisica1_senca.png', originalImage: 'lisica1.webp' },
  { id: 'lubenica', word: 'lubenica', audioFile: 'Lubenica.mp3', writtenWord: 'LUBENICA', shadowImage: 'lubenica1_senca.png', originalImage: 'lubenica1.webp' },
  { id: 'luc', word: 'luč', audioFile: 'Luc.mp3', writtenWord: 'LUČ', shadowImage: 'luc1_senca.png', originalImage: 'luc1.webp' },
  { id: 'luza', word: 'luža', audioFile: 'Luza.mp3', writtenWord: 'LUŽA', shadowImage: 'luza1_senca.png', originalImage: 'luza1.webp' }
];

// Four-column data for letter R
export const fourColumnMatchingDataR: FourColumnMatchingItem[] = [
  { id: 'raca', word: 'raca', audioFile: 'Raca.mp3', writtenWord: 'RACA', shadowImage: 'raca1_senca.png', originalImage: 'raca1.webp' },
  { id: 'rak', word: 'rak', audioFile: 'Rak.mp3', writtenWord: 'RAK', shadowImage: 'rak1_senca.png', originalImage: 'rak1.webp' },
  { id: 'raketa', word: 'raketa', audioFile: 'Raketa.mp3', writtenWord: 'RAKETA', shadowImage: 'raketa1_senca.png', originalImage: 'raketa1.webp' },
  { id: 'ravnilo', word: 'ravnilo', audioFile: 'Ravnilo.mp3', writtenWord: 'RAVNILO', shadowImage: 'ravnilo1_senca.png', originalImage: 'ravnilo1.webp' },
  { id: 'rep', word: 'rep', audioFile: 'Rep.mp3', writtenWord: 'REP', shadowImage: 'rep1_senca.png', originalImage: 'rep1.webp' },
  { id: 'repa', word: 'repa', audioFile: 'Repa.mp3', writtenWord: 'REPA', shadowImage: 'repa1_senca.png', originalImage: 'repa1.webp' },
  { id: 'riba', word: 'riba', audioFile: 'Riba.mp3', writtenWord: 'RIBA', shadowImage: 'riba1_senca.png', originalImage: 'riba1.webp' },
  { id: 'ribez', word: 'ribez', audioFile: 'Ribez.mp3', writtenWord: 'RIBEZ', shadowImage: 'ribez1_senca.png', originalImage: 'ribez1.webp' },
  { id: 'ribic', word: 'ribič', audioFile: 'Ribic.mp3', writtenWord: 'RIBIČ', shadowImage: 'ribic1_senca.png', originalImage: 'ribic1.webp' },
  { id: 'ris', word: 'ris', audioFile: 'Ris.mp3', writtenWord: 'RIS', shadowImage: 'ris1_senca.png', originalImage: 'ris1.webp' },
  { id: 'riz', word: 'riž', audioFile: 'Riz.mp3', writtenWord: 'RIŽ', shadowImage: 'riz1_senca.png', originalImage: 'riz1.webp' },
  { id: 'robot', word: 'robot', audioFile: 'Robot.mp3', writtenWord: 'ROBOT', shadowImage: 'robot1_senca.png', originalImage: 'robot1.webp' },
  { id: 'roka', word: 'roka', audioFile: 'Roka.mp3', writtenWord: 'ROKA', shadowImage: 'roka1_senca.png', originalImage: 'roka1.webp' },
  { id: 'rokometas', word: 'rokometaš', audioFile: 'Rokometas.mp3', writtenWord: 'ROKOMETAŠ', shadowImage: 'rokometas1_senca.png', originalImage: 'rokometas1.webp' },
  { id: 'rolka', word: 'rolka', audioFile: 'Rolka.mp3', writtenWord: 'ROLKA', shadowImage: 'rolka1_senca.png', originalImage: 'rolka1.webp' },
  { id: 'ropotuljica', word: 'ropotuljica', audioFile: 'Ropotuljica.mp3', writtenWord: 'ROPOTULJICA', shadowImage: 'ropotuljica1_senca.png', originalImage: 'ropotuljica1.webp' },
  { id: 'roza', word: 'roža', audioFile: 'Roza.mp3', writtenWord: 'ROŽA', shadowImage: 'roza1_senca.png', originalImage: 'roza1.webp' }
];

// Four-column data for letter S
export const fourColumnMatchingDataS: FourColumnMatchingItem[] = [
  { id: 'sedem', word: 'sedem', audioFile: 'Sedem.mp3', writtenWord: 'SEDEM', shadowImage: 'sedem1_senca.png', originalImage: 'sedem1.webp' },
  { id: 'sir', word: 'sir', audioFile: 'Sir.mp3', writtenWord: 'SIR', shadowImage: 'sir1_senca.png', originalImage: 'sir1.webp' },
  { id: 'sladoled', word: 'sladoled', audioFile: 'Sladoled.mp3', writtenWord: 'SLADOLED', shadowImage: 'sladoled1_senca.png', originalImage: 'sladoled1.webp' },
  { id: 'slika', word: 'slika', audioFile: 'Slika.mp3', writtenWord: 'SLIKA', shadowImage: 'slika1_senca.png', originalImage: 'slika1.webp' },
  { id: 'slon', word: 'slon', audioFile: 'Slon.mp3', writtenWord: 'SLON', shadowImage: 'slon1_senca.png', originalImage: 'slon1.webp' },
  { id: 'sluz', word: 'sluz', audioFile: 'Sluz.mp3', writtenWord: 'SLUZ', shadowImage: 'sluz1_senca.png', originalImage: 'sluz1.webp' },
  { id: 'smreka', word: 'smreka', audioFile: 'Smreka.mp3', writtenWord: 'SMREKA', shadowImage: 'smreka1_senca.png', originalImage: 'smreka1.webp' },
  { id: 'sneg', word: 'sneg', audioFile: 'Sneg.mp3', writtenWord: 'SNEG', shadowImage: 'sneg1_senca.png', originalImage: 'sneg1.webp' },
  { id: 'snezak', word: 'snežak', audioFile: 'Snezak.mp3', writtenWord: 'SNEŽAK', shadowImage: 'snezak1_senca.png', originalImage: 'snezak1.webp' },
  { id: 'snezinka', word: 'snežinka', audioFile: 'Snezinka.mp3', writtenWord: 'SNEŽINKA', shadowImage: 'snezinka1_senca.png', originalImage: 'snezinka1.webp' },
  { id: 'sok', word: 'sok', audioFile: 'Sok.mp3', writtenWord: 'SOK', shadowImage: 'sok1_senca.png', originalImage: 'sok1.webp' },
  { id: 'sonce', word: 'sonce', audioFile: 'Sonce.mp3', writtenWord: 'SONCE', shadowImage: 'sonce1_senca.png', originalImage: 'sonce1.webp' },
  { id: 'sova', word: 'sova', audioFile: 'Sova.mp3', writtenWord: 'SOVA', shadowImage: 'sova1_senca.png', originalImage: 'sova1.webp' },
  { id: 'stol', word: 'stol', audioFile: 'Stol.mp3', writtenWord: 'STOL', shadowImage: 'stol1_senca.png', originalImage: 'stol1.webp' },
  { id: 'svetilka', word: 'svetilka', audioFile: 'Svetilka.mp3', writtenWord: 'SVETILKA', shadowImage: 'svetilka1_senca.png', originalImage: 'svetilka1.webp' },
  { id: 'svincnik', word: 'svinčnik', audioFile: 'Svincnik.mp3', writtenWord: 'SVINČNIK', shadowImage: 'svincnik1_senca.png', originalImage: 'svincnik1.webp' }
];

// Four-column data for letter Š
export const fourColumnMatchingDataŠ: FourColumnMatchingItem[] = [
  { id: 'sah', word: 'šah', audioFile: 'Sah.mp3', writtenWord: 'ŠAH', shadowImage: 'sah1_senca.png', originalImage: 'sah1.webp' },
  { id: 'sal', word: 'šal', audioFile: 'Sal.mp3', writtenWord: 'ŠAL', shadowImage: 'sal1_senca.png', originalImage: 'sal1.webp' },
  { id: 'scetka', word: 'ščetka', audioFile: 'Scetka.mp3', writtenWord: 'ŠČETKA', shadowImage: 'scetka1_senca.png', originalImage: 'scetka1.webp' },
  { id: 'skarje', word: 'škarje', audioFile: 'Skarje.mp3', writtenWord: 'ŠKARJE', shadowImage: 'skarje1_senca.png', originalImage: 'skarje1.webp' },
  { id: 'skatla', word: 'škatla', audioFile: 'Skatla.mp3', writtenWord: 'ŠKATLA', shadowImage: 'skatla1_senca.png', originalImage: 'skatla1.webp' },
  { id: 'skoljka', word: 'školjka', audioFile: 'Skoljka.mp3', writtenWord: 'ŠKOLJKA', shadowImage: 'skoljka1_senca.png', originalImage: 'skoljka1.webp' },
  { id: 'sopek', word: 'šopek', audioFile: 'Sopek.mp3', writtenWord: 'ŠOPEK', shadowImage: 'sopek1_senca.png', originalImage: 'sopek1.webp' },
  { id: 'sotor', word: 'šotor', audioFile: 'Sotor.mp3', writtenWord: 'ŠOTOR', shadowImage: 'sotor1_senca.png', originalImage: 'sotor1.webp' },
  { id: 'stampiljka', word: 'štampiljka', audioFile: 'Stampiljka.mp3', writtenWord: 'ŠTAMPILJKA', shadowImage: 'stampiljka1_senca.png', originalImage: 'stampiljka1.webp' },
  { id: 'sofer', word: 'šofer', audioFile: 'Sofer.mp3', writtenWord: 'ŠOFER', shadowImage: 'sofer1_senca.png', originalImage: 'sofer1.webp' },
  { id: 'storklja', word: 'štorklja', audioFile: 'Storklja.mp3', writtenWord: 'ŠTORKLJA', shadowImage: 'storklja1_senca.png', originalImage: 'storklja1.webp' }
];

// Four-column data for letter Z
export const fourColumnMatchingDataZ: FourColumnMatchingItem[] = [
  { id: 'zajec', word: 'zajec', audioFile: 'Zajec.mp3', writtenWord: 'ZAJEC', shadowImage: 'zajec1_senca.png', originalImage: 'zajec1.webp' },
  { id: 'zaslon', word: 'zaslon', audioFile: 'Zaslon.mp3', writtenWord: 'ZASLON', shadowImage: 'zaslon1_senca.png', originalImage: 'zaslon1.webp' },
  { id: 'zavesa', word: 'zavesa', audioFile: 'Zavesa.mp3', writtenWord: 'ZAVESA', shadowImage: 'zavesa1_senca.png', originalImage: 'zavesa1.webp' },
  { id: 'zebra', word: 'zebra', audioFile: 'Zebra.mp3', writtenWord: 'ZEBRA', shadowImage: 'zebra1_senca.png', originalImage: 'zebra1.webp' },
  { id: 'zlato', word: 'zlato', audioFile: 'Zlato.mp3', writtenWord: 'ZLATO', shadowImage: 'zlato1_senca.png', originalImage: 'zlato1.webp' },
  { id: 'zmaj', word: 'zmaj', audioFile: 'Zmaj.mp3', writtenWord: 'ZMAJ', shadowImage: 'zmaj1_senca.png', originalImage: 'zmaj1.webp' },
  { id: 'zob', word: 'zob', audioFile: 'Zob.mp3', writtenWord: 'ZOB', shadowImage: 'zob1_senca.png', originalImage: 'zob1.webp' },
  { id: 'zobotrebec', word: 'zobotrebec', audioFile: 'Zobotrebec.mp3', writtenWord: 'ZOBOTREBEC', shadowImage: 'zobotrebec1_senca.png', originalImage: 'zobotrebec1.webp' },
  { id: 'zvezda', word: 'zvezda', audioFile: 'Zvezda.mp3', writtenWord: 'ZVEZDA', shadowImage: 'zvezda1_senca.png', originalImage: 'zvezda1.webp' },
  { id: 'zvezek', word: 'zvezek', audioFile: 'Zvezek.mp3', writtenWord: 'ZVEZEK', shadowImage: 'zvezek1_senca.png', originalImage: 'zvezek1.webp' },
  { id: 'zvocnik', word: 'zvočnik', audioFile: 'Zvocnik.mp3', writtenWord: 'ZVOČNIK', shadowImage: 'zvocnik1_senca.png', originalImage: 'zvocnik1.webp' }
];

// Four-column data for letter Ž
export const fourColumnMatchingDataŽ: FourColumnMatchingItem[] = [
  { id: 'zaba', word: 'žaba', audioFile: 'Zaba.mp3', writtenWord: 'ŽABA', shadowImage: 'zaba1_senca.png', originalImage: 'zaba1.webp' },
  { id: 'zaga', word: 'žaga', audioFile: 'Zaga.mp3', writtenWord: 'ŽAGA', shadowImage: 'zaga1_senca.png', originalImage: 'zaga1.webp' },
  { id: 'zarnica', word: 'žarnica', audioFile: 'Zarnica.mp3', writtenWord: 'ŽARNICA', shadowImage: 'zarnica1_senca.png', originalImage: 'zarnica1.webp' },
  { id: 'zebelj', word: 'žebelj', audioFile: 'Zebelj.mp3', writtenWord: 'ŽEBELJ', shadowImage: 'zebelj1_senca.png', originalImage: 'zebelj1.webp' },
  { id: 'zelva', word: 'želva', audioFile: 'Zelva.mp3', writtenWord: 'ŽELVA', shadowImage: 'zelva1_senca.png', originalImage: 'zelva1.webp' },
  { id: 'zerjav', word: 'žerjav', audioFile: 'Zerjav.mp3', writtenWord: 'ŽERJAV', shadowImage: 'zerjav1_senca.png', originalImage: 'zerjav1.webp' },
  { id: 'zirafa', word: 'žirafa', audioFile: 'Zirafa.mp3', writtenWord: 'ŽIRAFA', shadowImage: 'zirafa1_senca.png', originalImage: 'zirafa1.webp' },
  { id: 'zlica', word: 'žlica', audioFile: 'Zlica.mp3', writtenWord: 'ŽLICA', shadowImage: 'zlica1_senca.png', originalImage: 'zlica1.webp' },
  { id: 'zoga', word: 'žoga', audioFile: 'Zoga.mp3', writtenWord: 'ŽOGA', shadowImage: 'zoga1_senca.png', originalImage: 'zoga1.webp' },
  { id: 'zolna', word: 'žolna', audioFile: 'Zolna.mp3', writtenWord: 'ŽOLNA', shadowImage: 'zolna1_senca.png', originalImage: 'zolna1.webp' }
];

// Data for letter F
export const threeColumnMatchingDataF: ThreeColumnMatchingItem[] = [
  { id: 'faraon', word: 'FARAON', audioFile: 'Faraon.mp3', shadowImage: 'faraon_senca.png', originalImage: 'faraon.webp' },
  { id: 'fazan', word: 'FAZAN', audioFile: 'Fazan.mp3', shadowImage: 'fazan_senca.png', originalImage: 'fazan.webp' },
  { id: 'feferon', word: 'FEFERON', audioFile: 'Feferon.mp3', shadowImage: 'feferon_senca.png', originalImage: 'feferon.webp' },
  { id: 'figa', word: 'FIGA', audioFile: 'Figa.mp3', shadowImage: 'figa_senca.png', originalImage: 'figa.webp' },
  { id: 'flavta', word: 'FLAVTA', audioFile: 'Flavta.mp3', shadowImage: 'flavta_senca.png', originalImage: 'flavta.webp' },
  { id: 'formula', word: 'FORMULA', audioFile: 'Formula.mp3', shadowImage: 'formula_senca.png', originalImage: 'formula.webp' },
  { id: 'fotelj', word: 'FOTELJ', audioFile: 'Fotelj.mp3', shadowImage: 'fotelj_senca.png', originalImage: 'fotelj.webp' },
  { id: 'fraca', word: 'FRAČA', audioFile: 'Fraca.mp3', shadowImage: 'fraca_senca.png', originalImage: 'fraca.webp' },
  { id: 'frizer', word: 'FRIZER', audioFile: 'Frizer.mp3', shadowImage: 'frizer_senca.png', originalImage: 'frizer.webp' },
  { id: 'frnikola', word: 'FRNIKOLA', audioFile: 'Frnikola.mp3', shadowImage: 'frnikola_senca.png', originalImage: 'frnikola.webp' },
  { id: 'fant', word: 'FANT', audioFile: 'Fant.mp3', shadowImage: 'fant1_senca.png', originalImage: 'fant1.webp' },
  { id: 'fen', word: 'FEN', audioFile: 'Fen.mp3', shadowImage: 'fen1_senca.png', originalImage: 'fen1.webp' },
  { id: 'fizol', word: 'FIŽOL', audioFile: 'Fizol.mp3', shadowImage: 'fizol1_senca.png', originalImage: 'fizol1.webp' }
];

// Data for letter G
export const threeColumnMatchingDataG: ThreeColumnMatchingItem[] = [
  { id: 'gasilec', word: 'GASILEC', audioFile: 'Gasilec.mp3', shadowImage: 'gasilec_senca.png', originalImage: 'gasilec.webp' },
  { id: 'glavnik', word: 'GLAVNIK', audioFile: 'Glavnik.mp3', shadowImage: 'glavnik_senca.png', originalImage: 'glavnik.webp' },
  { id: 'golob', word: 'GOLOB', audioFile: 'Golob.mp3', shadowImage: 'golob_senca.png', originalImage: 'golob.webp' },
  { id: 'gos', word: 'GOS', audioFile: 'Gos.mp3', shadowImage: 'gos_senca.png', originalImage: 'gos.webp' },
  { id: 'gozdar', word: 'GOZDAR', audioFile: 'Gozdar.mp3', shadowImage: 'gozdar_senca.png', originalImage: 'gozdar.webp' },
  { id: 'grad', word: 'GRAD', audioFile: 'Grad.mp3', shadowImage: 'grad_senca.png', originalImage: 'grad.webp' },
  { id: 'grah', word: 'GRAH', audioFile: 'Grah.mp3', shadowImage: 'grah_senca.png', originalImage: 'grah.webp' },
  { id: 'gugalnica', word: 'GUGALNICA', audioFile: 'Gugalnica.mp3', shadowImage: 'gugalnica_senca.png', originalImage: 'gugalnica.webp' },
  { id: 'gusar', word: 'GUSAR', audioFile: 'Gusar.mp3', shadowImage: 'gusar_senca.png', originalImage: 'gusar.webp' },
  { id: 'goba', word: 'GOBA', audioFile: 'Goba.mp3', shadowImage: 'goba1_senca.png', originalImage: 'goba1.webp' },
  { id: 'gol', word: 'GOL', audioFile: 'Gol.mp3', shadowImage: 'gol1_senca.png', originalImage: 'gol1.webp' },
  { id: 'guma', word: 'GUMA', audioFile: 'Guma.mp3', shadowImage: 'guma1_senca.png', originalImage: 'guma1.webp' },
  { id: 'garaza', word: 'GARAŽA', audioFile: 'Garaza.mp3', shadowImage: 'garaza1_senca.png', originalImage: 'garaza1.webp' },
  { id: 'gnezdo', word: 'GNEZDO', audioFile: 'Gnezdo.mp3', shadowImage: 'gnezdo1_senca.png', originalImage: 'gnezdo1.webp' },
  { id: 'grozdje', word: 'GROZDJE', audioFile: 'Grozdje.mp3', shadowImage: 'grozdje1_senca.png', originalImage: 'grozdje1.webp' },
  { id: 'glava', word: 'GLAVA', audioFile: 'Glava.mp3', shadowImage: 'glava1_senca.png', originalImage: 'glava1.webp' }
];

// Data for letter H
export const threeColumnMatchingDataH: ThreeColumnMatchingItem[] = [
  { id: 'harfa', word: 'HARFA', audioFile: 'Harfa.mp3', shadowImage: 'harfa_senca.png', originalImage: 'harfa.webp' },
  { id: 'harmonika', word: 'HARMONIKA', audioFile: 'Harmonika.mp3', shadowImage: 'harmonika_senca.png', originalImage: 'harmonika.webp' },
  { id: 'helikopter', word: 'HELIKOPTER', audioFile: 'Helikopter.mp3', shadowImage: 'helikopter_senca.png', originalImage: 'helikopter.webp' },
  { id: 'hijena', word: 'HIJENA', audioFile: 'Hijena.mp3', shadowImage: 'hijena_senca.png', originalImage: 'hijena.webp' },
  { id: 'hlev', word: 'HLEV', audioFile: 'Hlev.mp3', shadowImage: 'hlev_senca.png', originalImage: 'hlev.webp' },
  { id: 'hobotnica', word: 'HOBOTNICA', audioFile: 'Hobotnica.mp3', shadowImage: 'hobotnica_senca.png', originalImage: 'hobotnica.webp' },
  { id: 'hokej', word: 'HOKEJ', audioFile: 'Hokej.mp3', shadowImage: 'hokej_senca.png', originalImage: 'hokej.webp' },
  { id: 'hotel', word: 'HOTEL', audioFile: 'Hotel.mp3', shadowImage: 'hotel_senca.png', originalImage: 'hotel.webp' },
  { id: 'hrcek', word: 'HRČEK', audioFile: 'Hrcek.mp3', shadowImage: 'hrcek_senca.png', originalImage: 'hrcek.webp' },
  { id: 'hrib', word: 'HRIB', audioFile: 'Hrib.mp3', shadowImage: 'hrib_senca.png', originalImage: 'hrib.webp' },
  { id: 'hupa', word: 'HUPA', audioFile: 'Hupa.mp3', shadowImage: 'hupa_senca.png', originalImage: 'hupa.webp' },
  { id: 'hisa', word: 'HIŠA', audioFile: 'Hisa.mp3', shadowImage: 'hisa1_senca.png', originalImage: 'hisa1.webp' },
  { id: 'hlace', word: 'HLAČE', audioFile: 'Hlace.mp3', shadowImage: 'hlace1_senca.png', originalImage: 'hlace1.webp' },
  { id: 'hruska', word: 'HRUŠKA', audioFile: 'Hruska.mp3', shadowImage: 'hruska1_senca.png', originalImage: 'hruska1.webp' }
];

// Data for letter V
export const threeColumnMatchingDataV: ThreeColumnMatchingItem[] = [
  { id: 'vafelj', word: 'VAFELJ', audioFile: 'Vafelj.mp3', shadowImage: 'vafelj_senca.png', originalImage: 'vafelj.webp' },
  { id: 'vedro', word: 'VEDRO', audioFile: 'Vedro.mp3', shadowImage: 'vedro_senca.png', originalImage: 'vedro.webp' },
  { id: 'veslo', word: 'VESLO', audioFile: 'Veslo.mp3', shadowImage: 'veslo_senca.png', originalImage: 'veslo.webp' },
  { id: 'veverica', word: 'VEVERICA', audioFile: 'Veverica.mp3', shadowImage: 'veverica_senca.png', originalImage: 'veverica.webp' },
  { id: 'vile', word: 'VILE', audioFile: 'Vile.mp3', shadowImage: 'vile_senca.png', originalImage: 'vile.webp' },
  { id: 'vitez', word: 'VITEZ', audioFile: 'Vitez.mp3', shadowImage: 'vitez_senca.png', originalImage: 'vitez.webp' },
  { id: 'volk', word: 'VOLK', audioFile: 'Volk.mp3', shadowImage: 'volk_senca.png', originalImage: 'volk.webp' },
  { id: 'volna', word: 'VOLNA', audioFile: 'Volna.mp3', shadowImage: 'volna_senca.png', originalImage: 'volna.webp' },
  { id: 'vozicek', word: 'VOZIČEK', audioFile: 'Vozicek.mp3', shadowImage: 'vozicek_senca.png', originalImage: 'vozicek.webp' },
  { id: 'vrata', word: 'VRATA', audioFile: 'Vrata.mp3', shadowImage: 'vrata_senca.png', originalImage: 'vrata.webp' },
  { id: 'vulkan', word: 'VULKAN', audioFile: 'Vulkan.mp3', shadowImage: 'vulkan_senca.png', originalImage: 'vulkan.webp' },
  { id: 'vaza', word: 'VAZA', audioFile: 'Vaza.mp3', shadowImage: 'vaza1_senca.png', originalImage: 'vaza1.webp' },
  { id: 'veja', word: 'VEJA', audioFile: 'Veja.mp3', shadowImage: 'veja1_senca.png', originalImage: 'veja1.webp' },
  { id: 'vetrnica', word: 'VETRNICA', audioFile: 'Vetrnica.mp3', shadowImage: 'veternica1_senca.png', originalImage: 'veternica1.webp' },
  { id: 'vilice', word: 'VILICE', audioFile: 'Vilice.mp3', shadowImage: 'vilica1_senca.png', originalImage: 'vilica1.webp' },
  { id: 'voda', word: 'VODA', audioFile: 'Voda.mp3', shadowImage: 'voda1_senca.png', originalImage: 'voda1.webp' },
  { id: 'volan', word: 'VOLAN', audioFile: 'Volan.mp3', shadowImage: 'volan1_senca.png', originalImage: 'volan1.webp' },
  { id: 'voz', word: 'VOZ', audioFile: 'Voz.mp3', shadowImage: 'voz1_senca.png', originalImage: 'voz1.webp' },
  { id: 'verizica', word: 'VERIŽICA', audioFile: 'Verizica.mp3', shadowImage: 'verizica1_senca.png', originalImage: 'verizica1.webp' },
  { id: 'vezalke', word: 'VEZALKE', audioFile: 'Vezalke.mp3', shadowImage: 'vezalke1_senca.png', originalImage: 'vezalke1.webp' },
  { id: 'visnja', word: 'VIŠNJA', audioFile: 'Visnja.mp3', shadowImage: 'visnja1_senca.png', originalImage: 'visnja1.webp' },
  { id: 'vrabec', word: 'VRABEC', audioFile: 'Vrabec.mp3', shadowImage: 'vrabec1_senca.png', originalImage: 'vrabec1.webp' }
];

// Four-column data for letter F
export const fourColumnMatchingDataF: FourColumnMatchingItem[] = [
  { id: 'faraon', word: 'faraon', audioFile: 'Faraon.mp3', writtenWord: 'FARAON', shadowImage: 'faraon_senca.png', originalImage: 'faraon.webp' },
  { id: 'fazan', word: 'fazan', audioFile: 'Fazan.mp3', writtenWord: 'FAZAN', shadowImage: 'fazan_senca.png', originalImage: 'fazan.webp' },
  { id: 'feferon', word: 'feferon', audioFile: 'Feferon.mp3', writtenWord: 'FEFERON', shadowImage: 'feferon_senca.png', originalImage: 'feferon.webp' },
  { id: 'figa', word: 'figa', audioFile: 'Figa.mp3', writtenWord: 'FIGA', shadowImage: 'figa_senca.png', originalImage: 'figa.webp' },
  { id: 'flavta', word: 'flavta', audioFile: 'Flavta.mp3', writtenWord: 'FLAVTA', shadowImage: 'flavta_senca.png', originalImage: 'flavta.webp' },
  { id: 'formula', word: 'formula', audioFile: 'Formula.mp3', writtenWord: 'FORMULA', shadowImage: 'formula_senca.png', originalImage: 'formula.webp' },
  { id: 'fotelj', word: 'fotelj', audioFile: 'Fotelj.mp3', writtenWord: 'FOTELJ', shadowImage: 'fotelj_senca.png', originalImage: 'fotelj.webp' },
  { id: 'fraca', word: 'frača', audioFile: 'Fraca.mp3', writtenWord: 'FRAČA', shadowImage: 'fraca_senca.png', originalImage: 'fraca.webp' },
  { id: 'frizer', word: 'frizer', audioFile: 'Frizer.mp3', writtenWord: 'FRIZER', shadowImage: 'frizer_senca.png', originalImage: 'frizer.webp' },
  { id: 'frnikola', word: 'frnikola', audioFile: 'Frnikola.mp3', writtenWord: 'FRNIKOLA', shadowImage: 'frnikola_senca.png', originalImage: 'frnikola.webp' },
  { id: 'fant', word: 'fant', audioFile: 'Fant.mp3', writtenWord: 'FANT', shadowImage: 'fant1_senca.png', originalImage: 'fant1.webp' },
  { id: 'fen', word: 'fen', audioFile: 'Fen.mp3', writtenWord: 'FEN', shadowImage: 'fen1_senca.png', originalImage: 'fen1.webp' },
  { id: 'fizol', word: 'fižol', audioFile: 'Fizol.mp3', writtenWord: 'FIŽOL', shadowImage: 'fizol1_senca.png', originalImage: 'fizol1.webp' }
];

// Four-column data for letter G
export const fourColumnMatchingDataG: FourColumnMatchingItem[] = [
  { id: 'gasilec', word: 'gasilec', audioFile: 'Gasilec.mp3', writtenWord: 'GASILEC', shadowImage: 'gasilec_senca.png', originalImage: 'gasilec.webp' },
  { id: 'glavnik', word: 'glavnik', audioFile: 'Glavnik.mp3', writtenWord: 'GLAVNIK', shadowImage: 'glavnik_senca.png', originalImage: 'glavnik.webp' },
  { id: 'golob', word: 'golob', audioFile: 'Golob.mp3', writtenWord: 'GOLOB', shadowImage: 'golob_senca.png', originalImage: 'golob.webp' },
  { id: 'gos', word: 'gos', audioFile: 'Gos.mp3', writtenWord: 'GOS', shadowImage: 'gos_senca.png', originalImage: 'gos.webp' },
  { id: 'gozdar', word: 'gozdar', audioFile: 'Gozdar.mp3', writtenWord: 'GOZDAR', shadowImage: 'gozdar_senca.png', originalImage: 'gozdar.webp' },
  { id: 'grad', word: 'grad', audioFile: 'Grad.mp3', writtenWord: 'GRAD', shadowImage: 'grad_senca.png', originalImage: 'grad.webp' },
  { id: 'grah', word: 'grah', audioFile: 'Grah.mp3', writtenWord: 'GRAH', shadowImage: 'grah_senca.png', originalImage: 'grah.webp' },
  { id: 'gugalnica', word: 'gugalnica', audioFile: 'Gugalnica.mp3', writtenWord: 'GUGALNICA', shadowImage: 'gugalnica_senca.png', originalImage: 'gugalnica.webp' },
  { id: 'gusar', word: 'gusar', audioFile: 'Gusar.mp3', writtenWord: 'GUSAR', shadowImage: 'gusar_senca.png', originalImage: 'gusar.webp' },
  { id: 'goba', word: 'goba', audioFile: 'Goba.mp3', writtenWord: 'GOBA', shadowImage: 'goba1_senca.png', originalImage: 'goba1.webp' },
  { id: 'gol', word: 'gol', audioFile: 'Gol.mp3', writtenWord: 'GOL', shadowImage: 'gol1_senca.png', originalImage: 'gol1.webp' },
  { id: 'guma', word: 'guma', audioFile: 'Guma.mp3', writtenWord: 'GUMA', shadowImage: 'guma1_senca.png', originalImage: 'guma1.webp' },
  { id: 'garaza', word: 'garaža', audioFile: 'Garaza.mp3', writtenWord: 'GARAŽA', shadowImage: 'garaza1_senca.png', originalImage: 'garaza1.webp' },
  { id: 'gnezdo', word: 'gnezdo', audioFile: 'Gnezdo.mp3', writtenWord: 'GNEZDO', shadowImage: 'gnezdo1_senca.png', originalImage: 'gnezdo1.webp' },
  { id: 'grozdje', word: 'grozdje', audioFile: 'Grozdje.mp3', writtenWord: 'GROZDJE', shadowImage: 'grozdje1_senca.png', originalImage: 'grozdje1.webp' },
  { id: 'glava', word: 'glava', audioFile: 'Glava.mp3', writtenWord: 'GLAVA', shadowImage: 'glava1_senca.png', originalImage: 'glava1.webp' }
];

// Four-column data for letter H
export const fourColumnMatchingDataH: FourColumnMatchingItem[] = [
  { id: 'harfa', word: 'harfa', audioFile: 'Harfa.mp3', writtenWord: 'HARFA', shadowImage: 'harfa_senca.png', originalImage: 'harfa.webp' },
  { id: 'harmonika', word: 'harmonika', audioFile: 'Harmonika.mp3', writtenWord: 'HARMONIKA', shadowImage: 'harmonika_senca.png', originalImage: 'harmonika.webp' },
  { id: 'helikopter', word: 'helikopter', audioFile: 'Helikopter.mp3', writtenWord: 'HELIKOPTER', shadowImage: 'helikopter_senca.png', originalImage: 'helikopter.webp' },
  { id: 'hijena', word: 'hijena', audioFile: 'Hijena.mp3', writtenWord: 'HIJENA', shadowImage: 'hijena_senca.png', originalImage: 'hijena.webp' },
  { id: 'hlev', word: 'hlev', audioFile: 'Hlev.mp3', writtenWord: 'HLEV', shadowImage: 'hlev_senca.png', originalImage: 'hlev.webp' },
  { id: 'hobotnica', word: 'hobotnica', audioFile: 'Hobotnica.mp3', writtenWord: 'HOBOTNICA', shadowImage: 'hobotnica_senca.png', originalImage: 'hobotnica.webp' },
  { id: 'hokej', word: 'hokej', audioFile: 'Hokej.mp3', writtenWord: 'HOKEJ', shadowImage: 'hokej_senca.png', originalImage: 'hokej.webp' },
  { id: 'hotel', word: 'hotel', audioFile: 'Hotel.mp3', writtenWord: 'HOTEL', shadowImage: 'hotel_senca.png', originalImage: 'hotel.webp' },
  { id: 'hrcek', word: 'hrček', audioFile: 'Hrcek.mp3', writtenWord: 'HRČEK', shadowImage: 'hrcek_senca.png', originalImage: 'hrcek.webp' },
  { id: 'hrib', word: 'hrib', audioFile: 'Hrib.mp3', writtenWord: 'HRIB', shadowImage: 'hrib_senca.png', originalImage: 'hrib.webp' },
  { id: 'hupa', word: 'hupa', audioFile: 'Hupa.mp3', writtenWord: 'HUPA', shadowImage: 'hupa_senca.png', originalImage: 'hupa.webp' },
  { id: 'hisa', word: 'hiša', audioFile: 'Hisa.mp3', writtenWord: 'HIŠA', shadowImage: 'hisa1_senca.png', originalImage: 'hisa1.webp' },
  { id: 'hlace', word: 'hlače', audioFile: 'Hlace.mp3', writtenWord: 'HLAČE', shadowImage: 'hlace1_senca.png', originalImage: 'hlace1.webp' },
  { id: 'hruska', word: 'hruška', audioFile: 'Hruska.mp3', writtenWord: 'HRUŠKA', shadowImage: 'hruska1_senca.png', originalImage: 'hruska1.webp' }
];

// Four-column data for letter V
export const fourColumnMatchingDataV: FourColumnMatchingItem[] = [
  { id: 'vafelj', word: 'vafelj', audioFile: 'Vafelj.mp3', writtenWord: 'VAFELJ', shadowImage: 'vafelj_senca.png', originalImage: 'vafelj.webp' },
  { id: 'vedro', word: 'vedro', audioFile: 'Vedro.mp3', writtenWord: 'VEDRO', shadowImage: 'vedro_senca.png', originalImage: 'vedro.webp' },
  { id: 'veslo', word: 'veslo', audioFile: 'Veslo.mp3', writtenWord: 'VESLO', shadowImage: 'veslo_senca.png', originalImage: 'veslo.webp' },
  { id: 'veverica', word: 'veverica', audioFile: 'Veverica.mp3', writtenWord: 'VEVERICA', shadowImage: 'veverica_senca.png', originalImage: 'veverica.webp' },
  { id: 'vile', word: 'vile', audioFile: 'Vile.mp3', writtenWord: 'VILE', shadowImage: 'vile_senca.png', originalImage: 'vile.webp' },
  { id: 'vitez', word: 'vitez', audioFile: 'Vitez.mp3', writtenWord: 'VITEZ', shadowImage: 'vitez_senca.png', originalImage: 'vitez.webp' },
  { id: 'volk', word: 'volk', audioFile: 'Volk.mp3', writtenWord: 'VOLK', shadowImage: 'volk_senca.png', originalImage: 'volk.webp' },
  { id: 'volna', word: 'volna', audioFile: 'Volna.mp3', writtenWord: 'VOLNA', shadowImage: 'volna_senca.png', originalImage: 'volna.webp' },
  { id: 'vozicek', word: 'voziček', audioFile: 'Vozicek.mp3', writtenWord: 'VOZIČEK', shadowImage: 'vozicek_senca.png', originalImage: 'vozicek.webp' },
  { id: 'vrata', word: 'vrata', audioFile: 'Vrata.mp3', writtenWord: 'VRATA', shadowImage: 'vrata_senca.png', originalImage: 'vrata.webp' },
  { id: 'vulkan', word: 'vulkan', audioFile: 'Vulkan.mp3', writtenWord: 'VULKAN', shadowImage: 'vulkan_senca.png', originalImage: 'vulkan.webp' },
  { id: 'vaza', word: 'vaza', audioFile: 'Vaza.mp3', writtenWord: 'VAZA', shadowImage: 'vaza1_senca.png', originalImage: 'vaza1.webp' },
  { id: 'veja', word: 'veja', audioFile: 'Veja.mp3', writtenWord: 'VEJA', shadowImage: 'veja1_senca.png', originalImage: 'veja1.webp' },
  { id: 'vetrnica', word: 'vetrnica', audioFile: 'Vetrnica.mp3', writtenWord: 'VETRNICA', shadowImage: 'veternica1_senca.png', originalImage: 'veternica1.webp' },
  { id: 'vilice', word: 'vilice', audioFile: 'Vilice.mp3', writtenWord: 'VILICE', shadowImage: 'vilica1_senca.png', originalImage: 'vilica1.webp' },
  { id: 'voda', word: 'voda', audioFile: 'Voda.mp3', writtenWord: 'VODA', shadowImage: 'voda1_senca.png', originalImage: 'voda1.webp' },
  { id: 'volan', word: 'volan', audioFile: 'Volan.mp3', writtenWord: 'VOLAN', shadowImage: 'volan1_senca.png', originalImage: 'volan1.webp' },
  { id: 'voz', word: 'voz', audioFile: 'Voz.mp3', writtenWord: 'VOZ', shadowImage: 'voz1_senca.png', originalImage: 'voz1.webp' },
  { id: 'verizica', word: 'verižica', audioFile: 'Verizica.mp3', writtenWord: 'VERIŽICA', shadowImage: 'verizica1_senca.png', originalImage: 'verizica1.webp' },
  { id: 'vezalke', word: 'vezalke', audioFile: 'Vezalke.mp3', writtenWord: 'VEZALKE', shadowImage: 'vezalke1_senca.png', originalImage: 'vezalke1.webp' },
  { id: 'visnja', word: 'višnja', audioFile: 'Visnja.mp3', writtenWord: 'VIŠNJA', shadowImage: 'visnja1_senca.png', originalImage: 'visnja1.webp' },
  { id: 'vrabec', word: 'vrabec', audioFile: 'Vrabec.mp3', writtenWord: 'VRABEC', shadowImage: 'vrabec1_senca.png', originalImage: 'vrabec1.webp' }
];

// Function to get letter-specific data
export function getLetterMatchingData(letter: string): ThreeColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return threeColumnMatchingDataC;
    case 'č':
      return threeColumnMatchingDataČ;
    case 'f':
      return threeColumnMatchingDataF;
    case 'g':
      return threeColumnMatchingDataG;
    case 'h':
      return threeColumnMatchingDataH;
    case 'k':
      return threeColumnMatchingDataK;
    case 'l':
      return threeColumnMatchingDataL;
    case 'r':
      return threeColumnMatchingDataR;
    case 's':
      return threeColumnMatchingDataS;
    case 'š':
      return threeColumnMatchingDataŠ;
    case 'v':
      return threeColumnMatchingDataV;
    case 'z':
      return threeColumnMatchingDataZ;
    case 'ž':
      return threeColumnMatchingDataŽ;
    default:
      return threeColumnMatchingDataC; // Fallback to C
  }
}

// Function to get letter-specific four-column data
export function getFourColumnLetterData(letter: string): FourColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return fourColumnMatchingDataC;
    case 'č':
      return fourColumnMatchingDataČ;
    case 'f':
      return fourColumnMatchingDataF;
    case 'g':
      return fourColumnMatchingDataG;
    case 'h':
      return fourColumnMatchingDataH;
    case 'k':
      return fourColumnMatchingDataK;
    case 'l':
      return fourColumnMatchingDataL;
    case 'r':
      return fourColumnMatchingDataR;
    case 's':
      return fourColumnMatchingDataS;
    case 'š':
      return fourColumnMatchingDataŠ;
    case 'v':
      return fourColumnMatchingDataV;
    case 'z':
      return fourColumnMatchingDataZ;
    case 'ž':
      return fourColumnMatchingDataŽ;
    default:
      return fourColumnMatchingDataC; // Fallback to C
  }
}

export function getRandomThreeColumnItems(count: number = 4, letter?: string): ThreeColumnMatchingItem[] {
  const data = letter ? getLetterMatchingData(letter) : threeColumnMatchingDataC;
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function getRandomFourColumnItems(count: number = 4, letter?: string): FourColumnMatchingItem[] {
  const data = letter ? getFourColumnLetterData(letter) : fourColumnMatchingDataC;
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
