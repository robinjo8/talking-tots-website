export interface ThreeColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .m4a file in zvocni-posnetki bucket
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .webp file in slike bucket
}

export interface FourColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .m4a file in zvocni-posnetki bucket
  writtenWord: string; // Written word in uppercase
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .webp file in slike bucket
}

// Only words starting with letter C - as per user specifications
export const threeColumnMatchingDataC: ThreeColumnMatchingItem[] = [
  { id: 'cedilo', word: 'CEDILO', audioFile: 'cedilo.m4a', shadowImage: 'cedilo1_senca.png', originalImage: 'cedilo1.webp' },
  { id: 'cekin', word: 'CEKIN', audioFile: 'cekin.m4a', shadowImage: 'cekin1_senca.png', originalImage: 'cekin1.webp' },
  { id: 'cerkev', word: 'CERKEV', audioFile: 'cerkev.m4a', shadowImage: 'cerkev1_senca.png', originalImage: 'cerkev1.webp' },
  { id: 'cesta', word: 'CESTA', audioFile: 'cesta.m4a', shadowImage: 'cesta1_senca.png', originalImage: 'cesta1.webp' },
  { id: 'cev', word: 'CEV', audioFile: 'cev.m4a', shadowImage: 'cev1_senca.png', originalImage: 'cev1.webp' },
  { id: 'cirkus', word: 'CIRKUS', audioFile: 'cirkus.m4a', shadowImage: 'cirkus1_senca.png', originalImage: 'cirkus1.webp' },
  { id: 'cisterna', word: 'CISTERNA', audioFile: 'cisterna.m4a', shadowImage: 'cisterna1_senca.png', originalImage: 'cisterna1.webp' },
  { id: 'cokla', word: 'COKLA', audioFile: 'cokla.m4a', shadowImage: 'cokla1_senca.png', originalImage: 'cokla1.webp' },
  { id: 'copat', word: 'COPAT', audioFile: 'copat.m4a', shadowImage: 'copat1_senca.png', originalImage: 'copat1.webp' },
  { id: 'cvet', word: 'CVET', audioFile: 'cvet.m4a', shadowImage: 'cvet1_senca.png', originalImage: 'cvet1.webp' }
];

// Data for letter Č
export const threeColumnMatchingDataČ: ThreeColumnMatchingItem[] = [
  { id: 'caj', word: 'ČAJ', audioFile: 'caj.m4a', shadowImage: 'caj1_senca.png', originalImage: 'caj1.webp' },
  { id: 'carovnik', word: 'ČAROVNIK', audioFile: 'carovnik.m4a', shadowImage: 'carovnik1_senca.png', originalImage: 'carovnik1.webp' },
  { id: 'casopis', word: 'ČASOPIS', audioFile: 'casopis.m4a', shadowImage: 'casopis1_senca.png', originalImage: 'casopis1.webp' },
  { id: 'cebela', word: 'ČEBELA', audioFile: 'cebela.m4a', shadowImage: 'cebela1_senca.png', originalImage: 'cebela1.webp' },
  { id: 'cebelar', word: 'ČEBELAR', audioFile: 'cebelar.m4a', shadowImage: 'cebelar1_senca.png', originalImage: 'cebelar1.webp' },
  { id: 'cebula', word: 'ČEBULA', audioFile: 'cebula.m4a', shadowImage: 'cebula1_senca.png', originalImage: 'cebula1.webp' },
  { id: 'cesen', word: 'ČESEN', audioFile: 'cesen.m4a', shadowImage: 'cesen1_senca.png', originalImage: 'cesen1.webp' },
  { id: 'cevlji', word: 'ČEVLJI', audioFile: 'cevlji.m4a', shadowImage: 'cevlji1_senca.png', originalImage: 'cevlji1.webp' },
  { id: 'cokolada', word: 'ČOKOLADA', audioFile: 'cokolada.m4a', shadowImage: 'cokolada1_senca.png', originalImage: 'cokolada1.webp' },
  { id: 'coln', word: 'ČOLN', audioFile: 'coln.m4a', shadowImage: 'coln1_senca.png', originalImage: 'coln1.webp' },
  { id: 'copic', word: 'ČOPIČ', audioFile: 'copic.m4a', shadowImage: 'copic1_senca.png', originalImage: 'copic1.webp' },
  { id: 'crke', word: 'ČRKE', audioFile: 'crke.m4a', shadowImage: 'crke1_senca.png', originalImage: 'crke1.webp' }
];

