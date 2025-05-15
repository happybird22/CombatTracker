const sortByInitiative = (combatants) =>
  [...combatants].sort((a, b) => b.initiative - a.initiative);

export const combatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_COMBATANT":
      return sortByInitiative([...state, action.payload]);

    case "REMOVE_COMBATANT":
      return state.filter(c => c.id !== action.payload.id);

    case "NEXT_TURN":
      return ([...state.slice(1), state[0]]);

    case "UPDATE_HP":
      return state.map(c =>
        c.id === action.payload.id
          ? { ...c, hp: action.payload.hp }
          : c
      );

    default:
      return state;
  }
};