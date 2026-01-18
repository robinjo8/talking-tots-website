export interface ThreeColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .m4a file in zvocni-posnetki bucket
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .png file in slike bucket
}

export interface FourColumnMatchingItem {
  id: string;
  word: string;
  audioFile: string; // .m4a file in zvocni-posnetki bucket
  writtenWord: string; // Written word in uppercase
  shadowImage: string; // _senca.png file in slike-sence bucket
  originalImage: string; // .png file in slike bucket
}

// Only words starting with letter C - as per user specifications
export const threeColumnMatchingDataC: ThreeColumnMatchingItem[] = [
  { id: 'cedilo', word: 'CEDILO', audioFile: 'cedilo.m4a', shadowImage: 'cedilo_senca.png', originalImage: 'cedilo.png' },
  { id: 'cekin', word: 'CEKIN', audioFile: 'cekin.m4a', shadowImage: 'cekin_senca.png', originalImage: 'cekin.png' },
  { id: 'cerkev', word: 'CERKEV', audioFile: 'cerkev.m4a', shadowImage: 'cerkev_senca.png', originalImage: 'cerkev.png' },
  { id: 'cesta', word: 'CESTA', audioFile: 'cesta.m4a', shadowImage: 'cesta_senca.png', originalImage: 'cesta.png' },
  { id: 'cev', word: 'CEV', audioFile: 'cev.m4a', shadowImage: 'cev_senca.png', originalImage: 'cev.png' },
  { id: 'cirkus', word: 'CIRKUS', audioFile: 'cirkus.m4a', shadowImage: 'cirkus_senca.png', originalImage: 'cirkus.png' },
  { id: 'cisterna', word: 'CISTERNA', audioFile: 'cisterna.m4a', shadowImage: 'cisterna_senca.png', originalImage: 'cisterna.png' },
  { id: 'cokla', word: 'COKLA', audioFile: 'cokla.m4a', shadowImage: 'cokla_senca.png', originalImage: 'cokla.png' },
  { id: 'copat', word: 'COPAT', audioFile: 'copat.m4a', shadowImage: 'copat_senca.png', originalImage: 'copat.png' },
  { id: 'cvet', word: 'CVET', audioFile: 'cvet.m4a', shadowImage: 'cvet_senca.png', originalImage: 'cvet.png' }
];

// Data for letter Č
export const threeColumnMatchingDataČ: ThreeColumnMatchingItem[] = [
  { id: 'caj', word: 'ČAJ', audioFile: 'caj.m4a', shadowImage: 'caj_senca.png', originalImage: 'caj.png' },
  { id: 'casopis', word: 'ČASOPIS', audioFile: 'casopis.m4a', shadowImage: 'casopis_senca.png', originalImage: 'casopis.png' },
  { id: 'cebela', word: 'ČEBELA', audioFile: 'cebela.m4a', shadowImage: 'cebela_senca.png', originalImage: 'cebela.png' },
  { id: 'cebula', word: 'ČEBULA', audioFile: 'cebula.m4a', shadowImage: 'cebula_senca.png', originalImage: 'cebula.png' },
  { id: 'cesen', word: 'ČESEN', audioFile: 'cesen.m4a', shadowImage: 'cesen_senca.png', originalImage: 'cesen.png' },
  { id: 'cevlji', word: 'ČEVLJI', audioFile: 'cevlji.m4a', shadowImage: 'cevlji_senca.png', originalImage: 'cevlji.png' },
  { id: 'cokolada', word: 'ČOKOLADA', audioFile: 'cokolada.m4a', shadowImage: 'cokolada_senca.png', originalImage: 'cokolada.png' },
  { id: 'coln', word: 'ČOLN', audioFile: 'coln.m4a', shadowImage: 'coln_senca.png', originalImage: 'coln.png' },
  { id: 'copic', word: 'ČOPIČ', audioFile: 'copic.m4a', shadowImage: 'copic_senca.png', originalImage: 'copic.png' },
  { id: 'crke', word: 'ČRKE', audioFile: 'crke.m4a', shadowImage: 'crke_senca.png', originalImage: 'crke.png' }
];