// Data for letter K
export const threeColumnMatchingDataK: ThreeColumnMatchingItem[] = [
  { id: 'kaca', word: 'KAČA', audioFile: 'kaca.m4a', shadowImage: 'kaca1_senca.png', originalImage: 'kaca1.webp' },
  { id: 'kapa', word: 'KAPA', audioFile: 'kapa.m4a', shadowImage: 'kapa1_senca.png', originalImage: 'kapa1.webp' },
  { id: 'kava', word: 'KAVA', audioFile: 'kava.m4a', shadowImage: 'kava1_senca.png', originalImage: 'kava1.webp' },
  { id: 'klavir', word: 'KLAVIR', audioFile: 'klavir.m4a', shadowImage: 'klavir1_senca.png', originalImage: 'klavir1.webp' },
  { id: 'kljuc', word: 'KLJUČ', audioFile: 'kljuc.m4a', shadowImage: 'kljuc1_senca.png', originalImage: 'kljuc1.webp' },
  { id: 'klop', word: 'KLOP', audioFile: 'klop.m4a', shadowImage: 'klop1_senca.png', originalImage: 'klop1.webp' },
  { id: 'knjiga', word: 'KNJIGA', audioFile: 'knjiga.m4a', shadowImage: 'knjiga1_senca.png', originalImage: 'knjiga1.webp' },
  { id: 'kocka', word: 'KOCKA', audioFile: 'kocka.m4a', shadowImage: 'kocka1_senca.png', originalImage: 'kocka1.webp' },
  { id: 'kokos_sadez', word: 'KOKOS', audioFile: 'kokos_sadez.m4a', shadowImage: 'kokos_sadez1_senca.png', originalImage: 'kokos_sadez1.webp' },
  { id: 'kokos', word: 'KOKOŠ', audioFile: 'kokos_1.m4a', shadowImage: 'kokos1_senca.png', originalImage: 'kokos1.webp' },
  { id: 'kolac', word: 'KOLAČ', audioFile: 'kolac.m4a', shadowImage: 'kolac1_senca.png', originalImage: 'kolac1.webp' },
  { id: 'kolo', word: 'KOLO', audioFile: 'kolo.m4a', shadowImage: 'kolo1_senca.png', originalImage: 'kolo1.webp' },
  { id: 'koruza', word: 'KORUZA', audioFile: 'koruza.m4a', shadowImage: 'koruza1_senca.png', originalImage: 'koruza1.webp' },
  { id: 'kost', word: 'KOST', audioFile: 'kost.m4a', shadowImage: 'kost1_senca.png', originalImage: 'kost1.webp' },
  { id: 'kos', word: 'KOŠ', audioFile: 'kos.m4a', shadowImage: 'kos1_senca.png', originalImage: 'kos1.webp' },
  { id: 'kosara', word: 'KOŠARA', audioFile: 'kosara.m4a', shadowImage: 'kosara1_senca.png', originalImage: 'kosara1.webp' },
  { id: 'koza', word: 'KOZA', audioFile: 'koza.m4a', shadowImage: 'koza1_senca.png', originalImage: 'koza1.webp' },
  { id: 'kozarec', word: 'KOZAREC', audioFile: 'kozarec.m4a', shadowImage: 'kozarec1_senca.png', originalImage: 'kozarec1.webp' },
  { id: 'koza_skin', word: 'KOŽA', audioFile: 'koza_skin.m4a', shadowImage: 'koza_skin1_senca.png', originalImage: 'koza_skin1.webp' },
  { id: 'krava', word: 'KRAVA', audioFile: 'krava.m4a', shadowImage: 'krava1_senca.png', originalImage: 'krava1.webp' },
  { id: 'krof', word: 'KROF', audioFile: 'krof.m4a', shadowImage: 'krof1_senca.png', originalImage: 'krof1.webp' },
  { id: 'krog', word: 'KROG', audioFile: 'krog.m4a', shadowImage: 'krog1_senca.png', originalImage: 'krog1.webp' },
  { id: 'kroznik', word: 'KROŽNIK', audioFile: 'kroznik.m4a', shadowImage: 'kroznik1_senca.png', originalImage: 'kroznik1.webp' },
  { id: 'kruh', word: 'KRUH', audioFile: 'kruh.m4a', shadowImage: 'kruh1_senca.png', originalImage: 'kruh1.webp' },
  { id: 'kumara', word: 'KUMARA', audioFile: 'kumara.m4a', shadowImage: 'kumara1_senca.png', originalImage: 'kumara1.webp' },
  { id: 'kuza', word: 'KUŽA', audioFile: 'kuza.m4a', shadowImage: 'kuza1_senca.png', originalImage: 'kuza1.webp' }
];

// Data for letter L
export const threeColumnMatchingDataL: ThreeColumnMatchingItem[] = [
  { id: 'ladja', word: 'LADJA', audioFile: 'ladja.m4a', shadowImage: 'ladja1_senca.png', originalImage: 'ladja1.webp' },
  { id: 'lasje', word: 'LASJE', audioFile: 'lasje.m4a', shadowImage: 'lasje1_senca.png', originalImage: 'lasje1.webp' },
  { id: 'led', word: 'LED', audioFile: 'led.m4a', shadowImage: 'led1_senca.png', originalImage: 'led1.webp' },
  { id: 'les', word: 'LES', audioFile: 'les.m4a', shadowImage: 'les1_senca.png', originalImage: 'les1.webp' },
  { id: 'lesnik', word: 'LEŠNIK', audioFile: 'lesnik.m4a', shadowImage: 'lesnik1_senca.png', originalImage: 'lesnik1.webp' },
  { id: 'letalo', word: 'LETALO', audioFile: 'letalo.m4a', shadowImage: 'letalo1_senca.png', originalImage: 'letalo1.webp' },
  { id: 'lev', word: 'LEV', audioFile: 'lev.m4a', shadowImage: 'lev1_senca.png', originalImage: 'lev1.webp' },
  { id: 'lisica', word: 'LISICA', audioFile: 'lisica.m4a', shadowImage: 'lisica1_senca.png', originalImage: 'lisica1.webp' },
  { id: 'list', word: 'LIST', audioFile: 'list.m4a', shadowImage: 'list1_senca.png', originalImage: 'list1.webp' },
  { id: 'lizika', word: 'LIZIKA', audioFile: 'lizika.m4a', shadowImage: 'lizika1_senca.png', originalImage: 'lizika1.webp' },
  { id: 'lonec', word: 'LONEC', audioFile: 'lonec.m4a', shadowImage: 'lonec1_senca.png', originalImage: 'lonec1.webp' },
  { id: 'lopar', word: 'LOPAR', audioFile: 'lopar.m4a', shadowImage: 'lopar1_senca.png', originalImage: 'lopar1.webp' },
  { id: 'lovec', word: 'LOVEC', audioFile: 'lovec.m4a', shadowImage: 'lovec1_senca.png', originalImage: 'lovec1.webp' },
  { id: 'lubenica', word: 'LUBENICA', audioFile: 'lubenica.m4a', shadowImage: 'lubenica1_senca.png', originalImage: 'lubenica1.webp' },
  { id: 'luc', word: 'LUČ', audioFile: 'luc.m4a', shadowImage: 'luc1_senca.png', originalImage: 'luc1.webp' },
  { id: 'luza', word: 'LUŽA', audioFile: 'luza.m4a', shadowImage: 'luza1_senca.png', originalImage: 'luza1.webp' }
];

