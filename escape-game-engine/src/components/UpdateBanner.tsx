import { useTranslation } from "react-i18next";
import { usePWAContext } from "../context/PWAContext";

export function UpdateBanner() {

  const { t } = useTranslation();

  const {
    needRefresh,
    offlineReady,
    update
  } = usePWAContext();

  if (!needRefresh && !offlineReady) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-xl shadow-xl px-6 py-4 z-50">
      <div className="space-y-3">
        {offlineReady && (
          <div>
            {t("pwa.offlineReady")}
          </div>
        )}
        {needRefresh && (
          <div>
            {t("pwa.updateAvailable")}
          </div>
        )}
        {needRefresh && (
          <div className="flex justify-end">
            <button
              onClick={update}
              className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-lg"
            >
              {t("pwa.update")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}