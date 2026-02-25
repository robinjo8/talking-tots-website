const BASE_URL = "https://tomitalk.lovable.app";

export interface RouteSeoData {
  title: string;
  description: string;
  canonical: string;
  ogImage?: string;
}

const defaultOgImage = `${BASE_URL}/icons/icon-512x512.png`;

export const seoMap: Record<string, RouteSeoData> = {
  "/": {
    title: "TomiTalk – Govorne igre in vaje za otroke | Logopedska podpora",
    description: "TomiTalk je interaktivna aplikacija za izboljšanje govora otrok. Govorne igre, vaje za izgovorjavo, artikulacijski test in logopedska podpora – razvito s strani logopedov.",
    canonical: BASE_URL + "/",
  },
  "/kako-deluje": {
    title: "Kako deluje TomiTalk – Govorne igre in vaje korak za korakom",
    description: "Spoznajte, kako TomiTalk pomaga otrokom pri razvoju govora z interaktivnimi igrami, vajami za izgovorjavo in artikulacijskim testom.",
    canonical: BASE_URL + "/kako-deluje",
  },
  "/kdo-smo": {
    title: "Kdo smo – Ekipa TomiTalk | Logopedi in razvijalci",
    description: "Spoznajte ekipo TomiTalk – logopede in razvijalce, ki ustvarjajo govorne igre in vaje za otroke s ciljem izboljšanja izgovorjave.",
    canonical: BASE_URL + "/kdo-smo",
  },
  "/kontakt": {
    title: "Kontakt – TomiTalk | Pišite nam",
    description: "Kontaktirajte ekipo TomiTalk za vprašanja o govornih igrah, vajah za izgovorjavo ali logopedski podpori za otroke.",
    canonical: BASE_URL + "/kontakt",
  },
  "/cenik": {
    title: "Cenik – TomiTalk | Naročniški paketi za govorne igre",
    description: "Preglejte naročniške pakete TomiTalk za posameznike in podjetja. Govorne igre, vaje za izgovorjavo in logopedska podpora.",
    canonical: BASE_URL + "/cenik",
  },
  "/informacije": {
    title: "Informacije – TomiTalk | Več o govornih igrah in vajah",
    description: "Vse informacije o TomiTalk aplikaciji – govorne igre, vaje za izgovorjavo, artikulacijski test in logopedska podpora za otroke.",
    canonical: BASE_URL + "/informacije",
  },
  "/za-posameznike": {
    title: "Za posameznike – TomiTalk | Govorne igre za vašega otroka",
    description: "TomiTalk za starše – govorne igre in vaje za izgovorjavo, prilagojene vašemu otroku. Spremljajte napredek in podprite razvoj govora.",
    canonical: BASE_URL + "/za-posameznike",
  },
  "/za-podjetja": {
    title: "Za podjetja – TomiTalk | Logopedska rešitev za ustanove",
    description: "TomiTalk za vrtce, šole in logopedske ordinacije. Profesionalna orodja za govorne vaje, artikulacijski test in spremljanje napredka.",
    canonical: BASE_URL + "/za-podjetja",
  },
  "/logopedski-koticek": {
    title: "Logopedski kotički – TomiTalk | Strokovni članki o govoru",
    description: "Strokovni članki o razvoju govora, motoriki govoril in govorno-jezikovnih težavah. Logopedski nasveti za starše otrok.",
    canonical: BASE_URL + "/logopedski-koticek",
  },
  "/clanki/razvoj-govora": {
    title: "Razvoj govora pri otrocih – TomiTalk | Logopedski članek",
    description: "Vse o razvoju govora pri otrocih – mejniki, znaki zaostanka in kako pomagati z govornimi igrami in vajami za izgovorjavo.",
    canonical: BASE_URL + "/clanki/razvoj-govora",
  },
  "/clanki/motorika-govoril": {
    title: "Motorika govoril – TomiTalk | Vaje za ustnice in jezik",
    description: "Naučite se vaj za motoriko govoril – vaje za ustnice, jezik in pravilno dihanje. Logopedski nasveti za starše.",
    canonical: BASE_URL + "/clanki/motorika-govoril",
  },
  "/clanki/govorno-jezikovne-tezave": {
    title: "Govorno-jezikovne težave – TomiTalk | Prepoznavanje in pomoč",
    description: "Prepoznajte govorno-jezikovne težave pri otrocih in odkrijte, kako TomiTalk pomaga z igrami in vajami za izboljšanje izgovorjave.",
    canonical: BASE_URL + "/clanki/govorno-jezikovne-tezave",
  },
  "/clanki/pogosta-vprasanja": {
    title: "Pogosta vprašanja – TomiTalk | Odgovori za starše",
    description: "Odgovori na pogosta vprašanja o TomiTalk – govorne igre, vaje za izgovorjavo, naročnine in logopedska podpora za otroke.",
    canonical: BASE_URL + "/clanki/pogosta-vprasanja",
  },
  "/pomoc-in-podpora": {
    title: "Pomoč in podpora – TomiTalk",
    description: "Potrebujete pomoč pri uporabi TomiTalk? Tukaj najdete odgovore na pogosta vprašanja in kontaktne podatke za podporo.",
    canonical: BASE_URL + "/pomoc-in-podpora",
  },
  "/splosni-pogoji": {
    title: "Splošni pogoji uporabe – TomiTalk",
    description: "Splošni pogoji uporabe aplikacije TomiTalk. Preberite pogoje pred registracijo in uporabo govornih iger.",
    canonical: BASE_URL + "/splosni-pogoji",
  },
  "/politika-zasebnosti": {
    title: "Politika zasebnosti – TomiTalk",
    description: "Politika zasebnosti TomiTalk. Kako varujemo vaše osebne podatke in podatke vašega otroka.",
    canonical: BASE_URL + "/politika-zasebnosti",
  },
  "/delovanje-testa": {
    title: "Delovanje artikulacijskega testa – TomiTalk",
    description: "Kako deluje artikulacijski test v TomiTalk? Preverite izgovorjavo glasov in spremljajte napredek vašega otroka.",
    canonical: BASE_URL + "/delovanje-testa",
  },
};

export function getSeoForPath(pathname: string): RouteSeoData {
  // Exact match first
  if (seoMap[pathname]) return { ogImage: defaultOgImage, ...seoMap[pathname] };

  // Fallback
  return {
    title: "TomiTalk – Govorne igre in vaje za otroke | Logopedska podpora",
    description: "TomiTalk je interaktivna aplikacija za izboljšanje govora otrok. Govorne igre, vaje za izgovorjavo, artikulacijski test in logopedska podpora – razvito s strani logopedov.",
    canonical: `https://tomitalk.lovable.app${pathname}`,
    ogImage: defaultOgImage,
  };
}