// Data for letter R
export const threeColumnMatchingDataR: ThreeColumnMatchingItem[] = [
  { id: 'raca', word: 'RACA', audioFile: 'raca.m4a', shadowImage: 'raca1_senca.png', originalImage: 'raca1.webp' },
  { id: 'rak', word: 'RAK', audioFile: 'rak.m4a', shadowImage: 'rak1_senca.png', originalImage: 'rak1.webp' },
  { id: 'raketa', word: 'RAKETA', audioFile: 'raketa.m4a', shadowImage: 'raketa1_senca.png', originalImage: 'raketa1.webp' },
  { id: 'ravnilo', word: 'RAVNILO', audioFile: 'ravnilo.m4a', shadowImage: 'ravnilo1_senca.png', originalImage: 'ravnilo1.webp' },
  { id: 'rep', word: 'REP', audioFile: 'rep.m4a', shadowImage: 'rep1_senca.png', originalImage: 'rep1.webp' },
  { id: 'repa', word: 'REPA', audioFile: 'repa.m4a', shadowImage: 'repa1_senca.png', originalImage: 'repa1.webp' },
  { id: 'riba', word: 'RIBA', audioFile: 'riba.m4a', shadowImage: 'riba1_senca.png', originalImage: 'riba1.webp' },
  { id: 'ribez', word: 'RIBEZ', audioFile: 'ribez.m4a', shadowImage: 'ribez1_senca.png', originalImage: 'ribez1.webp' },
  { id: 'ribic', word: 'RIBIČ', audioFile: 'ribic.m4a', shadowImage: 'ribic1_senca.png', originalImage: 'ribic1.webp' },
  { id: 'ris', word: 'RIS', audioFile: 'ris.m4a', shadowImage: 'ris1_senca.png', originalImage: 'ris1.webp' },
  { id: 'riz', word: 'RIŽ', audioFile: 'riz.m4a', shadowImage: 'riz1_senca.png', originalImage: 'riz1.webp' },
  { id: 'robot', word: 'ROBOT', audioFile: 'robot.m4a', shadowImage: 'robot1_senca.png', originalImage: 'robot1.webp' },
  { id: 'roka', word: 'ROKA', audioFile: 'roka.m4a', shadowImage: 'roka1_senca.png', originalImage: 'roka1.webp' },
  { id: 'rokometas', word: 'ROKOMETAŠ', audioFile: 'rokometas.m4a', shadowImage: 'rokometas1_senca.png', originalImage: 'rokometas1.webp' },
  { id: 'rolka', word: 'ROLKA', audioFile: 'rolka.m4a', shadowImage: 'rolka1_senca.png', originalImage: 'rolka1.webp' },
  { id: 'ropotuljica', word: 'ROPOTULJICA', audioFile: 'ropotuljica.m4a', shadowImage: 'ropotuljica1_senca.png', originalImage: 'ropotuljica1.webp' },
  { id: 'roza', word: 'ROŽA', audioFile: 'roza.m4a', shadowImage: 'roza1_senca.png', originalImage: 'roza1.webp' }
];

// Data for letter S
export const threeColumnMatchingDataS: ThreeColumnMatchingItem[] = [
  { id: 'sedem', word: 'SEDEM', audioFile: 'sedem.m4a', shadowImage: 'sedem1_senca.png', originalImage: 'sedem1.webp' },
  { id: 'sir', word: 'SIR', audioFile: 'sir.m4a', shadowImage: 'sir1_senca.png', originalImage: 'sir1.webp' },
  { id: 'sladoled', word: 'SLADOLED', audioFile: 'sladoled.m4a', shadowImage: 'sladoled1_senca.png', originalImage: 'sladoled1.webp' },
  { id: 'slika', word: 'SLIKA', audioFile: 'slika.m4a', shadowImage: 'slika1_senca.png', originalImage: 'slika1.webp' },
  { id: 'slon', word: 'SLON', audioFile: 'slon.m4a', shadowImage: 'slon1_senca.png', originalImage: 'slon1.webp' },
  { id: 'sluz', word: 'SLUZ', audioFile: 'sluz.m4a', shadowImage: 'sluz1_senca.png', originalImage: 'sluz1.webp' },
  { id: 'smreka', word: 'SMREKA', audioFile: 'smreka.m4a', shadowImage: 'smreka1_senca.png', originalImage: 'smreka1.webp' },
  { id: 'sneg', word: 'SNEG', audioFile: 'sneg.m4a', shadowImage: 'sneg1_senca.png', originalImage: 'sneg1.webp' },
  { id: 'snezak', word: 'SNEŽAK', audioFile: 'snezak.m4a', shadowImage: 'snezak1_senca.png', originalImage: 'snezak1.webp' },
  { id: 'snezinka', word: 'SNEŽINKA', audioFile: 'snezinka.m4a', shadowImage: 'snezinka1_senca.png', originalImage: 'snezinka1.webp' },
  { id: 'sok', word: 'SOK', audioFile: 'sok.m4a', shadowImage: 'sok1_senca.png', originalImage: 'sok1.webp' },
  { id: 'sonce', word: 'SONCE', audioFile: 'sonce.m4a', shadowImage: 'sonce1_senca.png', originalImage: 'sonce1.webp' },
  { id: 'sova', word: 'SOVA', audioFile: 'sova.m4a', shadowImage: 'sova1_senca.png', originalImage: 'sova1.webp' },
  { id: 'stol', word: 'STOL', audioFile: 'stol.m4a', shadowImage: 'stol1_senca.png', originalImage: 'stol1.webp' },
  { id: 'svetilka', word: 'SVETILKA', audioFile: 'svetilka.m4a', shadowImage: 'svetilka1_senca.png', originalImage: 'svetilka1.webp' },
  { id: 'svincnik', word: 'SVINČNIK', audioFile: 'svincnik.m4a', shadowImage: 'svincnik1_senca.png', originalImage: 'svincnik1.webp' }
];

// Data for letter Š
export const threeColumnMatchingDataŠ: ThreeColumnMatchingItem[] = [
  { id: 'sah', word: 'ŠAH', audioFile: 'sah.m4a', shadowImage: 'sah1_senca.png', originalImage: 'sah1.webp' },
  { id: 'sal', word: 'ŠAL', audioFile: 'sal.m4a', shadowImage: 'sal1_senca.png', originalImage: 'sal1.webp' },
  { id: 'scetka', word: 'ŠČETKA', audioFile: 'scetka.m4a', shadowImage: 'scetka1_senca.png', originalImage: 'scetka1.webp' },
  { id: 'skarje', word: 'ŠKARJE', audioFile: 'skarje.m4a', shadowImage: 'skarje1_senca.png', originalImage: 'skarje1.webp' },
  { id: 'skatla', word: 'ŠKATLA', audioFile: 'skatla.m4a', shadowImage: 'skatla1_senca.png', originalImage: 'skatla1.webp' },
  { id: 'skoljka', word: 'ŠKOLJKA', audioFile: 'skoljka.m4a', shadowImage: 'skoljka1_senca.png', originalImage: 'skoljka1.webp' },
  { id: 'sofer', word: 'ŠOFER', audioFile: 'sofer.m4a', shadowImage: 'sofer1_senca.png', originalImage: 'sofer1.webp' },
  { id: 'sopek', word: 'ŠOPEK', audioFile: 'sopek.m4a', shadowImage: 'sopek1_senca.png', originalImage: 'sopek1.webp' },
  { id: 'sotor', word: 'ŠOTOR', audioFile: 'sotor.m4a', shadowImage: 'sotor1_senca.png', originalImage: 'sotor1.webp' },
  { id: 'stampiljka', word: 'ŠTAMPILJKA', audioFile: 'stampiljka.m4a', shadowImage: 'stampiljka1_senca.png', originalImage: 'stampiljka1.webp' },
  { id: 'storklja', word: 'ŠTORKLJA', audioFile: 'storklja.m4a', shadowImage: 'storklja1_senca.png', originalImage: 'storklja1.webp' }
];

