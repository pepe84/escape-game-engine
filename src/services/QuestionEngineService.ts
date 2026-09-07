import type { Question, TextOrCodeQuestionConfig } from "../models/Question";

export interface QuestionEvaluationResult {
  correct: boolean;
  error?: string;
  positions?: boolean[];
}

export class QuestionEngineService {

  static isCodeQuestion(type: Question["type"]): boolean {
    return [
      "code",
      "code-numeric",
      "code-alpha",
      "code-alphanumeric"
    ].includes(type);
  }

  static getInitialAnswer(question: Question) {

    if (this.isCodeQuestion(question.type)) {
        return Array(
          (question.config as TextOrCodeQuestionConfig)?.length ?? 4
        ).fill("");
    }
    
    // default
    return "";
  }

  static evaluate(question: Question, userAnswer: any): QuestionEvaluationResult {
    
    if (this.isCodeQuestion(question.type)) {
        return this.evalCode(question, userAnswer);
    }

    switch (question.type) {

      case "text":
        return this.evalText(question, userAnswer);

      case "number":
        return this.evalNumber(question, userAnswer);

      case "select":
        return this.evalSelect(question, userAnswer);

      case "date":
        return this.evalDate(question, userAnswer);

      default:
        return {
          correct: false,
          error: "Unknown question type"
        };
    }
  }

  /**
   * Normalizes text by:
   * - trimming surrounding spaces
   * - removing accents/diacritics
   * - converting to lowercase
   */
  private static normalizeText(value: string): string {
    return value
      .trim()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();
  }

  /**
   * Normalizes a code by:
   * - removing accents/diacritics
   * - converting to uppercase
   *
   * Important: symbols are NOT removed.
   * An invalid symbol therefore remains invalid.
   */
  private static normalizeCode(value: string): string {
    return value
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toUpperCase();
  }

  private static isRegexLiteral(value: string): boolean {
    return /^\/.*\/[dgimsuvy]*$/.test(value);
  }

  private static parseRegexLiteral(value: string): RegExp | null {
    const match = value.match(/^\/(.*)\/([dgimsuvy]*)$/s);

    if (!match) {
      return null;
    }

    try {
      return new RegExp(match[1], match[2]);
    } catch {
      return null;
    }
  }

  private static evalText(question: Question, answer: string): QuestionEvaluationResult {
    const normalizedAnswer = this.normalizeText(String(answer ?? ""));
    const expected = String(question.answer ?? "").trim();

    if (this.isRegexLiteral(expected)) {

      const regex = this.parseRegexLiteral(expected);

      if (!regex) {
        return {
          correct: false,
          error: "⚠️⚠️⚠️ Invalid regular expression"
        };
      }

      return {
        correct: regex.test(normalizedAnswer)
      };
    }

    const normalizedExpected = this.normalizeText(question.answer);
    return {
      correct: normalizedAnswer === normalizedExpected
    };
  }

  private static evalNumber(question: Question, answer: string | number): QuestionEvaluationResult {
    return {
      correct: Number(answer) === Number(question.answer)
    };
  }

  private static evalSelect(question: Question, answer: string): QuestionEvaluationResult {
    return {
      correct: answer === question.answer
    };
  }

  private static evalCode(question: Question, answer: string[]): QuestionEvaluationResult {

    const config = question.config as TextOrCodeQuestionConfig;
    const length = config?.length ?? question.answer.length;

    // "code" is kept as an alias for "code-numeric"
    const codeType = question.type === "code" ? "code-numeric" : question.type;

    const expected = this.normalizeCode(question.answer);

    const actual =
      this.normalizeCode(
        Array.isArray(answer)
          ? answer.join("")
          : String(answer ?? "")
      );

    const positions = Array.from(
      { length: expected.length },
      (_, index) => {

        const actualChar = actual[index] ?? "";
        const expectedChar = expected[index];

        return (
          this.isValidCodeCharacter(actualChar, codeType) &&
          actualChar === expectedChar
        );
      }
    );

    const validCharacters =
      Array.from(actual).every(char =>
        this.isValidCodeCharacter(char, codeType)
      );

    const correct =
      validCharacters &&
      actual.length === expected.length &&
      expected.length === length &&
      positions.every(Boolean);

    return {
      correct,
      positions
    };
  }

  private static isValidCodeCharacter(char: string, codeType: Question["type"]): boolean {

    if (!char) {
      return false;
    }

    switch (codeType) {

      case "code":
      case "code-numeric":
        return /^[0-9]$/.test(char);

      case "code-alpha":
        return /^\p{L}$/u.test(char);

      case "code-alphanumeric":
        return /^[\p{L}\p{N}]$/u.test(char);

      default:
        return false;
    }
  }

  private static evalDate(question: Question, answer: string): QuestionEvaluationResult {

    const normalizedAnswer = this.normalizeDate(answer);

    const normalizedExpected = this.normalizeDate(question.answer);

    return {
      correct: normalizedAnswer === normalizedExpected
    };
  }

  private static normalizeDate(date: string) {

    if (!date) {
      return "";
    }

    if (date.includes("-") && date.length === 10) {
      const parts = date.split("-");
      if (parts[0].length === 4) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    return date;
  }
}