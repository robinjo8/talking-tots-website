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
import ArtikulacijaVajeC from "@/pages/ArtikulacijaVajeC";
import ArtikulacijaVajeČ from "@/pages/ArtikulacijaVajeČ";
import ArtikulacijaVajeK from "@/pages/ArtikulacijaVajeK";
import ArtikulacijaVajeL from "@/pages/ArtikulacijaVajeL";
import ArtikulacijaVajeR from "@/pages/ArtikulacijaVajeR";
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

import ArtikuacijskiTest from "@/pages/ArtikuacijskiTest";
import Sestavljanke from "@/pages/Sestavljanke";
import DrsnaSestavljanka from "@/pages/DrsnaSestavljanka";
import DrsnaSestavljankaC56 from "@/pages/DrsnaSestavljankaC56";
import DrsnaSestavljankaR56 from "@/pages/DrsnaSestavljankaR56";
import DrsnaSestavljankaL56 from "@/pages/DrsnaSestavljankaL56";
import DrsnaSestavljankaK56 from "@/pages/DrsnaSestavljankaK56";
import DrsnaSestavljankaČ56 from "@/pages/DrsnaSestavljankaČ56";
import DrsnaSestavljankaS56 from "@/pages/DrsnaSestavljankaS56";
import DrsnaSestavljankaŠ56 from "@/pages/DrsnaSestavljankaŠ56";
import DrsnaSestavljankaZ56 from "@/pages/DrsnaSestavljankaZ56";
import DrsnaSestavljankaŽ56 from "@/pages/DrsnaSestavljankaŽ56";
import DrsnaSestavljankaC34 from "@/pages/DrsnaSestavljankaC34";
import DrsnaSestavljankaR34 from "@/pages/DrsnaSestavljankaR34";
import DrsnaSestavljanka34Router from "@/pages/DrsnaSestavljanka34Router";