// Data for letter K
export const threeColumnMatchingDataK: ThreeColumnMatchingItem[] = [
  { id: 'kaca', word: 'KAČA', audioFile: 'kaca.m4a', shadowImage: 'kaca_senca.png', originalImage: 'kaca.png' },
  { id: 'kapa', word: 'KAPA', audioFile: 'kapa.m4a', shadowImage: 'kapa_senca.png', originalImage: 'kapa.png' },
  { id: 'kava', word: 'KAVA', audioFile: 'kava.m4a', shadowImage: 'kava_senca.png', originalImage: 'kava.png' },
  { id: 'klavir', word: 'KLAVIR', audioFile: 'klavir.m4a', shadowImage: 'klavir_senca.png', originalImage: 'klavir.png' },
  { id: 'kljuc', word: 'KLJUČ', audioFile: 'kljuc.m4a', shadowImage: 'kljuc_senca.png', originalImage: 'kljuc.png' },
  { id: 'klop', word: 'KLOP', audioFile: 'klop.m4a', shadowImage: 'klop_senca.png', originalImage: 'klop.png' },
  { id: 'knjiga', word: 'KNJIGA', audioFile: 'knjiga.m4a', shadowImage: 'knjiga_senca.png', originalImage: 'knjiga.png' },
  { id: 'kocka', word: 'KOCKA', audioFile: 'kocka.m4a', shadowImage: 'kocka_senca.png', originalImage: 'kocka.png' },
  { id: 'kokos_sadez', word: 'KOKOS', audioFile: 'kokos_sadez.m4a', shadowImage: 'kokos_sadez_senca.png', originalImage: 'kokos_sadez.png' },
  { id: 'kokos', word: 'KOKOŠ', audioFile: 'kokos_1.m4a', shadowImage: 'kokos_senca.png', originalImage: 'kokos.png' },
  { id: 'kolac', word: 'KOLAČ', audioFile: 'kolac.m4a', shadowImage: 'kolac_senca.png', originalImage: 'kolac.png' },
  { id: 'kolo', word: 'KOLO', audioFile: 'kolo.m4a', shadowImage: 'kolo_senca.png', originalImage: 'kolo.png' },
  { id: 'koruza', word: 'KORUZA', audioFile: 'koruza.m4a', shadowImage: 'koruza_senca.png', originalImage: 'koruza.png' },
  { id: 'kost', word: 'KOST', audioFile: 'kost.m4a', shadowImage: 'kost_senca.png', originalImage: 'kost.png' },
  { id: 'kos', word: 'KOŠ', audioFile: 'kos.m4a', shadowImage: 'kos_senca.png', originalImage: 'kos.png' },
  { id: 'kosara', word: 'KOŠARA', audioFile: 'kosara.m4a', shadowImage: 'kosara_senca.png', originalImage: 'kosara.png' },
  { id: 'koza', word: 'KOZA', audioFile: 'koza.m4a', shadowImage: 'koza_senca.png', originalImage: 'koza.png' },
  { id: 'kozarec', word: 'KOZAREC', audioFile: 'kozarec.m4a', shadowImage: 'kozarec_senca.png', originalImage: 'kozarec.png' },
  { id: 'koza_skin', word: 'KOŽA', audioFile: 'koza_skin.m4a', shadowImage: 'koza_skin_senca.png', originalImage: 'koza_skin.png' },
  { id: 'krava', word: 'KRAVA', audioFile: 'krava.m4a', shadowImage: 'krava_senca.png', originalImage: 'krava.png' },
  { id: 'krof', word: 'KROF', audioFile: 'krof.m4a', shadowImage: 'krof_senca.png', originalImage: 'krof.png' },
  { id: 'krog', word: 'KROG', audioFile: 'krog.m4a', shadowImage: 'krog_senca.png', originalImage: 'krog.png' },
  { id: 'kroznik', word: 'KROŽNIK', audioFile: 'kroznik.m4a', shadowImage: 'kroznik_senca.png', originalImage: 'kroznik.png' },
  { id: 'kruh', word: 'KRUH', audioFile: 'kruh.m4a', shadowImage: 'kruh_senca.png', originalImage: 'kruh.png' },
  { id: 'kumara', word: 'KUMARA', audioFile: 'kumara.m4a', shadowImage: 'kumara_senca.png', originalImage: 'kumara.png' },
  { id: 'kuza', word: 'KUŽA', audioFile: 'kuza.m4a', shadowImage: 'kuza_senca.png', originalImage: 'kuza.png' }
];

// Data for letter L
export const threeColumnMatchingDataL: ThreeColumnMatchingItem[] = [
  { id: 'ladja', word: 'LADJA', audioFile: 'ladja.m4a', shadowImage: 'ladja_senca.png', originalImage: 'ladja.png' },
  { id: 'lasje', word: 'LASJE', audioFile: 'lasje.m4a', shadowImage: 'lasje_senca.png', originalImage: 'lasje.png' },
  { id: 'led', word: 'LED', audioFile: 'led.m4a', shadowImage: 'led_senca.png', originalImage: 'led.png' },
  { id: 'lesnik', word: 'LEŠNIK', audioFile: 'lesnik.m4a', shadowImage: 'lesnik_senca.png', originalImage: 'lesnik.png' },
  { id: 'letalo', word: 'LETALO', audioFile: 'letalo.m4a', shadowImage: 'letalo_senca.png', originalImage: 'letalo.png' },
  { id: 'lev', word: 'LEV', audioFile: 'lev.m4a', shadowImage: 'lev_senca.png', originalImage: 'lev.png' },
  { id: 'les', word: 'LES', audioFile: 'les.m4a', shadowImage: 'les_senca.png', originalImage: 'les.png' },
  { id: 'list', word: 'LIST', audioFile: 'list.m4a', shadowImage: 'list_senca.png', originalImage: 'list.png' },
  { id: 'lizika', word: 'LIZIKA', audioFile: 'lizika.m4a', shadowImage: 'lizika_senca.png', originalImage: 'lizika.png' },
  { id: 'lonec', word: 'LONEC', audioFile: 'lonec.m4a', shadowImage: 'lonec_senca.png', originalImage: 'lonec.png' },
  { id: 'lopar', word: 'LOPAR', audioFile: 'lopar.m4a', shadowImage: 'lopar_senca.png', originalImage: 'lopar.png' },
  { id: 'lubenica', word: 'LUBENICA', audioFile: 'lubenica.m4a', shadowImage: 'lubenica_senca.png', originalImage: 'lubenica.png' },
  { id: 'luc', word: 'LUČ', audioFile: 'luc.m4a', shadowImage: 'luc_senca.png', originalImage: 'luc.png' },
  { id: 'luza', word: 'LUŽA', audioFile: 'luza.m4a', shadowImage: 'luza_senca.png', originalImage: 'luza.png' }
];

// Data for letter R
export const threeColumnMatchingDataR: ThreeColumnMatchingItem[] = [
  { id: 'raca', word: 'RACA', audioFile: 'raca.m4a', shadowImage: 'raca_senca.png', originalImage: 'raca.png' },
  { id: 'rak', word: 'RAK', audioFile: 'rak.m4a', shadowImage: 'rak_senca.png', originalImage: 'rak.png' },
  { id: 'raketa', word: 'RAKETA', audioFile: 'raketa.m4a', shadowImage: 'raketa_senca.png', originalImage: 'raketa.png' },
  { id: 'ravnilo', word: 'RAVNILO', audioFile: 'ravnilo.m4a', shadowImage: 'ravnilo_senca.png', originalImage: 'ravnilo.png' },
  { id: 'rep', word: 'REP', audioFile: 'rep.m4a', shadowImage: 'rep_senca.png', originalImage: 'rep.png' },
  { id: 'repa', word: 'REPA', audioFile: 'repa.m4a', shadowImage: 'repa_senca.png', originalImage: 'repa.png' },
  { id: 'riba', word: 'RIBA', audioFile: 'riba.m4a', shadowImage: 'riba_senca.png', originalImage: 'riba.png' },
  { id: 'ribez', word: 'RIBEZ', audioFile: 'ribez.m4a', shadowImage: 'ribez_senca.png', originalImage: 'ribez.png' },
  { id: 'ribic', word: 'RIBIČ', audioFile: 'ribic.m4a', shadowImage: 'ribic_senca.png', originalImage: 'ribic.png' },
  { id: 'ris', word: 'RIS', audioFile: 'ris.m4a', shadowImage: 'ris_senca.png', originalImage: 'ris.png' },
  { id: 'riz', word: 'RIŽ', audioFile: 'riz.m4a', shadowImage: 'riz_senca.png', originalImage: 'riz.png' },
  { id: 'robot', word: 'ROBOT', audioFile: 'robot.m4a', shadowImage: 'robot_senca.png', originalImage: 'robot.png' },
  { id: 'roka', word: 'ROKA', audioFile: 'roka.m4a', shadowImage: 'roka_senca.png', originalImage: 'roka.png' },
  { id: 'rokometas', word: 'ROKOMETAŠ', audioFile: 'rokometas.m4a', shadowImage: 'rokometas_senca.png', originalImage: 'rokometas.png' },
  { id: 'rolka', word: 'ROLKA', audioFile: 'rolka.m4a', shadowImage: 'rolka_senca.png', originalImage: 'rolka.png' },
  { id: 'ropotuljica', word: 'ROPOTULJICA', audioFile: 'ropotuljica.m4a', shadowImage: 'ropotuljica_senca.png', originalImage: 'ropotuljica.png' },
  { id: 'roza', word: 'ROŽA', audioFile: 'roza.m4a', shadowImage: 'roza_senca.png', originalImage: 'roza.png' }
];

