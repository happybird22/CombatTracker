import { useReducer, useEffect } from "react";
import { combatReducer } from "./reducers/combatReducer";
import { initialCombatants } from "./data/initialCombatants";
import TurnOrderList from "./components/TurnOrderList";
import Controls from "./components/Controls";
import NewCombatantForm from "./components/NewCombatantForm";
import logo from "./assets/logo.jpg";
import "./App.css";

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
    <div className="app-container">
      <header className="header">
        <img src={logo} alt="Dungeons Not Dating logo" className="logo" />
        <h1>Dungeons Not Dating Presents: Combat Tracker!</h1>
        <h3>
          Simply add player characters and monsters with their name, HP and
          initiative and let this tracker sort them for you. Make managing
          turns and health in combat quick and easy!
        </h3>
      </header>

      <main className="tracker-main">
        <NewCombatantForm dispatch={dispatch} />
        <Controls dispatch={dispatch} />
        <TurnOrderList combatants={combatants} dispatch={dispatch} />
      </main>
    </div>
  );
}

export default App;
