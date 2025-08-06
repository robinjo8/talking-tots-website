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
  { id: 'cedilo', word: 'CEDILO', audioFile: 'CEDILO.m4a', shadowImage: 'cedilo_senca.png', originalImage: 'cedilo.png' },
  { id: 'cekin', word: 'CEKIN', audioFile: 'CEKIN.m4a', shadowImage: 'cekin_senca.png', originalImage: 'cekin.png' },
  { id: 'cerkev', word: 'CERKEV', audioFile: 'CERKEV.m4a', shadowImage: 'cerkev_senca.png', originalImage: 'cerkev.png' },
  { id: 'cesta', word: 'CESTA', audioFile: 'CESTA.m4a', shadowImage: 'cesta_senca.png', originalImage: 'cesta.png' },
  { id: 'cev', word: 'CEV', audioFile: 'CEV.m4a', shadowImage: 'cev_senca.png', originalImage: 'cev.png' },
  { id: 'cirkus', word: 'CIRKUS', audioFile: 'CIRKUS.m4a', shadowImage: 'cirkus_senca.png', originalImage: 'cirkus.png' },
  { id: 'cisterna', word: 'CISTERNA', audioFile: 'CISTERNA.m4a', shadowImage: 'cisterna_senca.png', originalImage: 'cisterna.png' },
  { id: 'cokla', word: 'COKLA', audioFile: 'COKLA.m4a', shadowImage: 'cokla_senca.png', originalImage: 'cokla.png' },
  { id: 'copat', word: 'COPAT', audioFile: 'COPAT.m4a', shadowImage: 'copat_senca.png', originalImage: 'copat.png' },
  { id: 'cvet', word: 'CVET', audioFile: 'CVET.m4a', shadowImage: 'cvet_senca.png', originalImage: 'cvet.png' }
];

// Data for letter Č
export const threeColumnMatchingDataČ: ThreeColumnMatchingItem[] = [
  { id: 'caj', word: 'ČAJ', audioFile: 'CAJ.m4a', shadowImage: 'caj_senca.png', originalImage: 'caj.png' },
  { id: 'casopis', word: 'ČASOPIS', audioFile: 'CASOPIS.m4a', shadowImage: 'casopis_senca.png', originalImage: 'casopis.png' },
  { id: 'cebela', word: 'ČEBELA', audioFile: 'CEBELA.m4a', shadowImage: 'cebela_senca.png', originalImage: 'cebela.png' },
  { id: 'cebula', word: 'ČEBULA', audioFile: 'CEBULA.m4a', shadowImage: 'cebula_senca.png', originalImage: 'cebula.png' },
  { id: 'cesen', word: 'ČESEN', audioFile: 'CESEN.m4a', shadowImage: 'cesen_senca.png', originalImage: 'cesen.png' },
  { id: 'cevlji', word: 'ČEVLJI', audioFile: 'CEVLJI.m4a', shadowImage: 'cevlji_senca.png', originalImage: 'cevlji.png' },
  { id: 'cokolada', word: 'ČOKOLADA', audioFile: 'COKOLADA.m4a', shadowImage: 'cokolada_senca.png', originalImage: 'cokolada.png' },
  { id: 'coln', word: 'ČOLN', audioFile: 'COLN.m4a', shadowImage: 'coln_senca.png', originalImage: 'coln.png' },
  { id: 'copic', word: 'ČOPIČ', audioFile: 'COPIC.m4a', shadowImage: 'copic_senca.png', originalImage: 'copic.png' },
  { id: 'crke', word: 'ČRKE', audioFile: 'CRKE.m4a', shadowImage: 'crke_senca.png', originalImage: 'crke.png' }
];

// Data for letter K
export const threeColumnMatchingDataK: ThreeColumnMatchingItem[] = [
  { id: 'kaca', word: 'KAČA', audioFile: 'KACA.m4a', shadowImage: 'kaca_senca.png', originalImage: 'kaca.png' },
  { id: 'kapa', word: 'KAPA', audioFile: 'KAPA.m4a', shadowImage: 'kapa_senca.png', originalImage: 'kapa.png' },
  { id: 'kava', word: 'KAVA', audioFile: 'KAVA.m4a', shadowImage: 'kava_senca.png', originalImage: 'kava.png' },
  { id: 'klavir', word: 'KLAVIR', audioFile: 'KLAVIR.m4a', shadowImage: 'klavir_senca.png', originalImage: 'klavir.png' },
  { id: 'kljuc', word: 'KLJUČ', audioFile: 'KLJUC.m4a', shadowImage: 'kljuc_senca.png', originalImage: 'kljuc.png' },
  { id: 'klop', word: 'KLOP', audioFile: 'KLOP.m4a', shadowImage: 'klop_senca.png', originalImage: 'klop.png' },
  { id: 'knjiga', word: 'KNJIGA', audioFile: 'KNJIGA.m4a', shadowImage: 'knjiga_senca.png', originalImage: 'knjiga.png' },
  { id: 'kocka', word: 'KOCKA', audioFile: 'KOCKA.m4a', shadowImage: 'kocka_senca.png', originalImage: 'kocka.png' },
  { id: 'kokos', word: 'KOKOŠ', audioFile: 'KOKOS.m4a', shadowImage: 'kokos_senca.png', originalImage: 'kokos.png' },
  { id: 'kolo', word: 'KOLO', audioFile: 'KOLO.m4a', shadowImage: 'kolo_senca.png', originalImage: 'kolo.png' }
];

