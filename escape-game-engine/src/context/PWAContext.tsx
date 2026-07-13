import { createContext, useContext, type ReactNode } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export function usePWA() {
  const {
    needRefresh,
    offlineReady,
    updateServiceWorker
  } = useRegisterSW({ immediate: true });
  return {
    needRefresh,
    offlineReady,
    update: () => updateServiceWorker(true)
  };
}

interface PWAContextValue {
  needRefresh: boolean;
  offlineReady: boolean;
  update: () => void;
}

const PWAContext = createContext<PWAContextValue | null>(null);

export function PWAProvider({ children }: { children: ReactNode }) {

  const pwa = usePWA();

  return (
    <PWAContext.Provider value={{
      needRefresh: pwa.needRefresh[0],
      offlineReady: pwa.offlineReady[0],
      update: pwa.update
    }}>{children}</PWAContext.Provider>
  );

}

export function usePWAContext() {
  const context = useContext(PWAContext);
  if (!context) {
    throw new Error("usePWAContext must be used inside PWAProvider");
  }
  return context;
}