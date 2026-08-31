import { useCombatTracker } from "./hooks/useCombatTracker";
import TurnOrderList from "./components/TurnOrderList";
import Controls from "./components/Controls";
import NewCombatantForm from "./components/NewCombatantForm";
import "./App.css";

function App() {
  const { combatants, dispatch } = useCombatTracker();

   return (
    <div className="app-container">
      <header className="header">
        <h1>Combat Tracker!</h1>
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
