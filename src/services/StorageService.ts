import type { EscapeGame } from "../models/EscapeGame";
import type { GameState } from "../models/GameState";
import type { GameHistoryEntry } from "../models/GameHistoryEntry";

const GAME_KEY = "escape-game";
const STATE_KEY = "escape-game-state";
const HISTORY_KEY = "escape-game-history";

export class StorageService {

  /************************
   * CURRENT GAME         *
   ************************/

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

  static clearGame() {
    localStorage.removeItem(GAME_KEY);
    localStorage.removeItem(STATE_KEY);
  }

  /************************
   * GAME HISTORY         *
   ************************/

  static saveHistory(history: GameHistoryEntry[]) {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  static loadHistory(): GameHistoryEntry[] {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  static addHistoryEntry(entry: GameHistoryEntry) {
    const history = this.loadHistory();
    /*
     * Avoid inserting the same game twice.
     */
    const alreadyExists = history.some(
      item => item.id === entry.id
    );

    if (!alreadyExists) {
      history.push(entry);
      this.saveHistory(history);
    }
  }

  static removeHistoryEntry(id: string) {
    const history = this.loadHistory();
    const filtered = history.filter(
      item => item.id !== id
    );
    this.saveHistory(filtered);
  }

  static clearHistory() {
    localStorage.removeItem(HISTORY_KEY);
  }
  
}