// Data for letter L
export const threeColumnMatchingDataL: ThreeColumnMatchingItem[] = [
  { id: 'ladja', word: 'LADJA', audioFile: 'LADJA.m4a', shadowImage: 'ladja_senca.png', originalImage: 'ladja.png' },
  { id: 'led', word: 'LED', audioFile: 'LED.m4a', shadowImage: 'led_senca.png', originalImage: 'led.png' },
  { id: 'letalo', word: 'LETALO', audioFile: 'LETALO.m4a', shadowImage: 'letalo_senca.png', originalImage: 'letalo.png' },
  { id: 'lev', word: 'LEV', audioFile: 'LEV.m4a', shadowImage: 'lev_senca.png', originalImage: 'lev.png' },
  { id: 'list', word: 'LIST', audioFile: 'LIST.m4a', shadowImage: 'list_senca.png', originalImage: 'list.png' },
  { id: 'lizika', word: 'LIZIKA', audioFile: 'LIZIKA.m4a', shadowImage: 'lizika_senca.png', originalImage: 'lizika.png' },
  { id: 'lonec', word: 'LONEC', audioFile: 'LONEC.m4a', shadowImage: 'lonec_senca.png', originalImage: 'lonec.png' },
  { id: 'lopar', word: 'LOPAR', audioFile: 'LOPAR.m4a', shadowImage: 'lopar_senca.png', originalImage: 'lopar.png' },
  { id: 'lubenica', word: 'LUBENICA', audioFile: 'LUBENICA.m4a', shadowImage: 'lubenica_senca.png', originalImage: 'lubenica.png' },
  { id: 'luc', word: 'LUČ', audioFile: 'LUC.m4a', shadowImage: 'luc_senca.png', originalImage: 'luc.png' }
];

// Data for letter R
export const threeColumnMatchingDataR: ThreeColumnMatchingItem[] = [
  { id: 'raca', word: 'RACA', audioFile: 'RACA.m4a', shadowImage: 'raca_senca.png', originalImage: 'raca.png' },
  { id: 'rak', word: 'RAK', audioFile: 'RAK.m4a', shadowImage: 'rak_senca.png', originalImage: 'rak.png' },
  { id: 'raketa', word: 'RAKETA', audioFile: 'RAKETA.m4a', shadowImage: 'raketa_senca.png', originalImage: 'raketa.png' },
  { id: 'ravnilo', word: 'RAVNILO', audioFile: 'RAVNILO.m4a', shadowImage: 'ravnilo_senca.png', originalImage: 'ravnilo.png' },
  { id: 'rep', word: 'REP', audioFile: 'REP.m4a', shadowImage: 'rep_senca.png', originalImage: 'rep.png' },
  { id: 'repa', word: 'REPA', audioFile: 'REPA.m4a', shadowImage: 'repa_senca.png', originalImage: 'repa.png' },
  { id: 'riba', word: 'RIBA', audioFile: 'RIBA.m4a', shadowImage: 'riba_senca.png', originalImage: 'riba.png' },
  { id: 'robot', word: 'ROBOT', audioFile: 'ROBOT.m4a', shadowImage: 'robot_senca.png', originalImage: 'robot.png' },
  { id: 'roka', word: 'ROKA', audioFile: 'ROKA.m4a', shadowImage: 'roka_senca.png', originalImage: 'roka.png' },
  { id: 'rolka', word: 'ROLKA', audioFile: 'ROLKA.m4a', shadowImage: 'rolka_senca.png', originalImage: 'rolka.png' }
];

