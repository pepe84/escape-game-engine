import type { TextOrCodeQuestionConfig } from "../../models/Question";
import type { QuestionProps } from "../../models/QuestionProps";

export function TextQuestion({
  question,
  answer,
  onChange
}: QuestionProps) {

  const length =
    (question.config as TextOrCodeQuestionConfig)?.length;

  return (
    <input
      type="text"
      value={answer ?? ""}
      minLength={length}
      maxLength={length}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-4 py-3"
    />
  );
}