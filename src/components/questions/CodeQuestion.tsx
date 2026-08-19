import type { TextOrCodeQuestionConfig } from "../../models/Question";
import type { QuestionProps } from "../../models/QuestionProps";
import { CircleCheck, CircleX } from "lucide-react";

export function CodeQuestion({
  question,
  answer,
  onChange,
  feedback
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

      {Array.from({ length: digits }).map((_, index) => {

        const positionFeedback =
          feedback?.[index];

        const hasFeedback =
          feedback !== null &&
          feedback !== undefined &&
          positionFeedback !== undefined;

        return (
          <div key={index} className="flex flex-col items-center gap-1">
            <div className={`relative rounded-lg 
                ${
                  hasFeedback
                    ? positionFeedback
                      ? "bg-emerald-100 border border-emerald-400"
                      : "bg-red-100 border border-red-400"
                    : ""
                }
              `}
            >

              <input type="number" min="0" max="9" value={values[index]}
                onChange={(e) =>
                  updateDigit(index, e.target.value)
                }
                className={`w-16 rounded-lg px-2 py-3 text-center font-mono text-xl outline-none 
                  ${
                    hasFeedback
                      ? "bg-transparent"
                      : "border border-gray-300"
                  }
                `}
              />

            </div>

            {hasFeedback && (
              positionFeedback ? (
                <CircleCheck size={20} className="text-emerald-600" />
              ) : (
                <CircleX size={20} className="text-red-600" />
              )
            )}

          </div>
        );
      })}

    </div>
  );
}