import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { EscapeGame } from "../models/EscapeGame";
import type { GameState } from "../models/GameState";

interface GameContextType {
  game: EscapeGame | null;
  state: GameState | null;
  setGame: (game: EscapeGame | null) => void;
  setState: (state: GameState | null) => void;
  reset: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [game, setGame] = useState<EscapeGame | null>(null);
  const [state, setState] = useState<GameState | null>(null);

  const reset = () => {
    setGame(null);
    setState(null);
  };

  return (
    <GameContext.Provider value={{ game, state, setGame, setState, reset }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("GameContext no disponible");
  return ctx;
}