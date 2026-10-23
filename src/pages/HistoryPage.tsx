import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays, Clock, Trash2, Trophy, Users, ArrowDownUp } from "lucide-react";
import type { GameHistoryEntry } from "../models/GameHistoryEntry";
import { StorageService } from "../services/StorageService";

export function HistoryPage() {

  const { t, i18n } = useTranslation();

  const [history, setHistory] = useState<GameHistoryEntry[]>(
    () => StorageService.loadHistory()
  );

  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const sortedHistory = useMemo(() => {
    return [...history].sort((a, b) => {
      const dateA = new Date(a.finishedAt).getTime();
      const dateB = new Date(b.finishedAt).getTime();
      return sortOrder === "desc"
          ? dateB - dateA
          : dateA - dateB;
    });
  }, [history, sortOrder]);

  const formatDate = (value: string) => {
    return new Intl.DateTimeFormat(i18n.language,{
      dateStyle: "short",
      timeStyle: "short"
    }).format(
      new Date(value)
    );
  };

  const formatDuration = (startedAt: string, finishedAt: string) => {
    const seconds = Math.max(
      0,
      Math.round(
        (
          new Date(finishedAt).getTime() -
          new Date(startedAt).getTime()
        ) / 1000
      )
    );
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }

    return `${minutes}m ${String(
      remainingSeconds
    ).padStart(2, "0")}s`;
  };

  const removeEntry = (id: string) => {
    StorageService.removeHistoryEntry(id);
    setHistory(
      current =>
        current.filter(
          entry => entry.id !== id
        )
    );
  };

  const clearHistory = () => {
    if (!window.confirm(t("historyPage.clearConfirm"))) {
      return;
    }
    StorageService.clearHistory();
    setHistory([]);
  };

  if (history.length === 0) {

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">
            {t("historyPage.title")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t("historyPage.description")}
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-500">
          {t("historyPage.empty")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold">
            {t("historyPage.title")}
            </h1>

            <p className="text-gray-500 mt-1">
            {t("historyPage.description")}
            </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
            <button
                type="button"
                onClick={() =>
                    setSortOrder(current =>
                        current === "desc" ? "asc" : "desc"
                    )
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50"
                >
            <ArrowDownUp size={18} />

            {sortOrder === "desc"
                ? t("historyPage.sort.newest")
                : t("historyPage.sort.oldest")}
            </button>

            <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50"
            >
                <Trash2 size={18} />
                {t("historyPage.clear")}
            </button>
        </div>
    </div>

      {/*
       * Desktop / tablet
       */}
      <div className="hidden md:block bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  {t("historyPage.table.date")}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  {t("historyPage.table.game")}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">
                  {t("historyPage.table.team")}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-center">
                  {t("historyPage.table.duration")}
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">
                  {t("historyPage.table.score")}
                </th>
                <th className="px-6 py-4">
                  <span className="sr-only">
                    {t("historyPage.table.actions")}
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedHistory.map(entry => (
                <tr
                  key={entry.id}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(
                      entry.finishedAt
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {entry.gameTitle}
                  </td>
                  <td className="px-6 py-4">
                    {entry.teamName}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-600">
                    {formatDuration(
                      entry.startedAt,
                      entry.finishedAt
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-bold">
                      {entry.score}
                    </span>
                    <span className="text-gray-500 ml-1">
                      {t("historyPage.points")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() =>
                        removeEntry(entry.id)
                      }
                      title={t(
                        "historyPage.delete"
                      )}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>

      </div>

      {/*
       * Mobile
       */}
      <div className="md:hidden space-y-4">
        {sortedHistory.map(entry => (
          <article
            key={entry.id}
            className="bg-white rounded-2xl shadow p-5"
          >
            
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="font-bold text-lg truncate">
                  {entry.gameTitle}
                </h2>
                <div className="flex items-center gap-2 mt-2 text-gray-600">
                  <Users size={16} />
                  <span>
                    {entry.teamName}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  removeEntry(entry.id)
                }
                title={t(
                  "historyPage.delete"
                )}
                className="shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CalendarDays size={15} />
                  {t(
                    "historyPage.table.date"
                  )}
                </div>
                <div className="mt-1 font-medium text-sm">
                  {formatDate(
                    entry.finishedAt
                  )}
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={15} />
                  {t(
                    "historyPage.table.duration"
                  )}
                </div>
                <div className="mt-1 font-medium text-sm">
                  {formatDuration(
                    entry.startedAt,
                    entry.finishedAt
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-500">
                <Trophy size={18} />
                <span>
                  {t(
                    "historyPage.table.score"
                  )}
                </span>
              </div>
              <div className="text-xl font-bold">
                {entry.score}
                <span className="text-sm font-normal text-gray-500 ml-1">
                  {t(
                    "historyPage.points"
                  )}
                </span>
              </div>
            </div>

          </article>
        ))}

      </div>

    </div>
  );
}