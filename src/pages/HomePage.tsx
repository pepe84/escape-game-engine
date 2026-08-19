import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { GameLoaderService, type GameLoadResult } from "../services/GameLoaderService";
import { useTranslation, Trans } from "react-i18next";
import type { ZodIssue } from "zod";
import type { EscapeGame } from "../models/EscapeGame";
import { GamePreviewModal } from "../components/GamePreviewModal";

export function HomePage() {
  const { t } = useTranslation();
  const { setGame, state } = useGameContext();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const exampleJsonUrl = `${import.meta.env.BASE_URL}data/example-game.json`;
  const exampleCsvUrl = `${import.meta.env.BASE_URL}data/example-game.csv`;
  const [previewGame, setPreviewGame] = useState<EscapeGame | null>(null);

  useEffect(() => {
    if (state && !state.finished) navigate("/game");
    if (state?.finished) navigate("/summary");
  }, [state]);

  const handleGame = (result: GameLoadResult) => {
    if (!result.success) {
      const issues = (result.error as any)?.issues ?? [];
      setError(
        issues.length 
          ? issues.map((i:ZodIssue) => `${i.path.join(".")} → ${i.message}`)
            .join("\n")
          : t("homePage.loadingError")
      );
    } else {
      console.log("Game OK", result.data);
      setError(null);
      setPreviewGame(result.data);
    }
  }

  const startPreviewedGame = () => {
    if (!previewGame) return;
    setGame(previewGame);
    setPreviewGame(null);
    navigate("/start");
  };

  const cancelPreview = () => {
    setPreviewGame(null);
  };

  const loadExample = async () => {
    const result = await GameLoaderService.loadFromUrl(exampleJsonUrl);
    handleGame(result);
  };

  const loadFile = async () => {
    if (!file) return;
    const result = await GameLoaderService.loadFromFile(file);
    handleGame(result);
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Escape Game Engine</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold">
            {t("homePage.section1.title")}
          </h2>
          <div className="text-gray-500 mt-4 md:pb-14">
            <Trans
              i18nKey="homePage.section1.body"
              components={{
                csvLink: (<a href={exampleCsvUrl} download className="text-emerald-500" />),
                jsonLink: (<a href={exampleJsonUrl} download className="text-emerald-500" />),
              }}
            />            
          </div>
          <button onClick={loadExample} className="w-full bg-emerald-500 text-white py-3 rounded-xl cursor-pointer">
            {t("homePage.section1.btn")}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-2xl font-bold">
            {t("homePage.section2.title")}
          </h2>
          <div className="text-gray-500 mt-4">
            <Trans
              i18nKey="homePage.section2.body"
              components={{
                csvLink: (<a href={exampleCsvUrl} download className="text-emerald-500" />),
                jsonLink: (<a href={exampleJsonUrl} download className="text-emerald-500" />),
              }}
            />
          </div>
          <div>
            <input type="file" accept=".json,.csv" onChange={(e) => setFile(e.target.files?.[0] ?? null)} 
              className="text-sm text-stone-500 my-4
              file:mr-5 file:py-1 file:px-3 file:text-xs file:font-medium
              file:bg-gray-200 file:text-stone-700 file:rounded-lg
              hover:file:cursor-pointer hover:file:bg-blue-500 hover:file:text-blue-50"/>
            <button onClick={loadFile} className={`w-full text-white py-3 rounded-xl ${file ? "bg-blue-500 cursor-pointer": "bg-blue-200 "}`} >
              {t("homePage.section2.btn")}
            </button>
          </div>
        </div>
      </div>

      {error && <pre className="text-red-500 whitespace-pre-wrap">{error}</pre>}

      <GamePreviewModal
        game={previewGame}
        onStart={startPreviewedGame}
        onCancel={cancelPreview}
      />
    </>
  );
}