import { AppLayout } from "@/components/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./routes";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

export function AppRouter() {
  return (
    <>
      <ScrollToTop />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <CookieConsentBanner />
    </>
  );
}