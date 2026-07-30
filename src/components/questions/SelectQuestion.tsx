import type { SelectQuestionConfig } from "../../models/Question";
import type { QuestionProps } from "../../models/QuestionProps";

export function SelectQuestion({
  question,
  answer,
  onChange
}: QuestionProps) {

  const emptyOption = "---";
  
  const options =
    (question.config as SelectQuestionConfig)?.options ?? [];

  return (
    <select
      value={answer ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded-lg px-4 py-3"
    >
      {emptyOption && 
      <option value="">
        {emptyOption}
      </option>
      }
      {options.map(option => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}