// Data for letter Z
export const threeColumnMatchingDataZ: ThreeColumnMatchingItem[] = [
  { id: 'zajec', word: 'ZAJEC', audioFile: 'zajec.m4a', shadowImage: 'zajec1_senca.png', originalImage: 'zajec1.webp' },
  { id: 'zaslon', word: 'ZASLON', audioFile: 'zaslon.m4a', shadowImage: 'zaslon1_senca.png', originalImage: 'zaslon1.webp' },
  { id: 'zavesa', word: 'ZAVESA', audioFile: 'zavesa.m4a', shadowImage: 'zavesa1_senca.png', originalImage: 'zavesa1.webp' },
  { id: 'zebra', word: 'ZEBRA', audioFile: 'zebra.m4a', shadowImage: 'zebra1_senca.png', originalImage: 'zebra1.webp' },
  { id: 'zlato', word: 'ZLATO', audioFile: 'zlato.m4a', shadowImage: 'zlato1_senca.png', originalImage: 'zlato1.webp' },
  { id: 'zmaj', word: 'ZMAJ', audioFile: 'zmaj.m4a', shadowImage: 'zmaj1_senca.png', originalImage: 'zmaj1.webp' },
  { id: 'zob', word: 'ZOB', audioFile: 'zob.m4a', shadowImage: 'zob1_senca.png', originalImage: 'zob1.webp' },
  { id: 'zobotrebec', word: 'ZOBOTREBEC', audioFile: 'zobotrebec.m4a', shadowImage: 'zobotrebec1_senca.png', originalImage: 'zobotrebec1.webp' },
  { id: 'zvezda', word: 'ZVEZDA', audioFile: 'zvezda.m4a', shadowImage: 'zvezda1_senca.png', originalImage: 'zvezda1.webp' },
  { id: 'zvezek', word: 'ZVEZEK', audioFile: 'zvezek.m4a', shadowImage: 'zvezek1_senca.png', originalImage: 'zvezek1.webp' },
  { id: 'zvocnik', word: 'ZVOČNIK', audioFile: 'zvocnik.m4a', shadowImage: 'zvocnik1_senca.png', originalImage: 'zvocnik1.webp' }
];

// Data for letter Ž
export const threeColumnMatchingDataŽ: ThreeColumnMatchingItem[] = [
  { id: 'zaba', word: 'ŽABA', audioFile: 'zaba.m4a', shadowImage: 'zaba1_senca.png', originalImage: 'zaba1.webp' },
  { id: 'zaga', word: 'ŽAGA', audioFile: 'zaga.m4a', shadowImage: 'zaga1_senca.png', originalImage: 'zaga1.webp' },
  { id: 'zarnica', word: 'ŽARNICA', audioFile: 'zarnica.m4a', shadowImage: 'zarnica1_senca.png', originalImage: 'zarnica1.webp' },
  { id: 'zebelj', word: 'ŽEBELJ', audioFile: 'zebelj.m4a', shadowImage: 'zebelj1_senca.png', originalImage: 'zebelj1.webp' },
  { id: 'zelva', word: 'ŽELVA', audioFile: 'zelva.m4a', shadowImage: 'zelva1_senca.png', originalImage: 'zelva1.webp' },
  { id: 'zerjav', word: 'ŽERJAV', audioFile: 'zerjav.m4a', shadowImage: 'zerjav1_senca.png', originalImage: 'zerjav1.webp' },
  { id: 'zirafa', word: 'ŽIRAFA', audioFile: 'zirafa.m4a', shadowImage: 'zirafa1_senca.png', originalImage: 'zirafa1.webp' },
  { id: 'zlica', word: 'ŽLICA', audioFile: 'zlica.m4a', shadowImage: 'zlica1_senca.png', originalImage: 'zlica1.webp' },
  { id: 'zoga', word: 'ŽOGA', audioFile: 'zoga.m4a', shadowImage: 'zoga1_senca.png', originalImage: 'zoga1.webp' },
  { id: 'zolna', word: 'ŽOLNA', audioFile: 'zolna.m4a', shadowImage: 'zolna1_senca.png', originalImage: 'zolna1.webp' }
];

// Four-column data for 7-8 age group (letter C)
export const fourColumnMatchingDataC: FourColumnMatchingItem[] = [
  { id: 'cedilo', word: 'cedilo', audioFile: 'cedilo.m4a', writtenWord: 'CEDILO', shadowImage: 'cedilo1_senca.png', originalImage: 'cedilo1.webp' },
  { id: 'cekin', word: 'cekin', audioFile: 'cekin.m4a', writtenWord: 'CEKIN', shadowImage: 'cekin1_senca.png', originalImage: 'cekin1.webp' },
  { id: 'cerkev', word: 'cerkev', audioFile: 'cerkev.m4a', writtenWord: 'CERKEV', shadowImage: 'cerkev1_senca.png', originalImage: 'cerkev1.webp' },
  { id: 'cesta', word: 'cesta', audioFile: 'cesta.m4a', writtenWord: 'CESTA', shadowImage: 'cesta1_senca.png', originalImage: 'cesta1.webp' },
  { id: 'cev', word: 'cev', audioFile: 'cev.m4a', writtenWord: 'CEV', shadowImage: 'cev1_senca.png', originalImage: 'cev1.webp' },
  { id: 'cirkus', word: 'cirkus', audioFile: 'cirkus.m4a', writtenWord: 'CIRKUS', shadowImage: 'cirkus1_senca.png', originalImage: 'cirkus1.webp' },
  { id: 'cisterna', word: 'cisterna', audioFile: 'cisterna.m4a', writtenWord: 'CISTERNA', shadowImage: 'cisterna1_senca.png', originalImage: 'cisterna1.webp' },
  { id: 'cokla', word: 'cokla', audioFile: 'cokla.m4a', writtenWord: 'COKLA', shadowImage: 'cokla1_senca.png', originalImage: 'cokla1.webp' },
  { id: 'copat', word: 'copat', audioFile: 'copat.m4a', writtenWord: 'COPAT', shadowImage: 'copat1_senca.png', originalImage: 'copat1.webp' },
  { id: 'cvet', word: 'cvet', audioFile: 'cvet.m4a', writtenWord: 'CVET', shadowImage: 'cvet1_senca.png', originalImage: 'cvet1.webp' }
];

