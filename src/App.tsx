
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
              {/* Public routes */}
              <Route path="/" element={
                <SidebarProvider>
                  <AppLayout><Index /></AppLayout>
                </SidebarProvider>
              } />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><Index /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><Profile /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/moja-stran" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><MojaStran /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorno-jezikovne-vaje" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><GovornojezicovneVaje /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/artikulacija" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><ArtIzgovorjavaPage /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/artikulacija/:letter" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><ArtIzgovorjavaPage /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><GovorneIgre /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre/spomin/spomin-r" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><SpominR /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/moji-izzivi" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><MojiIzzivi /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/video-navodila" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><VideoNavodila /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre/spomin/spomin-k" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><SpominK /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre/spomin/spomin-s" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><SpominS /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre/spomin/spomin-š" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><SpominŠ /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              <Route path="/govorne-igre/spomin" element={
                <ProtectedRoute>
                  <SidebarProvider>
                    <AppLayout><SpominGames /></AppLayout>
                  </SidebarProvider>
                </ProtectedRoute>
              } />
              
              {/* Admin routes */}
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