// Data for letter S
export const threeColumnMatchingDataS: ThreeColumnMatchingItem[] = [
  { id: 'sedem', word: 'SEDEM', audioFile: 'sedem.m4a', shadowImage: 'sedem_senca.png', originalImage: 'sedem.png' },
  { id: 'sir', word: 'SIR', audioFile: 'sir.m4a', shadowImage: 'sir_senca.png', originalImage: 'sir.png' },
  { id: 'sladoled', word: 'SLADOLED', audioFile: 'sladoled.m4a', shadowImage: 'sladoled_senca.png', originalImage: 'sladoled.png' },
  { id: 'slika', word: 'SLIKA', audioFile: 'slika.m4a', shadowImage: 'slika_senca.png', originalImage: 'slika.png' },
  { id: 'slon', word: 'SLON', audioFile: 'slon.m4a', shadowImage: 'slon_senca.png', originalImage: 'slon.png' },
  { id: 'sluz', word: 'SLUZ', audioFile: 'sluz.m4a', shadowImage: 'sluz_senca.png', originalImage: 'sluz.png' },
  { id: 'smreka', word: 'SMREKA', audioFile: 'smreka.m4a', shadowImage: 'smreka_senca.png', originalImage: 'smreka.png' },
  { id: 'sneg', word: 'SNEG', audioFile: 'sneg.m4a', shadowImage: 'sneg_senca.png', originalImage: 'sneg.png' },
  { id: 'snezak', word: 'SNEŽAK', audioFile: 'snezak.m4a', shadowImage: 'snezak_senca.png', originalImage: 'snezak.png' },
  { id: 'snezinka', word: 'SNEŽINKA', audioFile: 'snezinka.m4a', shadowImage: 'snezinka_senca.png', originalImage: 'snezinka.png' },
  { id: 'sok', word: 'SOK', audioFile: 'sok.m4a', shadowImage: 'sok_senca.png', originalImage: 'sok.png' },
  { id: 'sonce', word: 'SONCE', audioFile: 'sonce.m4a', shadowImage: 'sonce_senca.png', originalImage: 'sonce.png' },
  { id: 'sova', word: 'SOVA', audioFile: 'sova.m4a', shadowImage: 'sova_senca.png', originalImage: 'sova.png' },
  { id: 'stol', word: 'STOL', audioFile: 'stol.m4a', shadowImage: 'stol_senca.png', originalImage: 'stol.png' },
  { id: 'svetilka', word: 'SVETILKA', audioFile: 'svetilka.m4a', shadowImage: 'svetilka_senca.png', originalImage: 'svetilka.png' },
  { id: 'svincnik', word: 'SVINČNIK', audioFile: 'svincnik.m4a', shadowImage: 'svincnik_senca.png', originalImage: 'svincnik.png' }
];

// Data for letter Š
export const threeColumnMatchingDataŠ: ThreeColumnMatchingItem[] = [
  { id: 'sah', word: 'ŠAH', audioFile: 'sah.m4a', shadowImage: 'sah_senca.png', originalImage: 'sah.png' },
  { id: 'sal', word: 'ŠAL', audioFile: 'sal.m4a', shadowImage: 'sal_senca.png', originalImage: 'sal.png' },
  { id: 'scetka', word: 'ŠČETKA', audioFile: 'scetka.m4a', shadowImage: 'scetka_senca.png', originalImage: 'scetka.png' },
  { id: 'skarje', word: 'ŠKARJE', audioFile: 'skarje.m4a', shadowImage: 'skarje_senca.png', originalImage: 'skarje.png' },
  { id: 'skatla', word: 'ŠKATLA', audioFile: 'skatla.m4a', shadowImage: 'skatla_senca.png', originalImage: 'skatla.png' },
  { id: 'skoljka', word: 'ŠKOLJKA', audioFile: 'skoljka.m4a', shadowImage: 'skoljka_senca.png', originalImage: 'skoljka.png' },
  { id: 'sopek', word: 'ŠOPEK', audioFile: 'sopek.m4a', shadowImage: 'sopek_senca.png', originalImage: 'sopek.png' },
  { id: 'sotor', word: 'ŠOTOR', audioFile: 'sotor.m4a', shadowImage: 'sotor_senca.png', originalImage: 'sotor.png' },
  { id: 'stampiljka', word: 'ŠTAMPILJKA', audioFile: 'stampiljka.m4a', shadowImage: 'stampiljka_senca.png', originalImage: 'stampiljka.png' },
  { id: 'storklja', word: 'ŠTORKLJA', audioFile: 'storklja.m4a', shadowImage: 'storklja_senca.png', originalImage: 'storklja.png' }
];

