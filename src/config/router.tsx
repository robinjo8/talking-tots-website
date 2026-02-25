import { AppLayout } from "@/components/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./routes";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { RouteSeo } from "@/components/seo/RouteSeo";

export function AppRouter() {
  return (
    <>
      <RouteSeo />
      <ScrollToTop />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
      <CookieConsentBanner />
    </>
  );
}