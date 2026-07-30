import { GameEventType } from "../models/GameEventType";
import type { EscapeGame } from "../models/EscapeGame";
import type { GameState } from "../models/GameState";
import { GameClockService } from "./GameClockService";

export class SummaryService {

  static readonly BASE_SCORE = 1000;

  static readonly MINUTE_COST = 5;

  static readonly HINT_COST = 25;

  static readonly SOLUTION_COST = 100;

  static getTotalQuestions(game: EscapeGame) {

    return game.pages.filter(
      p => !!p.question
    ).length;
  }

  static getCorrectAnswers(state: GameState) {

    return state.events.filter(
      e => e.type === GameEventType.CORRECT_ANSWER
    ).length;
  }

  static getWrongAnswers(state: GameState) {

    return state.events.filter(
      e => e.type === GameEventType.WRONG_ANSWER
    ).length;
  }

  static getHintsUsed(state: GameState) {

    return state.events.filter(
      e => e.type === GameEventType.HINT_OPENED
    ).length;
  }

  static getSolutionsViewed(state: GameState) {

    return state.events.filter(
      e => e.type === GameEventType.SOLUTION_OPENED
    ).length;
  }

  static getPenaltySeconds(state: GameState) {

    return state.penaltiesSeconds;
  }

  static getUsedSeconds(game: EscapeGame, state: GameState) {

    return GameClockService.getUsedSeconds(game, state);
  }

  static getOvertimeSeconds(game: EscapeGame, state: GameState) {
    const used = GameClockService.getUsedSeconds(game, state);
    const limit = game.durationMinutes * 60;
    return Math.max(used - limit, 0);
  }

  static getOvertimeMinutes(game: EscapeGame, state: GameState) {
    return Math.ceil(this.getOvertimeSeconds(game, state) / 60);
  }  

  static isGameCompleted(game: EscapeGame, state: GameState) {

    const questions = this.getTotalQuestions(game);
    const correct = this.getCorrectAnswers(state);
    return correct >= questions;
  }

  static getScore(game: EscapeGame, state: GameState) {

    const hints = this.getHintsUsed(state);
    const solutions = this.getSolutionsViewed(state);
    const totalQuestions = this.getTotalQuestions(game);
    const correctAnswers = this.getCorrectAnswers(state);
    const completionRatio = correctAnswers / totalQuestions;
    const overtimeMinutes = this.getOvertimeMinutes(game, state);

    const score = this.BASE_SCORE * completionRatio
      - overtimeMinutes * this.MINUTE_COST
      - hints * this.HINT_COST
      - solutions * this.SOLUTION_COST;

    return Math.max(score, 0);
  }

  static build(game: EscapeGame, state: GameState) {
    const teamName = state.teamName;
    const totalQuestions = this.getTotalQuestions(game);
    const correctAnswers = this.getCorrectAnswers(state);
    const wrongAnswers = this.getWrongAnswers(state);
    const hints = this.getHintsUsed(state);
    const solutions = this.getSolutionsViewed(state);
    const penaltySeconds = this.getPenaltySeconds(state);
    const usedSeconds = GameClockService.formatSeconds(
      this.getUsedSeconds(game,state)
    );    
    const score = this.getScore(game, state);
    const gameCompleted = this.isGameCompleted(game, state);
    
    return {
      teamName,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      hints,
      solutions,
      penaltySeconds,
      usedSeconds,
      score,
      gameCompleted
    };
  }  
}