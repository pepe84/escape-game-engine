import type { QuestionProps } from "../../models/QuestionProps";

export function NumberQuestion({
  answer,
  onChange
}: QuestionProps) {

  return (
    <input
      type="number" 
      value={answer ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-4 py-3"
    />
  );
}