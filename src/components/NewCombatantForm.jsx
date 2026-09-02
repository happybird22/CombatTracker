import { useState } from "react";
import MonsterLibrary from "./MonsterLibrary";
import CharacterLibrary from "./CharacterLibrary";
import CustomMonsterLibrary from "./CustomMonsterLibrary";
import { CONDITIONS } from "../data/conditions";
import { useAuth } from "../context/AuthContext";
import { saveCharacter } from "../services/characterService";

const NewCombatantForm = ({ dispatch }) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [type, setType] = useState("monster");
  const [maxHp, setMaxHp] = useState("");
  const [ac, setAc] = useState("");
  const [initiative, setInitiative] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [condition, setCondition] = useState("");
  const [showMonsterLibrary, setShowMonsterLibrary] = useState(false);
  const [showCharacterLibrary, setShowCharacterLibrary] = useState(false);
  const [showCustomMonsterLibrary, setShowCustomMonsterLibrary] = useState(false);
  const [selectedPresetName, setSelectedPresetName] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // { type: "success" | "error", message: string }

  const applyPreset = (preset, presetType) => {
    setSelectedPresetName(preset.name);
    setName(preset.name);
    setMaxHp(String(preset.maxHp));
    setAc(preset.ac != null ? String(preset.ac) : "");
    setType(presetType);
  };

  const handleTypeChange = (nextType) => {
    setType(nextType);
    if (nextType === "pc") setQuantity("1");
  };

  const resetForm = () => {
    setName("");
    setType("monster");
    setMaxHp("");
    setAc("");
    setInitiative("");
    setQuantity("1");
    setAdvantage(false);
    setDisadvantage(false);
    setCondition("");
    setSelectedPresetName(null);
  };

  const addCombatants = (overrideType) => {
    const effectiveType = overrideType || type;
    // PCs are always added one at a time — quantity only applies to monsters/NPCs.
    const count = effectiveType === "pc" ? 1 : Math.max(1, parseInt(quantity) || 1);
    const parsedAc = parseInt(ac);

    for (let i = 1; i <= count; i++) {
      dispatch({
        type: "ADD_COMBATANT",
        payload: {
          id: Date.now() + i,
          name: count > 1 ? `${name} ${i}` : name,
          type: effectiveType,
          hp: parseInt(maxHp),
          maxHp: parseInt(maxHp),
          tempHp: 0,
          ac: Number.isInteger(parsedAc) ? parsedAc : null,
          initiative: parseInt(initiative),
          advantage,
          disadvantage,
          conditions: condition ? [{ name: condition, duration: null }] : [],
          concentrating: false,
          pendingConcentrationCheck: null,
          deathSaves: { successes: 0, failures: 0 },
        },
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !maxHp || !initiative) return;
    addCombatants();
    resetForm();
  };

  const handleSaveCharacterAndAdd = async () => {
    if (!user || !name || !maxHp || !initiative) return;
    const parsedAc = parseInt(ac);
    const characterName = name;
    setSaveStatus(null);
    // Adding to the encounter is local and always succeeds — don't block it
    // on the cloud save, just report separately if that part fails.
    addCombatants("pc");
    resetForm();
    try {
      await saveCharacter(user.uid, {
        name: characterName,
        maxHp: parseInt(maxHp),
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
      });
      setSaveStatus({ type: "success", message: `Saved "${characterName}" and added to the encounter.` });
    } catch (err) {
      console.error("Failed to save character:", err);
      setSaveStatus({
        type: "error",
        message: `Added "${characterName}" to the encounter, but saving to your Character Library failed (${err.code || err.message}).`,
      });
    }
  };

  const handleSaveCharacterOnly = async () => {
    if (!user || !name || !maxHp) return;
    const parsedAc = parseInt(ac);
    setSaveStatus(null);
    try {
      await saveCharacter(user.uid, {
        name,
        maxHp: parseInt(maxHp),
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
      });
      resetForm();
      setSaveStatus({ type: "success", message: `Saved "${name}" to your Character Library.` });
    } catch (err) {
      console.error("Failed to save character:", err);
      setSaveStatus({ type: "error", message: `Couldn't save "${name}" (${err.code || err.message}).` });
    }
  };

  const saveDisabledReason = !user ? "Sign in to save characters" : undefined;

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>Add Combatant</h2>

      <div className="library-toggles">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowMonsterLibrary(prev => !prev)}
        >
          {showMonsterLibrary ? "Hide Monster Library" : "Access Monster Library"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowCustomMonsterLibrary(prev => !prev)}
        >
          {showCustomMonsterLibrary ? "Hide My Monsters" : "Access My Monsters"}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowCharacterLibrary(prev => !prev)}
        >
          {showCharacterLibrary ? "Hide Character Library" : "Access Character Library"}
        </button>
      </div>

      {showMonsterLibrary && (
        <MonsterLibrary
          onSelect={(monster) => applyPreset(monster, "monster")}
          selectedName={selectedPresetName}
        />
      )}
      {showCustomMonsterLibrary && (
        <CustomMonsterLibrary
          onSelect={(monster) => applyPreset(monster, "monster")}
          selectedName={selectedPresetName}
        />
      )}
      {showCharacterLibrary && (
        <CharacterLibrary
          onSelect={(character) => applyPreset(character, "pc")}
          selectedName={selectedPresetName}
        />
      )}

      <div className="type-toggle">
        <label>
          <input
            type="radio"
            name="combatant-type"
            checked={type === "monster"}
            onChange={() => handleTypeChange("monster")}
          />
          Monster/NPC
        </label>
        <label>
          <input
            type="radio"
            name="combatant-type"
            checked={type === "pc"}
            onChange={() => handleTypeChange("pc")}
          />
          Player Character
        </label>
      </div>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Max HP"
        value={maxHp}
        onChange={e => setMaxHp(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="AC (optional)"
        value={ac}
        onChange={e => setAc(e.target.value)}
      />
      <input
        type="number"
        placeholder="Initiative"
        value={initiative}
        onChange={e => setInitiative(e.target.value)}
        required
      />
      {type === "monster" && (
        <label className="quantity-field">
          Quantity
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
          />
        </label>
      )}

      <div className="form-checkboxes">
        <label>
          <input
            type="checkbox"
            checked={advantage}
            onChange={e => setAdvantage(e.target.checked)}
          />
          Advantage on next turn
        </label>

        <label>
          <input
            type="checkbox"
            checked={disadvantage}
            onChange={e => setDisadvantage(e.target.checked)}
          />
          Disadvantage on next turn
        </label>
      </div>

      <label className="form-condition">
        Starting Condition:
        <select value={condition} onChange={e => setCondition(e.target.value)}>
          <option value="">None</option>
          {CONDITIONS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>

      <div className="form-actions">
        {saveStatus && (
          <p className={`save-status save-status-${saveStatus.type}`}>{saveStatus.message}</p>
        )}
        <div className="save-buttons-row">
          <button
            type="button"
            className="btn-secondary"
            disabled={!user}
            title={saveDisabledReason}
            onClick={handleSaveCharacterAndAdd}
          >
            Save as Character and Add
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={!user}
            title={saveDisabledReason}
            onClick={handleSaveCharacterOnly}
          >
            Save as Character Only
          </button>
        </div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default NewCombatantForm;
