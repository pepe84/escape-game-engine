export class HintEngineService {

  static create(hints: string[]) {

    const state: Record<string, boolean> = {};

    hints.forEach((_, index) => {
      state[String(index + 1)] = false;
    });

    state["S"] = false;

    return state;
  }

  static unlockHint(
    state: Record<string, boolean>
  ) {

    const nextKey =
      Object.keys(state)
        .filter(key => key !== "S")
        .sort()
        .find(key => !state[key]);

    if (!nextKey) return state;

    return {
      ...state,
      [nextKey]: true
    };
  }

  static unlockSolution(
    state: Record<string, boolean>
  ) {

    return {
      ...state,
      S: true
    };
  }

  static allHintsUnlocked(
    state: Record<string, boolean>
  ) {

    return Object.entries(state)
      .filter(([key]) => key !== "S")
      .every(([, value]) => value);
  }

  static isHintUnlocked(
    state: Record<string, boolean>,
    index: number
  ) {

    return state[String(index + 1)] === true;
  }

  static isSolutionUnlocked(
    state: Record<string, boolean>
  ) {

    return state["S"] === true;
  }

  static countUsedHints(
    state: Record<string, boolean>
  ) {

    return Object.entries(state)
      .filter(([key, value]) =>
        key !== "S" && value
      )
      .length;
  }

}