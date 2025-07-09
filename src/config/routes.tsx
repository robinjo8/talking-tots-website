import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import MojaStran from "@/pages/MojaStran";
import GovornojezicovneVaje from "@/pages/GovornojezicovneVaje";
import VajeMoториkeGovoril from "@/pages/VajeMoториkeGovoril";
import ArtIzgovorjavaPage from "@/pages/ArtIzgovorjavaPage";
import GovorneIgre from "@/pages/GovorneIgre";
import MojiIzzivi from "@/pages/MojiIzzivi";
import VideoNavodila from "@/pages/VideoNavodila";
import VideoNavodilaCrkaR from "@/pages/VideoNavodilaCrkaR";
import LogopedskiKoticek from "@/pages/LogopedskiKoticek";
import SpominR from "@/pages/SpominR";
import SpominGames from "@/pages/SpominGames";
import SpominK from "@/pages/SpominK";
import SpominS from "@/pages/SpominS";
import SpominŠ from "@/pages/SpominŠ";
import DrsneStevike from "@/pages/DrsneStevike";
import ArtikuacijskiTest from "@/pages/ArtikuacijskiTest";
import Sestavljanke from "@/pages/Sestavljanke";
import SestavljankeGames from "@/pages/SestavljankeGames";
import SestavljankeR from "@/pages/SestavljankeR";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/update-password" element={<UpdatePassword />} />
      
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
        path="/govorne-igre/drsne-stevilke" 
        element={
          <ProtectedRoute>
            <DrsneStevike />
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
        path="/govorne-igre/sestavljanke/:letter" 
        element={
          <ProtectedRoute>
            <SestavljankeR />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/old" 
        element={
          <ProtectedRoute>
            <Sestavljanke />
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
        path="/video-navodila/crka-r" 
        element={
          <ProtectedRoute>
            <VideoNavodilaCrkaR />
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
      
      <Route path="*" element={<NotFound />} />
      
      <Route 
        path="/govorne-igre/spomin" 
        element={
          <ProtectedRoute>
            <SpominGames />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
