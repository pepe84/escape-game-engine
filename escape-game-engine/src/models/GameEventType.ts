export const GameEventType = {

    GAME_STARTED: "game_started",

    PAGE_OPENED: "page_opened",

    CORRECT_ANSWER: "correct_answer",

    WRONG_ANSWER: "wrong_answer",

    HINT_OPENED: "hint_opened",

    SOLUTION_OPENED: "solution_opened",

    GAME_FINISHED: "game_finished"

} as const;

export type GameEventType = typeof GameEventType[keyof typeof GameEventType];