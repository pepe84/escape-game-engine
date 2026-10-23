import type { GameEvent } from "./GameEvent";

export interface GameState {
  id: string;
  teamName: string;
  startedAt: string;
  currentPageIndex: number;
  penaltiesSeconds: number;
  finished: boolean;
  finishedAt?: string;
  unlockedHints: Record<number, Record<string, boolean>>;
  events: GameEvent[];
}