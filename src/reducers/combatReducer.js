const sortByInitiative = (combatants) =>
  [...combatants].sort((a, b) => b.initiative - a.initiative);

export const combatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_COMBATANT":
      return sortByInitiative([...state, action.payload]);

    case "REMOVE_COMBATANT":
      return state.filter(c => c.id !== action.payload.id);

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
        return {
          ...c,
          tempHp: tempHp - absorbed,
          hp: Math.max(0, c.hp - remaining),
        };
      });

    case "APPLY_HEAL":
      return state.map(c =>
        c.id === action.id
          ? { ...c, hp: Math.min(c.maxHp, c.hp + action.amount) }
          : c
      );

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

case "SET_CONDITION":
  return state.map(c =>
    c.id === action.id ? { ...c, condition: action.condition } : c
  );

    case "NEXT_TURN": {
      const resetActive = { ...state[0], advantage: false, disadvantage: false };
      return [...state.slice(1), resetActive];
    }

    default:
      return state;
  }
};
