import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameContext } from "../context/GameContext";
import { GameEngineService } from "../services/GameEngineService";
import { StorageService } from "../services/StorageService";
import { useTranslation } from "react-i18next";

export function StartGamePage() {
  const { t } = useTranslation();
  const [teamName, setTeamName] = useState("");
  const { game, setState } = useGameContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!game) navigate("/");
  }, [game]);

  if (!game) return null;

  const startGame = () => {
    const state = GameEngineService.factory(teamName);
    setState(state);
    StorageService.saveGame(game);
    StorageService.saveState(state);
    navigate("/game");
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-6">{game.title}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startGame();
        }}
      >
        <input
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder={t("startPage.team")}
          className="w-full border rounded-lg px-4 py-3"
        />
        <button
          type="submit"
          disabled={!teamName.trim()}
          className="mt-4 w-full bg-emerald-500 text-white rounded-lg py-3 disabled:opacity-50 cursor-pointer"
        >
          {t("startPage.btn")}
        </button>
      </form>
    </>
  );
}