
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              
              {/* Protected routes */}
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
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
