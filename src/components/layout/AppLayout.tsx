import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { useTranslation } from "react-i18next";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({
  children,
}: AppLayoutProps) {

  const { ready } = useTranslation();

  return (

    <div className="min-h-screen flex flex-col bg-slate-50">

      <Header />

      <main className="flex-1 pt-16">
        <div className="max-w-2xl mx-auto p-8 space-y-4">
        { !ready 
          ? <div className="text-center mt-5">🌍 Loading language...</div>
          : <>{children}</>
        }
        </div>
      </main>

      <Footer />

    </div>
  );
}