// Data for letter S
export const threeColumnMatchingDataS: ThreeColumnMatchingItem[] = [
  { id: 'sedem', word: 'SEDEM', audioFile: 'SEDEM.m4a', shadowImage: 'sedem_senca.png', originalImage: 'sedem.png' },
  { id: 'sir', word: 'SIR', audioFile: 'SIR.m4a', shadowImage: 'sir_senca.png', originalImage: 'sir.png' },
  { id: 'sladoled', word: 'SLADOLED', audioFile: 'SLADOLED.m4a', shadowImage: 'sladoled_senca.png', originalImage: 'sladoled.png' },
  { id: 'slika', word: 'SLIKA', audioFile: 'SLIKA.m4a', shadowImage: 'slika_senca.png', originalImage: 'slika.png' },
  { id: 'slon', word: 'SLON', audioFile: 'SLON.m4a', shadowImage: 'slon_senca.png', originalImage: 'slon.png' },
  { id: 'smreka', word: 'SMREKA', audioFile: 'SMREKA.m4a', shadowImage: 'smreka_senca.png', originalImage: 'smreka.png' },
  { id: 'sneg', word: 'SNEG', audioFile: 'SNEG.m4a', shadowImage: 'sneg_senca.png', originalImage: 'sneg.png' },
  { id: 'snezak', word: 'SNEŽAK', audioFile: 'SNEZAK.m4a', shadowImage: 'snezak_senca.png', originalImage: 'snezak.png' },
  { id: 'sok', word: 'SOK', audioFile: 'SOK.m4a', shadowImage: 'sok_senca.png', originalImage: 'sok.png' },
  { id: 'sonce', word: 'SONCE', audioFile: 'SONCE.m4a', shadowImage: 'sonce_senca.png', originalImage: 'sonce.png' }
];

// Data for letter Š
export const threeColumnMatchingDataŠ: ThreeColumnMatchingItem[] = [
  { id: 'sah', word: 'ŠAH', audioFile: 'SAH.m4a', shadowImage: 'sah_senca.png', originalImage: 'sah.png' },
  { id: 'sal', word: 'ŠAL', audioFile: 'SAL.m4a', shadowImage: 'sal_senca.png', originalImage: 'sal.png' },
  { id: 'scetka', word: 'ŠČETKA', audioFile: 'SCETKA.m4a', shadowImage: 'scetka_senca.png', originalImage: 'scetka.png' },
  { id: 'skarje', word: 'ŠKARJE', audioFile: 'SKARJE.m4a', shadowImage: 'skarje_senca.png', originalImage: 'skarje.png' },
  { id: 'skatla', word: 'ŠKATLA', audioFile: 'SKATLA.m4a', shadowImage: 'skatla_senca.png', originalImage: 'skatla.png' },
  { id: 'skoljka', word: 'ŠKOLJKA', audioFile: 'SKOLJKA.m4a', shadowImage: 'skoljka_senca.png', originalImage: 'skoljka.png' },
  { id: 'sopek', word: 'ŠOPEK', audioFile: 'SOPEK.m4a', shadowImage: 'sopek_senca.png', originalImage: 'sopek.png' },
  { id: 'sotor', word: 'ŠOTOR', audioFile: 'SOTOR.m4a', shadowImage: 'sotor_senca.png', originalImage: 'sotor.png' },
  { id: 'stampiljka', word: 'ŠTAMPILJKA', audioFile: 'STAMPILJKA.m4a', shadowImage: 'stampiljka_senca.png', originalImage: 'stampiljka.png' },
  { id: 'storklja', word: 'ŠTORKLJA', audioFile: 'STORKLJA.m4a', shadowImage: 'storklja_senca.png', originalImage: 'storklja.png' }
];

// Data for letter Z
export const threeColumnMatchingDataZ: ThreeColumnMatchingItem[] = [
  { id: 'zajec', word: 'ZAJEC', audioFile: 'ZAJEC.m4a', shadowImage: 'zajec_senca.png', originalImage: 'zajec.png' },
  { id: 'zaslon', word: 'ZASLON', audioFile: 'ZASLON.m4a', shadowImage: 'zaslon_senca.png', originalImage: 'zaslon.png' },
  { id: 'zavesa', word: 'ZAVESE', audioFile: 'ZAVESA.m4a', shadowImage: 'zavesa_senca.png', originalImage: 'zavesa.png' },
  { id: 'zebra', word: 'ZEBRA', audioFile: 'ZEBRA.m4a', shadowImage: 'zebra_senca.png', originalImage: 'zebra.png' },
  { id: 'zlato', word: 'ZLATO', audioFile: 'ZLATO.m4a', shadowImage: 'zlato_senca.png', originalImage: 'zlato.png' },
  { id: 'zmaj', word: 'ZMAJ', audioFile: 'ZMAJ.m4a', shadowImage: 'zmaj_senca.png', originalImage: 'zmaj.png' },
  { id: 'zob', word: 'ZOB', audioFile: 'ZOB.m4a', shadowImage: 'zob_senca.png', originalImage: 'zob.png' },
  { id: 'zobotrebec', word: 'ZOBOTREBEC', audioFile: 'ZOBOTREBEC.m4a', shadowImage: 'zobotrebec_senca.png', originalImage: 'zobotrebec.png' },
  { id: 'zvezda', word: 'ZVEZDA', audioFile: 'ZVEZDA.m4a', shadowImage: 'zvezda_senca.png', originalImage: 'zvezda.png' },
  { id: 'zvocnik', word: 'ZVOČNIK', audioFile: 'ZVOCNIK.m4a', shadowImage: 'zvocnik_senca.png', originalImage: 'zvocnik.png' }
];

