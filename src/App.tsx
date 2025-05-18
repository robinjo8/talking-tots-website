
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { SidebarProvider } from "./components/ui/sidebar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MojaStran from "./pages/MojaStran";
import GovornojezicovneVaje from "./pages/GovornojezicovneVaje";
import ArtIzgovorjavaPage from "./pages/ArtIzgovorjavaPage";
import MojiIzzivi from "./pages/MojiIzzivi";
import VideoNavodila from "./pages/VideoNavodila";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";
import UpdatePassword from "./pages/UpdatePassword";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import GovorneIgre from "./pages/GovorneIgre";
import SpominGames from "./pages/SpominGames";
import SpominR from "./pages/SpominR";
import SpominK from "./pages/SpominK";
import SpominS from "./pages/SpominS";
import SpominŠ from "./pages/SpominŠ";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <SidebarProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/update-password" element={<UpdatePassword />} />

                {/* Protected Routes */}
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
                  path="/artikulacijska-izgovorjava"
                  element={
                    <ProtectedRoute>
                      <ArtIzgovorjavaPage />
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
                  path="/profil"
                  element={
                    <ProtectedRoute>
                      <Profile />
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

                {/* Catch All/404 */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>

            <Toaster />
            <SonnerToaster position="top-center" />
          </SidebarProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
