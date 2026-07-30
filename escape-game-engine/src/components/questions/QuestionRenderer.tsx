import type { QuestionProps } from "../../models/QuestionProps";
import { TextQuestion } from "./TextQuestion";
import { NumberQuestion } from "./NumberQuestion";
import { SelectQuestion } from "./SelectQuestion";
import { CodeQuestion } from "./CodeQuestion";
import { DateQuestion } from "./DateQuestion";

export function QuestionRenderer({
  question,
  answer,
  onChange
}: QuestionProps) {

  const renderers = {
    text: TextQuestion,
    number: NumberQuestion,
    select: SelectQuestion,
    code: CodeQuestion,
    date: DateQuestion
  } as const;

  const Component = renderers[question.type];

  return Component ? (
    <Component
      question={question}
      answer={answer}
      onChange={onChange}
    />
  ) : null;
}