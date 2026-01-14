
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./routes";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <CookieConsentBanner />
    </BrowserRouter>
  );
}
