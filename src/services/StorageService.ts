import type { EscapeGame } from "../models/EscapeGame";
import type { GameState } from "../models/GameState";

const GAME_KEY = "escape-game";
const STATE_KEY = "escape-game-state";

export class StorageService {
  static saveGame(game: EscapeGame) {
    localStorage.setItem(GAME_KEY, JSON.stringify(game));
  }

  static loadGame(): EscapeGame | null {
    const raw = localStorage.getItem(GAME_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  static saveState(state: GameState) {
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
  }

  static loadState(): GameState | null {
    const raw = localStorage.getItem(STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  static clear() {
    localStorage.removeItem(GAME_KEY);
    localStorage.removeItem(STATE_KEY);
  }
}