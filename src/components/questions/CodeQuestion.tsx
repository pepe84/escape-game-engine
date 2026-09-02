import type { TextOrCodeQuestionConfig } from "../../models/Question";
import type { QuestionProps } from "../../models/QuestionProps";
import { CircleCheck, CircleX } from "lucide-react";

export function CodeQuestion({
  question,
  answer,
  onChange,
  feedback
}: QuestionProps) {

  const length = (question.config as TextOrCodeQuestionConfig)?.length ?? 4;

  const values =
    Array.isArray(answer)
      ? answer
      : Array(length).fill("");

  const isNumeric =
    question.type === "code" ||
    question.type === "code-numeric";

  const isLetters =
    question.type === "code-alpha";

  const isAlphanumeric =
    question.type === "code-alphanumeric";

  /**
   * Returns only valid characters for the current code type.
   */
  const filterValue = (value: string): string => {

    if (isNumeric) {
      return value.replace(/[^0-9]/g, "");
    }

    if (isLetters) {
      return value.replace(/[^\p{L}]/gu, "");
    }

    if (isAlphanumeric) {
      return value.replace(/[^\p{L}\p{N}]/gu, "");
    }

    return "";
  };

  const updatePosition = (index: number, value: string) => {
    const filteredValue = filterValue(value);
    const next = [...values];
    // Each position can contain only one character.
    next[index] = Array.from(filteredValue)[0] ?? "";
    onChange(next);
  };

  return (
    <div className="flex gap-2">

      {Array.from({ length }).map((_, index) => {

        const positionFeedback = feedback?.[index];

        const hasFeedback =
          feedback !== null &&
          feedback !== undefined &&
          positionFeedback !== undefined;

        return (
          <div
            key={index}
            className="flex flex-col items-center gap-1"
          >

            <div
              className={`relative rounded-lg ${
                hasFeedback
                  ? positionFeedback
                    ? "bg-emerald-100 border border-emerald-400"
                    : "bg-red-100 border border-red-400"
                  : ""
              }`}
            >

              <input
                type={isNumeric ? "number" : "text"}
                inputMode={isNumeric ? "numeric" : "text"}
                value={values[index] ?? ""}
                maxLength={1}
                onChange={(e) =>
                  updatePosition(index, e.target.value)
                }
                className={`w-16 rounded-lg px-2 py-3 text-center font-mono text-xl outline-none ${
                  hasFeedback
                    ? "bg-transparent"
                    : "border border-gray-300"
                }`}
              />

            </div>

            {hasFeedback && (
              positionFeedback ? (
                <CircleCheck
                  size={20}
                  className="text-emerald-600"
                />
              ) : (
                <CircleX
                  size={20}
                  className="text-red-600"
                />
              )
            )}

          </div>
        );
      })}

    </div>
  );
}