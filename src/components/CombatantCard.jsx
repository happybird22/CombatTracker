const CombatantCard = ({ combatant, dispatch, isActive }) => {
  const { id, name, hp, initiative, advantage, disadvantage, condition } = combatant;

  const handleHPChange = (e) => {
    dispatch({
      type: "UPDATE_HP",
      payload: { id, hp: parseInt(e.target.value) },
    });
  };

  const handleToggleAdvantage = () => {
  dispatch({ type: "TOGGLE_ADVANTAGE", id });
};

const handleToggleDisadvantage = () => {
  dispatch({ type: "TOGGLE_DISADVANTAGE", id });
};

const handleConditionChange = (e) => {
  dispatch({ type: "SET_CONDITION", id, condition: e.target.value });
};

  const handleRemove = () => {
    dispatch({ type: "REMOVE_COMBATANT", payload: { id } });
  };

  return (
    <div
      className="combatant-card"
      style={{
        border: isActive ? "3px solid limegreen" : "1px solid #ccc",
        padding: "1rem",
        borderRadius: "8px",
        backgroundColor: isActive ? "#f1fff1" : "#fff"
      }}
    >
      <h3>{name} {isActive && <span>🎯</span>}</h3>
      <p>Initiative: {initiative}</p>
      <label>
        HP:
        <input
          type="number"
          value={hp}
          onChange={handleHPChange}
          style={{ width: "60px", marginLeft: "0.5rem" }}
        />
      </label>
      <br />
      <button onClick={handleRemove} style={{ marginTop: "0.5rem" }}>
        Remove
      </button>
    </div>
  );
};

export default CombatantCard;