// Four-column data for letter Č
export const fourColumnMatchingDataČ: FourColumnMatchingItem[] = [
  { id: 'caj', word: 'čaj', audioFile: 'caj.m4a', writtenWord: 'ČAJ', shadowImage: 'caj1_senca.png', originalImage: 'caj1.webp' },
  { id: 'casopis', word: 'časopis', audioFile: 'casopis.m4a', writtenWord: 'ČASOPIS', shadowImage: 'casopis1_senca.png', originalImage: 'casopis1.webp' },
  { id: 'cebela', word: 'čebela', audioFile: 'cebela.m4a', writtenWord: 'ČEBELA', shadowImage: 'cebela1_senca.png', originalImage: 'cebela1.webp' },
  { id: 'cebula', word: 'čebula', audioFile: 'cebula.m4a', writtenWord: 'ČEBULA', shadowImage: 'cebula1_senca.png', originalImage: 'cebula1.webp' },
  { id: 'cesen', word: 'česen', audioFile: 'cesen.m4a', writtenWord: 'ČESEN', shadowImage: 'cesen1_senca.png', originalImage: 'cesen1.webp' },
  { id: 'cevlji', word: 'čevlji', audioFile: 'cevlji.m4a', writtenWord: 'ČEVLJI', shadowImage: 'cevlji1_senca.png', originalImage: 'cevlji1.webp' },
  { id: 'cokolada', word: 'čokolada', audioFile: 'cokolada.m4a', writtenWord: 'ČOKOLADA', shadowImage: 'cokolada1_senca.png', originalImage: 'cokolada1.webp' },
  { id: 'coln', word: 'čoln', audioFile: 'coln.m4a', writtenWord: 'ČOLN', shadowImage: 'coln1_senca.png', originalImage: 'coln1.webp' },
  { id: 'copic', word: 'čopič', audioFile: 'copic.m4a', writtenWord: 'ČOPIČ', shadowImage: 'copic1_senca.png', originalImage: 'copic1.webp' },
  { id: 'crke', word: 'črke', audioFile: 'crke.m4a', writtenWord: 'ČRKE', shadowImage: 'crke1_senca.png', originalImage: 'crke1.webp' }
];

// Four-column data for letter K
export const fourColumnMatchingDataK: FourColumnMatchingItem[] = [
  { id: 'kaca', word: 'kača', audioFile: 'kaca.m4a', writtenWord: 'KAČA', shadowImage: 'kaca1_senca.png', originalImage: 'kaca1.webp' },
  { id: 'kapa', word: 'kapa', audioFile: 'kapa.m4a', writtenWord: 'KAPA', shadowImage: 'kapa1_senca.png', originalImage: 'kapa1.webp' },
  { id: 'kava', word: 'kava', audioFile: 'kava.m4a', writtenWord: 'KAVA', shadowImage: 'kava1_senca.png', originalImage: 'kava1.webp' },
  { id: 'klavir', word: 'klavir', audioFile: 'klavir.m4a', writtenWord: 'KLAVIR', shadowImage: 'klavir1_senca.png', originalImage: 'klavir1.webp' },
  { id: 'kljuc', word: 'ključ', audioFile: 'kljuc.m4a', writtenWord: 'KLJUČ', shadowImage: 'kljuc1_senca.png', originalImage: 'kljuc1.webp' },
  { id: 'klop', word: 'klop', audioFile: 'klop.m4a', writtenWord: 'KLOP', shadowImage: 'klop1_senca.png', originalImage: 'klop1.webp' },
  { id: 'knjiga', word: 'knjiga', audioFile: 'knjiga.m4a', writtenWord: 'KNJIGA', shadowImage: 'knjiga1_senca.png', originalImage: 'knjiga1.webp' },
  { id: 'kocka', word: 'kocka', audioFile: 'kocka.m4a', writtenWord: 'KOCKA', shadowImage: 'kocka1_senca.png', originalImage: 'kocka1.webp' },
  { id: 'kokos_sadez', word: 'kokos', audioFile: 'kokos_sadez.m4a', writtenWord: 'KOKOS', shadowImage: 'kokos_sadez1_senca.png', originalImage: 'kokos_sadez1.webp' },
  { id: 'kokos', word: 'kokoš', audioFile: 'kokos_1.m4a', writtenWord: 'KOKOŠ', shadowImage: 'kokos1_senca.png', originalImage: 'kokos1.webp' },
  { id: 'kolac', word: 'kolač', audioFile: 'kolac.m4a', writtenWord: 'KOLAČ', shadowImage: 'kolac1_senca.png', originalImage: 'kolac1.webp' },
  { id: 'kolo', word: 'kolo', audioFile: 'kolo.m4a', writtenWord: 'KOLO', shadowImage: 'kolo1_senca.png', originalImage: 'kolo1.webp' },
  { id: 'koruza', word: 'koruza', audioFile: 'koruza.m4a', writtenWord: 'KORUZA', shadowImage: 'koruza1_senca.png', originalImage: 'koruza1.webp' },
  { id: 'kost', word: 'kost', audioFile: 'kost.m4a', writtenWord: 'KOST', shadowImage: 'kost1_senca.png', originalImage: 'kost1.webp' },
  { id: 'kos', word: 'koš', audioFile: 'kos.m4a', writtenWord: 'KOŠ', shadowImage: 'kos1_senca.png', originalImage: 'kos1.webp' },
  { id: 'kosara', word: 'košara', audioFile: 'kosara.m4a', writtenWord: 'KOŠARA', shadowImage: 'kosara1_senca.png', originalImage: 'kosara1.webp' },
  { id: 'koza', word: 'koza', audioFile: 'koza.m4a', writtenWord: 'KOZA', shadowImage: 'koza1_senca.png', originalImage: 'koza1.webp' },
  { id: 'kozarec', word: 'kozarec', audioFile: 'kozarec.m4a', writtenWord: 'KOZAREC', shadowImage: 'kozarec1_senca.png', originalImage: 'kozarec1.webp' },
  { id: 'koza_skin', word: 'koža', audioFile: 'koza_skin.m4a', writtenWord: 'KOŽA', shadowImage: 'koza_skin1_senca.png', originalImage: 'koza_skin1.webp' },
  { id: 'krava', word: 'krava', audioFile: 'krava.m4a', writtenWord: 'KRAVA', shadowImage: 'krava1_senca.png', originalImage: 'krava1.webp' },
  { id: 'krof', word: 'krof', audioFile: 'krof.m4a', writtenWord: 'KROF', shadowImage: 'krof1_senca.png', originalImage: 'krof1.webp' },
  { id: 'krog', word: 'krog', audioFile: 'krog.m4a', writtenWord: 'KROG', shadowImage: 'krog1_senca.png', originalImage: 'krog1.webp' },
  { id: 'kroznik', word: 'krožnik', audioFile: 'kroznik.m4a', writtenWord: 'KROŽNIK', shadowImage: 'kroznik1_senca.png', originalImage: 'kroznik1.webp' },
  { id: 'kruh', word: 'kruh', audioFile: 'kruh.m4a', writtenWord: 'KRUH', shadowImage: 'kruh1_senca.png', originalImage: 'kruh1.webp' },
  { id: 'kumara', word: 'kumara', audioFile: 'kumara.m4a', writtenWord: 'KUMARA', shadowImage: 'kumara1_senca.png', originalImage: 'kumara1.webp' },
  { id: 'kuza', word: 'kuža', audioFile: 'kuza.m4a', writtenWord: 'KUŽA', shadowImage: 'kuza1_senca.png', originalImage: 'kuza1.webp' }
];

