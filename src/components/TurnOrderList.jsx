import CombatantCard from "./CombatantCard";

const TurnOrderList = ({ combatants, dispatch }) => {
  return (
    <div className="turn-order">
      {combatants.map((c, index) => (
        <div key={c.id} style={{ marginBottom: "1rem" }}>
          <CombatantCard
            combatant={c}
            dispatch={dispatch}
            isActive={index === 0}
          />
        </div>
      ))}
    </div>
  );
};

export default TurnOrderList;