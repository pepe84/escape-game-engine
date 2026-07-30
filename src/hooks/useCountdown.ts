import { useEffect, useMemo, useState } from "react";
import { useGameContext } from "../context/GameContext";
import { GameClockService } from "../services/GameClockService";

export function useCountdown() {

  const { game, state } = useGameContext();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (state?.finished) return;
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [state?.finished]);

  const remainingSeconds = useMemo(() => {
    if (!game || !state) {
      return 0;
    }
    return GameClockService.getRemainingSeconds(
      game,
      state
    );

  }, [game, state, now]);

  return {
    remainingSeconds,
    formatted:
      GameClockService.formatSeconds(
        remainingSeconds
      )
  };
}