// Data for letter Z
export const threeColumnMatchingDataZ: ThreeColumnMatchingItem[] = [
  { id: 'zajec', word: 'ZAJEC', audioFile: 'zajec.m4a', shadowImage: 'zajec_senca.png', originalImage: 'zajec.png' },
  { id: 'zaslon', word: 'ZASLON', audioFile: 'zaslon.m4a', shadowImage: 'zaslon_senca.png', originalImage: 'zaslon.png' },
  { id: 'zavesa', word: 'ZAVESA', audioFile: 'zavesa.m4a', shadowImage: 'zavesa_senca.png', originalImage: 'zavesa.png' },
  { id: 'zebra', word: 'ZEBRA', audioFile: 'zebra.m4a', shadowImage: 'zebra_senca.png', originalImage: 'zebra.png' },
  { id: 'zlato', word: 'ZLATO', audioFile: 'zlato.m4a', shadowImage: 'zlato_senca.png', originalImage: 'zlato.png' },
  { id: 'zmaj', word: 'ZMAJ', audioFile: 'zmaj.m4a', shadowImage: 'zmaj_senca.png', originalImage: 'zmaj.png' },
  { id: 'zob', word: 'ZOB', audioFile: 'zob.m4a', shadowImage: 'zob_senca.png', originalImage: 'zob.png' },
  { id: 'zobotrebec', word: 'ZOBOTREBEC', audioFile: 'zobotrebec.m4a', shadowImage: 'zobotrebec_senca.png', originalImage: 'zobotrebec.png' },
  { id: 'zvezda', word: 'ZVEZDA', audioFile: 'zvezda.m4a', shadowImage: 'zvezda_senca.png', originalImage: 'zvezda.png' },
  { id: 'zvezek', word: 'ZVEZEK', audioFile: 'zvezek.m4a', shadowImage: 'zvezek_senca.png', originalImage: 'zvezek.png' },
  { id: 'zvocnik', word: 'ZVOČNIK', audioFile: 'zvocnik.m4a', shadowImage: 'zvocnik_senca.png', originalImage: 'zvocnik.png' }
];

// Data for letter Ž
export const threeColumnMatchingDataŽ: ThreeColumnMatchingItem[] = [
  { id: 'zaba', word: 'ŽABA', audioFile: 'zaba.m4a', shadowImage: 'zaba_senca.png', originalImage: 'zaba.png' },
  { id: 'zaga', word: 'ŽAGA', audioFile: 'zaga.m4a', shadowImage: 'zaga_senca.png', originalImage: 'zaga.png' },
  { id: 'zarnica', word: 'ŽARNICA', audioFile: 'zarnica.m4a', shadowImage: 'zarnica_senca.png', originalImage: 'zarnica.png' },
  { id: 'zebelj', word: 'ŽEBELJ', audioFile: 'zebelj.m4a', shadowImage: 'zebelj_senca.png', originalImage: 'zebelj.png' },
  { id: 'zelva', word: 'ŽELVA', audioFile: 'zelva.m4a', shadowImage: 'zelva_senca.png', originalImage: 'zelva.png' },
  { id: 'zerjav', word: 'ŽERJAV', audioFile: 'zerjav.m4a', shadowImage: 'zerjav_senca.png', originalImage: 'zerjav.png' },
  { id: 'zirafa', word: 'ŽIRAFA', audioFile: 'zirafa.m4a', shadowImage: 'zirafa_senca.png', originalImage: 'zirafa.png' },
  { id: 'zlica', word: 'ŽLICA', audioFile: 'zlica.m4a', shadowImage: 'zlica_senca.png', originalImage: 'zlica.png' },
  { id: 'zoga', word: 'ŽOGA', audioFile: 'zoga.m4a', shadowImage: 'zoga_senca.png', originalImage: 'zoga.png' },
  { id: 'zolna', word: 'ŽOLNA', audioFile: 'zolna.m4a', shadowImage: 'zolna_senca.png', originalImage: 'zolna.png' }
];

// Four-column data for 7-8 age group (letter C)
export const fourColumnMatchingDataC: FourColumnMatchingItem[] = [
  { id: 'cedilo', word: 'cedilo', audioFile: 'cedilo.m4a', writtenWord: 'CEDILO', shadowImage: 'cedilo_senca.png', originalImage: 'cedilo.png' },
  { id: 'cekin', word: 'cekin', audioFile: 'cekin.m4a', writtenWord: 'CEKIN', shadowImage: 'cekin_senca.png', originalImage: 'cekin.png' },
  { id: 'cerkev', word: 'cerkev', audioFile: 'cerkev.m4a', writtenWord: 'CERKEV', shadowImage: 'cerkev_senca.png', originalImage: 'cerkev.png' },
  { id: 'cesta', word: 'cesta', audioFile: 'cesta.m4a', writtenWord: 'CESTA', shadowImage: 'cesta_senca.png', originalImage: 'cesta.png' },
  { id: 'cev', word: 'cev', audioFile: 'cev.m4a', writtenWord: 'CEV', shadowImage: 'cev_senca.png', originalImage: 'cev.png' },
  { id: 'cirkus', word: 'cirkus', audioFile: 'cirkus.m4a', writtenWord: 'CIRKUS', shadowImage: 'cirkus_senca.png', originalImage: 'cirkus.png' },
  { id: 'cisterna', word: 'cisterna', audioFile: 'cisterna.m4a', writtenWord: 'CISTERNA', shadowImage: 'cisterna_senca.png', originalImage: 'cisterna.png' },
  { id: 'cokla', word: 'cokla', audioFile: 'cokla.m4a', writtenWord: 'COKLA', shadowImage: 'cokla_senca.png', originalImage: 'cokla.png' },
  { id: 'copat', word: 'copat', audioFile: 'copat.m4a', writtenWord: 'COPAT', shadowImage: 'copat_senca.png', originalImage: 'copat.png' },
  { id: 'cvet', word: 'cvet', audioFile: 'cvet.m4a', writtenWord: 'CVET', shadowImage: 'cvet_senca.png', originalImage: 'cvet.png' }
];

