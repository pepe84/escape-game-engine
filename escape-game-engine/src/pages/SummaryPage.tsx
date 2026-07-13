import { useGameContext } from "../context/GameContext";
import type { GameEvent } from "../models/GameEvent";
import { GameEventType } from "../models/GameEventType";
import { SummaryService } from "../services/SummaryService";
import { useTranslation } from "react-i18next";

export function SummaryPage() {
  const { t } = useTranslation();
  const { game, state } = useGameContext();

  if (!game || !state) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregant resum...
      </div>
    );
  }

  const summary = SummaryService.build(game, state);

  const describeEvent = (event: GameEvent) => {

    switch (event.type) {

      case GameEventType.GAME_STARTED:
        return t("summaryPage.eventType.gs");

      case GameEventType.PAGE_OPENED:
        return t("summaryPage.eventType.po", {i: event.pageIndex + 1});

      case GameEventType.CORRECT_ANSWER:
        return t("summaryPage.eventType.ca");

      case GameEventType.WRONG_ANSWER:
        return t("summaryPage.eventType.wa");

      case GameEventType.HINT_OPENED:
        return t("summaryPage.eventType.ho", {i: event.value});

      case GameEventType.SOLUTION_OPENED:
        return t("summaryPage.eventType.so");

      case GameEventType.GAME_FINISHED:
        return t("summaryPage.eventType.gf");

      default:
        return event.type;
    }
  }

  return (
    <>

      {summary.gameCompleted ? (
        <div className="text-2xl font-bold text-center bg-emerald-50 border border-emerald-200 rounded-2xl p-8">
          {t("summaryPage.result.success",{team:summary.teamName})} 🎉
        </div>
      ) : (
        <div className="text-2xl font-bold text-center bg-orange-50 border border-orange-200 rounded-2xl p-8">
          😵 {t("summaryPage.result.failed",{team:summary.teamName})}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.correctAnswers")}
          </div>
          <div className="text-2xl font-bold">
            {t("layout.counter",{current:summary.correctAnswers, total: summary.totalQuestions})}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.usedSeconds")}            
          </div>
          <div className="text-2xl font-bold">
            {summary.usedSeconds}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.penaltySeconds")}
          </div>
          <div className="text-2xl font-bold">
            {summary.penaltySeconds}s
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.wrongAnswers")}
          </div>
          <div className="text-2xl font-bold">
            {summary.wrongAnswers}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.hints")}
          </div>
          <div className="text-2xl font-bold">
            {summary.hints}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-500">
            {t("summaryPage.statistics.solutions")}
          </div>
          <div className="text-2xl font-bold">
            {summary.solutions}
          </div>
        </div>

      </div>

      <div className="bg-white rounded-lg shadow p-8 text-center">
        <span className="text-5xl font-bold">{summary.score}</span> 
        <span className="text-xl ml-2">{t("summaryPage.statistics.points")}</span>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("summaryPage.history")}
        </h3>
        <ul className="bg-white rounded-lg shadow p-4 space-y-2">
          {state.events.map((event, index) => (
            <li
              key={index}
              className="border-b border-gray-200 p-3"
            >
              <div className="flex justify-between text-sm">
                <div>
                  {describeEvent(event)}
                </div>
                <div className="text-gray-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </>    
  );
}