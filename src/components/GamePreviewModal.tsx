import type { EscapeGame } from "../models/EscapeGame";
import { useTranslation } from "react-i18next";

interface GamePreviewModalProps {
  game: EscapeGame | null;
  onStart: () => void;
  onCancel: () => void;
}

export function GamePreviewModal({
  game,
  onStart,
  onCancel
}: GamePreviewModalProps) {

  const { t } = useTranslation();

  if (!game) return null;

  const totalQuestions = game.pages.filter(
    page => !!page.question
  ).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="game-preview-title"
    >
      <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">

        <div className="border-b px-6 py-4">
          <h2
            id="game-preview-title"
            className="text-2xl font-bold"
          >
            {game.title}
          </h2>
        </div>

        <div className="space-y-4 px-6 py-5">

          {game.description && (
            <div>
              <p className="text-gray-600">
                {game.description}
              </p>
            </div>
          )}

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

        <div className="flex justify-end gap-3 border-t px-6 py-4">

          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg bg-gray-200 px-4 py-2 font-medium hover:bg-gray-300 cursor-pointer"
          >
            {t("gamePreview.cancel")}
          </button>

          <button
            type="button"
            onClick={onStart}
            className="rounded-lg bg-emerald-500 px-4 py-2 font-medium text-white hover:bg-emerald-600 cursor-pointer"
          >
            {t("gamePreview.start")}
          </button>

        </div>

      </div>
    </div>
  );
}