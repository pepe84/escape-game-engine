import type { Question } from "./Question";

export interface EscapeGamePage {
  title: string;
  content?: string;
  question?: Question;
}

export interface EscapeGame {
  title: string;
  description?: string;
  durationMinutes: number;
  defaultPenaltySeconds: number;
  version: string;
  author: string;
  license?: string;
  pages: EscapeGamePage[];
}