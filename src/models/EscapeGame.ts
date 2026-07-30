import type { Question } from "./Question";

export interface EscapeGamePage {
  title: string;
  content?: string;
  question?: Question;
}

export interface EscapeGame {
  version: string;
  title: string;
  description?: string;
  durationMinutes: number;
  defaultPenaltySeconds: number;
  pages: EscapeGamePage[];
}