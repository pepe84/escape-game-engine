import type { EscapeGame } from "../models/EscapeGame";
import { EscapeGameSchema } from "../models/GameSchema";
import { GameParserService } from "./GameParserService";
import type { ZodError } from "zod";

export type GameLoadResult =
  | {
      success: true;
      data: EscapeGame;
    }
  | {
      success: false;
      error: ZodError | Error;
    };

export class GameLoaderService {

  static validate(gameData: unknown): GameLoadResult {
    try {
      const game = EscapeGameSchema.parse(gameData);
      return {
        success: true,
        data: game
      };
    } catch (err) {
      return {
        success: false,
        error: err as any
      };
    }
  }

  static loadFromText(text:string, type:string): GameLoadResult {
    try {
      let game: EscapeGame;
      if (type === "csv") {
        game = GameParserService.parse(text);
      } else {
        game = JSON.parse(text);
      }
      return this.validate(game);
    } catch (err) {
      return {
        success: false,
        error: err as Error
      };
    }
  }

  static async loadFromFile(file: File): Promise<GameLoadResult> {
    try {
      const text = await file.text();
      const type = file.name.toLowerCase().endsWith(".csv") ? "csv" : "json";
      return this.loadFromText(text, type);
    } catch (err) {
      return {
        success: false,
        error: err as Error
      };
    }
  }

  static async loadFromUrl(url: string): Promise<GameLoadResult> {
   try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Cannot load game");
      }
      const text = await response.text();
      const type = url.endsWith(".csv") ? "csv" : "json";
      return this.loadFromText(text, type);
    } catch (err) {
      return {
        success: false,
        error: err as Error
      };
    }    
  }
}