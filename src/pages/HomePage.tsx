import { useEffect, useRef, useState } from "react";
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
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewGame, setPreviewGame] = useState<EscapeGame | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const queryUrlLoaded = useRef(false);

  const exampleJsonUrl = `${import.meta.env.BASE_URL}data/example-game.json`;

  const exampleCsvUrl = `${import.meta.env.BASE_URL}data/example-game.csv`;

  /*
   * Si hi ha un joc en curs, mantenim el comportament actual.
   */
  useEffect(() => {
    if (state && !state.finished) {
      navigate("/game");
    }

    if (state?.finished) {
      navigate("/summary");
    }
  }, [state, navigate]);

  /*
   * Carrega automàtica mitjançant:
   *
   * ?url=https%3A%2F%2Fexample.com%2Fgame.json
   */
  useEffect(() => {
    if (queryUrlLoaded.current) return;

    const params = new URLSearchParams(window.location.search);
    const queryUrl = params.get("url");
    if (!queryUrl) return;

    queryUrlLoaded.current = true;
    setUrl(queryUrl);
    void loadFromUrl(queryUrl);
  }, []);

  /*
   * Processa el resultat de qualsevol sistema de càrrega.
   */
  const handleGame = (result: GameLoadResult, sourceUrl: string | null = null) => {
    if (!result.success) {
      const issues = (result.error as any)?.issues ?? [];
      setError(
        issues.length
          ? issues
              .map(
                (i: ZodIssue) =>
                  `${i.path.join(".")} → ${i.message}`
              )
              .join("\n")
          : result.error instanceof Error
            ? result.error.message
            : t("homePage.loadingError")
      );
      return;
    }
    console.log("Game OK", result.data);
    setError(null);
    /*
     * Guardem la URL només si el joc prové d'una URL.
     *
     * Si ve d'un fitxer local o de la demo:
     * previewUrl = null
     */
    setPreviewUrl(sourceUrl);
    setPreviewGame(result.data);
  };

  
  const isValidUrl = (value: string) => {
    try {
      const parsed = new URL(value.trim());

      return (
        parsed.protocol === "http:" ||
        parsed.protocol === "https:"
      );
    } catch {
      return false;
    }
  };

  /*
   * Carrega un joc des d'una URL.
   */
  const loadFromUrl = async (gameUrl: string) => {

    setError(null);
    setLoading(true);

    try {
      const result = await GameLoaderService.loadFromUrl(gameUrl);
      handleGame(result, gameUrl);
    } catch (error) {
      console.error(error);
      setError(t("homePage.urlLoadError"));
    } finally {
      setLoading(false);
    }
  };

  /*
   * Inicia el joc després de la previsualització.
   */
  const startPreviewedGame = () => {
    if (!previewGame) return;

    setGame(previewGame);
    setPreviewGame(null);
    setPreviewUrl(null);
    navigate("/start");
  };

  /*
   * Cancel·la la previsualització.
   */
  const cancelPreview = () => {
    setPreviewGame(null);
    setPreviewUrl(null);
  };

  /*
   * Demo.
   */
  const loadExample = async () => {
    await loadFromUrl(exampleJsonUrl);
  };

  /*
   * Fitxer local.
   */
  const loadFile = async () => {
    if (!file) return;

    setError(null);
    setLoading(true);

    try {
      const result = await GameLoaderService.loadFromFile(file);
      handleGame(result);
    } finally {
      setLoading(false);
    }
  };

  /*
   * Fitxer extern (URL)
   */
  const loadURL = async (gameUrl: string) => {
    const trimmedUrl = gameUrl.trim();

    if (!trimmedUrl) {
      setError(t("homePage.urlRequired"));
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setError(t("homePage.invalidUrl"));
      return;
    }

    await loadFromUrl(gameUrl);
  }; 

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ========================================================= */}
        {/* DEMO */}
        {/* ========================================================= */}

        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-2xl font-bold">
            {t("homePage.section1.title")}
          </h2>

          <div className="text-gray-500 mt-4 flex-1">
            <Trans
              i18nKey="homePage.section1.body"
              components={{
                csvLink: (
                  <a
                    href={exampleCsvUrl}
                    download
                    className="text-emerald-500"
                  />
                ),
                jsonLink: (
                  <a
                    href={exampleJsonUrl}
                    download
                    className="text-emerald-500"
                  />
                ),
              }}
            />
          </div>

          <button
            onClick={loadExample}
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl mt-4 mb-4 ${
              loading
                ? "bg-emerald-200"
                : "bg-emerald-500 hover:bg-emerald-600 cursor-pointer"
            }`}
          >
            {loading
              ? t("homePage.loading")
              : t("homePage.section1.btn")}
          </button>
        </div>

        {/* ========================================================= */}
        {/* JOC PROPI */}
        {/* ========================================================= */}

        <div className="lg:col-span-2 bg-white rounded-lg shadow p-4">

          <h2 className="text-2xl font-bold">
            {t("homePage.section2.title")}
          </h2>

          <div className="text-gray-500 mt-4">
            <Trans
              i18nKey="homePage.section2.body"
              components={{
                csvLink: (
                  <a
                    href={exampleCsvUrl}
                    download
                    className="text-emerald-500"
                  />
                ),
                jsonLink: (
                  <a
                    href={exampleJsonUrl}
                    download
                    className="text-emerald-500"
                  />
                ),
              }}
            />
          </div>

          {/* ======================================================= */}
          {/* SUBSECCIONS */}
          {/* ======================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

            {/* FITXER LOCAL */}

            <div className="border border-gray-200 rounded-lg p-4 flex flex-col">

              <h3 className="text-lg font-semibold">
                {t("homePage.section2.local.title")}
              </h3>

              {/* Alçada reservada per al text */}
              <div className="min-h-8 mt-2">
                <p className="text-gray-500 text-sm">
                  {t("homePage.section2.local.body")}
                </p>
              </div>

              {/* Formulari al final */}
              <div className="mt-auto pt-4">

                <input
                  type="file"
                  accept=".json,.csv"
                  onChange={(e) =>
                    setFile(e.target.files?.[0] ?? null)
                  }
                  className="w-full text-sm text-stone-500
                    file:mr-4 file:py-3 file:px-3 file:text-xs file:font-medium
                    file:bg-gray-200 file:text-stone-700 file:rounded-lg
                    hover:file:cursor-pointer
                    hover:file:bg-blue-500
                    hover:file:text-blue-50"
                />

                <button
                  onClick={loadFile}
                  disabled={!file || loading}
                  className={`w-full text-white py-3 mt-4 rounded-xl ${
                    file && !loading
                      ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                      : "bg-blue-200"
                  }`}
                >
                  {loading
                    ? t("homePage.loading")
                    : t("homePage.section2.local.btn")}
                </button>

              </div>

            </div>


            {/* URL */}

            <div className="border border-gray-200 rounded-lg p-4 flex flex-col">

              <h3 className="text-lg font-semibold">
                {t("homePage.section2.url.title")}
              </h3>

              {/* Mateixa alçada reservada */}
              <div className="min-h-8 mt-2">
                <p className="text-gray-500 text-sm">
                  {t("homePage.section2.url.body")}
                </p>
              </div>

              {/* Formulari al final */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void loadURL(url);
                }}
                className="mt-auto pt-4"
              >

                <input
                  type="url"
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError(null);
                  }}
                  placeholder="https://example.com/game.json"
                  required
                  className="w-full border border-gray-300 rounded-lg
                    px-3 py-2
                    focus:outline-none
                    focus:ring-2
                    focus:ring-purple-300"
                />

                <button
                  type="submit"
                  disabled={!url.trim() || loading}
                  className={`w-full text-white py-3 mt-4 rounded-xl ${
                    url.trim() && !loading
                      ? "bg-purple-500 hover:bg-purple-600 cursor-pointer"
                      : "bg-purple-200"
                  }`}
                >
                  {loading
                    ? t("homePage.loading")
                    : t("homePage.section2.url.btn")}
                </button>

              </form>

            </div>

          </div>

        </div>
        
      </div>

      {/* ERROR */}

      {error && (
        <pre className="text-red-500 whitespace-pre-wrap mt-4">
          {error}
        </pre>
      )}

      {/* PREVIEW */}

      <GamePreviewModal
        game={previewGame}
        sourceUrl={previewUrl}
        onStart={startPreviewedGame}
        onCancel={cancelPreview}
      />
    </>
  );
}