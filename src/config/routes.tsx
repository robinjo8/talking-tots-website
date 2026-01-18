import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AuthCallback from "@/pages/AuthCallback";
import AuthConfirm from "@/pages/AuthConfirm";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCanceled from "@/pages/PaymentCanceled";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminRegister from "@/pages/admin/AdminRegister";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminUserDetail from "@/pages/admin/AdminUserDetail";
import AdminMemberships from "@/pages/admin/AdminMemberships";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import Profile from "@/pages/Profile";
import MojaStran from "@/pages/MojaStran";
import MojeAplikacije from "@/pages/MojeAplikacije";
import GovornojezicovneVaje from "@/pages/GovornojezicovneVaje";
import VajeMoториkeGovoril from "@/pages/VajeMoториkeGovoril";
import ArtIzgovorjavaPage from "@/pages/ArtIzgovorjavaPage";
import ArtikulacijaVaje from "@/pages/ArtikulacijaVaje";
import GovorneIgre from "@/pages/GovorneIgre";
import MojiIzzivi from "@/pages/MojiIzzivi";
import VideoNavodila from "@/pages/VideoNavodila";
import LogopedskiKoticek from "@/pages/LogopedskiKoticek";
import RazvojGovora from "@/pages/RazvojGovora";
import SpominGames from "@/pages/SpominGames";
import SpominRouter from "@/components/routing/SpominRouter";
import Labirint from "@/pages/Labirint";
import ArtikuacijskiTest from "@/pages/ArtikuacijskiTest";
import Sestavljanke from "@/pages/Sestavljanke";
import DrsnaSestavljanka from "@/pages/DrsnaSestavljanka";
import DrsnaSestavljankaRouter from "@/components/routing/DrsnaSestavljankaRouter";
import SestavljankeGames from "@/pages/SestavljankeGames";
import SestavljankeRouter from "@/components/routing/SestavljankeRouter";
import MatchingGames3to4 from "@/pages/MatchingGames3to4";
import MatchingGames5to6 from "@/pages/MatchingGames5to6";
import MatchingGameLetter from "@/pages/MatchingGameLetter";
import IgraUjemanja from "@/pages/IgraUjemanja";
import Zaporedja from "@/pages/Zaporedja";
import ZaporedjaRouter from "@/components/routing/ZaporedjaRouter";
import IgraUjemanjaRouter from "@/components/routing/IgraUjemanjaRouter";
import Kontakt from "@/pages/Kontakt";
import SplosniPogoji from "@/pages/SplosniPogoji";
import PolitikaZasebnosti from "@/pages/PolitikaZasebnosti";
import ZaPosameznike from "@/pages/ZaPosameznike";
import ZaPodjetja from "@/pages/ZaPodjetja";
import PomocInPodpora from "@/pages/PomocInPodpora";
import KakoDeluje from "@/pages/KakoDeluje";
import Cenik from "@/pages/Cenik";
import DelovanjeTest from "@/pages/DelovanjeTest";