// Data for letter Ž
export const threeColumnMatchingDataŽ: ThreeColumnMatchingItem[] = [
  { id: 'zaba', word: 'ŽABA', audioFile: 'ZABA.m4a', shadowImage: 'zaba_senca.png', originalImage: 'zaba.png' },
  { id: 'zaga', word: 'ŽAGA', audioFile: 'ZAGA.m4a', shadowImage: 'zaga_senca.png', originalImage: 'zaga.png' },
  { id: 'zarnica', word: 'ŽARNICA', audioFile: 'ZARNICA.m4a', shadowImage: 'zarnica_senca.png', originalImage: 'zarnica.png' },
  { id: 'zebelj', word: 'ŽEBELJ', audioFile: 'ZEBELJ.m4a', shadowImage: 'zebelj_senca.png', originalImage: 'zebelj.png' },
  { id: 'zelva', word: 'ŽELVA', audioFile: 'ZELVA.m4a', shadowImage: 'zelva_senca.png', originalImage: 'zelva.png' },
  { id: 'zerjav', word: 'ŽERJAV', audioFile: 'ZERJAV.m4a', shadowImage: 'zerjav_senca.png', originalImage: 'zerjav.png' },
  { id: 'zirafa', word: 'ŽIRAFA', audioFile: 'ZIRAFA.m4a', shadowImage: 'zirafa_senca.png', originalImage: 'zirafa.png' },
  { id: 'zlica', word: 'ŽLICA', audioFile: 'ZLICA.m4a', shadowImage: 'zlica_senca.png', originalImage: 'zlica.png' },
  { id: 'zoga', word: 'ŽOGA', audioFile: 'ZOGA.m4a', shadowImage: 'zoga_senca.png', originalImage: 'zoga.png' },
  { id: 'zolna', word: 'ŽOLNA', audioFile: 'ZOLNA.m4a', shadowImage: 'zolna_senca.png', originalImage: 'zolna.png' }
];

// Four-column data for 7-8 age group (letter C)
export const fourColumnMatchingDataC: FourColumnMatchingItem[] = [
  { id: 'cedilo', word: 'cedilo', audioFile: 'CEDILO.m4a', writtenWord: 'CEDILO', shadowImage: 'cedilo_senca.png', originalImage: 'cedilo.png' },
  { id: 'cekin', word: 'cekin', audioFile: 'CEKIN.m4a', writtenWord: 'CEKIN', shadowImage: 'cekin_senca.png', originalImage: 'cekin.png' },
  { id: 'cerkev', word: 'cerkev', audioFile: 'CERKEV.m4a', writtenWord: 'CERKEV', shadowImage: 'cerkev_senca.png', originalImage: 'cerkev.png' },
  { id: 'cesta', word: 'cesta', audioFile: 'CESTA.m4a', writtenWord: 'CESTA', shadowImage: 'cesta_senca.png', originalImage: 'cesta.png' },
  { id: 'cev', word: 'cev', audioFile: 'CEV.m4a', writtenWord: 'CEV', shadowImage: 'cev_senca.png', originalImage: 'cev.png' },
  { id: 'cirkus', word: 'cirkus', audioFile: 'CIRKUS.m4a', writtenWord: 'CIRKUS', shadowImage: 'cirkus_senca.png', originalImage: 'cirkus.png' },
  { id: 'cisterna', word: 'cisterna', audioFile: 'CISTERNA.m4a', writtenWord: 'CISTERNA', shadowImage: 'cisterna_senca.png', originalImage: 'cisterna.png' },
  { id: 'cokla', word: 'cokla', audioFile: 'COKLA.m4a', writtenWord: 'COKLA', shadowImage: 'cokla_senca.png', originalImage: 'cokla.png' },
  { id: 'copat', word: 'copat', audioFile: 'COPAT.m4a', writtenWord: 'COPAT', shadowImage: 'copat_senca.png', originalImage: 'copat.png' },
  { id: 'cvet', word: 'cvet', audioFile: 'CVET.m4a', writtenWord: 'CVET', shadowImage: 'cvet_senca.png', originalImage: 'cvet.png' }
];

