import { useEffect } from "react";
import { useGameContext } from "../context/GameContext";
import { StorageService } from "../services/StorageService";

export function AppBootstrap() {
  const { setGame, setState } = useGameContext();

  useEffect(() => {
    const game = StorageService.loadGame();
    const state = StorageService.loadState();

    if (game) setGame(game);
    if (state) setState(state);
  }, []);

  return null;
}