// Import missing sliding puzzle components
import DrsnaSestavljankaČ34 from "@/pages/DrsnaSestavljankaČ34";
import DrsnaSestavljankaS34 from "@/pages/DrsnaSestavljankaS34";
import DrsnaSestavljankaŠ34 from "@/pages/DrsnaSestavljankaŠ34";
import DrsnaSestavljankaZ34 from "@/pages/DrsnaSestavljankaZ34";
import DrsnaSestavljankaŽ34 from "@/pages/DrsnaSestavljankaŽ34";
import DrsnaSestavljankaL34 from "@/pages/DrsnaSestavljankaL34";
import DrsnaSestavljankaK34 from "@/pages/DrsnaSestavljankaK34";
import DrsnaSestavljankaC78 from "@/pages/DrsnaSestavljankaC78";
import DrsnaSestavljankaK78 from "@/pages/DrsnaSestavljankaK78";
import DrsnaSestavljankaL78 from "@/pages/DrsnaSestavljankaL78";
import DrsnaSestavljankaR78 from "@/pages/DrsnaSestavljankaR78";
import DrsnaSestavljankaS78 from "@/pages/DrsnaSestavljankaS78";
import DrsnaSestavljankaZ78 from "@/pages/DrsnaSestavljankaZ78";
import DrsnaSestavljankaČ78 from "@/pages/DrsnaSestavljankaČ78";
import DrsnaSestavljankaŠ78 from "@/pages/DrsnaSestavljankaŠ78";
import DrsnaSestavljankaŽ78 from "@/pages/DrsnaSestavljankaŽ78";
import DrsnaSestavljankaC910 from "@/pages/DrsnaSestavljankaC910";
import DrsnaSestavljankaK910 from "@/pages/DrsnaSestavljankaK910";
import DrsnaSestavljankaL910 from "@/pages/DrsnaSestavljankaL910";
import DrsnaSestavljankaR910 from "@/pages/DrsnaSestavljankaR910";
import DrsnaSestavljankaS910 from "@/pages/DrsnaSestavljankaS910";
import DrsnaSestavljankaZ910 from "@/pages/DrsnaSestavljankaZ910";
import DrsnaSestavljankaČ910 from "@/pages/DrsnaSestavljankaČ910";
import DrsnaSestavljankaŠ910 from "@/pages/DrsnaSestavljankaŠ910";
import DrsnaSestavljankaŽ910 from "@/pages/DrsnaSestavljankaŽ910";
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
import MatchingGames3to4 from "@/pages/MatchingGames3to4";
import MatchingGames5to6 from "@/pages/MatchingGames5to6";
import MatchingGameLetter from "@/pages/MatchingGameLetter";
import IgraUjemanja from "@/pages/IgraUjemanja";
import Zaporedja from "@/pages/Zaporedja";
import ZaporedjaC from "@/pages/ZaporedjaC";
import IgraUjemanjaC from "@/pages/IgraUjemanjaC";
import IgraUjemanjaC56 from "@/pages/IgraUjemanjaC56";
import IgraUjemanjaC78 from "@/pages/IgraUjemanjaC78";
import IgraUjemanjaC910 from "@/pages/IgraUjemanjaC910";
import IgraUjemanjaR from "@/pages/IgraUjemanjaR";
import IgraUjemanjaR56 from "@/pages/IgraUjemanjaR56";
import IgraUjemanjaL from "@/pages/IgraUjemanjaL";
import IgraUjemanjaL56 from "@/pages/IgraUjemanjaL56";
import IgraUjemanjaK from "@/pages/IgraUjemanjaK";
import IgraUjemanjaK56 from "@/pages/IgraUjemanjaK56";
import IgraUjemanjaČ from "@/pages/IgraUjemanjaČ";
import IgraUjemanjaČ56 from "@/pages/IgraUjemanjaČ56";
import IgraUjemanjaS from "@/pages/IgraUjemanjaS";
import IgraUjemanjaS56 from "@/pages/IgraUjemanjaS56";
import IgraUjemanjaŠ from "@/pages/IgraUjemanjaŠ";
import IgraUjemanjaŠ56 from "@/pages/IgraUjemanjaŠ56";
import IgraUjemanjaZ from "@/pages/IgraUjemanjaZ";
import IgraUjemanjaZ56 from "@/pages/IgraUjemanjaZ56";
import IgraUjemanjaŽ from "@/pages/IgraUjemanjaŽ";
import IgraUjemanjaŽ56 from "@/pages/IgraUjemanjaŽ56";
import IgraUjemanjaR78 from "@/pages/IgraUjemanjaR78";
import IgraUjemanjaL78 from "@/pages/IgraUjemanjaL78";
import IgraUjemanjaK78 from "@/pages/IgraUjemanjaK78";
import IgraUjemanjaČ78 from "@/pages/IgraUjemanjaČ78";
import IgraUjemanjaS78 from "@/pages/IgraUjemanjaS78";
import IgraUjemanjaŠ78 from "@/pages/IgraUjemanjaŠ78";
import IgraUjemanjaZ78 from "@/pages/IgraUjemanjaZ78";
import IgraUjemanjaŽ78 from "@/pages/IgraUjemanjaŽ78";
import IgraUjemanjaR910 from "@/pages/IgraUjemanjaR910";
import IgraUjemanjaL910 from "@/pages/IgraUjemanjaL910";
import IgraUjemanjaK910 from "@/pages/IgraUjemanjaK910";
import IgraUjemanjaS910 from "@/pages/IgraUjemanjaS910";
import IgraUjemanjaŠ910 from "@/pages/IgraUjemanjaŠ910";
import IgraUjemanjaZ910 from "@/pages/IgraUjemanjaZ910";
import IgraUjemanjaŽ910 from "@/pages/IgraUjemanjaŽ910";
import IgraUjemanjaČ910 from "@/pages/IgraUjemanjaČ910";
import AdminRemoveBackground from "@/pages/AdminRemoveBackground";

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
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/c56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaC56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/r56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaR56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/l56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaL56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/k56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaK56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/č56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaČ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/s56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaS56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/š56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŠ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/z56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaZ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/ž56" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŽ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/c34" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaC34 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/r34" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaR34 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/:letter" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljanka34Router />
          </ProtectedRoute>
        }
      />
      
      {/* Drsna sestavljanka 7-8 routes */}
      <Route 
        path="/govorne-igre/drsna-sestavljanka/c78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaC78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/k78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaK78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/l78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaL78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/r78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaR78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/s78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaS78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/z78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaZ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/č78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaČ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/š78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŠ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/ž78" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŽ78 />
          </ProtectedRoute>
        }
      />
      
      {/* Drsna sestavljanka 9-10 routes */}
      <Route 
        path="/govorne-igre/drsna-sestavljanka/c910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaC910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/k910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaK910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/l910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaL910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/r910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaR910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/s910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaS910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/z910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaZ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/č910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaČ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/š910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŠ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/drsna-sestavljanka/ž910" 
        element={
          <ProtectedRoute>
            <DrsnaSestavljankaŽ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/r" 
        element={
          <ProtectedRoute>
            <SestavljankeR />
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
        path="/govorne-igre/sestavljanke/č" 
        element={
          <ProtectedRoute>
            <SestavljankeČ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/k" 
        element={
          <ProtectedRoute>
            <SestavljankeK />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/l" 
        element={
          <ProtectedRoute>
            <SestavljankeL />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/s" 
        element={
          <ProtectedRoute>
            <SestavljankeS />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/š" 
        element={
          <ProtectedRoute>
            <SestavljankeŠ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/z" 
        element={
          <ProtectedRoute>
            <SestavljankeZ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/sestavljanke/ž" 
        element={
          <ProtectedRoute>
            <SestavljankeŽ />
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

      {/* Igra Ujemanja Routes */}
      <Route 
        path="/govorne-igre/igra-ujemanja" 
        element={
          <ProtectedRoute>
            <IgraUjemanja />
          </ProtectedRoute>
        }
      />

      {/* Zaporedja Routes */}
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
        path="/govorne-igre/igra-ujemanja/c"
        element={
          <ProtectedRoute>
            <IgraUjemanjaC />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/c56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaC56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/c78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaC78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/r78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaR78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/l78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaL78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/k78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaK78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/č78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaČ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/s78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaS78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/š78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŠ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/z78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaZ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/ž78" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŽ78 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/c910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaC910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/r910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaR910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/l910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaL910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/k910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaK910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/s910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaS910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/š910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŠ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/z910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaZ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/ž910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŽ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/č910" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaČ910 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/r" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaR />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/r56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaR56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/l" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaL />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/l56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaL56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/k" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaK />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/k56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaK56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/č" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaČ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/č56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaČ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/s" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaS />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/s56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaS56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/š" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŠ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/š56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŠ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/z" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaZ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/z56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaZ56 />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/ž" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŽ />
          </ProtectedRoute>
        }
      />
      
      <Route 
        path="/govorne-igre/igra-ujemanja/ž56" 
        element={
          <ProtectedRoute>
            <IgraUjemanjaŽ56 />
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

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