// Four-column data for letter L
export const fourColumnMatchingDataL: FourColumnMatchingItem[] = [
  { id: 'ladja', word: 'ladja', audioFile: 'ladja.m4a', writtenWord: 'LADJA', shadowImage: 'ladja1_senca.png', originalImage: 'ladja1.webp' },
  { id: 'lasje', word: 'lasje', audioFile: 'lasje.m4a', writtenWord: 'LASJE', shadowImage: 'lasje1_senca.png', originalImage: 'lasje1.webp' },
  { id: 'led', word: 'led', audioFile: 'led.m4a', writtenWord: 'LED', shadowImage: 'led1_senca.png', originalImage: 'led1.webp' },
  { id: 'lesnik', word: 'lešnik', audioFile: 'lesnik.m4a', writtenWord: 'LEŠNIK', shadowImage: 'lesnik1_senca.png', originalImage: 'lesnik1.webp' },
  { id: 'letalo', word: 'letalo', audioFile: 'letalo.m4a', writtenWord: 'LETALO', shadowImage: 'letalo1_senca.png', originalImage: 'letalo1.webp' },
  { id: 'lev', word: 'lev', audioFile: 'lev.m4a', writtenWord: 'LEV', shadowImage: 'lev1_senca.png', originalImage: 'lev1.webp' },
  { id: 'les', word: 'les', audioFile: 'les.m4a', writtenWord: 'LES', shadowImage: 'les1_senca.png', originalImage: 'les1.webp' },
  { id: 'list', word: 'list', audioFile: 'list.m4a', writtenWord: 'LIST', shadowImage: 'list1_senca.png', originalImage: 'list1.webp' },
  { id: 'lizika', word: 'lizika', audioFile: 'lizika.m4a', writtenWord: 'LIZIKA', shadowImage: 'lizika1_senca.png', originalImage: 'lizika1.webp' },
  { id: 'lonec', word: 'lonec', audioFile: 'lonec.m4a', writtenWord: 'LONEC', shadowImage: 'lonec1_senca.png', originalImage: 'lonec1.webp' },
  { id: 'lopar', word: 'lopar', audioFile: 'lopar.m4a', writtenWord: 'LOPAR', shadowImage: 'lopar1_senca.png', originalImage: 'lopar1.webp' },
  { id: 'lubenica', word: 'lubenica', audioFile: 'lubenica.m4a', writtenWord: 'LUBENICA', shadowImage: 'lubenica1_senca.png', originalImage: 'lubenica1.webp' },
  { id: 'luc', word: 'luč', audioFile: 'luc.m4a', writtenWord: 'LUČ', shadowImage: 'luc1_senca.png', originalImage: 'luc1.webp' },
  { id: 'luza', word: 'luža', audioFile: 'luza.m4a', writtenWord: 'LUŽA', shadowImage: 'luza1_senca.png', originalImage: 'luza1.webp' }
];

// Four-column data for letter R
export const fourColumnMatchingDataR: FourColumnMatchingItem[] = [
  { id: 'raca', word: 'raca', audioFile: 'raca.m4a', writtenWord: 'RACA', shadowImage: 'raca1_senca.png', originalImage: 'raca1.webp' },
  { id: 'rak', word: 'rak', audioFile: 'rak.m4a', writtenWord: 'RAK', shadowImage: 'rak1_senca.png', originalImage: 'rak1.webp' },
  { id: 'raketa', word: 'raketa', audioFile: 'raketa.m4a', writtenWord: 'RAKETA', shadowImage: 'raketa1_senca.png', originalImage: 'raketa1.webp' },
  { id: 'ravnilo', word: 'ravnilo', audioFile: 'ravnilo.m4a', writtenWord: 'RAVNILO', shadowImage: 'ravnilo1_senca.png', originalImage: 'ravnilo1.webp' },
  { id: 'rep', word: 'rep', audioFile: 'rep.m4a', writtenWord: 'REP', shadowImage: 'rep1_senca.png', originalImage: 'rep1.webp' },
  { id: 'repa', word: 'repa', audioFile: 'repa.m4a', writtenWord: 'REPA', shadowImage: 'repa1_senca.png', originalImage: 'repa1.webp' },
  { id: 'riba', word: 'riba', audioFile: 'riba.m4a', writtenWord: 'RIBA', shadowImage: 'riba1_senca.png', originalImage: 'riba1.webp' },
  { id: 'ribez', word: 'ribez', audioFile: 'ribez.m4a', writtenWord: 'RIBEZ', shadowImage: 'ribez1_senca.png', originalImage: 'ribez1.webp' },
  { id: 'ribic', word: 'ribič', audioFile: 'ribic.m4a', writtenWord: 'RIBIČ', shadowImage: 'ribic1_senca.png', originalImage: 'ribic1.webp' },
  { id: 'ris', word: 'ris', audioFile: 'ris.m4a', writtenWord: 'RIS', shadowImage: 'ris1_senca.png', originalImage: 'ris1.webp' },
  { id: 'riz', word: 'riž', audioFile: 'riz.m4a', writtenWord: 'RIŽ', shadowImage: 'riz1_senca.png', originalImage: 'riz1.webp' },
  { id: 'robot', word: 'robot', audioFile: 'robot.m4a', writtenWord: 'ROBOT', shadowImage: 'robot1_senca.png', originalImage: 'robot1.webp' },
  { id: 'roka', word: 'roka', audioFile: 'roka.m4a', writtenWord: 'ROKA', shadowImage: 'roka1_senca.png', originalImage: 'roka1.webp' },
  { id: 'rokometas', word: 'rokometaš', audioFile: 'rokometas.m4a', writtenWord: 'ROKOMETAŠ', shadowImage: 'rokometas1_senca.png', originalImage: 'rokometas1.webp' },
  { id: 'rolka', word: 'rolka', audioFile: 'rolka.m4a', writtenWord: 'ROLKA', shadowImage: 'rolka1_senca.png', originalImage: 'rolka1.webp' },
  { id: 'ropotuljica', word: 'ropotuljica', audioFile: 'ropotuljica.m4a', writtenWord: 'ROPOTULJICA', shadowImage: 'ropotuljica1_senca.png', originalImage: 'ropotuljica1.webp' },
  { id: 'roza', word: 'roža', audioFile: 'roza.m4a', writtenWord: 'ROŽA', shadowImage: 'roza1_senca.png', originalImage: 'roza1.webp' }
];

