import { BrowserRouter } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { AppLayout } from "./components/layout/AppLayout";
import { AppRoutes } from "./router/AppRoutes";
import { AppBootstrap } from "./components/AppBootstrap";
import "./i18n/i18n";
import { PWAProvider } from "./context/PWAContext";
import { UpdateBanner } from "./components/UpdateBanner";

export default function App() {  
  return (
    <BrowserRouter>
      <PWAProvider>
        <GameProvider>
          <AppBootstrap />
          <AppLayout>
            <AppRoutes />
          </AppLayout>
          <UpdateBanner />
        </GameProvider>
      </PWAProvider>
    </BrowserRouter>
  );
}