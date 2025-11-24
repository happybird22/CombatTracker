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

   case "NEXT_TURN":
  return state.map((c, index) => {
    if (index === 0) {
      return { ...c, advantage: false, disadvantage: false }; // reset for active combatant
    }
    return c;
  }).slice(1).concat(state[0]); // move first combatant to the end
 
    default:
      return state;
  }
};
