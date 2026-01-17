import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";

// Eagerly load Index (homepage) for best LCP
import Index from "@/pages/Index";

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Lazy load all other pages for code splitting
const Login = lazy(() => import("@/pages/Login"));
const Register = lazy(() => import("@/pages/Register"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const AuthConfirm = lazy(() => import("@/pages/AuthConfirm"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const UpdatePassword = lazy(() => import("@/pages/UpdatePassword"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const PaymentSuccess = lazy(() => import("@/pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("@/pages/PaymentCanceled"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminRegister = lazy(() => import("@/pages/admin/AdminRegister"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("@/pages/admin/AdminUsers"));
const AdminUserDetail = lazy(() => import("@/pages/admin/AdminUserDetail"));
const AdminMemberships = lazy(() => import("@/pages/admin/AdminMemberships"));
const Profile = lazy(() => import("@/pages/Profile"));
const MojaStran = lazy(() => import("@/pages/MojaStran"));
const MojeAplikacije = lazy(() => import("@/pages/MojeAplikacije"));
const GovornojezicovneVaje = lazy(() => import("@/pages/GovornojezicovneVaje"));
const VajeMoториkeGovoril = lazy(() => import("@/pages/VajeMoториkeGovoril"));
const ArtIzgovorjavaPage = lazy(() => import("@/pages/ArtIzgovorjavaPage"));
const ArtikulacijaVaje = lazy(() => import("@/pages/ArtikulacijaVaje"));
const ArtikulacijaVajeC = lazy(() => import("@/pages/ArtikulacijaVajeC"));
const ArtikulacijaVajeČ = lazy(() => import("@/pages/ArtikulacijaVajeČ"));
const ArtikulacijaVajeK = lazy(() => import("@/pages/ArtikulacijaVajeK"));
const ArtikulacijaVajeL = lazy(() => import("@/pages/ArtikulacijaVajeL"));
const ArtikulacijaVajeR = lazy(() => import("@/pages/ArtikulacijaVajeR"));
const ArtikulacijaVajeRSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeRSredinaKonec"));
const ArtikulacijaVajeCSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeCSredinaKonec"));
const ArtikulacijaVajeČSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeČSredinaKonec"));
const ArtikulacijaVajeKSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeKSredinaKonec"));
const ArtikulacijaVajeLSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeLSredinaKonec"));
const ArtikulacijaVajeSSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeSSredinaKonec"));
const ArtikulacijaVajeŠSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeŠSredinaKonec"));
const ArtikulacijaVajeZSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeZSredinaKonec"));
const ArtikulacijaVajeŽSredinaKonec = lazy(() => import("@/pages/ArtikulacijaVajeŽSredinaKonec"));
const ArtikulacijaVajeS = lazy(() => import("@/pages/ArtikulacijaVajeS"));
const ArtikulacijaVajeŠ = lazy(() => import("@/pages/ArtikulacijaVajeŠ"));
const ArtikulacijaVajeZ = lazy(() => import("@/pages/ArtikulacijaVajeZ"));
const ArtikulacijaVajeŽ = lazy(() => import("@/pages/ArtikulacijaVajeŽ"));
const GovorneIgre = lazy(() => import("@/pages/GovorneIgre"));
const MojiIzzivi = lazy(() => import("@/pages/MojiIzzivi"));
const VideoNavodila = lazy(() => import("@/pages/VideoNavodila"));
const VideoNavodilaCrkaR = lazy(() => import("@/pages/VideoNavodilaCrkaR"));
const VideoNavodilaCrkaC = lazy(() => import("@/pages/VideoNavodilaCrkaC"));
const VideoNavodilaCrkaČ = lazy(() => import("@/pages/VideoNavodilaCrkaČ"));
const VideoNavodilaCrkaK = lazy(() => import("@/pages/VideoNavodilaCrkaK"));
const VideoNavodilaCrkaL = lazy(() => import("@/pages/VideoNavodilaCrkaL"));
const VideoNavodilaCrkaS = lazy(() => import("@/pages/VideoNavodilaCrkaS"));
const VideoNavodilaCrkaŠ = lazy(() => import("@/pages/VideoNavodilaCrkaŠ"));
const VideoNavodilaCrkaZ = lazy(() => import("@/pages/VideoNavodilaCrkaZ"));
const VideoNavodilaCrkaŽ = lazy(() => import("@/pages/VideoNavodilaCrkaŽ"));
const LogopedskiKoticek = lazy(() => import("@/pages/LogopedskiKoticek"));
const RazvojGovora = lazy(() => import("@/pages/RazvojGovora"));
const SpominR = lazy(() => import("@/pages/SpominR"));
const SpominGames = lazy(() => import("@/pages/SpominGames"));
const SpominK = lazy(() => import("@/pages/SpominK"));
const SpominS = lazy(() => import("@/pages/SpominS"));
const SpominŠ = lazy(() => import("@/pages/SpominŠ"));
const SpominC = lazy(() => import("@/pages/SpominC"));
const SpominČ = lazy(() => import("@/pages/SpominČ"));
const SpominZ = lazy(() => import("@/pages/SpominZ"));
const SpominŽ = lazy(() => import("@/pages/SpominŽ"));
const SpominL = lazy(() => import("@/pages/SpominL"));
const LabirintX = lazy(() => import("@/pages/LabirintX"));
const LabirintC = lazy(() => import("@/pages/LabirintC"));
const LabirintLetter = lazy(() => import("@/pages/LabirintLetter"));
const Labirint = lazy(() => import("@/pages/Labirint"));
const ArtikuacijskiTest = lazy(() => import("@/pages/ArtikuacijskiTest"));
const Sestavljanke = lazy(() => import("@/pages/Sestavljanke"));
const DrsnaSestavljanka = lazy(() => import("@/pages/DrsnaSestavljanka"));
const DrsnaSestavljankaC56 = lazy(() => import("@/pages/DrsnaSestavljankaC56"));
const DrsnaSestavljankaR56 = lazy(() => import("@/pages/DrsnaSestavljankaR56"));
const DrsnaSestavljankaL56 = lazy(() => import("@/pages/DrsnaSestavljankaL56"));
const DrsnaSestavljankaK56 = lazy(() => import("@/pages/DrsnaSestavljankaK56"));
const DrsnaSestavljankaČ56 = lazy(() => import("@/pages/DrsnaSestavljankaČ56"));
const DrsnaSestavljankaS56 = lazy(() => import("@/pages/DrsnaSestavljankaS56"));
const DrsnaSestavljankaŠ56 = lazy(() => import("@/pages/DrsnaSestavljankaŠ56"));
const DrsnaSestavljankaZ56 = lazy(() => import("@/pages/DrsnaSestavljankaZ56"));
const DrsnaSestavljankaŽ56 = lazy(() => import("@/pages/DrsnaSestavljankaŽ56"));
const DrsnaSestavljankaC34 = lazy(() => import("@/pages/DrsnaSestavljankaC34"));
const DrsnaSestavljankaR34 = lazy(() => import("@/pages/DrsnaSestavljankaR34"));
const DrsnaSestavljanka34Router = lazy(() => import("@/pages/DrsnaSestavljanka34Router"));
const DrsnaSestavljankaC78 = lazy(() => import("@/pages/DrsnaSestavljankaC78"));
const DrsnaSestavljankaK78 = lazy(() => import("@/pages/DrsnaSestavljankaK78"));
const DrsnaSestavljankaL78 = lazy(() => import("@/pages/DrsnaSestavljankaL78"));
const DrsnaSestavljankaR78 = lazy(() => import("@/pages/DrsnaSestavljankaR78"));
const DrsnaSestavljankaS78 = lazy(() => import("@/pages/DrsnaSestavljankaS78"));
const DrsnaSestavljankaZ78 = lazy(() => import("@/pages/DrsnaSestavljankaZ78"));
const DrsnaSestavljankaČ78 = lazy(() => import("@/pages/DrsnaSestavljankaČ78"));
const DrsnaSestavljankaŠ78 = lazy(() => import("@/pages/DrsnaSestavljankaŠ78"));
const DrsnaSestavljankaŽ78 = lazy(() => import("@/pages/DrsnaSestavljankaŽ78"));
const DrsnaSestavljankaC910 = lazy(() => import("@/pages/DrsnaSestavljankaC910"));
const DrsnaSestavljankaK910 = lazy(() => import("@/pages/DrsnaSestavljankaK910"));
const DrsnaSestavljankaL910 = lazy(() => import("@/pages/DrsnaSestavljankaL910"));
const DrsnaSestavljankaR910 = lazy(() => import("@/pages/DrsnaSestavljankaR910"));
const DrsnaSestavljankaS910 = lazy(() => import("@/pages/DrsnaSestavljankaS910"));
const DrsnaSestavljankaZ910 = lazy(() => import("@/pages/DrsnaSestavljankaZ910"));
const DrsnaSestavljankaČ910 = lazy(() => import("@/pages/DrsnaSestavljankaČ910"));
const DrsnaSestavljankaŠ910 = lazy(() => import("@/pages/DrsnaSestavljankaŠ910"));
const DrsnaSestavljankaŽ910 = lazy(() => import("@/pages/DrsnaSestavljankaŽ910"));
const SestavljankeGames = lazy(() => import("@/pages/SestavljankeGames"));
const SestavljankeR = lazy(() => import("@/pages/SestavljankeR"));
const SestavljankeRRouter = lazy(() => import("@/pages/SestavljankeRRouter"));
const SestavljankeR56 = lazy(() => import("@/pages/SestavljankeR56"));
const SestavljankeR78 = lazy(() => import("@/pages/SestavljankeR78"));
const SestavljankeR910 = lazy(() => import("@/pages/SestavljankeR910"));
const SestavljankeX = lazy(() => import("@/pages/SestavljankeX"));
const SestavljankeC = lazy(() => import("@/pages/SestavljankeC"));
const SestavljankeC56 = lazy(() => import("@/pages/SestavljankeC56"));
const SestavljankeC78 = lazy(() => import("@/pages/SestavljankeC78"));
const SestavljankeC910 = lazy(() => import("@/pages/SestavljankeC910"));
const SestavljankeČ = lazy(() => import("@/pages/SestavljankeČ"));
const SestavljankeČ56 = lazy(() => import("@/pages/SestavljankeČ56"));
const SestavljankeČ78 = lazy(() => import("@/pages/SestavljankeČ78"));
const SestavljankeČ910 = lazy(() => import("@/pages/SestavljankeČ910"));
const SestavljankeS = lazy(() => import("@/pages/SestavljankeS"));
const SestavljankeS56 = lazy(() => import("@/pages/SestavljankeS56"));
const SestavljankeS78 = lazy(() => import("@/pages/SestavljankeS78"));
const SestavljankeS910 = lazy(() => import("@/pages/SestavljankeS910"));
const SestavljankeŠ = lazy(() => import("@/pages/SestavljankeŠ"));
const SestavljankeŠ56 = lazy(() => import("@/pages/SestavljankeŠ56"));
const SestavljankeŠ78 = lazy(() => import("@/pages/SestavljankeŠ78"));
const SestavljankeŠ910 = lazy(() => import("@/pages/SestavljankeŠ910"));
const SestavljankeZ = lazy(() => import("@/pages/SestavljankeZ"));
const SestavljankeZ56 = lazy(() => import("@/pages/SestavljankeZ56"));
const SestavljankeZ78 = lazy(() => import("@/pages/SestavljankeZ78"));
const SestavljankeZ910 = lazy(() => import("@/pages/SestavljankeZ910"));
const SestavljankeŽ = lazy(() => import("@/pages/SestavljankeŽ"));
const SestavljankeŽ56 = lazy(() => import("@/pages/SestavljankeŽ56"));
const SestavljankeŽ78 = lazy(() => import("@/pages/SestavljankeŽ78"));
const SestavljankeŽ910 = lazy(() => import("@/pages/SestavljankeŽ910"));
const SestavljankeK = lazy(() => import("@/pages/SestavljankeK"));
const SestavljankeK56 = lazy(() => import("@/pages/SestavljankeK56"));
const SestavljankeK78 = lazy(() => import("@/pages/SestavljankeK78"));
const SestavljankeK910 = lazy(() => import("@/pages/SestavljankeK910"));
const SestavljankeL = lazy(() => import("@/pages/SestavljankeL"));
const SestavljankeL56 = lazy(() => import("@/pages/SestavljankeL56"));
const SestavljankeL78 = lazy(() => import("@/pages/SestavljankeL78"));
const SestavljankeL910 = lazy(() => import("@/pages/SestavljankeL910"));
const MatchingGames3to4 = lazy(() => import("@/pages/MatchingGames3to4"));
const MatchingGames5to6 = lazy(() => import("@/pages/MatchingGames5to6"));
const MatchingGameLetter = lazy(() => import("@/pages/MatchingGameLetter"));
const IgraUjemanja = lazy(() => import("@/pages/IgraUjemanja"));
const Zaporedja = lazy(() => import("@/pages/Zaporedja"));
const ZaporedjaC = lazy(() => import("@/pages/ZaporedjaC"));
const ZaporedjaČ = lazy(() => import("@/pages/ZaporedjaČ"));
const ZaporedjaK = lazy(() => import("@/pages/ZaporedjaK"));
const ZaporedjaL = lazy(() => import("@/pages/ZaporedjaL"));
const ZaporedjaR = lazy(() => import("@/pages/ZaporedjaR"));
const ZaporedjaS = lazy(() => import("@/pages/ZaporedjaS"));
const ZaporedjaŠ = lazy(() => import("@/pages/ZaporedjaŠ"));
const ZaporedjaZ = lazy(() => import("@/pages/ZaporedjaZ"));
const ZaporedjaŽ = lazy(() => import("@/pages/ZaporedjaŽ"));
const ZaporedjaC56 = lazy(() => import("@/pages/ZaporedjaC56"));
const ZaporedjaČ56 = lazy(() => import("@/pages/ZaporedjaČ56"));
const ZaporedjaK56 = lazy(() => import("@/pages/ZaporedjaK56"));
const ZaporedjaL56 = lazy(() => import("@/pages/ZaporedjaL56"));
const ZaporedjaR56 = lazy(() => import("@/pages/ZaporedjaR56"));
const ZaporedjaS56 = lazy(() => import("@/pages/ZaporedjaS56"));
const ZaporedjaŠ56 = lazy(() => import("@/pages/ZaporedjaŠ56"));
const ZaporedjaZ56 = lazy(() => import("@/pages/ZaporedjaZ56"));
const ZaporedjaŽ56 = lazy(() => import("@/pages/ZaporedjaŽ56"));
const ZaporedjaC78 = lazy(() => import("@/pages/ZaporedjaC78"));
const ZaporedjaČ78 = lazy(() => import("@/pages/ZaporedjaČ78"));
const ZaporedjaK78 = lazy(() => import("@/pages/ZaporedjaK78"));
const ZaporedjaL78 = lazy(() => import("@/pages/ZaporedjaL78"));
const ZaporedjaR78 = lazy(() => import("@/pages/ZaporedjaR78"));
const ZaporedjaS78 = lazy(() => import("@/pages/ZaporedjaS78"));
const ZaporedjaŠ78 = lazy(() => import("@/pages/ZaporedjaŠ78"));
const ZaporedjaZ78 = lazy(() => import("@/pages/ZaporedjaZ78"));
const ZaporedjaŽ78 = lazy(() => import("@/pages/ZaporedjaŽ78"));
const ZaporedjaC910 = lazy(() => import("@/pages/ZaporedjaC910"));
const ZaporedjaČ910 = lazy(() => import("@/pages/ZaporedjaČ910"));
const ZaporedjaK910 = lazy(() => import("@/pages/ZaporedjaK910"));
const ZaporedjaL910 = lazy(() => import("@/pages/ZaporedjaL910"));
const ZaporedjaR910 = lazy(() => import("@/pages/ZaporedjaR910"));
const ZaporedjaS910 = lazy(() => import("@/pages/ZaporedjaS910"));
const ZaporedjaŠ910 = lazy(() => import("@/pages/ZaporedjaŠ910"));
const ZaporedjaZ910 = lazy(() => import("@/pages/ZaporedjaZ910"));
const ZaporedjaŽ910 = lazy(() => import("@/pages/ZaporedjaŽ910"));
const IgraUjemanjaC = lazy(() => import("@/pages/IgraUjemanjaC"));
const IgraUjemanjaC56 = lazy(() => import("@/pages/IgraUjemanjaC56"));
const IgraUjemanjaC78 = lazy(() => import("@/pages/IgraUjemanjaC78"));
const IgraUjemanjaC910 = lazy(() => import("@/pages/IgraUjemanjaC910"));
const IgraUjemanjaR = lazy(() => import("@/pages/IgraUjemanjaR"));
const IgraUjemanjaR56 = lazy(() => import("@/pages/IgraUjemanjaR56"));
const IgraUjemanjaL = lazy(() => import("@/pages/IgraUjemanjaL"));
const IgraUjemanjaL56 = lazy(() => import("@/pages/IgraUjemanjaL56"));
const IgraUjemanjaK = lazy(() => import("@/pages/IgraUjemanjaK"));
const IgraUjemanjaK56 = lazy(() => import("@/pages/IgraUjemanjaK56"));
const IgraUjemanjaČ = lazy(() => import("@/pages/IgraUjemanjaČ"));
const IgraUjemanjaČ56 = lazy(() => import("@/pages/IgraUjemanjaČ56"));
const IgraUjemanjaS = lazy(() => import("@/pages/IgraUjemanjaS"));
const IgraUjemanjaS56 = lazy(() => import("@/pages/IgraUjemanjaS56"));
const IgraUjemanjaŠ = lazy(() => import("@/pages/IgraUjemanjaŠ"));
const IgraUjemanjaŠ56 = lazy(() => import("@/pages/IgraUjemanjaŠ56"));
const IgraUjemanjaZ = lazy(() => import("@/pages/IgraUjemanjaZ"));
const IgraUjemanjaZ56 = lazy(() => import("@/pages/IgraUjemanjaZ56"));
const IgraUjemanjaŽ = lazy(() => import("@/pages/IgraUjemanjaŽ"));
const IgraUjemanjaŽ56 = lazy(() => import("@/pages/IgraUjemanjaŽ56"));
const IgraUjemanjaR78 = lazy(() => import("@/pages/IgraUjemanjaR78"));
const IgraUjemanjaL78 = lazy(() => import("@/pages/IgraUjemanjaL78"));
const IgraUjemanjaK78 = lazy(() => import("@/pages/IgraUjemanjaK78"));
const IgraUjemanjaČ78 = lazy(() => import("@/pages/IgraUjemanjaČ78"));
const IgraUjemanjaS78 = lazy(() => import("@/pages/IgraUjemanjaS78"));
const IgraUjemanjaŠ78 = lazy(() => import("@/pages/IgraUjemanjaŠ78"));
const IgraUjemanjaZ78 = lazy(() => import("@/pages/IgraUjemanjaZ78"));
const IgraUjemanjaŽ78 = lazy(() => import("@/pages/IgraUjemanjaŽ78"));
const IgraUjemanjaR910 = lazy(() => import("@/pages/IgraUjemanjaR910"));
const IgraUjemanjaL910 = lazy(() => import("@/pages/IgraUjemanjaL910"));
const IgraUjemanjaK910 = lazy(() => import("@/pages/IgraUjemanjaK910"));
const IgraUjemanjaS910 = lazy(() => import("@/pages/IgraUjemanjaS910"));
const IgraUjemanjaŠ910 = lazy(() => import("@/pages/IgraUjemanjaŠ910"));
const IgraUjemanjaZ910 = lazy(() => import("@/pages/IgraUjemanjaZ910"));
const IgraUjemanjaŽ910 = lazy(() => import("@/pages/IgraUjemanjaŽ910"));
const IgraUjemanjaČ910 = lazy(() => import("@/pages/IgraUjemanjaČ910"));
const AdminRemoveBackground = lazy(() => import("@/pages/AdminRemoveBackground"));
const Kontakt = lazy(() => import("@/pages/Kontakt"));
const SplosniPogoji = lazy(() => import("@/pages/SplosniPogoji"));
const PolitikaZasebnosti = lazy(() => import("@/pages/PolitikaZasebnosti"));
const ZaPosameznike = lazy(() => import("@/pages/ZaPosameznike"));
const ZaPodjetja = lazy(() => import("@/pages/ZaPodjetja"));
const PomocInPodpora = lazy(() => import("@/pages/PomocInPodpora"));
const KakoDeluje = lazy(() => import("@/pages/KakoDeluje"));
const Cenik = lazy(() => import("@/pages/Cenik"));
const DelovanjeTest = lazy(() => import("@/pages/DelovanjeTest"));
const DrsnaSestavljankaK34 = lazy(() => import("@/pages/DrsnaSestavljankaK34"));
const DrsnaSestavljankaL34 = lazy(() => import("@/pages/DrsnaSestavljankaL34"));
const DrsnaSestavljankaS34 = lazy(() => import("@/pages/DrsnaSestavljankaS34"));
const DrsnaSestavljankaZ34 = lazy(() => import("@/pages/DrsnaSestavljankaZ34"));
const DrsnaSestavljankaČ34 = lazy(() => import("@/pages/DrsnaSestavljankaČ34"));
const DrsnaSestavljankaŠ34 = lazy(() => import("@/pages/DrsnaSestavljankaŠ34"));
const DrsnaSestavljankaŽ34 = lazy(() => import("@/pages/DrsnaSestavljankaŽ34"));
const MatchingGameR3to4 = lazy(() => import("@/pages/MatchingGameR3to4"));
const VajeZaJezik = lazy(() => import("@/pages/VajeZaJezik"));

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
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
          path="/govorno-jezikovne-vaje/vaje-za-jezik" 
          element={
            <ProtectedRoute>
              <VajeZaJezik />
            </ProtectedRoute>
          }
        />
        <Route
          path="/govorno-jezikovne-vaje/izgovorjava" 
          element={
            <ProtectedRoute>
              <ArtIzgovorjavaPage />
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
          path="/video-navodila/r" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/c" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/č" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaČ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/k" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaK />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/l" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaL />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/s" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/š" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaŠ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/z" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaZ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video-navodila/ž" 
          element={
            <ProtectedRoute>
              <VideoNavodilaCrkaŽ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logopedski-koticek" 
          element={
            <ProtectedRoute>
              <LogopedskiKoticek />
            </ProtectedRoute>
          }
        />
        <Route
          path="/logopedski-koticek/razvoj-govora" 
          element={
            <ProtectedRoute>
              <RazvojGovora />
            </ProtectedRoute>
          }
        />
        {/* Spomin Games - new nested paths */}
        <Route
          path="/govorne-igre/spomin" 
          element={
            <ProtectedRoute>
              <SpominGames />
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
          path="/govorne-igre/spomin/spomin-k" 
          element={
            <ProtectedRoute>
              <SpominK />
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
        <Route
          path="/govorne-igre/spomin/spomin-r" 
          element={
            <ProtectedRoute>
              <SpominR />
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
        
        {/* Legacy spomin routes - redirects for backward compatibility */}
        <Route path="/spomin-games" element={<Navigate to="/govorne-igre/spomin" replace />} />
        <Route path="/spomin-r" element={<Navigate to="/govorne-igre/spomin/spomin-r" replace />} />
        <Route path="/spomin-k" element={<Navigate to="/govorne-igre/spomin/spomin-k" replace />} />
        <Route path="/spomin-s" element={<Navigate to="/govorne-igre/spomin/spomin-s" replace />} />
        <Route path="/spomin-š" element={<Navigate to="/govorne-igre/spomin/spomin-š" replace />} />
        <Route path="/spomin-c" element={<Navigate to="/govorne-igre/spomin/spomin-c" replace />} />
        <Route path="/spomin-č" element={<Navigate to="/govorne-igre/spomin/spomin-č" replace />} />
        <Route path="/spomin-z" element={<Navigate to="/govorne-igre/spomin/spomin-z" replace />} />
        <Route path="/spomin-ž" element={<Navigate to="/govorne-igre/spomin/spomin-ž" replace />} />
        <Route path="/spomin-l" element={<Navigate to="/govorne-igre/spomin/spomin-l" replace />} />
        <Route
          path="/labirint/:letter" 
          element={
            <ProtectedRoute>
              <LabirintX />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirint-c" 
          element={
            <ProtectedRoute>
              <LabirintC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirint-letter/:letter" 
          element={
            <ProtectedRoute>
              <LabirintLetter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/labirint" 
          element={
            <ProtectedRoute>
              <Labirint />
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
          path="/sestavljanke" 
          element={
            <ProtectedRoute>
              <Sestavljanke />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljanka />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-c-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaC56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-r-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaR56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-l-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaL56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-k-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaK56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-č-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaČ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-s-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaS56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-š-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŠ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-z-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaZ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-ž-56" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŽ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-c-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaC34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-r-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaR34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-k-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaK34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-l-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaL34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-s-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaS34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-z-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaZ34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-č-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaČ34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-š-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŠ34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-ž-34" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŽ34 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-34/:letter" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljanka34Router />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-c-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaC78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-k-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaK78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-l-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaL78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-r-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaR78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-s-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaS78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-z-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaZ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-č-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaČ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-š-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŠ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-ž-78" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŽ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-c-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaC910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-k-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaK910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-l-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaL910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-r-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaR910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-s-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaS910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-z-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaZ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-č-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaČ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-š-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŠ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/drsna-sestavljanka-ž-910" 
          element={
            <ProtectedRoute>
              <DrsnaSestavljankaŽ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-games" 
          element={
            <ProtectedRoute>
              <SestavljankeGames />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-r" 
          element={
            <ProtectedRoute>
              <SestavljankeR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-r-router/:ageGroup" 
          element={
            <ProtectedRoute>
              <SestavljankeRRouter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-r-56" 
          element={
            <ProtectedRoute>
              <SestavljankeR56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-r-78" 
          element={
            <ProtectedRoute>
              <SestavljankeR78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-r-910" 
          element={
            <ProtectedRoute>
              <SestavljankeR910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-x/:letter/:ageGroup" 
          element={
            <ProtectedRoute>
              <SestavljankeX />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-c" 
          element={
            <ProtectedRoute>
              <SestavljankeC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-c-56" 
          element={
            <ProtectedRoute>
              <SestavljankeC56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-c-78" 
          element={
            <ProtectedRoute>
              <SestavljankeC78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-c-910" 
          element={
            <ProtectedRoute>
              <SestavljankeC910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-č" 
          element={
            <ProtectedRoute>
              <SestavljankeČ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-č-56" 
          element={
            <ProtectedRoute>
              <SestavljankeČ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-č-78" 
          element={
            <ProtectedRoute>
              <SestavljankeČ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-č-910" 
          element={
            <ProtectedRoute>
              <SestavljankeČ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-s" 
          element={
            <ProtectedRoute>
              <SestavljankeS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-s-56" 
          element={
            <ProtectedRoute>
              <SestavljankeS56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-s-78" 
          element={
            <ProtectedRoute>
              <SestavljankeS78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-s-910" 
          element={
            <ProtectedRoute>
              <SestavljankeS910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-š" 
          element={
            <ProtectedRoute>
              <SestavljankeŠ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-š-56" 
          element={
            <ProtectedRoute>
              <SestavljankeŠ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-š-78" 
          element={
            <ProtectedRoute>
              <SestavljankeŠ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-š-910" 
          element={
            <ProtectedRoute>
              <SestavljankeŠ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-z" 
          element={
            <ProtectedRoute>
              <SestavljankeZ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-z-56" 
          element={
            <ProtectedRoute>
              <SestavljankeZ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-z-78" 
          element={
            <ProtectedRoute>
              <SestavljankeZ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-z-910" 
          element={
            <ProtectedRoute>
              <SestavljankeZ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-ž" 
          element={
            <ProtectedRoute>
              <SestavljankeŽ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-ž-56" 
          element={
            <ProtectedRoute>
              <SestavljankeŽ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-ž-78" 
          element={
            <ProtectedRoute>
              <SestavljankeŽ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-ž-910" 
          element={
            <ProtectedRoute>
              <SestavljankeŽ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-k" 
          element={
            <ProtectedRoute>
              <SestavljankeK />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-k-56" 
          element={
            <ProtectedRoute>
              <SestavljankeK56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-k-78" 
          element={
            <ProtectedRoute>
              <SestavljankeK78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-k-910" 
          element={
            <ProtectedRoute>
              <SestavljankeK910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-l" 
          element={
            <ProtectedRoute>
              <SestavljankeL />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-l-56" 
          element={
            <ProtectedRoute>
              <SestavljankeL56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-l-78" 
          element={
            <ProtectedRoute>
              <SestavljankeL78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sestavljanke-l-910" 
          element={
            <ProtectedRoute>
              <SestavljankeL910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matching-games-3-to-4" 
          element={
            <ProtectedRoute>
              <MatchingGames3to4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matching-games-5-to-6" 
          element={
            <ProtectedRoute>
              <MatchingGames5to6 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matching-game/:letter" 
          element={
            <ProtectedRoute>
              <MatchingGameLetter />
            </ProtectedRoute>
          }
        />
        <Route
          path="/matching-game-r-3-to-4" 
          element={
            <ProtectedRoute>
              <MatchingGameR3to4 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja" 
          element={
            <ProtectedRoute>
              <IgraUjemanja />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja" 
          element={
            <ProtectedRoute>
              <Zaporedja />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-c" 
          element={
            <ProtectedRoute>
              <ZaporedjaC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-č" 
          element={
            <ProtectedRoute>
              <ZaporedjaČ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-k" 
          element={
            <ProtectedRoute>
              <ZaporedjaK />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-l" 
          element={
            <ProtectedRoute>
              <ZaporedjaL />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-r" 
          element={
            <ProtectedRoute>
              <ZaporedjaR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-s" 
          element={
            <ProtectedRoute>
              <ZaporedjaS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-š" 
          element={
            <ProtectedRoute>
              <ZaporedjaŠ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-z" 
          element={
            <ProtectedRoute>
              <ZaporedjaZ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-ž" 
          element={
            <ProtectedRoute>
              <ZaporedjaŽ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-c-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaC56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-č-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaČ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-k-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaK56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-l-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaL56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-r-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaR56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-s-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaS56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-š-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaŠ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-z-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaZ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-ž-56" 
          element={
            <ProtectedRoute>
              <ZaporedjaŽ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-c-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaC78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-č-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaČ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-k-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaK78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-l-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaL78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-r-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaR78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-s-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaS78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-š-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaŠ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-z-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaZ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-ž-78" 
          element={
            <ProtectedRoute>
              <ZaporedjaŽ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-c-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaC910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-č-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaČ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-k-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaK910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-l-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaL910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-r-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaR910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-s-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaS910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-š-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaŠ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-z-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaZ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/zaporedja-ž-910" 
          element={
            <ProtectedRoute>
              <ZaporedjaŽ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-c" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaC />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-c-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaC56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-c-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaC78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-c-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaC910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-r" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-r-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaR56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-l" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaL />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-l-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaL56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-k" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaK />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-k-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaK56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-č" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaČ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-č-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaČ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-s" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaS />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-s-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaS56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-š" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŠ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-š-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŠ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-z" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaZ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-z-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaZ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-ž" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŽ />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-ž-56" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŽ56 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-r-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaR78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-l-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaL78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-k-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaK78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-č-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaČ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-s-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaS78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-š-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŠ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-z-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaZ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-ž-78" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŽ78 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-r-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaR910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-l-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaL910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-k-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaK910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-s-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaS910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-š-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŠ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-z-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaZ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-ž-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaŽ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/igra-ujemanja-č-910" 
          element={
            <ProtectedRoute>
              <IgraUjemanjaČ910 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/remove-background" 
          element={
            <ProtectedRoute>
              <AdminRemoveBackground />
            </ProtectedRoute>
          }
        />
        <Route path="/kontakt" element={<Kontakt />} />
        <Route path="/splosni-pogoji" element={<SplosniPogoji />} />
        <Route path="/politika-zasebnosti" element={<PolitikaZasebnosti />} />
        <Route path="/za-posameznike" element={<ZaPosameznike />} />
        <Route path="/za-podjetja" element={<ZaPodjetja />} />
        <Route path="/pomoc-in-podpora" element={<PomocInPodpora />} />
        <Route path="/kako-deluje" element={<KakoDeluje />} />
        <Route path="/cenik" element={<Cenik />} />
        <Route path="/delovanje-test" element={<DelovanjeTest />} />
        
        {/* Admin Routes - wrapped with AdminAuthProvider */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={
          <AdminAuthProvider>
            <AdminLogin />
          </AdminAuthProvider>
        } />
        <Route path="/admin/register" element={
          <AdminAuthProvider>
            <AdminRegister />
          </AdminAuthProvider>
        } />
        <Route path="/admin/dashboard" element={
          <AdminAuthProvider>
            <AdminDashboard />
          </AdminAuthProvider>
        } />
        <Route path="/admin/users" element={
          <AdminAuthProvider>
            <AdminUsers />
          </AdminAuthProvider>
        } />
        <Route path="/admin/users/:userId" element={
          <AdminAuthProvider>
            <AdminUserDetail />
          </AdminAuthProvider>
        } />
        <Route path="/admin/memberships" element={
          <AdminAuthProvider>
            <AdminMemberships />
          </AdminAuthProvider>
        } />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
