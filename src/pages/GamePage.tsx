
import { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { GameEngineService } from "../services/GameEngineService";
import { QuestionEngineService } from "../services/QuestionEngineService";
import { isEmpty } from "../utils/isEmpty";
import { QuestionRenderer } from "../components/questions/QuestionRenderer";
import type { QuestionAnswer } from "../models/QuestionAnswer";
import { StorageService } from "../services/StorageService";
import { HintsModal } from "../components/HintsModal";
import { CircleCheckBig, Lightbulb } from "lucide-react";
import type { GameState } from "../models/GameState";
import { useTranslation } from "react-i18next";
import { SummaryService } from "../services/SummaryService";

export function GamePage() {
  const { t } = useTranslation();
  const { game, state, setState } = useGameContext();
  const navigate = useNavigate();

  // Estats del component
  const [answer, setAnswer] = useState<QuestionAnswer>("");
  const [error, setError] = useState<string | null>(null);
  const [codeFeedback, setCodeFeedback] = useState<boolean[] | null>(null);
  const [showHints, setShowHints] = useState(false);
  const [visible, setVisible] = useState(true);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Dades de la pàgina actual, si estan disponibles
  const page =
    game && state
      ? game.pages[state.currentPageIndex]
      : undefined;

  // 1. Navegació segura
  useEffect(() => {
    if (!game || !state) {
      navigate("/", { replace: true });
      return;
    }

    if (state.finished) {
      navigate("/summary", { replace: true });
    }
  }, [game, state, navigate]);

  // 2. Tornar al principi quan canvia la pàgina
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [state?.currentPageIndex]);

  // Reinicialitzar la resposta quan canvia la pàgina
  useEffect(() => {
    setCodeFeedback(null);
    setError(null);
    setShowHints(false);

    if (!game || !state) return;

    const currentPage = game.pages[state.currentPageIndex];

    if (!currentPage?.question) {
      setAnswer("");
      return;
    }

    setAnswer(
      QuestionEngineService.getInitialAnswer(
        currentPage.question
      )
    );
  }, [game, state?.currentPageIndex]);

  // Animació de transició entre pàgines
  useEffect(() => {
    setVisible(false);

    const timer = setTimeout(() => {
      setVisible(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [state?.currentPageIndex]);

  // Tots els hooks s'han declarat abans d'aquest retorn
  if (!game || !state || !page) return null;

  const totalPages = game.pages.length;
  const progress = GameEngineService.getProgress(game, state);
  const totalHints = page.question?.hints?.length ?? 0;

  const hintState = page.question?.hints
    ? GameEngineService.getHints(
        state,
        state.currentPageIndex,
        page.question.hints
      )
    : null;

  const updateGameState = (nextState: GameState) => {
    setState(nextState);
    StorageService.saveState(nextState);

    if (nextState.finished) {
      const summary = SummaryService.build(game, nextState);

      StorageService.addHistoryEntry({
        id: nextState.id,
        gameTitle: game.title,
        teamName: nextState.teamName,
        startedAt: nextState.startedAt,
        finishedAt: nextState.finishedAt ?? "",
        score: summary.score
      });

      navigate("/summary", {
        state: { summary }
      });
    }
  };

  const nextPage = (nextState: GameState = state) => {
    updateGameState(
      GameEngineService.continue(game, nextState)
    );
  };

  const validateQuestion = () => {
    if (!page.question) return;

    if (isEmpty(answer)) {
      setError(t("gamePage.required"));
      return;
    }

    const result = QuestionEngineService.evaluate(page.question, answer);

    if (
      QuestionEngineService.isCodeQuestion(page.question.type) &&
      result.positions
    ) {
      setCodeFeedback(result.positions);
    }

    if (result.correct) {
      setError(null);
      setAnswer("");
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        nextPage(GameEngineService.registerSuccess(state));
      }, 750);
    } else {
      setShake(true);
      setTimeout(() => {
        setShake(false);
      }, 500);

      const penalty =
        page.question.penaltySeconds ??
        game.defaultPenaltySeconds;

      updateGameState(GameEngineService.applyPenalty(state, penalty));

      setError(t("gamePage.wrongAnswer", { penalty }));
    }
  };

  return (
    <>
      <div
        className={`space-y-4 transition-all duration-300 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
      >
        <h2 className="text-xl font-bold">
          {page.title}
        </h2>

        {/* Progrés de la partida */}
        <div className="w-full space-y-1">
          <div className="flex justify-between text-sm text-gray-500">
            <span>
              {t("layout.counter", {
                current: state.currentPageIndex + 1,
                total: totalPages
              })}
            </span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Contingut de la pàgina */}
        <div className="text-gray-700 space-y-4">
          {page.content
            ?.split(/\r?\n\s*\r?\n/)
            .map((paragraph, index) => (
              <p key={index} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
        </div>

        {/* Pregunta */}
        {page.question && (
          <form
            className={`space-y-4 ${
              shake ? "animate-shake" : ""
            }`}
            onSubmit={(e) => {
              e.preventDefault();
              validateQuestion();
            }}
          >
            <QuestionRenderer
              question={page.question}
              answer={answer}
              onChange={setAnswer}
              feedback={codeFeedback}
            />

            {page.question.formatHelp && (
              <div className="text-gray-500">
                ⬆️ {page.question.formatHelp}
              </div>
            )}

            <div className="flex justify-end">
              {totalHints > 0 && (
                <button
                  type="button"
                  onClick={() => setShowHints(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-4 cursor-pointer"
                >
                  <Lightbulb className="inline mr-2" />
                  {t("gamePage.hintsBtn")}
                </button>
              )}

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                <CircleCheckBig className="inline mr-2" />
                {t("gamePage.submitBtn")}
              </button>
            </div>

            {success && (
              <div className="bg-emerald-100 border border-emerald-300 text-emerald-700 px-4 py-3 rounded-lg">
                Correcte!
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
          </form>
        )}

        {/* Botó per avançar sense pregunta */}
        {!page.question && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => nextPage(state)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {t("gamePage.nextBtn")}
            </button>
          </div>
        )}
      </div>

      {/* Modal de pistes */}
      {totalHints > 0 && showHints && hintState && (
        <HintsModal
          hints={page.question?.hints ?? []}
          answer={page.question?.answer ?? ""}
          state={hintState}
          onUnlockHint={() => {
            updateGameState(
              GameEngineService.unlockHint(
                state,
                state.currentPageIndex,
                page.question?.hints ?? []
              )
            );
          }}
          onUnlockSolution={() => {
            updateGameState(
              GameEngineService.unlockSolution(
                state,
                state.currentPageIndex,
                page.question?.hints ?? []
              )
            );
          }}
          onClose={() => setShowHints(false)}
        />
      )}
    </>
  );
}