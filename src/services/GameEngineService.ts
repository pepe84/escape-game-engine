import type { EscapeGame } from "../models/EscapeGame";
import type { GameEvent } from "../models/GameEvent";
import { GameEventType } from "../models/GameEventType";
import type { GameState } from "../models/GameState";
import { HintEngineService } from "./HintEngineService";

export class GameEngineService {

  static factory(teamName: string): GameState {

    const state: GameState = {
      teamName,
      startedAt: new Date().toISOString(),
      currentPageIndex: 0,
      penaltiesSeconds: 0,
      finished: false,
      unlockedHints: {},
      events: []
    };

    return this.addEvent(
      state,
      {
        pageIndex: 0,
        type: GameEventType.GAME_STARTED
      }
    );
  }
  
  /************************
   * NAVIGATION           *
   ************************/

  static continue(game: EscapeGame, state: GameState): GameState {

    if (this.isLastPage(game, state)) {
      return this.finishGame(state);
    }

    return this.nextPage(state);
  }

  static nextPage(state: GameState): GameState {

    const nextState = {
      ...state,
      currentPageIndex: state.currentPageIndex + 1
    };

    return this.addEvent(nextState, {
      pageIndex: nextState.currentPageIndex,
      type: GameEventType.PAGE_OPENED
    });
  }

  static finishGame(state: GameState): GameState {

    const nextState = {
      ...state,
      finished: true,
      finishedAt: new Date().toISOString()
    };

    return this.addEvent(nextState, {
      pageIndex: state.currentPageIndex,
      type: GameEventType.GAME_FINISHED
    });    
  }

  static isLastPage(game: any, state: GameState) {
    return state.currentPageIndex >= game.pages.length - 1;
  }

  static getProgress(game: any, state: GameState) {
    let current = state.currentPageIndex;
    let total = game.pages.length;
    return Math.round(Math.min(100, ((current + 1) / total) * 100));
  }
  
  /************************
   * QUESTIONS & ANSWERS  *
   ************************/
  
  static registerSuccess(state: GameState): GameState {

    return this.addEvent(state, {
      pageIndex: state.currentPageIndex,
      type: GameEventType.CORRECT_ANSWER
    });
  }

  static applyPenalty(state: GameState, seconds = 60): GameState {

    const nextState = {
      ...state,
      penaltiesSeconds: state.penaltiesSeconds + seconds
    };

    return this.addEvent(nextState, {
      pageIndex: state.currentPageIndex,
      type: GameEventType.WRONG_ANSWER,
      value: String(seconds)
    });
  }  
  
  /************************
   * HINTS                *
   ************************/

  private static getHintState(
    state: GameState,
    pageIndex: number,
    hints: string[]
  ) {

    return (
      state.unlockedHints?.[pageIndex] ??
      HintEngineService.create(hints)
    );
  }

  static unlockHint(
    state: GameState,
    pageIndex: number,
    hints: string[]
  ) {

    const hintState = this.getHintState(
      state,
      pageIndex,
      hints
    );

    const updated = HintEngineService.unlockHint(
      hintState
    );

    const nextState = {
      ...state,
      unlockedHints: {
        ...state.unlockedHints,
        [pageIndex]: updated
      }
    }

    const hintNumber = HintEngineService.countUsedHints(updated);

    return this.addEvent(nextState, {
      pageIndex,
      type: GameEventType.HINT_OPENED,
      value: String(hintNumber)
    });
  }

  static unlockSolution(
    state: GameState,
    pageIndex: number,
    hints: string[]
  ) {

    const hintState = this.getHintState(
      state,
      pageIndex,
      hints
    );

    const updated = HintEngineService.unlockSolution(
      hintState
    );

    const nextState = {
      ...state,
      unlockedHints: {
        ...state.unlockedHints,
        [pageIndex]: updated
      }
    };

    return this.addEvent(nextState, {
      pageIndex,
      type: GameEventType.SOLUTION_OPENED
    });
  }

  static getHints(
    state: GameState,
    pageIndex: number,
    hints: string[]
  ) {

    return this.getHintState(
      state,
      pageIndex,
      hints
    );
  }
  
  /************************
   * EVENTS               *
   ************************/
  
  static addEvent(state: GameState, event: Omit<GameEvent, "timestamp">): GameState {
    return {
      ...state,
      events: [
        ...state.events,
        {
          ...event,
          timestamp: new Date().toISOString()
        }
      ]
    };
  }

}