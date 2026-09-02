const sortByInitiative = (combatants) =>
  [...combatants].sort((a, b) => b.initiative - a.initiative);

const concentrationDc = (damage) => Math.max(10, Math.floor(damage / 2));

export const combatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_COMBATANT":
      return sortByInitiative([...state, action.payload]);

    case "REMOVE_COMBATANT":
      return state.filter(c => c.id !== action.payload.id);

    case "CLEAR_ENCOUNTER":
      return [];

    case "EDIT_COMBATANT":
      return sortByInitiative(
        state.map(c => {
          if (c.id !== action.id) return c;
          const updated = { ...c, ...action.updates };
          return { ...updated, hp: Math.min(updated.hp, updated.maxHp) };
        })
      );

    case "APPLY_DAMAGE":
      return state.map(c => {
        if (c.id !== action.id) return c;
        const tempHp = c.tempHp || 0;
        const absorbed = Math.min(tempHp, action.amount);
        const remaining = action.amount - absorbed;
        const wasAlive = c.hp > 0;
        const newHp = Math.max(0, c.hp - remaining);
        const justDropped = wasAlive && newHp === 0;

        return {
          ...c,
          tempHp: tempHp - absorbed,
          hp: newHp,
          // Concentration is broken outright if this hit drops them to 0;
          // otherwise any damage while concentrating prompts a save.
          concentrating: newHp === 0 ? false : c.concentrating,
          pendingConcentrationCheck:
            newHp === 0
              ? null
              : c.concentrating && action.amount > 0
              ? concentrationDc(action.amount)
              : c.pendingConcentrationCheck,
          deathSaves: justDropped
            ? { successes: 0, failures: 0 }
            : c.deathSaves,
        };
      });

    case "APPLY_HEAL":
      return state.map(c => {
        if (c.id !== action.id) return c;
        const newHp = Math.min(c.maxHp, c.hp + action.amount);
        const revived = c.hp === 0 && newHp > 0;
        return {
          ...c,
          hp: newHp,
          deathSaves: revived ? { successes: 0, failures: 0 } : c.deathSaves,
        };
      });

    case "SET_TEMP_HP":
      return state.map(c =>
        c.id === action.id
          ? { ...c, tempHp: Math.max(c.tempHp || 0, action.amount) }
          : c
      );

    case "TOGGLE_ADVANTAGE":
      return state.map(c =>
        c.id === action.id ? { ...c, advantage: !c.advantage } : c
      );

    case "TOGGLE_DISADVANTAGE":
      return state.map(c =>
        c.id === action.id ? { ...c, disadvantage: !c.disadvantage } : c
      );

    case "ADD_CONDITION":
      return state.map(c => {
        if (c.id !== action.id) return c;
        const existing = c.conditions || [];
        const withoutDup = existing.filter(cond => cond.name !== action.condition.name);
        return { ...c, conditions: [...withoutDup, action.condition] };
      });

    case "REMOVE_CONDITION":
      return state.map(c =>
        c.id === action.id
          ? { ...c, conditions: (c.conditions || []).filter(cond => cond.name !== action.conditionName) }
          : c
      );

    case "TOGGLE_CONCENTRATION":
      return state.map(c =>
        c.id === action.id
          ? {
              ...c,
              concentrating: !c.concentrating,
              pendingConcentrationCheck: c.concentrating ? c.pendingConcentrationCheck : null,
            }
          : c
      );

    case "DISMISS_CONCENTRATION_CHECK":
      return state.map(c =>
        c.id === action.id ? { ...c, pendingConcentrationCheck: null } : c
      );

    case "ADJUST_DEATH_SAVE": {
      // action.kind: "successes" | "failures", action.delta: 1 | -1
      return state.map(c => {
        if (c.id !== action.id) return c;
        const current = c.deathSaves || { successes: 0, failures: 0 };
        const next = Math.max(0, Math.min(3, current[action.kind] + action.delta));
        return { ...c, deathSaves: { ...current, [action.kind]: next } };
      });
    }

    case "NEXT_TURN": {
      if (state.length === 0) return state;
      const [current, ...rest] = state;
      // Conditions with a set duration tick down once per full turn for
      // the creature they're on (i.e. once per round for that creature)
      // and drop off when they expire.
      const tickedConditions = (current.conditions || [])
        .map(cond => (cond.duration != null ? { ...cond, duration: cond.duration - 1 } : cond))
        .filter(cond => cond.duration == null || cond.duration > 0);

      const resetActive = {
        ...current,
        advantage: false,
        disadvantage: false,
        conditions: tickedConditions,
      };
      return [...rest, resetActive];
    }

    default:
      return state;
  }
};
