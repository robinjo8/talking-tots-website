/**
 * Protected user page route definitions
 */
import { lazy } from 'react';
import { Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

const Profile = lazy(() => import('@/pages/Profile'));
const MojaStran = lazy(() => import('@/pages/MojaStran'));
const MojeAplikacije = lazy(() => import('@/pages/MojeAplikacije'));
const GovornojezicovneVaje = lazy(() => import('@/pages/GovornojezicovneVaje'));
const VajeMoториkeGovoril = lazy(() => import('@/pages/VajeMoториkeGovoril'));
const ArtIzgovorjavaPage = lazy(() => import('@/pages/ArtIzgovorjavaPage'));
const ArtikulacijaVaje = lazy(() => import('@/pages/ArtikulacijaVaje'));
const MojiIzzivi = lazy(() => import('@/pages/MojiIzzivi'));
const VideoNavodila = lazy(() => import('@/pages/VideoNavodila'));
const LogopedskiKoticek = lazy(() => import('@/pages/LogopedskiKoticek'));
const RazvojGovora = lazy(() => import('@/pages/RazvojGovora'));
const ArtikuacijskiTest = lazy(() => import('@/pages/ArtikuacijskiTest'));
const VajeZaJezik = lazy(() => import('@/pages/VajeZaJezik'));
const Sestavljanke = lazy(() => import('@/pages/Sestavljanke'));

// Artikulacija vaje komponente
const ArtikulacijaVajeC = lazy(() => import('@/pages/ArtikulacijaVajeC'));
const ArtikulacijaVajeČ = lazy(() => import('@/pages/ArtikulacijaVajeČ'));
const ArtikulacijaVajeK = lazy(() => import('@/pages/ArtikulacijaVajeK'));
const ArtikulacijaVajeL = lazy(() => import('@/pages/ArtikulacijaVajeL'));
const ArtikulacijaVajeR = lazy(() => import('@/pages/ArtikulacijaVajeR'));
const ArtikulacijaVajeS = lazy(() => import('@/pages/ArtikulacijaVajeS'));
const ArtikulacijaVajeŠ = lazy(() => import('@/pages/ArtikulacijaVajeŠ'));
const ArtikulacijaVajeZ = lazy(() => import('@/pages/ArtikulacijaVajeZ'));
const ArtikulacijaVajeŽ = lazy(() => import('@/pages/ArtikulacijaVajeŽ'));

// Sredina/Konec vaje
const ArtikulacijaVajeRSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeRSredinaKonec'));
const ArtikulacijaVajeCSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeCSredinaKonec'));
const ArtikulacijaVajeČSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeČSredinaKonec'));
const ArtikulacijaVajeKSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeKSredinaKonec'));
const ArtikulacijaVajeLSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeLSredinaKonec'));
const ArtikulacijaVajeSSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeSSredinaKonec'));
const ArtikulacijaVajeŠSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeŠSredinaKonec'));
const ArtikulacijaVajeZSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeZSredinaKonec'));
const ArtikulacijaVajeŽSredinaKonec = lazy(() => import('@/pages/ArtikulacijaVajeŽSredinaKonec'));

// Video navodila
const VideoNavodilaCrkaR = lazy(() => import('@/pages/VideoNavodilaCrkaR'));
const VideoNavodilaCrkaC = lazy(() => import('@/pages/VideoNavodilaCrkaC'));
const VideoNavodilaCrkaČ = lazy(() => import('@/pages/VideoNavodilaCrkaČ'));
const VideoNavodilaCrkaK = lazy(() => import('@/pages/VideoNavodilaCrkaK'));
const VideoNavodilaCrkaL = lazy(() => import('@/pages/VideoNavodilaCrkaL'));
const VideoNavodilaCrkaS = lazy(() => import('@/pages/VideoNavodilaCrkaS'));
const VideoNavodilaCrkaŠ = lazy(() => import('@/pages/VideoNavodilaCrkaŠ'));
const VideoNavodilaCrkaZ = lazy(() => import('@/pages/VideoNavodilaCrkaZ'));
const VideoNavodilaCrkaŽ = lazy(() => import('@/pages/VideoNavodilaCrkaŽ'));

// Matching games
const MatchingGames3to4 = lazy(() => import('@/pages/MatchingGames3to4'));
const MatchingGames5to6 = lazy(() => import('@/pages/MatchingGames5to6'));
const MatchingGameLetter = lazy(() => import('@/pages/MatchingGameLetter'));
const MatchingGameR3to4 = lazy(() => import('@/pages/MatchingGameR3to4'));

// Routers
const SestavljankeRRouter = lazy(() => import('@/pages/SestavljankeRRouter'));
const SestavljankeX = lazy(() => import('@/pages/SestavljankeX'));
const DrsnaSestavljanka34Router = lazy(() => import('@/pages/DrsnaSestavljanka34Router'));
const LabirintX = lazy(() => import('@/pages/LabirintX'));
const LabirintC = lazy(() => import('@/pages/LabirintC'));

// Index for dashboard
import Index from '@/pages/Index';

export function ProtectedUserRoutes(): JSX.Element[] {
  return [
    <Route key="dashboard" path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />,
    <Route key="profile" path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />,
    <Route key="moja-stran" path="/moja-stran" element={<ProtectedRoute><MojaStran /></ProtectedRoute>} />,
    <Route key="moje-aplikacije" path="/moje-aplikacije" element={<ProtectedRoute><MojeAplikacije /></ProtectedRoute>} />,
    <Route key="govornojezicovne-vaje" path="/govornojezicovne-vaje" element={<ProtectedRoute><GovornojezicovneVaje /></ProtectedRoute>} />,
    <Route key="vaje-motorike-govoril" path="/vaje-motorike-govoril" element={<ProtectedRoute><VajeMoториkeGovoril /></ProtectedRoute>} />,
    <Route key="art-izgovorjava" path="/art-izgovorjava" element={<ProtectedRoute><ArtIzgovorjavaPage /></ProtectedRoute>} />,
    <Route key="artikulacija-vaje" path="/artikulacija-vaje" element={<ProtectedRoute><ArtikulacijaVaje /></ProtectedRoute>} />,
    <Route key="moji-izzivi" path="/moji-izzivi" element={<ProtectedRoute><MojiIzzivi /></ProtectedRoute>} />,
    <Route key="video-navodila" path="/video-navodila" element={<ProtectedRoute><VideoNavodila /></ProtectedRoute>} />,
    <Route key="logopedski-koticek" path="/logopedski-koticek" element={<ProtectedRoute><LogopedskiKoticek /></ProtectedRoute>} />,
    <Route key="razvoj-govora" path="/logopedski-koticek/razvoj-govora" element={<ProtectedRoute><RazvojGovora /></ProtectedRoute>} />,
    <Route key="artikulacijski-test" path="/artikulacijski-test" element={<ProtectedRoute><ArtikuacijskiTest /></ProtectedRoute>} />,
    <Route key="vaje-za-jezik" path="/vaje-za-jezik" element={<ProtectedRoute><VajeZaJezik /></ProtectedRoute>} />,
    <Route key="sestavljanke" path="/sestavljanke" element={<ProtectedRoute><Sestavljanke /></ProtectedRoute>} />,
    
    // Artikulacija vaje - posamezne črke
    <Route key="art-vaje-c" path="/artikulacija-vaje/c" element={<ProtectedRoute><ArtikulacijaVajeC /></ProtectedRoute>} />,
    <Route key="art-vaje-č" path="/artikulacija-vaje/č" element={<ProtectedRoute><ArtikulacijaVajeČ /></ProtectedRoute>} />,
    <Route key="art-vaje-k" path="/artikulacija-vaje/k" element={<ProtectedRoute><ArtikulacijaVajeK /></ProtectedRoute>} />,
    <Route key="art-vaje-l" path="/artikulacija-vaje/l" element={<ProtectedRoute><ArtikulacijaVajeL /></ProtectedRoute>} />,
    <Route key="art-vaje-r" path="/artikulacija-vaje/r" element={<ProtectedRoute><ArtikulacijaVajeR /></ProtectedRoute>} />,
    <Route key="art-vaje-s" path="/artikulacija-vaje/s" element={<ProtectedRoute><ArtikulacijaVajeS /></ProtectedRoute>} />,
    <Route key="art-vaje-š" path="/artikulacija-vaje/š" element={<ProtectedRoute><ArtikulacijaVajeŠ /></ProtectedRoute>} />,
    <Route key="art-vaje-z" path="/artikulacija-vaje/z" element={<ProtectedRoute><ArtikulacijaVajeZ /></ProtectedRoute>} />,
    <Route key="art-vaje-ž" path="/artikulacija-vaje/ž" element={<ProtectedRoute><ArtikulacijaVajeŽ /></ProtectedRoute>} />,
    
    // Artikulacija vaje - sredina/konec
    <Route key="art-vaje-r-sk" path="/artikulacija-vaje/r-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeRSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-c-sk" path="/artikulacija-vaje/c-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeCSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-č-sk" path="/artikulacija-vaje/č-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeČSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-k-sk" path="/artikulacija-vaje/k-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeKSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-l-sk" path="/artikulacija-vaje/l-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeLSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-s-sk" path="/artikulacija-vaje/s-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeSSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-š-sk" path="/artikulacija-vaje/š-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeŠSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-z-sk" path="/artikulacija-vaje/z-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeZSredinaKonec /></ProtectedRoute>} />,
    <Route key="art-vaje-ž-sk" path="/artikulacija-vaje/ž-sredina-konec" element={<ProtectedRoute><ArtikulacijaVajeŽSredinaKonec /></ProtectedRoute>} />,
    
    // Video navodila - posamezne črke
    <Route key="video-r" path="/video-navodila/r" element={<ProtectedRoute><VideoNavodilaCrkaR /></ProtectedRoute>} />,
    <Route key="video-c" path="/video-navodila/c" element={<ProtectedRoute><VideoNavodilaCrkaC /></ProtectedRoute>} />,
    <Route key="video-č" path="/video-navodila/č" element={<ProtectedRoute><VideoNavodilaCrkaČ /></ProtectedRoute>} />,
    <Route key="video-k" path="/video-navodila/k" element={<ProtectedRoute><VideoNavodilaCrkaK /></ProtectedRoute>} />,
    <Route key="video-l" path="/video-navodila/l" element={<ProtectedRoute><VideoNavodilaCrkaL /></ProtectedRoute>} />,
    <Route key="video-s" path="/video-navodila/s" element={<ProtectedRoute><VideoNavodilaCrkaS /></ProtectedRoute>} />,
    <Route key="video-š" path="/video-navodila/š" element={<ProtectedRoute><VideoNavodilaCrkaŠ /></ProtectedRoute>} />,
    <Route key="video-z" path="/video-navodila/z" element={<ProtectedRoute><VideoNavodilaCrkaZ /></ProtectedRoute>} />,
    <Route key="video-ž" path="/video-navodila/ž" element={<ProtectedRoute><VideoNavodilaCrkaŽ /></ProtectedRoute>} />,
    
    // Matching games
    <Route key="matching-3-4" path="/matching-games-3-to-4" element={<ProtectedRoute><MatchingGames3to4 /></ProtectedRoute>} />,
    <Route key="matching-5-6" path="/matching-games-5-to-6" element={<ProtectedRoute><MatchingGames5to6 /></ProtectedRoute>} />,
    <Route key="matching-letter" path="/matching-game/:letter" element={<ProtectedRoute><MatchingGameLetter /></ProtectedRoute>} />,
    <Route key="matching-r-3-4" path="/matching-game-r-3-to-4" element={<ProtectedRoute><MatchingGameR3to4 /></ProtectedRoute>} />,
    
    // Routers
    <Route key="sest-r-router" path="/sestavljanke-r-router/:ageGroup" element={<ProtectedRoute><SestavljankeRRouter /></ProtectedRoute>} />,
    <Route key="sest-x" path="/sestavljanke-x/:letter/:ageGroup" element={<ProtectedRoute><SestavljankeX /></ProtectedRoute>} />,
    <Route key="drsna-34-router" path="/drsna-sestavljanka-34/:letter" element={<ProtectedRoute><DrsnaSestavljanka34Router /></ProtectedRoute>} />,
    <Route key="labirint-x" path="/labirint-x/:letter" element={<ProtectedRoute><LabirintX /></ProtectedRoute>} />,
    <Route key="labirint-c-old" path="/labirint-c" element={<ProtectedRoute><LabirintC /></ProtectedRoute>} />,
  ];
}
