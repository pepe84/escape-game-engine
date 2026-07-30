import { Brain } from 'lucide-react';
import { useCountdown } from "../../hooks/useCountdown";
import { useGameContext } from "../../context/GameContext";
import { useNavigate, Link } from "react-router-dom";
import { StorageService } from "../../services/StorageService";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const { formatted } = useCountdown();
  const { state, reset } = useGameContext();
  const navigate = useNavigate();

  const abandonGame = () => {
    const ok = confirm("Segur que vols finalitzar la partida?");
    if (!ok) return;

    reset();
    StorageService.clear();
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white border-b border-slate-700 z-50">
      <nav className="h-full px-6 flex items-center justify-between font-semibold">

        <Link to="/">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-900">
                <Brain size={24} />
              </div>
              <span className="md:hidden">EGE</span>
              <span className="invisible md:visible">Escape Game Engine</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          
          <div className="font-mono text-xl font-bold tracking-wider">
            {formatted}
          </div>

          {state && (
            <button
              onClick={abandonGame}
              className="bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-1 rounded cursor-pointer"
            >
              {t("layout.finishBtn")}
            </button>
          )}

        </div>
      </nav>
    </header>
  );
}
