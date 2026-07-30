import type { TextOrCodeQuestionConfig } from "../../models/Question";
import type { QuestionProps } from "../../models/QuestionProps";

export function CodeQuestion({
  question,
  answer,
  onChange
}: QuestionProps) {

  const digits =
    (question.config as TextOrCodeQuestionConfig)?.length ?? 4;

  const values =
    Array.isArray(answer)
      ? answer
      : Array(digits).fill("");

  const updateDigit = (
    index: number,
    value: string
  ) => {

    const next = [...values];

    next[index] = value;

    onChange(next);
  };

  return (
    <div className="flex gap-2">

      {Array.from({ length: digits }).map((_, index) => (

        <input
          type="number" 
          min="0" 
          max="9"
          key={index}
          value={values[index]}
          onChange={(e) =>
            updateDigit(index, e.target.value)
          }
          className="w-16 border rounded-lg px-2 py-3 text-center"
        />

      ))}

    </div>
  );
}