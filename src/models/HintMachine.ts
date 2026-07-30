export const HintMachine = {

  hintsCount: (hints: string[]) => hints.length,

  solutionStep: (hints: string[]) => hints.length + 1,

  isHintUnlocked: (step: number, index: number) =>
    step > index,

  isSolutionUnlocked: (step: number, hints: string[]) =>
    step >= hints.length + 1
};