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
import ArtikulacijaVajeC from "@/pages/ArtikulacijaVajeC";
import ArtikulacijaVajeČ from "@/pages/ArtikulacijaVajeČ";
import ArtikulacijaVajeK from "@/pages/ArtikulacijaVajeK";
import ArtikulacijaVajeL from "@/pages/ArtikulacijaVajeL";
import ArtikulacijaVajeR from "@/pages/ArtikulacijaVajeR";
import ArtikulacijaVajeRSredinaKonec from "@/pages/ArtikulacijaVajeRSredinaKonec";
import ArtikulacijaVajeCSredinaKonec from "@/pages/ArtikulacijaVajeCSredinaKonec";
import ArtikulacijaVajeČSredinaKonec from "@/pages/ArtikulacijaVajeČSredinaKonec";
import ArtikulacijaVajeKSredinaKonec from "@/pages/ArtikulacijaVajeKSredinaKonec";
import ArtikulacijaVajeLSredinaKonec from "@/pages/ArtikulacijaVajeLSredinaKonec";
import ArtikulacijaVajeSSredinaKonec from "@/pages/ArtikulacijaVajeSSredinaKonec";
import ArtikulacijaVajeŠSredinaKonec from "@/pages/ArtikulacijaVajeŠSredinaKonec";
import ArtikulacijaVajeZSredinaKonec from "@/pages/ArtikulacijaVajeZSredinaKonec";
import ArtikulacijaVajeŽSredinaKonec from "@/pages/ArtikulacijaVajeŽSredinaKonec";
import ArtikulacijaVajeS from "@/pages/ArtikulacijaVajeS";
import ArtikulacijaVajeŠ from "@/pages/ArtikulacijaVajeŠ";
import ArtikulacijaVajeZ from "@/pages/ArtikulacijaVajeZ";
import ArtikulacijaVajeŽ from "@/pages/ArtikulacijaVajeŽ";
import GovorneIgre from "@/pages/GovorneIgre";
import MojiIzzivi from "@/pages/MojiIzzivi";
import VideoNavodila from "@/pages/VideoNavodila";
import VideoNavodilaCrkaR from "@/pages/VideoNavodilaCrkaR";
import VideoNavodilaCrkaC from "@/pages/VideoNavodilaCrkaC";
import VideoNavodilaCrkaČ from "@/pages/VideoNavodilaCrkaČ";
import VideoNavodilaCrkaK from "@/pages/VideoNavodilaCrkaK";
import VideoNavodilaCrkaL from "@/pages/VideoNavodilaCrkaL";
import VideoNavodilaCrkaS from "@/pages/VideoNavodilaCrkaS";
import VideoNavodilaCrkaŠ from "@/pages/VideoNavodilaCrkaŠ";
import VideoNavodilaCrkaZ from "@/pages/VideoNavodilaCrkaZ";
import VideoNavodilaCrkaŽ from "@/pages/VideoNavodilaCrkaŽ";
import LogopedskiKoticek from "@/pages/LogopedskiKoticek";
import RazvojGovora from "@/pages/RazvojGovora";
import SpominR from "@/pages/SpominR";
import SpominGames from "@/pages/SpominGames";
import SpominK from "@/pages/SpominK";
import SpominS from "@/pages/SpominS";
import SpominŠ from "@/pages/SpominŠ";
import SpominC from "@/pages/SpominC";
import SpominČ from "@/pages/SpominČ";
import SpominZ from "@/pages/SpominZ";
import SpominŽ from "@/pages/SpominŽ";
import SpominL from "@/pages/SpominL";
import LabirintX from "@/pages/LabirintX";
import LabirintC from "@/pages/LabirintC";
import LabirintLetter from "@/pages/LabirintLetter";
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
import AdminRemoveBackground from "@/pages/AdminRemoveBackground";
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
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/c" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeC />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/č" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeČ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/k" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeK />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/l" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeL />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/r" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeR />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/r-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeRSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/c-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeCSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/č-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeČSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/k-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeKSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/l-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeLSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/s-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeSSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/š-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeŠSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/z-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeZSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/ž-sredina-konec" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeŽSredinaKonec />
          </ProtectedRoute>
        }
      />
      <Route
        path="/govorno-jezikovne-vaje/artikulacija/s" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeS />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/š" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeŠ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/z" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeZ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorno-jezikovne-vaje/artikulacija/ž" 
        element={
          <ProtectedRoute>
            <ArtikulacijaVajeŽ />
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
      {/* ASCII URL mapping: č->ch, š->sh, ž->zh for reliable routing */}
      <Route 
        path="/govorne-igre/drsna-sestavljanka/:letterAndAge" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaRouter />
          </ProtectedRoute>
        }
      />
      
      {/* Dynamic Sestavljanke routes - handles all letters and age groups */}
      {/* ASCII URL mapping: č->ch, š->sh, ž->zh for reliable routing */}
      <Route 
        path="/govorne-igre/sestavljanke/:letterAndAge" 
        element={
          <ProtectedRoute>
            <SestavljankeRouter />
          </ProtectedRoute>
        }
      />
      
      
      {/* Spomin Game Routes */}
      <Route 
        path="/govorne-igre/spomin" 
        element={
          <ProtectedRoute>
            <SpominGames />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-r" 
        element={
          <ProtectedRoute>
            <SpominR />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-k" 
        element={
          <ProtectedRoute>
            <SpominK />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-s" 
        element={
          <ProtectedRoute>
            <SpominS />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-š" 
        element={
          <ProtectedRoute>
            <SpominŠ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-c" 
        element={
          <ProtectedRoute>
            <SpominC />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-č" 
        element={
          <ProtectedRoute>
            <SpominČ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-z" 
        element={
          <ProtectedRoute>
            <SpominZ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-ž" 
        element={
          <ProtectedRoute>
            <SpominŽ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/spomin/spomin-l" 
        element={
          <ProtectedRoute>
            <SpominL />
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
      <Route 
        path="/govorne-igre/labirint/x" 
        element={
          <ProtectedRoute>
            <LabirintX />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/labirint/:letter" 
        element={
          <ProtectedRoute>
            <LabirintLetter />
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
      <Route 
        path="/govorne-igre/zaporedja/c"
        element={
          <ProtectedRoute>
            <ZaporedjaC />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/c56"
        element={
          <ProtectedRoute>
            <ZaporedjaC56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/c78"
        element={
          <ProtectedRoute>
            <ZaporedjaC78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/č78"
        element={
          <ProtectedRoute>
            <ZaporedjaČ78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/k78"
        element={
          <ProtectedRoute>
            <ZaporedjaK78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/l78"
        element={
          <ProtectedRoute>
            <ZaporedjaL78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/r78"
        element={
          <ProtectedRoute>
            <ZaporedjaR78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/s78"
        element={
          <ProtectedRoute>
            <ZaporedjaS78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/š78"
        element={
          <ProtectedRoute>
            <ZaporedjaŠ78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/z78"
        element={
          <ProtectedRoute>
            <ZaporedjaZ78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/ž78"
        element={
          <ProtectedRoute>
            <ZaporedjaŽ78 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/c910"
        element={
          <ProtectedRoute>
            <ZaporedjaC910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/č910"
        element={
          <ProtectedRoute>
            <ZaporedjaČ910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/k910"
        element={
          <ProtectedRoute>
            <ZaporedjaK910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/l910"
        element={
          <ProtectedRoute>
            <ZaporedjaL910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/r910"
        element={
          <ProtectedRoute>
            <ZaporedjaR910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/s910"
        element={
          <ProtectedRoute>
            <ZaporedjaS910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/š910"
        element={
          <ProtectedRoute>
            <ZaporedjaŠ910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/z910"
        element={
          <ProtectedRoute>
            <ZaporedjaZ910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/ž910"
        element={
          <ProtectedRoute>
            <ZaporedjaŽ910 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/č56"
        element={
          <ProtectedRoute>
            <ZaporedjaČ56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/k56"
        element={
          <ProtectedRoute>
            <ZaporedjaK56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/l56"
        element={
          <ProtectedRoute>
            <ZaporedjaL56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/r56"
        element={
          <ProtectedRoute>
            <ZaporedjaR56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/s56"
        element={
          <ProtectedRoute>
            <ZaporedjaS56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/š56"
        element={
          <ProtectedRoute>
            <ZaporedjaŠ56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/z56"
        element={
          <ProtectedRoute>
            <ZaporedjaZ56 />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/ž56"
        element={
          <ProtectedRoute>
            <ZaporedjaŽ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/zaporedja/č"
        element={
          <ProtectedRoute>
            <ZaporedjaČ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/k"
        element={
          <ProtectedRoute>
            <ZaporedjaK />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/l"
        element={
          <ProtectedRoute>
            <ZaporedjaL />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/r"
        element={
          <ProtectedRoute>
            <ZaporedjaR />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/s"
        element={
          <ProtectedRoute>
            <ZaporedjaS />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/š"
        element={
          <ProtectedRoute>
            <ZaporedjaŠ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/z"
        element={
          <ProtectedRoute>
            <ZaporedjaZ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/govorne-igre/zaporedja/ž"
        element={
          <ProtectedRoute>
            <ZaporedjaŽ />
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
      <Route 
        path="/video-navodila/crka-c" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaC />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-č" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaČ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-k" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaK />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-l" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaL />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-r" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaR />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-s" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaS />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-š" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaŠ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-z" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaZ />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/video-navodila/crka-ž" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaŽ />
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

      <Route path="/admin/remove-background" element={<AdminRemoveBackground />} />

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