// Four-column data for letter Č
export const fourColumnMatchingDataČ: FourColumnMatchingItem[] = [
  { id: 'caj', word: 'čaj', audioFile: 'caj.m4a', writtenWord: 'ČAJ', shadowImage: 'caj_senca.png', originalImage: 'caj.png' },
  { id: 'casopis', word: 'časopis', audioFile: 'casopis.m4a', writtenWord: 'ČASOPIS', shadowImage: 'casopis_senca.png', originalImage: 'casopis.png' },
  { id: 'cebela', word: 'čebela', audioFile: 'cebela.m4a', writtenWord: 'ČEBELA', shadowImage: 'cebela_senca.png', originalImage: 'cebela.png' },
  { id: 'cebula', word: 'čebula', audioFile: 'cebula.m4a', writtenWord: 'ČEBULA', shadowImage: 'cebula_senca.png', originalImage: 'cebula.png' },
  { id: 'cesen', word: 'česen', audioFile: 'cesen.m4a', writtenWord: 'ČESEN', shadowImage: 'cesen_senca.png', originalImage: 'cesen.png' },
  { id: 'cevlji', word: 'čevlji', audioFile: 'cevlji.m4a', writtenWord: 'ČEVLJI', shadowImage: 'cevlji_senca.png', originalImage: 'cevlji.png' },
  { id: 'cokolada', word: 'čokolada', audioFile: 'cokolada.m4a', writtenWord: 'ČOKOLADA', shadowImage: 'cokolada_senca.png', originalImage: 'cokolada.png' },
  { id: 'coln', word: 'čoln', audioFile: 'coln.m4a', writtenWord: 'ČOLN', shadowImage: 'coln_senca.png', originalImage: 'coln.png' },
  { id: 'copic', word: 'čopič', audioFile: 'copic.m4a', writtenWord: 'ČOPIČ', shadowImage: 'copic_senca.png', originalImage: 'copic.png' },
  { id: 'crke', word: 'črke', audioFile: 'crke.m4a', writtenWord: 'ČRKE', shadowImage: 'crke_senca.png', originalImage: 'crke.png' }
];

// Four-column data for letter K
export const fourColumnMatchingDataK: FourColumnMatchingItem[] = [
  { id: 'kaca', word: 'kača', audioFile: 'kaca.m4a', writtenWord: 'KAČA', shadowImage: 'kaca_senca.png', originalImage: 'kaca.png' },
  { id: 'kapa', word: 'kapa', audioFile: 'kapa.m4a', writtenWord: 'KAPA', shadowImage: 'kapa_senca.png', originalImage: 'kapa.png' },
  { id: 'kava', word: 'kava', audioFile: 'kava.m4a', writtenWord: 'KAVA', shadowImage: 'kava_senca.png', originalImage: 'kava.png' },
  { id: 'klavir', word: 'klavir', audioFile: 'klavir.m4a', writtenWord: 'KLAVIR', shadowImage: 'klavir_senca.png', originalImage: 'klavir.png' },
  { id: 'kljuc', word: 'ključ', audioFile: 'kljuc.m4a', writtenWord: 'KLJUČ', shadowImage: 'kljuc_senca.png', originalImage: 'kljuc.png' },
  { id: 'klop', word: 'klop', audioFile: 'klop.m4a', writtenWord: 'KLOP', shadowImage: 'klop_senca.png', originalImage: 'klop.png' },
  { id: 'knjiga', word: 'knjiga', audioFile: 'knjiga.m4a', writtenWord: 'KNJIGA', shadowImage: 'knjiga_senca.png', originalImage: 'knjiga.png' },
  { id: 'kocka', word: 'kocka', audioFile: 'kocka.m4a', writtenWord: 'KOCKA', shadowImage: 'kocka_senca.png', originalImage: 'kocka.png' },
  { id: 'kokos_sadez', word: 'kokos', audioFile: 'kokos_sadez.m4a', writtenWord: 'KOKOS', shadowImage: 'kokos_sadez_senca.png', originalImage: 'kokos_sadez.png' },
  { id: 'kokos', word: 'kokoš', audioFile: 'kokos_1.m4a', writtenWord: 'KOKOŠ', shadowImage: 'kokos_senca.png', originalImage: 'kokos.png' },
  { id: 'kolac', word: 'kolač', audioFile: 'kolac.m4a', writtenWord: 'KOLAČ', shadowImage: 'kolac_senca.png', originalImage: 'kolac.png' },
  { id: 'kolo', word: 'kolo', audioFile: 'kolo.m4a', writtenWord: 'KOLO', shadowImage: 'kolo_senca.png', originalImage: 'kolo.png' },
  { id: 'koruza', word: 'koruza', audioFile: 'koruza.m4a', writtenWord: 'KORUZA', shadowImage: 'koruza_senca.png', originalImage: 'koruza.png' },
  { id: 'kost', word: 'kost', audioFile: 'kost.m4a', writtenWord: 'KOST', shadowImage: 'kost_senca.png', originalImage: 'kost.png' },
  { id: 'kos', word: 'koš', audioFile: 'kos.m4a', writtenWord: 'KOŠ', shadowImage: 'kos_senca.png', originalImage: 'kos.png' },
  { id: 'kosara', word: 'košara', audioFile: 'kosara.m4a', writtenWord: 'KOŠARA', shadowImage: 'kosara_senca.png', originalImage: 'kosara.png' },
  { id: 'koza', word: 'koza', audioFile: 'koza.m4a', writtenWord: 'KOZA', shadowImage: 'koza_senca.png', originalImage: 'koza.png' },
  { id: 'kozarec', word: 'kozarec', audioFile: 'kozarec.m4a', writtenWord: 'KOZAREC', shadowImage: 'kozarec_senca.png', originalImage: 'kozarec.png' },
  { id: 'koza_skin', word: 'koža', audioFile: 'koza_skin.m4a', writtenWord: 'KOŽA', shadowImage: 'koza_skin_senca.png', originalImage: 'koza_skin.png' },
  { id: 'krava', word: 'krava', audioFile: 'krava.m4a', writtenWord: 'KRAVA', shadowImage: 'krava_senca.png', originalImage: 'krava.png' },
  { id: 'krof', word: 'krof', audioFile: 'krof.m4a', writtenWord: 'KROF', shadowImage: 'krof_senca.png', originalImage: 'krof.png' },
  { id: 'krog', word: 'krog', audioFile: 'krog.m4a', writtenWord: 'KROG', shadowImage: 'krog_senca.png', originalImage: 'krog.png' },
  { id: 'kroznik', word: 'krožnik', audioFile: 'kroznik.m4a', writtenWord: 'KROŽNIK', shadowImage: 'kroznik_senca.png', originalImage: 'kroznik.png' },
  { id: 'kruh', word: 'kruh', audioFile: 'kruh.m4a', writtenWord: 'KRUH', shadowImage: 'kruh_senca.png', originalImage: 'kruh.png' },
  { id: 'kumara', word: 'kumara', audioFile: 'kumara.m4a', writtenWord: 'KUMARA', shadowImage: 'kumara_senca.png', originalImage: 'kumara.png' },
  { id: 'kuza', word: 'kuža', audioFile: 'kuza.m4a', writtenWord: 'KUŽA', shadowImage: 'kuza_senca.png', originalImage: 'kuza.png' }
];

