import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import MojaStran from "./pages/MojaStran";
import GovornojezicovneVaje from "./pages/GovornojezicovneVaje";
import ArtIzgovorjavaPage from "./pages/ArtIzgovorjavaPage";
import GovorneIgre from "./pages/GovorneIgre";
import MojiIzzivi from "./pages/MojiIzzivi";
import VideoNavodila from "./pages/VideoNavodila";
import SpominIgra from "./pages/SpominIgra";
import SpominR from "./pages/SpominR";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppLayout>
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
                  path="/govorne-igre" 
                  element={
                    <ProtectedRoute>
                      <GovorneIgre />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path="/govorne-igre/spomin" 
                  element={
                    <ProtectedRoute>
                      <SpominIgra />
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
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