// Four-column data for letter Č
export const fourColumnMatchingDataČ: FourColumnMatchingItem[] = [
  { id: 'caj', word: 'čaj', audioFile: 'CAJ.m4a', writtenWord: 'ČAJ', shadowImage: 'caj_senca.png', originalImage: 'caj.png' },
  { id: 'casopis', word: 'časopis', audioFile: 'CASOPIS.m4a', writtenWord: 'ČASOPIS', shadowImage: 'casopis_senca.png', originalImage: 'casopis.png' },
  { id: 'cebela', word: 'čebela', audioFile: 'CEBELA.m4a', writtenWord: 'ČEBELA', shadowImage: 'cebela_senca.png', originalImage: 'cebela.png' },
  { id: 'cebula', word: 'čebula', audioFile: 'CEBULA.m4a', writtenWord: 'ČEBULA', shadowImage: 'cebula_senca.png', originalImage: 'cebula.png' },
  { id: 'cesen', word: 'česen', audioFile: 'CESEN.m4a', writtenWord: 'ČESEN', shadowImage: 'cesen_senca.png', originalImage: 'cesen.png' },
  { id: 'cevlji', word: 'čevlji', audioFile: 'CEVLJI.m4a', writtenWord: 'ČEVLJI', shadowImage: 'cevlji_senca.png', originalImage: 'cevlji.png' },
  { id: 'cokolada', word: 'čokolada', audioFile: 'COKOLADA.m4a', writtenWord: 'ČOKOLADA', shadowImage: 'cokolada_senca.png', originalImage: 'cokolada.png' },
  { id: 'coln', word: 'čoln', audioFile: 'COLN.m4a', writtenWord: 'ČOLN', shadowImage: 'coln_senca.png', originalImage: 'coln.png' },
  { id: 'copic', word: 'čopič', audioFile: 'COPIC.m4a', writtenWord: 'ČOPIČ', shadowImage: 'copic_senca.png', originalImage: 'copic.png' },
  { id: 'crke', word: 'črke', audioFile: 'CRKE.m4a', writtenWord: 'ČRKE', shadowImage: 'crke_senca.png', originalImage: 'crke.png' }
];

// Four-column data for letter K
export const fourColumnMatchingDataK: FourColumnMatchingItem[] = [
  { id: 'kaca', word: 'kača', audioFile: 'KACA.m4a', writtenWord: 'KAČA', shadowImage: 'kaca_senca.png', originalImage: 'kaca.png' },
  { id: 'kapa', word: 'kapa', audioFile: 'KAPA.m4a', writtenWord: 'KAPA', shadowImage: 'kapa_senca.png', originalImage: 'kapa.png' },
  { id: 'kava', word: 'kava', audioFile: 'KAVA.m4a', writtenWord: 'KAVA', shadowImage: 'kava_senca.png', originalImage: 'kava.png' },
  { id: 'klavir', word: 'klavir', audioFile: 'KLAVIR.m4a', writtenWord: 'KLAVIR', shadowImage: 'klavir_senca.png', originalImage: 'klavir.png' },
  { id: 'kljuc', word: 'ključ', audioFile: 'KLJUC.m4a', writtenWord: 'KLJUČ', shadowImage: 'kljuc_senca.png', originalImage: 'kljuc.png' },
  { id: 'klop', word: 'klop', audioFile: 'KLOP.m4a', writtenWord: 'KLOP', shadowImage: 'klop_senca.png', originalImage: 'klop.png' },
  { id: 'knjiga', word: 'knjiga', audioFile: 'KNJIGA.m4a', writtenWord: 'KNJIGA', shadowImage: 'knjiga_senca.png', originalImage: 'knjiga.png' },
  { id: 'kocka', word: 'kocka', audioFile: 'KOCKA.m4a', writtenWord: 'KOCKA', shadowImage: 'kocka_senca.png', originalImage: 'kocka.png' },
  { id: 'kokos', word: 'kokoš', audioFile: 'KOKOS.m4a', writtenWord: 'KOKOŠ', shadowImage: 'kokos_senca.png', originalImage: 'kokos.png' },
  { id: 'kolo', word: 'kolo', audioFile: 'KOLO.m4a', writtenWord: 'KOLO', shadowImage: 'kolo_senca.png', originalImage: 'kolo.png' },
  { id: 'kost', word: 'kost', audioFile: 'KOST.m4a', writtenWord: 'KOST', shadowImage: 'kost_senca.png', originalImage: 'kost.png' },
  { id: 'kos', word: 'koš', audioFile: 'KOS.m4a', writtenWord: 'KOŠ', shadowImage: 'kos_senca.png', originalImage: 'kos.png' },
  { id: 'kosara', word: 'košara', audioFile: 'KOSARA.m4a', writtenWord: 'KOŠARA', shadowImage: 'kosara_senca.png', originalImage: 'kosara.png' },
  { id: 'koza', word: 'koza', audioFile: 'KOZA.m4a', writtenWord: 'KOZA', shadowImage: 'koza_senca.png', originalImage: 'koza.png' },
  { id: 'krava', word: 'krava', audioFile: 'KRAVA.m4a', writtenWord: 'KRAVA', shadowImage: 'krava_senca.png', originalImage: 'krava.png' },
  { id: 'krof', word: 'krof', audioFile: 'KROF.m4a', writtenWord: 'KROF', shadowImage: 'krof_senca.png', originalImage: 'krof.png' },
  { id: 'krog', word: 'krog', audioFile: 'KROG.m4a', writtenWord: 'KROG', shadowImage: 'krog_senca.png', originalImage: 'krog.png' },
  { id: 'kruh', word: 'kruh', audioFile: 'KRUH.m4a', writtenWord: 'KRUH', shadowImage: 'kruh_senca.png', originalImage: 'kruh.png' },
  { id: 'kumara', word: 'kumara', audioFile: 'KUMARA.m4a', writtenWord: 'KUMARA', shadowImage: 'kumara_senca.png', originalImage: 'kumara.png' },
  { id: 'kuza', word: 'kuža', audioFile: 'KUZA.m4a', writtenWord: 'KUŽA', shadowImage: 'kuza_senca.png', originalImage: 'kuza.png' }
];

