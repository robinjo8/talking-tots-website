import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Critical pages - loaded immediately (auth flow)
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import AuthConfirm from "@/pages/AuthConfirm";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";

// Loading fallback component
function PageLoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-app-blue" />
    </div>
  );
}

// Helper component for lazy routes (public)
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      {children}
    </Suspense>
  );
}

// Helper component for protected lazy routes (combines ProtectedRoute + Suspense)
function ProtectedLazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Suspense fallback={<PageLoadingFallback />}>
        {children}
      </Suspense>
    </ProtectedRoute>
  );
}

// Lazy loaded pages - split into separate chunks
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("@/pages/PaymentCanceled"));

// Protected pages
const Profile = lazy(() => import("@/pages/Profile"));
const MojaStran = lazy(() => import("@/pages/MojaStran"));
const MojeAplikacije = lazy(() => import("@/pages/MojeAplikacije"));
const GovorneIgre = lazy(() => import("@/pages/GovorneIgre"));

// Govorno-jezikovne vaje
const GovornojezicovneVaje = lazy(() => import("@/pages/GovornojezicovneVaje"));
const VajeMoториkeGovoril = lazy(() => import("@/pages/VajeMoториkeGovoril"));
const VajeZaJezik = lazy(() => import("@/pages/VajeZaJezik"));
const ArtikulacijaVaje = lazy(() => import("@/pages/ArtikulacijaVaje"));
const ArtIzgovorjavaPage = lazy(() => import("@/pages/ArtIzgovorjavaPage"));

// Game pages
const SpominGames = lazy(() => import("@/pages/SpominGames"));
const Zaporedja = lazy(() => import("@/pages/Zaporedja"));
const IgraUjemanja = lazy(() => import("@/pages/IgraUjemanja"));
const Sestavljanke = lazy(() => import("@/pages/Sestavljanke"));
const DrsnaSestavljanka = lazy(() => import("@/pages/DrsnaSestavljanka"));
const SestavljankeGames = lazy(() => import("@/pages/SestavljankeGames"));
const Labirint = lazy(() => import("@/pages/Labirint"));
const KoloSreceGames = lazy(() => import("@/pages/KoloSreceGames"));
const BingoGames = lazy(() => import("@/pages/BingoGames"));
const ArtikuacijskiTest = lazy(() => import("@/pages/ArtikuacijskiTest"));
const MojiIzzivi = lazy(() => import("@/pages/MojiIzzivi"));
const VideoNavodila = lazy(() => import("@/pages/VideoNavodila"));
const MetKockeGames = lazy(() => import("@/pages/MetKockeGames"));

// Informational pages
const LogopedskiKoticek = lazy(() => import("@/pages/LogopedskiKoticek"));
const RazvojGovora = lazy(() => import("@/pages/RazvojGovora"));
const MotorikaGovoril = lazy(() => import("@/pages/MotorikaGovoril"));
const PogostaVprasanja = lazy(() => import("@/pages/clanki/PogostaVprasanja"));

// Game routers
const SpominRouter = lazy(() => import("@/components/routing/SpominRouter"));
const ZaporedjaRouter = lazy(() => import("@/components/routing/ZaporedjaRouter"));
const SestavljankeRouter = lazy(() => import("@/components/routing/SestavljankeRouter"));
const DrsnaSestavljankaRouter = lazy(() => import("@/components/routing/DrsnaSestavljankaRouter"));
const PoveziPareRouter = lazy(() => import("@/components/routing/PoveziPareRouter"));
const IgraUjemanjaRouter = lazy(() => import("@/components/routing/IgraUjemanjaRouter"));
const ArtikulacijaVajeRouter = lazy(() => import("@/components/routing/ArtikulacijaVajeRouter"));
const VideoNavodilaRouter = lazy(() => import("@/components/routing/VideoNavodilaRouter"));
const LabirintRouter = lazy(() => import("@/components/routing/LabirintRouter"));
const KoloSreceRouter = lazy(() => import("@/components/routing/KoloSreceRouter"));
const BingoRouter = lazy(() => import("@/components/routing/BingoRouter"));
const MetKockeRouter = lazy(() => import("@/components/routing/MetKockeRouter"));
const AdminRoutes = lazy(() => import("@/components/routing/AdminRoutes"));

