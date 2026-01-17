/**
 * Static page route definitions
 */
import { lazy } from 'react';
import { Route } from 'react-router-dom';

const Kontakt = lazy(() => import('@/pages/Kontakt'));
const SplosniPogoji = lazy(() => import('@/pages/SplosniPogoji'));
const PolitikaZasebnosti = lazy(() => import('@/pages/PolitikaZasebnosti'));
const ZaPosameznike = lazy(() => import('@/pages/ZaPosameznike'));
const ZaPodjetja = lazy(() => import('@/pages/ZaPodjetja'));
const PomocInPodpora = lazy(() => import('@/pages/PomocInPodpora'));
const KakoDeluje = lazy(() => import('@/pages/KakoDeluje'));
const Cenik = lazy(() => import('@/pages/Cenik'));
const DelovanjeTest = lazy(() => import('@/pages/DelovanjeTest'));

export function StaticRoutes(): JSX.Element[] {
  return [
    <Route key="kontakt" path="/kontakt" element={<Kontakt />} />,
    <Route key="splosni-pogoji" path="/splosni-pogoji" element={<SplosniPogoji />} />,
    <Route key="politika-zasebnosti" path="/politika-zasebnosti" element={<PolitikaZasebnosti />} />,
    <Route key="za-posameznike" path="/za-posameznike" element={<ZaPosameznike />} />,
    <Route key="za-podjetja" path="/za-podjetja" element={<ZaPodjetja />} />,
    <Route key="pomoc-in-podpora" path="/pomoc-in-podpora" element={<PomocInPodpora />} />,
    <Route key="kako-deluje" path="/kako-deluje" element={<KakoDeluje />} />,
    <Route key="cenik" path="/cenik" element={<Cenik />} />,
    <Route key="delovanje-test" path="/delovanje-test" element={<DelovanjeTest />} />,
  ];
}