// Four-column data for letter L
export const fourColumnMatchingDataL: FourColumnMatchingItem[] = [
  { id: 'ladja', word: 'ladja', audioFile: 'LADJA.m4a', writtenWord: 'LADJA', shadowImage: 'ladja_senca.png', originalImage: 'ladja.png' },
  { id: 'led', word: 'led', audioFile: 'LED.m4a', writtenWord: 'LED', shadowImage: 'led_senca.png', originalImage: 'led.png' },
  { id: 'letalo', word: 'letalo', audioFile: 'LETALO.m4a', writtenWord: 'LETALO', shadowImage: 'letalo_senca.png', originalImage: 'letalo.png' },
  { id: 'lev', word: 'lev', audioFile: 'LEV.m4a', writtenWord: 'LEV', shadowImage: 'lev_senca.png', originalImage: 'lev.png' },
  { id: 'list', word: 'list', audioFile: 'LIST.m4a', writtenWord: 'LIST', shadowImage: 'list_senca.png', originalImage: 'list.png' },
  { id: 'lizika', word: 'lizika', audioFile: 'LIZIKA.m4a', writtenWord: 'LIZIKA', shadowImage: 'lizika_senca.png', originalImage: 'lizika.png' },
  { id: 'lonec', word: 'lonec', audioFile: 'LONEC.m4a', writtenWord: 'LONEC', shadowImage: 'lonec_senca.png', originalImage: 'lonec.png' },
  { id: 'lopar', word: 'lopar', audioFile: 'LOPAR.m4a', writtenWord: 'LOPAR', shadowImage: 'lopar_senca.png', originalImage: 'lopar.png' },
  { id: 'lubenica', word: 'lubenica', audioFile: 'LUBENICA.m4a', writtenWord: 'LUBENICA', shadowImage: 'lubenica_senca.png', originalImage: 'lubenica.png' },
  { id: 'luc', word: 'luč', audioFile: 'LUC.m4a', writtenWord: 'LUČ', shadowImage: 'luc_senca.png', originalImage: 'luc.png' }
];

// Four-column data for letter R
export const fourColumnMatchingDataR: FourColumnMatchingItem[] = [
  { id: 'raca', word: 'raca', audioFile: 'RACA.m4a', writtenWord: 'RACA', shadowImage: 'raca_senca.png', originalImage: 'raca.png' },
  { id: 'rak', word: 'rak', audioFile: 'RAK.m4a', writtenWord: 'RAK', shadowImage: 'rak_senca.png', originalImage: 'rak.png' },
  { id: 'raketa', word: 'raketa', audioFile: 'RAKETA.m4a', writtenWord: 'RAKETA', shadowImage: 'raketa_senca.png', originalImage: 'raketa.png' },
  { id: 'ravnilo', word: 'ravnilo', audioFile: 'RAVNILO.m4a', writtenWord: 'RAVNILO', shadowImage: 'ravnilo_senca.png', originalImage: 'ravnilo.png' },
  { id: 'rep', word: 'rep', audioFile: 'REP.m4a', writtenWord: 'REP', shadowImage: 'rep_senca.png', originalImage: 'rep.png' },
  { id: 'repa', word: 'repa', audioFile: 'REPA.m4a', writtenWord: 'REPA', shadowImage: 'repa_senca.png', originalImage: 'repa.png' },
  { id: 'riba', word: 'riba', audioFile: 'RIBA.m4a', writtenWord: 'RIBA', shadowImage: 'riba_senca.png', originalImage: 'riba.png' },
  { id: 'robot', word: 'robot', audioFile: 'ROBOT.m4a', writtenWord: 'ROBOT', shadowImage: 'robot_senca.png', originalImage: 'robot.png' },
  { id: 'roka', word: 'roka', audioFile: 'ROKA.m4a', writtenWord: 'ROKA', shadowImage: 'roka_senca.png', originalImage: 'roka.png' },
  { id: 'rolka', word: 'rolka', audioFile: 'ROLKA.m4a', writtenWord: 'ROLKA', shadowImage: 'rolka_senca.png', originalImage: 'rolka.png' },
  { id: 'ropotuljica', word: 'ropotuljica', audioFile: 'ROPOTULJICA.m4a', writtenWord: 'ROPOTULJICA', shadowImage: 'ropotuljica_senca.png', originalImage: 'ropotuljica.png' },
  { id: 'roza', word: 'roža', audioFile: 'ROZA.m4a', writtenWord: 'ROŽA', shadowImage: 'roza_senca.png', originalImage: 'roza.png' }
];

