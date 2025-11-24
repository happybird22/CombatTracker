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

      {/* Status Controls */}
      <div style={{ marginTop: "1rem" }}>
        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={advantage}
            onChange={handleToggleAdvantage}
            style={{ marginRight: "4px" }}
          />
          Advantage
        </label>

        <label style={{ marginRight: "10px" }}>
          <input
            type="checkbox"
            checked={disadvantage}
            onChange={handleToggleDisadvantage}
            style={{ marginRight: "4px" }}
          />
          Disadvantage
        </label>

        <label>
          Condition:
          <select
            value={condition || ""}
            onChange={handleConditionChange}
            style={{ marginLeft: "4px" }}
          >
            <option value="">None</option>
            <option value="blinded">Blinded</option>
            <option value="charmed">Charmed</option>
            <option value="deafened">Deafened</option>
            <option value="frightened">Frightened</option>
            <option value="grappled">Grappled</option>
            <option value="incapacitated">Incapacitated</option>
            <option value="paralyzed">Paralyzed</option>
            <option value="petrified">Petrified</option>
            <option value="poisoned">Poisoned</option>
            <option value="prone">Prone</option>
            <option value="restrained">Restrained</option>
            <option value="stunned">Stunned</option>
            <option value="unconscious">Unconscious</option>
            <option value="blessed">Blessed</option>
            <option value="inspiration">Has Inspiration</option>
            <option value="huntersMark">Hunter’s Mark</option>
          </select>
        </label>
      </div>

      <button onClick={handleRemove} style={{ marginTop: "0.5rem" }}>
        Remove
      </button>
    </div>
  );
};

export default CombatantCard;

