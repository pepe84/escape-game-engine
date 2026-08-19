import Papa from "papaparse";
import type { EscapeGame } from "../models/EscapeGame";

export class GameParserService {

  static parse(text: string): EscapeGame {

    const result = Papa.parse<string[]>(text, {
      skipEmptyLines: false
    });

    if (result.errors.length > 0) {
      throw new Error(
        result.errors
          .map(error => error.message)
          .join("\n")
      );
    }

    const rows = result.data;

    const metadataIndex = rows.findIndex(
      row => row[0]?.trim() === "METADATA"
    );

    if (metadataIndex === -1) {
      throw new Error(
        "Secció METADATA no trobada."
      );
    }

    const pagesIndex = rows.findIndex(
      row => row[0]?.trim() === "PAGES"
    );

    if (pagesIndex === -1) {
      throw new Error(
        "Secció PAGES no trobada."
      );
    }

    /*
     * METADATA
     */
    const metadataHeaders = rows[metadataIndex + 1];
    const metadataValues = rows[metadataIndex + 2];

    if (!metadataHeaders || !metadataValues) {
      throw new Error(
        "Les metadades estan incompletes."
      );
    }

    const metadata = this.rowToObject(
      metadataHeaders,
      metadataValues
    );

    /*
     * PAGES
     */
    const pagesHeaders = rows[pagesIndex + 1];

    if (!pagesHeaders) {
      throw new Error(
        "Capçalera de PAGES no trobada."
      );
    }

    const pageRows = rows
      .slice(pagesIndex + 2)
      .filter(row =>
        row.some(cell => cell.trim() !== "")
      );

    const pages = pageRows.map(row => {
      const page = this.rowToObject(
        pagesHeaders,
        row
      );

      return this.parsePage(page);
    });
    
    return {
      title: metadata.title,
      description: metadata.description,
      durationMinutes: Number(
        metadata.durationMinutes
      ),
      defaultPenaltySeconds: Number(
        metadata.defaultPenaltySeconds
      ),
      version: metadata.version,
      author: metadata.author,
      license: metadata.license || undefined,
      pages
    };
  }
  
  private static rowToObject(
    headers: string[],
    values: string[]
  ): Record<string, string> {

    const result: Record<string, string> = {};

    headers.forEach((header, index) => {
      result[header.trim()] =
        values[index] ?? "";
    });

    return result;
  }

  private static parsePage(row: Record<string, string>) {

    const questionType = row.question?.trim();

    if (!questionType) {
      return {
        title: row.title,
        content: row.content
      };
    }

    const hints = [
      row["hint 1"],
      row["hint 2"],
      row["hint 3"]
    ].filter(
      (hint): hint is string =>
        Boolean(hint?.trim())
    );

    const question: any = {
      type: questionType,
      answer: row.answer
    };

    if (row.formatHelp?.trim()) {
      question.formatHelp = row.formatHelp;
    }

    if (row.penaltySeconds?.trim()) {
      question.penaltySeconds = Number(row.penaltySeconds);
    }

    const config: any = {};

    if (row.length?.trim()) {
      config.length = Number(row.length);
    }

    if (row.options?.trim()) {
      config.options =
        row.options
          .split("|")
          .map(option => option.trim())
          .filter(Boolean);
    }

    if (Object.keys(config).length > 0) {
      question.config = config;
    }

    if (hints.length > 0) {
      question.hints = hints;
    }

    return {
      title: row.title,
      content: row.content,
      question
    };
  }
}