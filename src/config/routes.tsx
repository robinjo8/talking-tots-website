import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import UpdatePassword from "@/pages/UpdatePassword";
import NotFound from "@/pages/NotFound";
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
import VideoNavodilaCrkaR from "@/pages/VideoNavodilaCrkaR";
import LogopedskiKoticek from "@/pages/LogopedskiKoticek";
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

import ArtikuacijskiTest from "@/pages/ArtikuacijskiTest";
import Sestavljanke from "@/pages/Sestavljanke";
import SestavljankeGames from "@/pages/SestavljankeGames";
import SestavljankeR from "@/pages/SestavljankeR";
import SestavljankeRRouter from "@/pages/SestavljankeRRouter";
import SestavljankeR56 from "@/pages/SestavljankeR56";
import SestavljankeR78 from "@/pages/SestavljankeR78";
import SestavljankeR910 from "@/pages/SestavljankeR910";

import SestavljankeX from "@/pages/SestavljankeX";
import SestavljankeC from "@/pages/SestavljankeC";
import SestavljankeC56 from "@/pages/SestavljankeC56";
import SestavljankeC78 from "@/pages/SestavljankeC78";
import SestavljankeC910 from "@/pages/SestavljankeC910";
import SestavljankeČ from "@/pages/SestavljankeČ";
import SestavljankeČ56 from "@/pages/SestavljankeČ56";
import SestavljankeČ78 from "@/pages/SestavljankeČ78";
import SestavljankeČ910 from "@/pages/SestavljankeČ910";
import SestavljankeS from "@/pages/SestavljankeS";
import SestavljankeS56 from "@/pages/SestavljankeS56";
import SestavljankeS78 from "@/pages/SestavljankeS78";
import SestavljankeS910 from "@/pages/SestavljankeS910";
import SestavljankeŠ from "@/pages/SestavljankeŠ";
import SestavljankeŠ56 from "@/pages/SestavljankeŠ56";
import SestavljankeŠ78 from "@/pages/SestavljankeŠ78";
import SestavljankeŠ910 from "@/pages/SestavljankeŠ910";
import SestavljankeZ from "@/pages/SestavljankeZ";
import SestavljankeZ56 from "@/pages/SestavljankeZ56";
import SestavljankeZ78 from "@/pages/SestavljankeZ78";
import SestavljankeZ910 from "@/pages/SestavljankeZ910";
import SestavljankeŽ from "@/pages/SestavljankeŽ";
import SestavljankeŽ56 from "@/pages/SestavljankeŽ56";
import SestavljankeŽ78 from "@/pages/SestavljankeŽ78";
import SestavljankeŽ910 from "@/pages/SestavljankeŽ910";
import SestavljankeK from "@/pages/SestavljankeK";
import SestavljankeK56 from "@/pages/SestavljankeK56";
import SestavljankeK78 from "@/pages/SestavljankeK78";
import SestavljankeK910 from "@/pages/SestavljankeK910";
import SestavljankeL from "@/pages/SestavljankeL";
import SestavljankeL56 from "@/pages/SestavljankeL56";
import SestavljankeL78 from "@/pages/SestavljankeL78";
import SestavljankeL910 from "@/pages/SestavljankeL910";
import PoveziPareGames from "@/pages/PoveziPareGames";
import PoveziPareR from "@/pages/PoveziPareR";
import PoveziPareC from "@/pages/PoveziPareC";
import PoveziPareC56 from "@/pages/PoveziPareC56";
import PoveziPareC78 from "@/pages/PoveziPareC78";
import PoveziPareC910 from "@/pages/PoveziPareC910";
import MatchingGames3to4 from "@/pages/MatchingGames3to4";
import MatchingGames5to6 from "@/pages/MatchingGames5to6";
import MatchingGameLetter from "@/pages/MatchingGameLetter";

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
        path="/govorne-igre/sestavljanke/r" 
        element={
          <ProtectedRoute>
            <SestavljankeRRouter />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/r-basic" 
        element={
          <ProtectedRoute>
            <SestavljankeR />
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
        path="/govorne-igre/sestavljanke/r56" 
        element={
          <ProtectedRoute>
            <SestavljankeR56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/r78" 
        element={
          <ProtectedRoute>
            <SestavljankeR78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/r910" 
        element={
          <ProtectedRoute>
            <SestavljankeR910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/sestavljanke-r56" 
        element={
          <ProtectedRoute>
            <SestavljankeR56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/sestavljanke-r78" 
        element={
          <ProtectedRoute>
            <SestavljankeR78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/sestavljanke-r910" 
        element={
          <ProtectedRoute>
            <SestavljankeR910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/X" 
        element={
          <ProtectedRoute>
            <SestavljankeX />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/c" 
        element={
          <ProtectedRoute>
            <SestavljankeC />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/c56" 
        element={
          <ProtectedRoute>
            <SestavljankeC56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/c78" 
        element={
          <ProtectedRoute>
            <SestavljankeC78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/c910" 
        element={
          <ProtectedRoute>
            <SestavljankeC910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/č56" 
        element={
          <ProtectedRoute>
            <SestavljankeČ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/č78" 
        element={
          <ProtectedRoute>
            <SestavljankeČ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/č910" 
        element={
          <ProtectedRoute>
            <SestavljankeČ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/s56" 
        element={
          <ProtectedRoute>
            <SestavljankeS56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/s78" 
        element={
          <ProtectedRoute>
            <SestavljankeS78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/s910" 
        element={
          <ProtectedRoute>
            <SestavljankeS910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/š56" 
        element={
          <ProtectedRoute>
            <SestavljankeŠ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/š78" 
        element={
          <ProtectedRoute>
            <SestavljankeŠ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/š910" 
        element={
          <ProtectedRoute>
            <SestavljankeŠ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/z56" 
        element={
          <ProtectedRoute>
            <SestavljankeZ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/z78" 
        element={
          <ProtectedRoute>
            <SestavljankeZ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/z910" 
        element={
          <ProtectedRoute>
            <SestavljankeZ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/ž56" 
        element={
          <ProtectedRoute>
            <SestavljankeŽ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/ž78" 
        element={
          <ProtectedRoute>
            <SestavljankeŽ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/ž910" 
        element={
          <ProtectedRoute>
            <SestavljankeŽ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/k56" 
        element={
          <ProtectedRoute>
            <SestavljankeK56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/k78" 
        element={
          <ProtectedRoute>
            <SestavljankeK78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/k910" 
        element={
          <ProtectedRoute>
            <SestavljankeK910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/l56" 
        element={
          <ProtectedRoute>
            <SestavljankeL56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/l78" 
        element={
          <ProtectedRoute>
            <SestavljankeL78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/l910" 
        element={
          <ProtectedRoute>
            <SestavljankeL910 />
          </ProtectedRoute>
        }
      />
      
      {/* Povezi Pare Routes */}
      <Route 
        path="/govorne-igre/povezi-pare" 
        element={
          <ProtectedRoute>
            <PoveziPareGames />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/govorne-igre/povezi-pare/c" 
        element={<Navigate to="/govorne-igre/povezi-pare-3-4/c" replace />}
      />
      
      {/* Backward compatibility redirects */}
      <Route 
        path="/govorne-igre/povezi-pare/c56" 
        element={<Navigate to="/govorne-igre/povezi-pare-5-6/c" replace />}
      />
      
      <Route 
        path="/govorne-igre/povezi-pare/c78" 
        element={<Navigate to="/govorne-igre/povezi-pare-7-8/c" replace />}
      />
      
      <Route 
        path="/govorne-igre/povezi-pare/c910" 
        element={<Navigate to="/govorne-igre/povezi-pare-9-10/c" replace />}
      />
      
      <Route 
        path="/govorne-igre/povezi-pare/r" 
        element={
          <ProtectedRoute>
            <PoveziPareR />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