// New consolidated routers
import ArtikulacijaVajeRouter from "@/components/routing/ArtikulacijaVajeRouter";
import VideoNavodilaRouter from "@/components/routing/VideoNavodilaRouter";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/auth/confirm" element={<AuthConfirm />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-canceled" element={<PaymentCanceled />} />
      
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
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/moja-stran" 
        element={
          <ProtectedRoute>
            <MojaStran />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/moje-aplikacije" 
        element={
          <ProtectedRoute>
            <MojeAplikacije />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje" 
        element={
          <ProtectedRoute>
            <GovornojezicovneVaje />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/vaje-motorike-govoril" 
        element={
          <ProtectedRoute>
            <VajeMoториkeGovoril />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVaje />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic ArtikulacijaVaje routes - handles all letters and positions */}
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/:gameId" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeRouter />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/artikulacija" 
        element={
          <ProtectedRoute>
            <ArtIzgovorjavaPage />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/artikulacija/:letter" 
        element={
          <ProtectedRoute>
            <ArtIzgovorjavaPage />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/artikulacijski-test" 
        element={
          <ProtectedRoute>
            <ArtikuacijskiTest />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre" 
        element={
          <ProtectedRoute>
            <GovorneIgre />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke" 
        element={
          <ProtectedRoute>
            <SestavljankeGames />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljanka />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic DrsnaSestavljanka routes - handles all letters and age groups */}
      <Route 
        path="/govorne-igre/drsna-sestavljanka/:letterAndAge" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaRouter />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic Sestavljanke routes - handles all letters and age groups */}
      <Route 
        path="/govorne-igre/sestavljanke/:letterAndAge" 
        element={
          <ProtectedRoute>
            <SestavljankeRouter />
          </ProtectedRoute>
        }
      />
      
      {/* Spomin Game Routes - Dynamic */}
      <Route 
        path="/govorne-igre/spomin" 
        element={
          <ProtectedRoute>
            <SpominGames />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/spomin/:gameId" 
        element={
          <ProtectedRoute>
            <SpominRouter />
          </ProtectedRoute>
        }
      />
      
      {/* Labirint Routes */}
      <Route 
        path="/govorne-igre/labirint" 
        element={
          <ProtectedRoute>
            <Labirint />
          </ProtectedRoute>
        }
      />
      
      {/* Matching Games Routes */}
      <Route 
        path="/govorne-igre/povezi-pare-3-4" 
        element={
          <ProtectedRoute>
            <MatchingGames3to4 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/povezi-pare-5-6" 
        element={
          <ProtectedRoute>
            <MatchingGames5to6 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/povezi-pare-3-4/:letter" 
        element={
          <ProtectedRoute>
            <MatchingGameLetter />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/govorne-igre/povezi-pare-5-6/:letter" 
        element={
          <ProtectedRoute>
            <MatchingGameLetter />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/govorne-igre/povezi-pare-7-8" 
        element={
          <ProtectedRoute>
            <MatchingGames5to6 />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/govorne-igre/povezi-pare-7-8/:letter" 
        element={
          <ProtectedRoute>
            <MatchingGameLetter />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/govorne-igre/povezi-pare-9-10" 
        element={
          <ProtectedRoute>
            <MatchingGames5to6 />
          </ProtectedRoute>
        }
      />

      <Route 
        path="/govorne-igre/povezi-pare-9-10/:letter" 
        element={
          <ProtectedRoute>
            <MatchingGameLetter />
          </ProtectedRoute>
        }
      />

      {/* Igra Ujemanja Routes */}
      <Route 
        path="/govorne-igre/igra-ujemanja" 
        element={
          <ProtectedRoute>
            <IgraUjemanja />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic IgraUjemanja routes - handles all letters and age groups */}
      <Route 
        path="/govorne-igre/igra-ujemanja/:letterAndAge" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaRouter />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja" 
        element={
          <ProtectedRoute>
            <Zaporedja />
          </ProtectedRoute>
        }
      />
      {/* Dynamic Zaporedja routes - handles all letters and age groups */}
      <Route 
        path="/govorne-igre/zaporedja/:letterAndAge" 
        element={
          <ProtectedRoute>
            <ZaporedjaRouter />
          </ProtectedRoute>
        }
      />
      

      {/* Other Routes */}
      <Route 
        path="/moji-izzivi" 
        element={
          <ProtectedRoute>
            <MojiIzzivi />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila" 
        element={
          <ProtectedRoute>
            <VideoNavodila />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic VideoNavodila routes - handles all letters */}
      <Route 
        path="/video-navodila/:letter" 
        element={
          <ProtectedRoute>
            <VideoNavodilaRouter />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/logopedski-koticek" 
        element={
          <LogopedskiKoticek />
        }
      />
      <Route 
        path="/clanki/razvoj-govora" 
        element={
          <RazvojGovora />
        }
      />

      {/* Admin Portal Routes */}
      <Route path="/admin/login" element={<AdminAuthProvider><AdminLogin /></AdminAuthProvider>} />
      <Route path="/admin/register" element={<AdminAuthProvider><AdminRegister /></AdminAuthProvider>} />
      <Route path="/admin" element={<AdminAuthProvider><AdminDashboard /></AdminAuthProvider>} />
      <Route path="/admin/users" element={<AdminAuthProvider><AdminUsers /></AdminAuthProvider>} />
      <Route path="/admin/users/:parentId/:childId" element={<AdminAuthProvider><AdminUserDetail /></AdminAuthProvider>} />
      <Route path="/admin/memberships" element={<AdminAuthProvider><AdminMemberships /></AdminAuthProvider>} />

      {/* Footer pages */}
      <Route path="/kontakt" element={<Kontakt />} />
      <Route path="/splosni-pogoji" element={<SplosniPogoji />} />
      <Route path="/politika-zasebnosti" element={<PolitikaZasebnosti />} />
      <Route path="/za-posameznike" element={<ZaPosameznike />} />
      <Route path="/za-podjetja" element={<ZaPodjetja />} />
      <Route path="/pomoc-in-podpora" element={<PomocInPodpora />} />
      <Route path="/kako-deluje" element={<KakoDeluje />} />
      <Route path="/cenik" element={<Cenik />} />
      <Route path="/delovanje-testa" element={<DelovanjeTest />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