// Four-column data for letter S
export const fourColumnMatchingDataS: FourColumnMatchingItem[] = [
  { id: 'sedem', word: 'sedem', audioFile: 'sedem.m4a', writtenWord: 'SEDEM', shadowImage: 'sedem1_senca.png', originalImage: 'sedem1.webp' },
  { id: 'sir', word: 'sir', audioFile: 'sir.m4a', writtenWord: 'SIR', shadowImage: 'sir1_senca.png', originalImage: 'sir1.webp' },
  { id: 'sladoled', word: 'sladoled', audioFile: 'sladoled.m4a', writtenWord: 'SLADOLED', shadowImage: 'sladoled1_senca.png', originalImage: 'sladoled1.webp' },
  { id: 'slika', word: 'slika', audioFile: 'slika.m4a', writtenWord: 'SLIKA', shadowImage: 'slika1_senca.png', originalImage: 'slika1.webp' },
  { id: 'slon', word: 'slon', audioFile: 'slon.m4a', writtenWord: 'SLON', shadowImage: 'slon1_senca.png', originalImage: 'slon1.webp' },
  { id: 'sluz', word: 'sluz', audioFile: 'sluz.m4a', writtenWord: 'SLUZ', shadowImage: 'sluz1_senca.png', originalImage: 'sluz1.webp' },
  { id: 'smreka', word: 'smreka', audioFile: 'smreka.m4a', writtenWord: 'SMREKA', shadowImage: 'smreka1_senca.png', originalImage: 'smreka1.webp' },
  { id: 'sneg', word: 'sneg', audioFile: 'sneg.m4a', writtenWord: 'SNEG', shadowImage: 'sneg1_senca.png', originalImage: 'sneg1.webp' },
  { id: 'snezak', word: 'snežak', audioFile: 'snezak.m4a', writtenWord: 'SNEŽAK', shadowImage: 'snezak1_senca.png', originalImage: 'snezak1.webp' },
  { id: 'snezinka', word: 'snežinka', audioFile: 'snezinka.m4a', writtenWord: 'SNEŽINKA', shadowImage: 'snezinka1_senca.png', originalImage: 'snezinka1.webp' },
  { id: 'sok', word: 'sok', audioFile: 'sok.m4a', writtenWord: 'SOK', shadowImage: 'sok1_senca.png', originalImage: 'sok1.webp' },
  { id: 'sonce', word: 'sonce', audioFile: 'sonce.m4a', writtenWord: 'SONCE', shadowImage: 'sonce1_senca.png', originalImage: 'sonce1.webp' },
  { id: 'sova', word: 'sova', audioFile: 'sova.m4a', writtenWord: 'SOVA', shadowImage: 'sova1_senca.png', originalImage: 'sova1.webp' },
  { id: 'stol', word: 'stol', audioFile: 'stol.m4a', writtenWord: 'STOL', shadowImage: 'stol1_senca.png', originalImage: 'stol1.webp' },
  { id: 'svetilka', word: 'svetilka', audioFile: 'svetilka.m4a', writtenWord: 'SVETILKA', shadowImage: 'svetilka1_senca.png', originalImage: 'svetilka1.webp' },
  { id: 'svincnik', word: 'svinčnik', audioFile: 'svincnik.m4a', writtenWord: 'SVINČNIK', shadowImage: 'svincnik1_senca.png', originalImage: 'svincnik1.webp' }
];

// Four-column data for letter Š
export const fourColumnMatchingDataŠ: FourColumnMatchingItem[] = [
  { id: 'sah', word: 'šah', audioFile: 'sah.m4a', writtenWord: 'ŠAH', shadowImage: 'sah1_senca.png', originalImage: 'sah1.webp' },
  { id: 'sal', word: 'šal', audioFile: 'sal.m4a', writtenWord: 'ŠAL', shadowImage: 'sal1_senca.png', originalImage: 'sal1.webp' },
  { id: 'scetka', word: 'ščetka', audioFile: 'scetka.m4a', writtenWord: 'ŠČETKA', shadowImage: 'scetka1_senca.png', originalImage: 'scetka1.webp' },
  { id: 'skarje', word: 'škarje', audioFile: 'skarje.m4a', writtenWord: 'ŠKARJE', shadowImage: 'skarje1_senca.png', originalImage: 'skarje1.webp' },
  { id: 'skatla', word: 'škatla', audioFile: 'skatla.m4a', writtenWord: 'ŠKATLA', shadowImage: 'skatla1_senca.png', originalImage: 'skatla1.webp' },
  { id: 'skoljka', word: 'školjka', audioFile: 'skoljka.m4a', writtenWord: 'ŠKOLJKA', shadowImage: 'skoljka1_senca.png', originalImage: 'skoljka1.webp' },
  { id: 'sopek', word: 'šopek', audioFile: 'sopek.m4a', writtenWord: 'ŠOPEK', shadowImage: 'sopek1_senca.png', originalImage: 'sopek1.webp' },
  { id: 'sotor', word: 'šotor', audioFile: 'sotor.m4a', writtenWord: 'ŠOTOR', shadowImage: 'sotor1_senca.png', originalImage: 'sotor1.webp' },
  { id: 'stampiljka', word: 'štampiljka', audioFile: 'stampiljka.m4a', writtenWord: 'ŠTAMPILJKA', shadowImage: 'stampiljka1_senca.png', originalImage: 'stampiljka1.webp' },
  { id: 'storklja', word: 'štorklja', audioFile: 'storklja.m4a', writtenWord: 'ŠTORKLJA', shadowImage: 'storklja1_senca.png', originalImage: 'storklja1.webp' }
];

