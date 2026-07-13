import type { TextOrCodeQuestionConfig, Question } from "../models/Question";

export class QuestionEngineService {

  static getInitialAnswer(question: Question) {

    switch (question.type) {

      case "code":
        return Array((question.config as TextOrCodeQuestionConfig)?.length ?? 4).fill("");

      case "text":
      case "select":
      case "date":
      default:
        return "";
    }
  }

  static evaluate(question: Question, userAnswer: any) {

    switch (question.type) {

      case "text":
        return this.evalText(question, userAnswer);

      case "select":
        return this.evalSelect(question, userAnswer);

      case "code":
        return this.evalCode(question, userAnswer);

      case "date":
        return this.evalDate(question, userAnswer);

      default:
        return {
          correct: false,
          error: "Unknown question type"
        };
    }
  }

  private static evalText(question: Question, answer: string) {

    return {
      correct:
        answer.trim().toLowerCase() ===
        question.answer.trim().toLowerCase()
    };
  }

  private static evalSelect(question: Question, answer: string) {

    return {
      correct: answer === question.answer
    };
  }

  private static evalCode(question: Question, answer: string[]) {

    const code =
      answer.join("").trim();

    return {
      correct: code === question.answer.trim()
    };
  }

  private static evalDate(question: Question, answer: string) {

    const normalizedAnswer =
      this.normalizeDate(answer);

    const normalizedExpected =
      this.normalizeDate(question.answer);

    return {
      correct:
        normalizedAnswer === normalizedExpected
    };
  }

  private static normalizeDate(date: string) {

    if (!date) return "";

    if (date.includes("-") && date.length === 10) {

      const parts = date.split("-");

      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    return date;
  }
}