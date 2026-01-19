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

// Helper component for lazy routes
function LazyRoute({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PageLoadingFallback />}>
      {children}
    </Suspense>
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
const ArtikuacijskiTest = lazy(() => import("@/pages/ArtikuacijskiTest"));
const MojiIzzivi = lazy(() => import("@/pages/MojiIzzivi"));
const VideoNavodila = lazy(() => import("@/pages/VideoNavodila"));

// Informational pages
const LogopedskiKoticek = lazy(() => import("@/pages/LogopedskiKoticek"));
const RazvojGovora = lazy(() => import("@/pages/RazvojGovora"));

// Game routers
const SpominRouter = lazy(() => import("@/components/routing/SpominRouter"));
const ZaporedjaRouter = lazy(() => import("@/components/routing/ZaporedjaRouter"));
const SestavljankeRouter = lazy(() => import("@/components/routing/SestavljankeRouter"));
const DrsnaSestavljankaRouter = lazy(() => import("@/components/routing/DrsnaSestavljankaRouter"));
const PoveziPareRouter = lazy(() => import("@/components/routing/PoveziPareRouter"));
const IgraUjemanjaRouter = lazy(() => import("@/components/routing/IgraUjemanjaRouter"));
const ArtikulacijaVajeRouter = lazy(() => import("@/components/routing/ArtikulacijaVajeRouter"));
const VideoNavodilaRouter = lazy(() => import("@/components/routing/VideoNavodilaRouter"));
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
      
      {/* Protected routes - lazy */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <LazyRoute><Profile /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/moja-stran" 
        element={
          <ProtectedRoute>
            <LazyRoute><MojaStran /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/moje-aplikacije" 
        element={
          <ProtectedRoute>
            <LazyRoute><MojeAplikacije /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje" 
        element={
          <ProtectedRoute>
            <LazyRoute><GovornojezicovneVaje /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/vaje-motorike-govoril" 
        element={
          <ProtectedRoute>
            <LazyRoute><VajeMoториkeGovoril /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija" 
        element={
          <ProtectedRoute>
            <LazyRoute><ArtikulacijaVaje /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic ArtikulacijaVaje routes */}
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/:gameId" 
        element={
          <ProtectedRoute>
            <LazyRoute><ArtikulacijaVajeRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/artikulacija" 
        element={
          <ProtectedRoute>
            <LazyRoute><ArtIzgovorjavaPage /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/artikulacija/:letter" 
        element={
          <ProtectedRoute>
            <LazyRoute><ArtIzgovorjavaPage /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/artikulacijski-test" 
        element={
          <ProtectedRoute>
            <LazyRoute><ArtikuacijskiTest /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre" 
        element={
          <ProtectedRoute>
            <LazyRoute><GovorneIgre /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke" 
        element={
          <ProtectedRoute>
            <LazyRoute><SestavljankeGames /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka" 
        element={
          <ProtectedRoute>
            <LazyRoute><DrsnaSestavljanka /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic DrsnaSestavljanka routes */}
      <Route 
        path="/govorne-igre/drsna-sestavljanka/:letterAndAge" 
        element={
          <ProtectedRoute>
            <LazyRoute><DrsnaSestavljankaRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic Sestavljanke routes */}
      <Route 
        path="/govorne-igre/sestavljanke/:letterAndAge" 
        element={
          <ProtectedRoute>
            <LazyRoute><SestavljankeRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Spomin Game Routes */}
      <Route 
        path="/govorne-igre/spomin" 
        element={
          <ProtectedRoute>
            <LazyRoute><SpominGames /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/spomin/:gameId" 
        element={
          <ProtectedRoute>
            <LazyRoute><SpominRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Labirint Routes */}
      <Route 
        path="/govorne-igre/labirint" 
        element={
          <ProtectedRoute>
            <LazyRoute><Labirint /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Povezi Pare Routes */}
      <Route 
        path="/govorne-igre/povezi-pare/:ageGroup" 
        element={
          <ProtectedRoute>
            <LazyRoute><PoveziPareRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/povezi-pare/:ageGroup/:letter" 
        element={
          <ProtectedRoute>
            <LazyRoute><PoveziPareRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />

      {/* Igra Ujemanja Routes */}
      <Route 
        path="/govorne-igre/igra-ujemanja" 
        element={
          <ProtectedRoute>
            <LazyRoute><IgraUjemanja /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic IgraUjemanja routes */}
      <Route 
        path="/govorne-igre/igra-ujemanja/:letterAndAge" 
        element={
          <ProtectedRoute>
            <LazyRoute><IgraUjemanjaRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja" 
        element={
          <ProtectedRoute>
            <LazyRoute><Zaporedja /></LazyRoute>
          </ProtectedRoute>
        }
      />
      {/* Dynamic Zaporedja routes */}
      <Route 
        path="/govorne-igre/zaporedja/:letterAndAge" 
        element={
          <ProtectedRoute>
            <LazyRoute><ZaporedjaRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      

      {/* Other Routes */}
      <Route 
        path="/moji-izzivi" 
        element={
          <ProtectedRoute>
            <LazyRoute><MojiIzzivi /></LazyRoute>
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila" 
        element={
          <ProtectedRoute>
            <LazyRoute><VideoNavodila /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic VideoNavodila routes */}
      <Route 
        path="/video-navodila/:letter" 
        element={
          <ProtectedRoute>
            <LazyRoute><VideoNavodilaRouter /></LazyRoute>
          </ProtectedRoute>
        }
      />
      
      {/* Informational pages - lazy */}
      <Route path="/logopedski-koticek" element={<LazyRoute><LogopedskiKoticek /></LazyRoute>} />
      <Route path="/clanki/razvoj-govora" element={<LazyRoute><RazvojGovora /></LazyRoute>} />

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