// Four-column data for letter L
export const fourColumnMatchingDataL: FourColumnMatchingItem[] = [
  { id: 'ladja', word: 'ladja', audioFile: 'ladja.m4a', writtenWord: 'LADJA', shadowImage: 'ladja_senca.png', originalImage: 'ladja.png' },
  { id: 'lasje', word: 'lasje', audioFile: 'lasje.m4a', writtenWord: 'LASJE', shadowImage: 'lasje_senca.png', originalImage: 'lasje.png' },
  { id: 'led', word: 'led', audioFile: 'led.m4a', writtenWord: 'LED', shadowImage: 'led_senca.png', originalImage: 'led.png' },
  { id: 'lesnik', word: 'lešnik', audioFile: 'lesnik.m4a', writtenWord: 'LEŠNIK', shadowImage: 'lesnik_senca.png', originalImage: 'lesnik.png' },
  { id: 'letalo', word: 'letalo', audioFile: 'letalo.m4a', writtenWord: 'LETALO', shadowImage: 'letalo_senca.png', originalImage: 'letalo.png' },
  { id: 'lev', word: 'lev', audioFile: 'lev.m4a', writtenWord: 'LEV', shadowImage: 'lev_senca.png', originalImage: 'lev.png' },
  { id: 'les', word: 'les', audioFile: 'les.m4a', writtenWord: 'LES', shadowImage: 'les_senca.png', originalImage: 'les.png' },
  { id: 'list', word: 'list', audioFile: 'list.m4a', writtenWord: 'LIST', shadowImage: 'list_senca.png', originalImage: 'list.png' },
  { id: 'lizika', word: 'lizika', audioFile: 'lizika.m4a', writtenWord: 'LIZIKA', shadowImage: 'lizika_senca.png', originalImage: 'lizika.png' },
  { id: 'lonec', word: 'lonec', audioFile: 'lonec.m4a', writtenWord: 'LONEC', shadowImage: 'lonec_senca.png', originalImage: 'lonec.png' },
  { id: 'lopar', word: 'lopar', audioFile: 'lopar.m4a', writtenWord: 'LOPAR', shadowImage: 'lopar_senca.png', originalImage: 'lopar.png' },
  { id: 'lubenica', word: 'lubenica', audioFile: 'lubenica.m4a', writtenWord: 'LUBENICA', shadowImage: 'lubenica_senca.png', originalImage: 'lubenica.png' },
  { id: 'luc', word: 'luč', audioFile: 'luc.m4a', writtenWord: 'LUČ', shadowImage: 'luc_senca.png', originalImage: 'luc.png' },
  { id: 'luza', word: 'luža', audioFile: 'luza.m4a', writtenWord: 'LUŽA', shadowImage: 'luza_senca.png', originalImage: 'luza.png' }
];

// Four-column data for letter R
export const fourColumnMatchingDataR: FourColumnMatchingItem[] = [
  { id: 'raca', word: 'raca', audioFile: 'raca.m4a', writtenWord: 'RACA', shadowImage: 'raca_senca.png', originalImage: 'raca.png' },
  { id: 'rak', word: 'rak', audioFile: 'rak.m4a', writtenWord: 'RAK', shadowImage: 'rak_senca.png', originalImage: 'rak.png' },
  { id: 'raketa', word: 'raketa', audioFile: 'raketa.m4a', writtenWord: 'RAKETA', shadowImage: 'raketa_senca.png', originalImage: 'raketa.png' },
  { id: 'ravnilo', word: 'ravnilo', audioFile: 'ravnilo.m4a', writtenWord: 'RAVNILO', shadowImage: 'ravnilo_senca.png', originalImage: 'ravnilo.png' },
  { id: 'rep', word: 'rep', audioFile: 'rep.m4a', writtenWord: 'REP', shadowImage: 'rep_senca.png', originalImage: 'rep.png' },
  { id: 'repa', word: 'repa', audioFile: 'repa.m4a', writtenWord: 'REPA', shadowImage: 'repa_senca.png', originalImage: 'repa.png' },
  { id: 'riba', word: 'riba', audioFile: 'riba.m4a', writtenWord: 'RIBA', shadowImage: 'riba_senca.png', originalImage: 'riba.png' },
  { id: 'ribez', word: 'ribez', audioFile: 'ribez.m4a', writtenWord: 'RIBEZ', shadowImage: 'ribez_senca.png', originalImage: 'ribez.png' },
  { id: 'ribic', word: 'ribič', audioFile: 'ribic.m4a', writtenWord: 'RIBIČ', shadowImage: 'ribic_senca.png', originalImage: 'ribic.png' },
  { id: 'ris', word: 'ris', audioFile: 'ris.m4a', writtenWord: 'RIS', shadowImage: 'ris_senca.png', originalImage: 'ris.png' },
  { id: 'riz', word: 'riž', audioFile: 'riz.m4a', writtenWord: 'RIŽ', shadowImage: 'riz_senca.png', originalImage: 'riz.png' },
  { id: 'robot', word: 'robot', audioFile: 'robot.m4a', writtenWord: 'ROBOT', shadowImage: 'robot_senca.png', originalImage: 'robot.png' },
  { id: 'roka', word: 'roka', audioFile: 'roka.m4a', writtenWord: 'ROKA', shadowImage: 'roka_senca.png', originalImage: 'roka.png' },
  { id: 'rokometas', word: 'rokometaš', audioFile: 'rokometas.m4a', writtenWord: 'ROKOMETAŠ', shadowImage: 'rokometas_senca.png', originalImage: 'rokometas.png' },
  { id: 'rolka', word: 'rolka', audioFile: 'rolka.m4a', writtenWord: 'ROLKA', shadowImage: 'rolka_senca.png', originalImage: 'rolka.png' },
  { id: 'ropotuljica', word: 'ropotuljica', audioFile: 'ropotuljica.m4a', writtenWord: 'ROPOTULJICA', shadowImage: 'ropotuljica_senca.png', originalImage: 'ropotuljica.png' },
  { id: 'roza', word: 'roža', audioFile: 'roza.m4a', writtenWord: 'ROŽA', shadowImage: 'roza_senca.png', originalImage: 'roza.png' }
];