// Footer pages
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const SplosniPogoji = lazy(() => import("@/pages/SplosniPogoji"));
const PolitikaZasebnosti = lazy(() => import("@/pages/PolitikaZasebnosti"));
const ZaPosameznike = lazy(() => import("@/pages/ZaPosameznike"));
const ZaPodjetja = lazy(() => import("@/pages/ZaPodjetja"));
const PomocInPodpora = lazy(() => import("@/pages/PomocInPodpora"));
const KakoDeluje = lazy(() => import("@/pages/KakoDeluje"));
const Cenik = lazy(() => import("@/pages/Cenik"));
const DelovanjeTest = lazy(() => import("@/pages/DelovanjeTest"));

export function AppRoutes() {
  return (
    <Routes>
      {/* Critical routes - no lazy loading */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/confirm" element={<AuthConfirm />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
      {/* Payment routes - lazy */}
      <Route path="/payment-success" element={<LazyRoute><PaymentSuccess /></LazyRoute>} />
      <Route path="/payment-canceled" element={<LazyRoute><PaymentCanceled /></LazyRoute>} />
      
      {/* Protected routes - using ProtectedLazyRoute helper */}
      <Route path="/dashboard" element={<ProtectedRoute><Index /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedLazyRoute><Profile /></ProtectedLazyRoute>} />
      <Route path="/moja-stran" element={<ProtectedLazyRoute><MojaStran /></ProtectedLazyRoute>} />
      <Route path="/moje-aplikacije" element={<ProtectedLazyRoute><MojeAplikacije /></ProtectedLazyRoute>} />
      
      {/* Govorno-jezikovne vaje */}
      <Route path="/govorno-jezikovne-vaje" element={<ProtectedLazyRoute><GovornojezicovneVaje /></ProtectedLazyRoute>} />
      <Route path="/govorno-jezikovne-vaje/vaje-motorike-govoril" element={<ProtectedLazyRoute><VajeMoториkeGovoril /></ProtectedLazyRoute>} />
      <Route path="/govorno-jezikovne-vaje/vaje-za-jezik" element={<ProtectedLazyRoute><VajeZaJezik /></ProtectedLazyRoute>} />
      <Route path="/govorno-jezikovne-vaje/artikulacija" element={<ProtectedLazyRoute><ArtikulacijaVaje /></ProtectedLazyRoute>} />
      <Route path="/govorno-jezikovne-vaje/artikulacija/:gameId" element={<ProtectedLazyRoute><ArtikulacijaVajeRouter /></ProtectedLazyRoute>} />
      
      {/* Artikulacija routes */}
      <Route path="/artikulacija" element={<ProtectedLazyRoute><ArtIzgovorjavaPage /></ProtectedLazyRoute>} />
      <Route path="/artikulacija/:letter" element={<ProtectedLazyRoute><ArtIzgovorjavaPage /></ProtectedLazyRoute>} />
      <Route path="/artikulacijski-test" element={<ProtectedLazyRoute><ArtikuacijskiTest /></ProtectedLazyRoute>} />
      
      {/* Govorne igre */}
      <Route path="/govorne-igre" element={<ProtectedLazyRoute><GovorneIgre /></ProtectedLazyRoute>} />
      
      {/* Kolo sreče routes */}
      <Route path="/govorne-igre/kolo-srece" element={<ProtectedLazyRoute><KoloSreceGames /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/kolo-srece/:letter" element={<ProtectedLazyRoute><KoloSreceRouter /></ProtectedLazyRoute>} />
      
      {/* Bingo routes */}
      <Route path="/govorne-igre/bingo" element={<ProtectedLazyRoute><BingoGames /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/bingo/:letter" element={<ProtectedLazyRoute><BingoRouter /></ProtectedLazyRoute>} />
      
      {/* Sestavljanke routes */}
      <Route path="/govorne-igre/sestavljanke" element={<ProtectedLazyRoute><SestavljankeGames /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/sestavljanke/:letterAndAge" element={<ProtectedLazyRoute><SestavljankeRouter /></ProtectedLazyRoute>} />
      
      {/* Drsna sestavljanka routes */}
      <Route path="/govorne-igre/drsna-sestavljanka" element={<ProtectedLazyRoute><DrsnaSestavljanka /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/drsna-sestavljanka/:letterAndAge" element={<ProtectedLazyRoute><DrsnaSestavljankaRouter /></ProtectedLazyRoute>} />
      
      {/* Spomin routes */}
      <Route path="/govorne-igre/spomin" element={<ProtectedLazyRoute><SpominGames /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/spomin/:gameId" element={<ProtectedLazyRoute><SpominRouter /></ProtectedLazyRoute>} />
      
      {/* Labirint routes */}
      <Route path="/govorne-igre/labirint" element={<ProtectedLazyRoute><Labirint /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/labirint/:letter" element={<ProtectedLazyRoute><LabirintRouter /></ProtectedLazyRoute>} />
      
      {/* Met kocke routes */}
      <Route path="/govorne-igre/met-kocke" element={<ProtectedLazyRoute><MetKockeGames /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/met-kocke/:letter" element={<ProtectedLazyRoute><MetKockeRouter /></ProtectedLazyRoute>} />
      
      {/* Povezi pare routes */}
      <Route path="/govorne-igre/povezi-pare/:ageGroup" element={<ProtectedLazyRoute><PoveziPareRouter /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/povezi-pare/:ageGroup/:letter" element={<ProtectedLazyRoute><PoveziPareRouter /></ProtectedLazyRoute>} />

      {/* Igra ujemanja routes */}
      <Route path="/govorne-igre/igra-ujemanja" element={<ProtectedLazyRoute><IgraUjemanja /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/igra-ujemanja/:letterAndAge" element={<ProtectedLazyRoute><IgraUjemanjaRouter /></ProtectedLazyRoute>} />
      
      {/* Zaporedja routes */}
      <Route path="/govorne-igre/zaporedja" element={<ProtectedLazyRoute><Zaporedja /></ProtectedLazyRoute>} />
      <Route path="/govorne-igre/zaporedja/:letterAndAge" element={<ProtectedLazyRoute><ZaporedjaRouter /></ProtectedLazyRoute>} />

      {/* Other protected routes */}
      <Route path="/moji-izzivi" element={<ProtectedLazyRoute><MojiIzzivi /></ProtectedLazyRoute>} />
      <Route path="/video-navodila" element={<ProtectedLazyRoute><VideoNavodila /></ProtectedLazyRoute>} />
      <Route path="/video-navodila/:letter" element={<ProtectedLazyRoute><VideoNavodilaRouter /></ProtectedLazyRoute>} />
      
      {/* Informational pages - lazy */}
      <Route path="/logopedski-koticek" element={<LazyRoute><LogopedskiKoticek /></LazyRoute>} />
      <Route path="/clanki/razvoj-govora" element={<LazyRoute><RazvojGovora /></LazyRoute>} />
      <Route path="/clanki/motorika-govoril" element={<LazyRoute><MotorikaGovoril /></LazyRoute>} />
      <Route path="/clanki/pogosta-vprasanja" element={<LazyRoute><PogostaVprasanja /></LazyRoute>} />

      {/* Admin Portal Routes */}
      <Route path="/admin/*" element={<LazyRoute><AdminRoutes /></LazyRoute>} />

      {/* Footer pages - lazy */}
      <Route path="/kontakt" element={<LazyRoute><Kontakt /></LazyRoute>} />
      <Route path="/splosni-pogoji" element={<LazyRoute><SplosniPogoji /></LazyRoute>} />
      <Route path="/politika-zasebnosti" element={<LazyRoute><PolitikaZasebnosti /></LazyRoute>} />
      <Route path="/za-posameznike" element={<LazyRoute><ZaPosameznike /></LazyRoute>} />
      <Route path="/za-podjetja" element={<LazyRoute><ZaPodjetja /></LazyRoute>} />
      <Route path="/pomoc-in-podpora" element={<LazyRoute><PomocInPodpora /></LazyRoute>} />
      <Route path="/kako-deluje" element={<LazyRoute><KakoDeluje /></LazyRoute>} />
      <Route path="/cenik" element={<LazyRoute><Cenik /></LazyRoute>} />
      <Route path="/delovanje-testa" element={<LazyRoute><DelovanjeTest /></LazyRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