// Four-column data for letter S
export const fourColumnMatchingDataS: FourColumnMatchingItem[] = [
  { id: 'sedem', word: 'sedem', audioFile: 'SEDEM.m4a', writtenWord: 'SEDEM', shadowImage: 'sedem_senca.png', originalImage: 'sedem.png' },
  { id: 'sir', word: 'sir', audioFile: 'SIR.m4a', writtenWord: 'SIR', shadowImage: 'sir_senca.png', originalImage: 'sir.png' },
  { id: 'sladoled', word: 'sladoled', audioFile: 'SLADOLED.m4a', writtenWord: 'SLADOLED', shadowImage: 'sladoled_senca.png', originalImage: 'sladoled.png' },
  { id: 'slika', word: 'slika', audioFile: 'SLIKA.m4a', writtenWord: 'SLIKA', shadowImage: 'slika_senca.png', originalImage: 'slika.png' },
  { id: 'slon', word: 'slon', audioFile: 'SLON.m4a', writtenWord: 'SLON', shadowImage: 'slon_senca.png', originalImage: 'slon.png' },
  { id: 'smreka', word: 'smreka', audioFile: 'SMREKA.m4a', writtenWord: 'SMREKA', shadowImage: 'smreka_senca.png', originalImage: 'smreka.png' },
  { id: 'sneg', word: 'sneg', audioFile: 'SNEG.m4a', writtenWord: 'SNEG', shadowImage: 'sneg_senca.png', originalImage: 'sneg.png' },
  { id: 'snezak', word: 'snežak', audioFile: 'SNEZAK.m4a', writtenWord: 'SNEŽAK', shadowImage: 'snezak_senca.png', originalImage: 'snezak.png' },
  { id: 'sok', word: 'sok', audioFile: 'SOK.m4a', writtenWord: 'SOK', shadowImage: 'sok_senca.png', originalImage: 'sok.png' },
  { id: 'sonce', word: 'sonce', audioFile: 'SONCE.m4a', writtenWord: 'SONCE', shadowImage: 'sonce_senca.png', originalImage: 'sonce.png' },
  { id: 'sova', word: 'sova', audioFile: 'SOVA.m4a', writtenWord: 'SOVA', shadowImage: 'sova_senca.png', originalImage: 'sova.png' },
  { id: 'stol', word: 'stol', audioFile: 'STOL.m4a', writtenWord: 'STOL', shadowImage: 'stol_senca.png', originalImage: 'stol.png' },
  { id: 'svetilka', word: 'svetilka', audioFile: 'SVETILKA.m4a', writtenWord: 'SVETILKA', shadowImage: 'svetilka_senca.png', originalImage: 'svetilka.png' },
  { id: 'svincnik', word: 'svinčnik', audioFile: 'SVINCNIK.m4a', writtenWord: 'SVINČNIK', shadowImage: 'svincnik_senca.png', originalImage: 'svincnik.png' }
];

// Four-column data for letter Š
export const fourColumnMatchingDataŠ: FourColumnMatchingItem[] = [
  { id: 'sah', word: 'šah', audioFile: 'SAH.m4a', writtenWord: 'ŠAH', shadowImage: 'sah_senca.png', originalImage: 'sah.png' },
  { id: 'sal', word: 'šal', audioFile: 'SAL.m4a', writtenWord: 'ŠAL', shadowImage: 'sal_senca.png', originalImage: 'sal.png' },
  { id: 'scetka', word: 'ščetka', audioFile: 'SCETKA.m4a', writtenWord: 'ŠČETKA', shadowImage: 'scetka_senca.png', originalImage: 'scetka.png' },
  { id: 'skarje', word: 'škarje', audioFile: 'SKARJE.m4a', writtenWord: 'ŠKARJE', shadowImage: 'skarje_senca.png', originalImage: 'skarje.png' },
  { id: 'skatla', word: 'škatla', audioFile: 'SKATLA.m4a', writtenWord: 'ŠKATLA', shadowImage: 'skatla_senca.png', originalImage: 'skatla.png' },
  { id: 'skoljka', word: 'školjka', audioFile: 'SKOLJKA.m4a', writtenWord: 'ŠKOLJKA', shadowImage: 'skoljka_senca.png', originalImage: 'skoljka.png' },
  { id: 'sopek', word: 'šopek', audioFile: 'SOPEK.m4a', writtenWord: 'ŠOPEK', shadowImage: 'sopek_senca.png', originalImage: 'sopek.png' },
  { id: 'sotor', word: 'šotor', audioFile: 'SOTOR.m4a', writtenWord: 'ŠOTOR', shadowImage: 'sotor_senca.png', originalImage: 'sotor.png' },
  { id: 'stampiljka', word: 'štampiljka', audioFile: 'STAMPILJKA.m4a', writtenWord: 'ŠTAMPILJKA', shadowImage: 'stampiljka_senca.png', originalImage: 'stampiljka.png' },
  { id: 'storklja', word: 'štorklja', audioFile: 'STORKLJA.m4a', writtenWord: 'ŠTORKLJA', shadowImage: 'storklja_senca.png', originalImage: 'storklja.png' }
];

