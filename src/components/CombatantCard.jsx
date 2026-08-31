import { useState } from "react";

const CombatantCard = ({ combatant, dispatch, isActive }) => {
  const { id, name, hp, maxHp, tempHp, initiative, advantage, disadvantage, condition } = combatant;
  const [amount, setAmount] = useState("");
  const [tempAmount, setTempAmount] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editInitiative, setEditInitiative] = useState(initiative);
  const [editHp, setEditHp] = useState(hp);
  const [editMaxHp, setEditMaxHp] = useState(maxHp);

  const handleStartEdit = () => {
    setEditName(name);
    setEditInitiative(initiative);
    setEditHp(hp);
    setEditMaxHp(maxHp);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const newMaxHp = parseInt(editMaxHp);
    const newHp = parseInt(editHp);
    const newInitiative = parseInt(editInitiative);
    if (!editName || !Number.isInteger(newMaxHp) || !Number.isInteger(newHp) || !Number.isInteger(newInitiative)) return;

    dispatch({
      type: "EDIT_COMBATANT",
      id,
      updates: { name: editName, initiative: newInitiative, hp: newHp, maxHp: newMaxHp },
    });
    setIsEditing(false);
  };

  const handleDamage = () => {
    const value = parseInt(amount);
    if (!value || value <= 0) return;
    dispatch({ type: "APPLY_DAMAGE", id, amount: value });
    setAmount("");
  };

  const handleHeal = () => {
    const value = parseInt(amount);
    if (!value || value <= 0) return;
    dispatch({ type: "APPLY_HEAL", id, amount: value });
    setAmount("");
  };

  const handleSetTempHp = () => {
    const value = parseInt(tempAmount);
    if (!value || value <= 0) return;
    dispatch({ type: "SET_TEMP_HP", id, amount: value });
    setTempAmount("");
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
    if (!window.confirm(`Remove ${name} from the encounter?`)) return;
    dispatch({ type: "REMOVE_COMBATANT", payload: { id } });
  };

  if (isEditing) {
    return (
      <div className={`combatant-card${isActive ? " active" : ""}`}>
        <form className="edit-form" onSubmit={handleSaveEdit}>
          <h3>Edit Combatant</h3>

          <label>
            Name
            <input
              type="text"
              value={editName}
              onChange={e => setEditName(e.target.value)}
              required
            />
          </label>

          <label>
            Initiative
            <input
              type="number"
              value={editInitiative}
              onChange={e => setEditInitiative(e.target.value)}
              required
            />
          </label>

          <label>
            Current HP
            <input
              type="number"
              min="0"
              value={editHp}
              onChange={e => setEditHp(e.target.value)}
              required
            />
          </label>

          <label>
            Max HP
            <input
              type="number"
              min="1"
              value={editMaxHp}
              onChange={e => setEditMaxHp(e.target.value)}
              required
            />
          </label>

          <div className="card-footer">
            <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
              Cancel
            </button>
            <button type="submit" className="btn-success">
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`combatant-card${isActive ? " active" : ""}`}>
      <h3>{name} {isActive && <span>🎯</span>}</h3>
      <p>Initiative: {initiative}</p>

      <p className="hp-summary">
        HP: <strong>{hp} / {maxHp}</strong>
        {tempHp > 0 && <span className="temp"> (+{tempHp} temp)</span>}
        {hp === 0 && <span className="down"> (Down)</span>}
      </p>

      <div className="hp-controls">
        <input
          type="number"
          min="1"
          placeholder="Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button type="button" className="btn-danger" onClick={handleDamage}>
          − Damage
        </button>
        <button type="button" className="btn-success" onClick={handleHeal}>
          + Heal
        </button>
      </div>

      <div className="hp-controls">
        <input
          type="number"
          min="1"
          placeholder="Temp HP"
          value={tempAmount}
          onChange={e => setTempAmount(e.target.value)}
        />
        <button type="button" className="btn-secondary" onClick={handleSetTempHp}>
          Set Temp HP
        </button>
      </div>

      {/* Status Controls */}
      <div className="status-controls">
        <label>
          <input
            type="checkbox"
            checked={advantage}
            onChange={handleToggleAdvantage}
          />
          Advantage
        </label>

        <label>
          <input
            type="checkbox"
            checked={disadvantage}
            onChange={handleToggleDisadvantage}
          />
          Disadvantage
        </label>

        <label>
          Condition:
          <select
            value={condition || ""}
            onChange={handleConditionChange}
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

      <div className="card-footer">
        <button type="button" className="btn-secondary" onClick={handleStartEdit}>
          Edit
        </button>
        <button type="button" className="btn-danger" onClick={handleRemove}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CombatantCard;

