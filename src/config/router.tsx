
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./routes";
import { BackgroundMusicProvider } from "@/contexts/BackgroundMusicContext";

export function AppRouter() {
  return (
    <BrowserRouter>
      <BackgroundMusicProvider>
        <ScrollToTop />
        <AppLayout>
          <AppRoutes />
        </AppLayout>
      </BackgroundMusicProvider>
    </BrowserRouter>
  );
}
