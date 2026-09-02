import { useState } from "react";
import { CONDITIONS, conditionLabel } from "../data/conditions";

const hpBucket = (hp, maxHp) => {
  if (hp <= 0) return "empty";
  const pct = hp / maxHp;
  if (pct > 0.5) return "high";
  if (pct > 0.25) return "mid";
  return "low";
};

const CombatantCard = ({ combatant, dispatch, isActive }) => {
  const {
    id,
    name,
    type,
    hp,
    maxHp,
    tempHp,
    ac,
    initiative,
    advantage,
    disadvantage,
    conditions = [],
    concentrating,
    pendingConcentrationCheck,
    deathSaves = { successes: 0, failures: 0 },
  } = combatant;

  const [amount, setAmount] = useState("");
  const [tempAmount, setTempAmount] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newConditionDuration, setNewConditionDuration] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(name);
  const [editInitiative, setEditInitiative] = useState(initiative);
  const [editHp, setEditHp] = useState(hp);
  const [editMaxHp, setEditMaxHp] = useState(maxHp);
  const [editAc, setEditAc] = useState(ac ?? "");

  const handleStartEdit = () => {
    setEditName(name);
    setEditInitiative(initiative);
    setEditHp(hp);
    setEditMaxHp(maxHp);
    setEditAc(ac ?? "");
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
    const parsedAc = parseInt(editAc);
    if (!editName || !Number.isInteger(newMaxHp) || !Number.isInteger(newHp) || !Number.isInteger(newInitiative)) return;

    dispatch({
      type: "EDIT_COMBATANT",
      id,
      updates: {
        name: editName,
        initiative: newInitiative,
        hp: newHp,
        maxHp: newMaxHp,
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
      },
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

  const handleAddCondition = () => {
    if (!newCondition) return;
    const duration = parseInt(newConditionDuration);
    dispatch({
      type: "ADD_CONDITION",
      id,
      condition: { name: newCondition, duration: Number.isInteger(duration) && duration > 0 ? duration : null },
    });
    setNewCondition("");
    setNewConditionDuration("");
  };

  const handleRemoveCondition = (conditionName) => {
    dispatch({ type: "REMOVE_CONDITION", id, conditionName });
  };

  const handleToggleConcentration = () => {
    dispatch({ type: "TOGGLE_CONCENTRATION", id });
  };

  const handleDismissConcentrationCheck = () => {
    dispatch({ type: "DISMISS_CONCENTRATION_CHECK", id });
  };

  const handleAdjustDeathSave = (kind, delta) => {
    dispatch({ type: "ADJUST_DEATH_SAVE", id, kind, delta });
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
            AC
            <input
              type="number"
              placeholder="Optional"
              value={editAc}
              onChange={e => setEditAc(e.target.value)}
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
      <h3>
        {name} {isActive && <span>🎯</span>}
        {ac != null && <span className="ac-badge" title="Armor Class">AC {ac}</span>}
      </h3>
      <p>Initiative: {initiative}</p>

      <p className="hp-summary">
        HP: <strong>{hp} / {maxHp}</strong>
        {tempHp > 0 && <span className="temp"> (+{tempHp} temp)</span>}
        {hp === 0 && <span className="down"> (Down)</span>}
      </p>

      <div className={`hp-bar hp-bar-${hpBucket(hp, maxHp)}`}>
        <div className="hp-bar-fill" style={{ width: `${maxHp > 0 ? Math.min(100, (hp / maxHp) * 100) : 0}%` }} />
        {tempHp > 0 && (
          <div
            className="hp-bar-temp"
            style={{ width: `${maxHp > 0 ? Math.min(100 - (hp / maxHp) * 100, (tempHp / maxHp) * 100) : 0}%` }}
          />
        )}
      </div>

      {type === "pc" && hp === 0 && (
        <div className="death-saves">
          <span className="death-saves-label">Death Saves</span>
          <div className="death-saves-row">
            <span className="death-saves-pips success">
              {[0, 1, 2].map(i => (
                <button
                  type="button"
                  key={`s-${i}`}
                  className={`pip${i < deathSaves.successes ? " filled" : ""}`}
                  onClick={() => handleAdjustDeathSave("successes", i < deathSaves.successes ? -1 : 1)}
                  aria-label={`Death save success ${i + 1}`}
                />
              ))}
            </span>
            <span className="death-saves-pips failure">
              {[0, 1, 2].map(i => (
                <button
                  type="button"
                  key={`f-${i}`}
                  className={`pip${i < deathSaves.failures ? " filled" : ""}`}
                  onClick={() => handleAdjustDeathSave("failures", i < deathSaves.failures ? -1 : 1)}
                  aria-label={`Death save failure ${i + 1}`}
                />
              ))}
            </span>
          </div>
          {deathSaves.successes >= 3 && <p className="death-saves-status stable">Stabilized</p>}
          {deathSaves.failures >= 3 && <p className="death-saves-status dead">Dead</p>}
        </div>
      )}

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
          <input
            type="checkbox"
            checked={!!concentrating}
            onChange={handleToggleConcentration}
          />
          Concentrating
        </label>
      </div>

      {pendingConcentrationCheck != null && (
        <div className="concentration-banner">
          <span>⚠ Concentration save! DC {pendingConcentrationCheck}</span>
          <button type="button" className="btn-secondary" onClick={handleDismissConcentrationCheck}>
            Dismiss
          </button>
        </div>
      )}

      <div className="conditions-section">
        {conditions.length > 0 && (
          <div className="conditions-list">
            {conditions.map(cond => (
              <span key={cond.name} className="condition-chip">
                {conditionLabel(cond.name)}
                {cond.duration != null && ` (${cond.duration})`}
                <button
                  type="button"
                  className="condition-chip-remove"
                  onClick={() => handleRemoveCondition(cond.name)}
                  aria-label={`Remove ${conditionLabel(cond.name)}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="condition-add-row">
          <select value={newCondition} onChange={e => setNewCondition(e.target.value)}>
            <option value="">Add condition…</option>
            {CONDITIONS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            placeholder="Rounds (optional)"
            value={newConditionDuration}
            onChange={e => setNewConditionDuration(e.target.value)}
          />
          <button type="button" className="btn-secondary" onClick={handleAddCondition}>
            Add
          </button>
        </div>
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
