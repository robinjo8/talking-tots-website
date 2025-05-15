
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AppLayout } from "@/components/AppLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { SidebarProvider } from "@/components/ui/sidebar";
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
import SpominR from "./pages/SpominR";
import SpominGames from "./pages/SpominGames";
import SpominK from "./pages/SpominK";
import SpominS from "./pages/SpominS";
import SpominŠ from "./pages/SpominŠ";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import UsersAdmin from "./pages/admin/Users";
import ContentAdmin from "./pages/admin/Content";
import SettingsAdmin from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<AppLayout><Index /></AppLayout>} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Index /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <AppLayout><Profile /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/moja-stran" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MojaStran /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorno-jezikovne-vaje" 
                element={
                  <ProtectedRoute>
                    <AppLayout><GovornojezicovneVaje /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/artikulacija" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ArtIzgovorjavaPage /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/artikulacija/:letter" 
                element={
                  <ProtectedRoute>
                    <AppLayout><ArtIzgovorjavaPage /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre" 
                element={
                  <ProtectedRoute>
                    <AppLayout><GovorneIgre /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre/spomin/spomin-r" 
                element={
                  <ProtectedRoute>
                    <AppLayout><SpominR /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/moji-izzivi" 
                element={
                  <ProtectedRoute>
                    <AppLayout><MojiIzzivi /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/video-navodila" 
                element={
                  <ProtectedRoute>
                    <AppLayout><VideoNavodila /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre/spomin/spomin-k" 
                element={
                  <ProtectedRoute>
                    <AppLayout><SpominK /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre/spomin/spomin-s" 
                element={
                  <ProtectedRoute>
                    <AppLayout><SpominS /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre/spomin/spomin-š" 
                element={
                  <ProtectedRoute>
                    <AppLayout><SpominŠ /></AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/govorne-igre/spomin" 
                element={
                  <ProtectedRoute>
                    <AppLayout><SpominGames /></AppLayout>
                  </ProtectedRoute>
                }
              />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
