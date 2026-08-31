import { useReducer, useEffect } from "react";
import { combatReducer } from "../reducers/combatReducer";
import { initialCombatants } from "../data/initialCombatants";

const STORAGE_KEY = "combat-tracker-state";

export function useCombatTracker() {
  const [combatants, dispatch] = useReducer(
    combatReducer,
    [],
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialCombatants;
    }
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combatants));
  }, [combatants]);

  return { combatants, dispatch };
}
