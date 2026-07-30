import type { GameEventType } from "./GameEventType";

export interface GameEvent {
  timestamp: string;
  pageIndex: number;
  type: GameEventType;
  value?: string;
}