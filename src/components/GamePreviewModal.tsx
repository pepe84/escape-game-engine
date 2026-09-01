import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { EscapeGame } from "../models/EscapeGame";

interface GamePreviewModalProps {
  game: EscapeGame | null;
  sourceUrl: string | null;
  onStart: () => void;
  onCancel: () => void;
}

export function GamePreviewModal({
  game,
  sourceUrl,
  onStart,
  onCancel
}: GamePreviewModalProps) {

  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  if (!game) return null;

  const totalQuestions = game.pages.filter(
    page => !!page.question
  ).length;

  /*
   * Generem l'enllaç que permet compartir aquest joc.
   *
   * Exemple:
   *
   * https://usuari.github.io/escape-game-engine/?url=https%3A%2F%2F...
   */
  const shareUrl = sourceUrl
    ? (() => {
        const currentUrl = new URL(window.location.href);
        currentUrl.search = "";
        currentUrl.searchParams.set("url", sourceUrl);
        return currentUrl.toString();
      })()
    : null;

  const copyShareUrl = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        "No s'ha pogut copiar l'enllaç:",
        error
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-preview-title"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">

        {/* ======================================================= */}
        {/* HEADER */}
        {/* ======================================================= */}

        <div className="px-6 py-4">
          <h2
            id="game-preview-title"
            className="text-2xl font-bold"
          >
            {game.title}
          </h2>
        </div>

        {/* ======================================================= */}
        {/* INFORMACIÓ */}
        {/* ======================================================= */}

        <div className="space-y-4 px-6 py-4">

          {game.description && (
            <div>
              <p className="whitespace-pre-line">
                {game.description}
              </p>
            </div>
          )}

          <div className="border border-gray-200 rounded-lg p-4 mt-8">

            <div className="grid grid-cols-2 gap-4">

              <div>
                <div className="text-sm text-gray-500">
                  {t("gamePreview.version")}
                </div>

                <div className="font-medium">
                  {game.version}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  {t("gamePreview.duration")}
                </div>

                <div className="font-medium">
                  {game.durationMinutes} min
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  {t("gamePreview.questions")}
                </div>

                <div className="font-medium">
                  {totalQuestions}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500">
                  {t("gamePreview.penalty")}
                </div>

                <div className="font-medium">
                  {game.defaultPenaltySeconds} s
                </div>
              </div>

              {game.author && (
                <div>
                  <div className="text-sm text-gray-500">
                    {t("gamePreview.author")}
                  </div>

                  <div className="font-medium">
                    {game.author}
                  </div>
                </div>
              )}

              {game.license && (
                <div>
                  <div className="text-sm text-gray-500">
                    {t("gamePreview.license")}
                  </div>

                  <div className="font-medium">
                    {game.license}
                  </div>
                </div>
              )}

            </div>
        </div>

          {/* ===================================================== */}
          {/* ENLLAÇ DE COMPARTICIÓ */}
          {/* ===================================================== */}

          {shareUrl && (
            <div className="border border-gray-200 rounded-lg p-4 mt-4">

              <div className="text-sm text-gray-500 mb-2">
                {t("gamePreview.share")}
              </div>

              <div className="flex gap-2">

                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  onFocus={(e) =>
                    e.currentTarget.select()
                  }
                  className="min-w-0 flex-1 border border-gray-300 rounded-lg
                    px-3 py-2 text-sm bg-gray-50"
                />

                <button
                  type="button"
                  onClick={copyShareUrl}
                  title={t("gamePreview.copy")}
                  aria-label={t("gamePreview.copy")}
                  className="shrink-0 rounded-lg bg-gray-200
                    px-3 py-2 hover:bg-gray-300 cursor-pointer"
                >
                  {copied ? (
                    <Check
                      size={20}
                      className="text-emerald-600"
                    />
                  ) : (
                    <Copy size={20} />
                  )}
                </button>

              </div>

              {copied && (
                <div className="text-emerald-600 text-sm mt-2">
                  {t("gamePreview.copied")}
                </div>
              )}

            </div>
          )}

        </div>

        {/* ======================================================= */}
        {/* FOOTER */}
        {/* ======================================================= */}

        <div className="flex justify-end gap-3 px-6 py-4">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2
              font-medium hover:bg-gray-300 cursor-pointer"
          >
            {t("gamePreview.cancel")}
          </button>

          <button
            type="button"
            onClick={onStart}
            className="rounded-lg bg-emerald-500 px-4 py-2
              font-medium text-white hover:bg-emerald-600 cursor-pointer"
          >
            {t("gamePreview.start")}
          </button>

        </div>

      </div>
    </div>
  );
}