import type { QuestionProps } from "../../models/QuestionProps";

export function DateQuestion({
  answer,
  onChange
}: QuestionProps) {

  return (
    <input
      type="date"
      value={answer ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-4 py-3"
    />
  );
}