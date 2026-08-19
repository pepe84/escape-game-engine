import { useEffect, useState } from "react";
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

export function GamePage() {
  const { t } = useTranslation();
  const { game, state, setState } = useGameContext();
  const navigate = useNavigate();

  const [answer, setAnswer] = useState<QuestionAnswer>("");
  const [error, setError] = useState<string | null>(null);
  const [codeFeedback, setCodeFeedback] = useState<boolean[] | null>(null);

  useEffect(() => {
    if (!game || !state) navigate("/");
    if (state?.finished) navigate("/summary");
  }, [game, state]);

  if (!game || !state) return null;

  const page = game.pages[state.currentPageIndex];
  const totalPages = game.pages.length;
  const progress = GameEngineService.getProgress(game, state);

  const [showHints, setShowHints] = useState(false);
  const totalHints = page.question?.hints?.length ?? 0;
  const hintState =
    page.question?.hints
      ? GameEngineService.getHints(
          state,
          state.currentPageIndex,
          page.question.hints
        )
      : null;

  useEffect(() => {
    setCodeFeedback(null);

    if (!page?.question) {
      setAnswer("");
      return;
    }
    setAnswer(
      QuestionEngineService.getInitialAnswer(
        page.question
      )
    );
  }, [page]);

  const [visible, setVisible] = useState(true);
  const [success, setSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setVisible(false);
    const timer = setTimeout(() => {
      setVisible(true);
    }, 200);
    return () => clearTimeout(timer);
  }, [state.currentPageIndex]);

  const updateGameState = (nextState: GameState) => {
    setState(nextState);
    StorageService.saveState(nextState);
    if (nextState.finished) {
      navigate("/summary");
    }
  };

  const nextPage = (nextState: GameState = state) => {
    updateGameState(GameEngineService.continue(game, nextState));
  };

  const validateQuestion = () => {

    if (isEmpty(answer)) {
      setError(t("gamePage.required"));
      return;
    }

    const result = QuestionEngineService.evaluate(page.question!, answer);

    if (page.question!.type === "code" && result.positions) {
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
        setShake(false)
      }, 500);

      const penalty = page.question!.penaltySeconds ?? game.defaultPenaltySeconds;
      updateGameState(GameEngineService.applyPenalty(state, penalty));
      setError(t("gamePage.wrongAnswer", {penalty}));
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

        <div className="w-full space-y-1">

          <div className="flex justify-between text-sm text-gray-500">
            <span>{t("layout.counter",{current:state.currentPageIndex + 1, total: totalPages})}</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <div className="text-gray-700 whitespace-pre-wrap">
          {page.content}
        </div>

        {page.question && (
          <form
            className={`space-y-4 ${shake ? "animate-shake" : ""}`}
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
            
            {page.question?.formatHelp && (
            <div className="text-gray-500 text-sm">
              {page.question?.formatHelp}
            </div>
            )}

            <div className="flex justify-end">
              { totalHints > 0 && (
              <button
                type="button"
                onClick={() => setShowHints(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-4 cursor-pointer"
              >
                <Lightbulb className="inline mr-2"/>  {t("gamePage.hintsBtn")}
              </button>
              )}

              <button
                type="submit"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer"
              >
                <CircleCheckBig className="inline mr-2"/>  {t("gamePage.submitBtn")}
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

        {!page.question && (
          <div className="flex justify-end">
            <button
              onClick={() => nextPage(state)}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg cursor-pointer"
            >
              {t("gamePage.nextBtn")}
            </button>
          </div>
        )}

      </div>

      { totalHints > 0 && showHints && hintState && (
      <HintsModal
        hints={page.question!.hints ?? []}
        answer={page.question!.answer}
        state={hintState}
        onUnlockHint={() => {
          updateGameState(
            GameEngineService.unlockHint(
              state,
              state.currentPageIndex,
              page.question!.hints!
            )
          );
        }}
        onUnlockSolution={() => {
          updateGameState(
            GameEngineService.unlockSolution(
              state,
              state.currentPageIndex,
              page.question!.hints!
            )
          );
        }}
        onClose={() => setShowHints(false)}
      />          
      )}
    </>
  );
}