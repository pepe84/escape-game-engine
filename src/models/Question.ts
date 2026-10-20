import type { QuestionType } from "./GameSchema";

export interface TextOrCodeQuestionConfig {
  length?: number;
}

export interface SelectQuestionConfig {
  options: string[];
}

export interface DateQuestionConfig {}

export type QuestionConfig =
  | TextOrCodeQuestionConfig
  | SelectQuestionConfig
  | DateQuestionConfig;

export interface Question {
  type: QuestionType;
  answer: string;
  regexAnswer: string;
  hints?: string[];
  penaltySeconds?: number;
  formatHelp?: string;
  config?: QuestionConfig;
}