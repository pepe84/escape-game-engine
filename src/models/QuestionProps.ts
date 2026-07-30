import type { Question } from "./Question";

export interface QuestionProps {
  question: Question;
  answer: any;
  onChange: (value: any) => void;
}