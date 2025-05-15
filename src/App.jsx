import { useReducer, useEffect } from "react";
import { combatReducer } from "./reducers/combatReducer";
import { initialCombatants } from "./data/initialCombatants";
import TurnOrderList from "./components/TurnOrderList";
import Controls from "./components/Controls";
import NewCombatantForm from "./components/NewCombatantForm";

const STORAGE_KEY = "combat-tracker-state";

function App() {
  const [combatants, dispatch] = useReducer(
    combatReducer,
    [],
    () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialCombatants;
    }
  );

  // Save to localStorage whenever combatants change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combatants));
  }, [combatants]);

  return (
    <div className="app" style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Combat Tracker</h1>
      <NewCombatantForm dispatch={dispatch} />
      <Controls dispatch={dispatch} />
      <TurnOrderList combatants={combatants} dispatch={dispatch} />
    </div>
  );
}

export default App;
