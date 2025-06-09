
import { BrowserRouter } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AppRoutes } from "./routes";

export function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </BrowserRouter>
  );
}