// Four-column data for letter Z
export const fourColumnMatchingDataZ: FourColumnMatchingItem[] = [
  { id: 'zajec', word: 'zajec', audioFile: 'ZAJEC.m4a', writtenWord: 'ZAJEC', shadowImage: 'zajec_senca.png', originalImage: 'zajec.png' },
  { id: 'zaslon', word: 'zaslon', audioFile: 'ZASLON.m4a', writtenWord: 'ZASLON', shadowImage: 'zaslon_senca.png', originalImage: 'zaslon.png' },
  { id: 'zavesa', word: 'zavese', audioFile: 'ZAVESA.m4a', writtenWord: 'ZAVESE', shadowImage: 'zavesa_senca.png', originalImage: 'zavesa.png' },
  { id: 'zebra', word: 'zebra', audioFile: 'ZEBRA.m4a', writtenWord: 'ZEBRA', shadowImage: 'zebra_senca.png', originalImage: 'zebra.png' },
  { id: 'zlato', word: 'zlato', audioFile: 'ZLATO.m4a', writtenWord: 'ZLATO', shadowImage: 'zlato_senca.png', originalImage: 'zlato.png' },
  { id: 'zmaj', word: 'zmaj', audioFile: 'ZMAJ.m4a', writtenWord: 'ZMAJ', shadowImage: 'zmaj_senca.png', originalImage: 'zmaj.png' },
  { id: 'zob', word: 'zob', audioFile: 'ZOB.m4a', writtenWord: 'ZOB', shadowImage: 'zob_senca.png', originalImage: 'zob.png' },
  { id: 'zobotrebec', word: 'zobotrebec', audioFile: 'ZOBOTREBEC.m4a', writtenWord: 'ZOBOTREBEC', shadowImage: 'zobotrebec_senca.png', originalImage: 'zobotrebec.png' },
  { id: 'zvezda', word: 'zvezda', audioFile: 'ZVEZDA.m4a', writtenWord: 'ZVEZDA', shadowImage: 'zvezda_senca.png', originalImage: 'zvezda.png' },
  { id: 'zvocnik', word: 'zvočnik', audioFile: 'ZVOCNIK.m4a', writtenWord: 'ZVOČNIK', shadowImage: 'zvocnik_senca.png', originalImage: 'zvocnik.png' }
];

// Four-column data for letter Ž
export const fourColumnMatchingDataŽ: FourColumnMatchingItem[] = [
  { id: 'zaba', word: 'žaba', audioFile: 'ZABA.m4a', writtenWord: 'ŽABA', shadowImage: 'zaba_senca.png', originalImage: 'zaba.png' },
  { id: 'zaga', word: 'žaga', audioFile: 'ZAGA.m4a', writtenWord: 'ŽAGA', shadowImage: 'zaga_senca.png', originalImage: 'zaga.png' },
  { id: 'zarnica', word: 'žarnica', audioFile: 'ZARNICA.m4a', writtenWord: 'ŽARNICA', shadowImage: 'zarnica_senca.png', originalImage: 'zarnica.png' },
  { id: 'zebelj', word: 'žebelj', audioFile: 'ZEBELJ.m4a', writtenWord: 'ŽEBELJ', shadowImage: 'zebelj_senca.png', originalImage: 'zebelj.png' },
  { id: 'zelva', word: 'želva', audioFile: 'ZELVA.m4a', writtenWord: 'ŽELVA', shadowImage: 'zelva_senca.png', originalImage: 'zelva.png' },
  { id: 'zerjav', word: 'žerjav', audioFile: 'ZERJAV.m4a', writtenWord: 'ŽERJAV', shadowImage: 'zerjav_senca.png', originalImage: 'zerjav.png' },
  { id: 'zirafa', word: 'žirafa', audioFile: 'ZIRAFA.m4a', writtenWord: 'ŽIRAFA', shadowImage: 'zirafa_senca.png', originalImage: 'zirafa.png' },
  { id: 'zlica', word: 'žlica', audioFile: 'ZLICA.m4a', writtenWord: 'ŽLICA', shadowImage: 'zlica_senca.png', originalImage: 'zlica.png' },
  { id: 'zoga', word: 'žoga', audioFile: 'ZOGA.m4a', writtenWord: 'ŽOGA', shadowImage: 'zoga_senca.png', originalImage: 'zoga.png' },
  { id: 'zolna', word: 'žolna', audioFile: 'ZOLNA.m4a', writtenWord: 'ŽOLNA', shadowImage: 'zolna_senca.png', originalImage: 'zolna.png' }
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
  return shuffled.slice(0, Math.min(count, dataSet.length));
}

export function getRandomFourColumnItems(count: number = 4, letter?: string): FourColumnMatchingItem[] {
  const dataSet = letter ? getFourColumnLetterData(letter) : fourColumnMatchingDataC;
  const shuffled = [...dataSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, dataSet.length));
}