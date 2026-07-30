import Papa from "papaparse";
import type { EscapeGame } from "../models/EscapeGame";

export class GameParserService {

  static parse(text: string): EscapeGame {

    const lines =
      text
        .split(/\r?\n/)
        .map(line => line.trimEnd());

    const metadataCsv = this.getSection(lines, "METADATA");

    const pagesCsv = this.getSection(lines, "PAGES");

    const metadataResult =
      Papa.parse(metadataCsv, {
        header: true,
        skipEmptyLines: true
      });

    const metadata =
      metadataResult.data[0] as any;

    if (!metadata) {
      throw new Error(
        "No s'han trobat metadades."
      );
    }

    const pagesResult =
      Papa.parse(pagesCsv, {
        header: true,
        skipEmptyLines: true
      });

    const pages =
      pagesResult.data.map((row: any) =>
        this.parsePage(row)
      );

    return {
      title: metadata.title,
      description: metadata.description,
      version: metadata.version,
      durationMinutes: Number(
        metadata.durationMinutes
      ),
      defaultPenaltySeconds: Number(
        metadata.defaultPenaltySeconds
      ),
      pages
    };
  }

  private static getSection(lines: string[], section: string): string {

    const start =
      lines.findIndex(line =>
        line.startsWith(section)
      );

    if (start === -1) {
      throw new Error(
        `Secció ${section} no trobada`
      );
    }

    const end =
      lines.findIndex(
        (line, index) =>
          index > start &&
          /^[A-Z_]+(?:,.*)?$/.test(line)
      );

    return lines
      .slice(
        start + 1,
        end === -1
          ? undefined
          : end
      )
      .filter(line => line.trim() !== "")
      .join("\n");
  }

  private static parsePage(row: any) {

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
    ].filter(Boolean);

    const question: any = {
      type: questionType,
      answer: row.answer
    };

    if (row.formatHelp) {
      question.formatHelp = row.formatHelp;
    }

    if (row.penaltySeconds) {
      question.penaltySeconds = Number(row.penaltySeconds);
    }

    const config: any = {};

    if (row["length"]) {
      config.length = Number(row["length"]);
    }

    if (row["options"]) {
      config.options = String(row["options"])
        .split("|")
        .map((opt: string) => opt.trim())
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