// Four-column data for letter S
export const fourColumnMatchingDataS: FourColumnMatchingItem[] = [
  { id: 'sedem', word: 'sedem', audioFile: 'sedem.m4a', writtenWord: 'SEDEM', shadowImage: 'sedem_senca.png', originalImage: 'sedem.png' },
  { id: 'sir', word: 'sir', audioFile: 'sir.m4a', writtenWord: 'SIR', shadowImage: 'sir_senca.png', originalImage: 'sir.png' },
  { id: 'sladoled', word: 'sladoled', audioFile: 'sladoled.m4a', writtenWord: 'SLADOLED', shadowImage: 'sladoled_senca.png', originalImage: 'sladoled.png' },
  { id: 'slika', word: 'slika', audioFile: 'slika.m4a', writtenWord: 'SLIKA', shadowImage: 'slika_senca.png', originalImage: 'slika.png' },
  { id: 'slon', word: 'slon', audioFile: 'slon.m4a', writtenWord: 'SLON', shadowImage: 'slon_senca.png', originalImage: 'slon.png' },
  { id: 'sluz', word: 'sluz', audioFile: 'sluz.m4a', writtenWord: 'SLUZ', shadowImage: 'sluz_senca.png', originalImage: 'sluz.png' },
  { id: 'smreka', word: 'smreka', audioFile: 'smreka.m4a', writtenWord: 'SMREKA', shadowImage: 'smreka_senca.png', originalImage: 'smreka.png' },
  { id: 'sneg', word: 'sneg', audioFile: 'sneg.m4a', writtenWord: 'SNEG', shadowImage: 'sneg_senca.png', originalImage: 'sneg.png' },
  { id: 'snezak', word: 'snežak', audioFile: 'snezak.m4a', writtenWord: 'SNEŽAK', shadowImage: 'snezak_senca.png', originalImage: 'snezak.png' },
  { id: 'snezinka', word: 'snežinka', audioFile: 'snezinka.m4a', writtenWord: 'SNEŽINKA', shadowImage: 'snezinka_senca.png', originalImage: 'snezinka.png' },
  { id: 'sok', word: 'sok', audioFile: 'sok.m4a', writtenWord: 'SOK', shadowImage: 'sok_senca.png', originalImage: 'sok.png' },
  { id: 'sonce', word: 'sonce', audioFile: 'sonce.m4a', writtenWord: 'SONCE', shadowImage: 'sonce_senca.png', originalImage: 'sonce.png' },
  { id: 'sova', word: 'sova', audioFile: 'sova.m4a', writtenWord: 'SOVA', shadowImage: 'sova_senca.png', originalImage: 'sova.png' },
  { id: 'stol', word: 'stol', audioFile: 'stol.m4a', writtenWord: 'STOL', shadowImage: 'stol_senca.png', originalImage: 'stol.png' },
  { id: 'svetilka', word: 'svetilka', audioFile: 'svetilka.m4a', writtenWord: 'SVETILKA', shadowImage: 'svetilka_senca.png', originalImage: 'svetilka.png' },
  { id: 'svincnik', word: 'svinčnik', audioFile: 'svincnik.m4a', writtenWord: 'SVINČNIK', shadowImage: 'svincnik_senca.png', originalImage: 'svincnik.png' }
];

// Four-column data for letter Š
export const fourColumnMatchingDataŠ: FourColumnMatchingItem[] = [
  { id: 'sah', word: 'šah', audioFile: 'sah.m4a', writtenWord: 'ŠAH', shadowImage: 'sah_senca.png', originalImage: 'sah.png' },
  { id: 'sal', word: 'šal', audioFile: 'sal.m4a', writtenWord: 'ŠAL', shadowImage: 'sal_senca.png', originalImage: 'sal.png' },
  { id: 'scetka', word: 'ščetka', audioFile: 'scetka.m4a', writtenWord: 'ŠČETKA', shadowImage: 'scetka_senca.png', originalImage: 'scetka.png' },
  { id: 'skarje', word: 'škarje', audioFile: 'skarje.m4a', writtenWord: 'ŠKARJE', shadowImage: 'skarje_senca.png', originalImage: 'skarje.png' },
  { id: 'skatla', word: 'škatla', audioFile: 'skatla.m4a', writtenWord: 'ŠKATLA', shadowImage: 'skatla_senca.png', originalImage: 'skatla.png' },
  { id: 'skoljka', word: 'školjka', audioFile: 'skoljka.m4a', writtenWord: 'ŠKOLJKA', shadowImage: 'skoljka_senca.png', originalImage: 'skoljka.png' },
  { id: 'sopek', word: 'šopek', audioFile: 'sopek.m4a', writtenWord: 'ŠOPEK', shadowImage: 'sopek_senca.png', originalImage: 'sopek.png' },
  { id: 'sotor', word: 'šotor', audioFile: 'sotor.m4a', writtenWord: 'ŠOTOR', shadowImage: 'sotor_senca.png', originalImage: 'sotor.png' },
  { id: 'stampiljka', word: 'štampiljka', audioFile: 'stampiljka.m4a', writtenWord: 'ŠTAMPILJKA', shadowImage: 'stampiljka_senca.png', originalImage: 'stampiljka.png' },
  { id: 'storklja', word: 'štorklja', audioFile: 'storklja.m4a', writtenWord: 'ŠTORKLJA', shadowImage: 'storklja_senca.png', originalImage: 'storklja.png' }
];

