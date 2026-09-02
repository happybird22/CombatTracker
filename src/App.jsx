import { useCombatTracker } from "./hooks/useCombatTracker";
import TurnOrderList from "./components/TurnOrderList";
import Controls from "./components/Controls";
import NewCombatantForm from "./components/NewCombatantForm";
import AuthPanel from "./components/AuthPanel";
import Footer from "./components/Footer";
import PrivacyPolicy from "./components/PrivacyPolicy";
import FAQ from "./components/FAQ";
import "./App.css";

function App() {
  const { combatants, dispatch } = useCombatTracker();
  const path = window.location.pathname;

  if (path === "/privacy") {
    document.title = "Privacy Policy — Combat Tracker";
    return (
      <div className="app-container">
        <PrivacyPolicy />
        <Footer />
      </div>
    );
  }

  if (path === "/faq") {
    document.title = "FAQ — Combat Tracker";
    return (
      <div className="app-container">
        <FAQ />
        <Footer />
      </div>
    );
  }

   return (
    <div className="app-container">
      <header className="header">
        <h1>Welcome to the Ultimate Combat Tracker Tool for D&amp;D</h1>
        <p className="header-subheading">Made with love, The Dungeons Not Dating Team</p>

        <AuthPanel />

        <h3>
          Built for Game Masters who would rather be narrating than doing
          math. Add your characters and monsters, and this tracker instantly
          sorts initiative, tracks HP, and keeps every round running
          smoothly.
        </h3>
      </header>

      <main className="tracker-main">
        <NewCombatantForm dispatch={dispatch} />
        <Controls dispatch={dispatch} />
        <TurnOrderList combatants={combatants} dispatch={dispatch} />
      </main>

      <Footer />
    </div>
  );
}

export default App;
