import { useState } from "react";
import { HintEngineService } from "../services/HintEngineService";
import { useTranslation } from "react-i18next";

interface Props {
  hints: string[];
  answer: string;
  state: Record<string, boolean>;
  onUnlockHint: () => void;
  onUnlockSolution: () => void;
  onClose: () => void;
}

export function HintsModal({
  hints,
  answer,
  state,
  onUnlockHint,
  onUnlockSolution,
  onClose
}: Props) {

  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const unlockedHints = HintEngineService.countUsedHints(state);

  const solutionUnlocked =
    HintEngineService.isSolutionUnlocked(
      state
    );

  const allHintsUnlocked =
    HintEngineService.allHintsUnlocked(
      state
    );

  const unlockNext = () => {
    if (!allHintsUnlocked) {
      onUnlockHint();
      setTab(unlockedHints);
    } else if (!solutionUnlocked) {
      onUnlockSolution();
      setTab(hints.length);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white rounded-xl w-[520px] p-5 space-y-4 shadow-xl">

        <div className="flex justify-between">
          <div className="flex gap-2 flex-wrap">
            {hints.map((_, index) => {
              const unlocked =
                HintEngineService.isHintUnlocked(
                  state,
                  index
                );
              return (
                <button
                  key={index}
                  disabled={!unlocked}
                  onClick={() => setTab(index)}
                  className={`px-3 py-1 rounded text-sm cursor-pointer ${
                    unlocked
                      ? tab === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {t("gamePage.hints.hint", {i: index + 1})}
                </button>
              );
            })}
            <button
              disabled={!solutionUnlocked}
              onClick={() => setTab(hints.length)}
              className={`px-3 py-1 rounded text-sm cursor-pointer ${
                tab === hints.length
                  ? "bg-green-600 text-white"
                  : solutionUnlocked
                    ? "bg-green-200"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {t("gamePage.hints.solution")}
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="min-h-[120px]">
          {tab < hints.length && 
           HintEngineService.isHintUnlocked(state, tab) && (
            <p>{hints[tab]}</p>
          )}
          {tab === hints.length &&
           solutionUnlocked && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="font-bold text-green-700 mb-2">
                {t("gamePage.hints.solution")}
              </div>
              <div>{answer}</div>
            </div>
          )}
        </div>

        <div className="flex justify-end">
          {!solutionUnlocked && (
            <button
              onClick={unlockNext}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {allHintsUnlocked
                ? t("gamePage.hints.solutionBtn")
                : t("gamePage.hints.hintBtn", {i: unlockedHints+1})
              }
            </button>
          )}
        </div>

      </div>
    </div>
  );
}