
import { AppProviders } from "@/config/providers";
import { AppRouter } from "@/config/router";

const App = () => {
  // Add error boundary logging
  console.log("App component rendering - v2.0 cache bust");
  
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
};

export default App;
