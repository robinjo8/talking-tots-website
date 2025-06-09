
import { AppProviders } from "@/config/providers";
import { AppRouter } from "@/config/router";

const App = () => (
  <AppProviders>
    <AppRouter />
  </AppProviders>
);

export default App;