// Four-column data for letter Z
export const fourColumnMatchingDataZ: FourColumnMatchingItem[] = [
  { id: 'zajec', word: 'zajec', audioFile: 'zajec.m4a', writtenWord: 'ZAJEC', shadowImage: 'zajec1_senca.png', originalImage: 'zajec1.webp' },
  { id: 'zaslon', word: 'zaslon', audioFile: 'zaslon.m4a', writtenWord: 'ZASLON', shadowImage: 'zaslon1_senca.png', originalImage: 'zaslon1.webp' },
  { id: 'zavesa', word: 'zavesa', audioFile: 'zavesa.m4a', writtenWord: 'ZAVESA', shadowImage: 'zavesa1_senca.png', originalImage: 'zavesa1.webp' },
  { id: 'zebra', word: 'zebra', audioFile: 'zebra.m4a', writtenWord: 'ZEBRA', shadowImage: 'zebra1_senca.png', originalImage: 'zebra1.webp' },
  { id: 'zlato', word: 'zlato', audioFile: 'zlato.m4a', writtenWord: 'ZLATO', shadowImage: 'zlato1_senca.png', originalImage: 'zlato1.webp' },
  { id: 'zmaj', word: 'zmaj', audioFile: 'zmaj.m4a', writtenWord: 'ZMAJ', shadowImage: 'zmaj1_senca.png', originalImage: 'zmaj1.webp' },
  { id: 'zob', word: 'zob', audioFile: 'zob.m4a', writtenWord: 'ZOB', shadowImage: 'zob1_senca.png', originalImage: 'zob1.webp' },
  { id: 'zobotrebec', word: 'zobotrebec', audioFile: 'zobotrebec.m4a', writtenWord: 'ZOBOTREBEC', shadowImage: 'zobotrebec1_senca.png', originalImage: 'zobotrebec1.webp' },
  { id: 'zvezda', word: 'zvezda', audioFile: 'zvezda.m4a', writtenWord: 'ZVEZDA', shadowImage: 'zvezda1_senca.png', originalImage: 'zvezda1.webp' },
  { id: 'zvezek', word: 'zvezek', audioFile: 'zvezek.m4a', writtenWord: 'ZVEZEK', shadowImage: 'zvezek1_senca.png', originalImage: 'zvezek1.webp' },
  { id: 'zvocnik', word: 'zvočnik', audioFile: 'zvocnik.m4a', writtenWord: 'ZVOČNIK', shadowImage: 'zvocnik1_senca.png', originalImage: 'zvocnik1.webp' }
];

// Four-column data for letter Ž
export const fourColumnMatchingDataŽ: FourColumnMatchingItem[] = [
  { id: 'zaba', word: 'žaba', audioFile: 'zaba.m4a', writtenWord: 'ŽABA', shadowImage: 'zaba1_senca.png', originalImage: 'zaba1.webp' },
  { id: 'zaga', word: 'žaga', audioFile: 'zaga.m4a', writtenWord: 'ŽAGA', shadowImage: 'zaga1_senca.png', originalImage: 'zaga1.webp' },
  { id: 'zarnica', word: 'žarnica', audioFile: 'zarnica.m4a', writtenWord: 'ŽARNICA', shadowImage: 'zarnica1_senca.png', originalImage: 'zarnica1.webp' },
  { id: 'zebelj', word: 'žebelj', audioFile: 'zebelj.m4a', writtenWord: 'ŽEBELJ', shadowImage: 'zebelj1_senca.png', originalImage: 'zebelj1.webp' },
  { id: 'zelva', word: 'želva', audioFile: 'zelva.m4a', writtenWord: 'ŽELVA', shadowImage: 'zelva1_senca.png', originalImage: 'zelva1.webp' },
  { id: 'zerjav', word: 'žerjav', audioFile: 'zerjav.m4a', writtenWord: 'ŽERJAV', shadowImage: 'zerjav1_senca.png', originalImage: 'zerjav1.webp' },
  { id: 'zirafa', word: 'žirafa', audioFile: 'zirafa.m4a', writtenWord: 'ŽIRAFA', shadowImage: 'zirafa1_senca.png', originalImage: 'zirafa1.webp' },
  { id: 'zlica', word: 'žlica', audioFile: 'zlica.m4a', writtenWord: 'ŽLICA', shadowImage: 'zlica1_senca.png', originalImage: 'zlica1.webp' },
  { id: 'zoga', word: 'žoga', audioFile: 'zoga.m4a', writtenWord: 'ŽOGA', shadowImage: 'zoga1_senca.png', originalImage: 'zoga1.webp' },
  { id: 'zolna', word: 'žolna', audioFile: 'zolna.m4a', writtenWord: 'ŽOLNA', shadowImage: 'zolna1_senca.png', originalImage: 'zolna1.webp' }
];

// Function to get letter-specific data
export function getLetterMatchingData(letter: string): ThreeColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return threeColumnMatchingDataC;
    case 'č':
      return threeColumnMatchingDataČ;
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
    case 'z':
      return fourColumnMatchingDataZ;
    case 'ž':
      return fourColumnMatchingDataŽ;
    default:
      return fourColumnMatchingDataC; // Fallback to C
  }
}

export function getRandomThreeColumnItems(count: number = 4, letter?: string): ThreeColumnMatchingItem[] {
  const dataSet = letter ? getLetterMatchingData(letter) : threeColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function getRandomFourColumnItems(count: number = 4, letter?: string): FourColumnMatchingItem[] {
  const dataSet = letter ? getFourColumnLetterData(letter) : fourColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