// Four-column data for letter Z
export const fourColumnMatchingDataZ: FourColumnMatchingItem[] = [
  { id: 'zajec', word: 'zajec', audioFile: 'zajec.m4a', writtenWord: 'ZAJEC', shadowImage: 'zajec_senca.png', originalImage: 'zajec.png' },
  { id: 'zaslon', word: 'zaslon', audioFile: 'zaslon.m4a', writtenWord: 'ZASLON', shadowImage: 'zaslon_senca.png', originalImage: 'zaslon.png' },
  { id: 'zavesa', word: 'zavesa', audioFile: 'zavesa.m4a', writtenWord: 'ZAVESA', shadowImage: 'zavesa_senca.png', originalImage: 'zavesa.png' },
  { id: 'zebra', word: 'zebra', audioFile: 'zebra.m4a', writtenWord: 'ZEBRA', shadowImage: 'zebra_senca.png', originalImage: 'zebra.png' },
  { id: 'zlato', word: 'zlato', audioFile: 'zlato.m4a', writtenWord: 'ZLATO', shadowImage: 'zlato_senca.png', originalImage: 'zlato.png' },
  { id: 'zmaj', word: 'zmaj', audioFile: 'zmaj.m4a', writtenWord: 'ZMAJ', shadowImage: 'zmaj_senca.png', originalImage: 'zmaj.png' },
  { id: 'zob', word: 'zob', audioFile: 'zob.m4a', writtenWord: 'ZOB', shadowImage: 'zob_senca.png', originalImage: 'zob.png' },
  { id: 'zobotrebec', word: 'zobotrebec', audioFile: 'zobotrebec.m4a', writtenWord: 'ZOBOTREBEC', shadowImage: 'zobotrebec_senca.png', originalImage: 'zobotrebec.png' },
  { id: 'zvezda', word: 'zvezda', audioFile: 'zvezda.m4a', writtenWord: 'ZVEZDA', shadowImage: 'zvezda_senca.png', originalImage: 'zvezda.png' },
  { id: 'zvezek', word: 'zvezek', audioFile: 'zvezek.m4a', writtenWord: 'ZVEZEK', shadowImage: 'zvezek_senca.png', originalImage: 'zvezek.png' },
  { id: 'zvocnik', word: 'zvočnik', audioFile: 'zvocnik.m4a', writtenWord: 'ZVOČNIK', shadowImage: 'zvocnik_senca.png', originalImage: 'zvocnik.png' }
];

// Four-column data for letter Ž
export const fourColumnMatchingDataŽ: FourColumnMatchingItem[] = [
  { id: 'zaba', word: 'žaba', audioFile: 'zaba.m4a', writtenWord: 'ŽABA', shadowImage: 'zaba_senca.png', originalImage: 'zaba.png' },
  { id: 'zaga', word: 'žaga', audioFile: 'zaga.m4a', writtenWord: 'ŽAGA', shadowImage: 'zaga_senca.png', originalImage: 'zaga.png' },
  { id: 'zarnica', word: 'žarnica', audioFile: 'zarnica.m4a', writtenWord: 'ŽARNICA', shadowImage: 'zarnica_senca.png', originalImage: 'zarnica.png' },
  { id: 'zebelj', word: 'žebelj', audioFile: 'zebelj.m4a', writtenWord: 'ŽEBELJ', shadowImage: 'zebelj_senca.png', originalImage: 'zebelj.png' },
  { id: 'zelva', word: 'želva', audioFile: 'zelva.m4a', writtenWord: 'ŽELVA', shadowImage: 'zelva_senca.png', originalImage: 'zelva.png' },
  { id: 'zerjav', word: 'žerjav', audioFile: 'zerjav.m4a', writtenWord: 'ŽERJAV', shadowImage: 'zerjav_senca.png', originalImage: 'zerjav.png' },
  { id: 'zirafa', word: 'žirafa', audioFile: 'zirafa.m4a', writtenWord: 'ŽIRAFA', shadowImage: 'zirafa_senca.png', originalImage: 'zirafa.png' },
  { id: 'zlica', word: 'žlica', audioFile: 'zlica.m4a', writtenWord: 'ŽLICA', shadowImage: 'zlica_senca.png', originalImage: 'zlica.png' },
  { id: 'zoga', word: 'žoga', audioFile: 'zoga.m4a', writtenWord: 'ŽOGA', shadowImage: 'zoga_senca.png', originalImage: 'zoga.png' },
  { id: 'zolna', word: 'žolna', audioFile: 'zolna.m4a', writtenWord: 'ŽOLNA', shadowImage: 'zolna_senca.png', originalImage: 'zolna.png' }
];

// Function to get letter-specific data
export function getLetterMatchingData(letter: string): ThreeColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return threeColumnMatchingDataC;
    case 'č':
    case 'ch':
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
    case 'sh':
      return threeColumnMatchingDataŠ;
    case 'z':
      return threeColumnMatchingDataZ;
    case 'ž':
    case 'zh':
      return threeColumnMatchingDataŽ;
    default:
      console.warn(`Unknown letter: ${letter}, falling back to C`);
      return threeColumnMatchingDataC;
  }
}

// Function to get letter-specific four-column data
export function getFourColumnLetterData(letter: string): FourColumnMatchingItem[] {
  switch (letter.toLowerCase()) {
    case 'c':
      return fourColumnMatchingDataC;
    case 'č':
    case 'ch':
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
    case 'sh':
      return fourColumnMatchingDataŠ;
    case 'z':
      return fourColumnMatchingDataZ;
    case 'ž':
    case 'zh':
      return fourColumnMatchingDataŽ;
    default:
      console.warn(`Unknown letter: ${letter}, falling back to C`);
      return fourColumnMatchingDataC;
  }
}

export function getRandomThreeColumnItems(count: number = 4, letter?: string): ThreeColumnMatchingItem[] {
  const dataSet = letter ? getLetterMatchingData(letter) : threeColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, dataSet.length));
}

export function getRandomFourColumnItems(count: number = 4, letter?: string): FourColumnMatchingItem[] {
  const dataSet = letter ? getFourColumnLetterData(letter) : fourColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, dataSet.length));
}