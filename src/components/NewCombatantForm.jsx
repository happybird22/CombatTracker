import { useState } from "react";
import MonsterLibrary from "./MonsterLibrary";
import CharacterLibrary from "./CharacterLibrary";
import CustomMonsterLibrary from "./CustomMonsterLibrary";
import { CONDITIONS } from "../data/conditions";
import { useAuth } from "../context/AuthContext";
import { saveCharacter } from "../services/characterService";
import { saveCustomMonster } from "../services/customMonsterService";

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

  // PCs save to the Character Library; everything else (monster/NPC) saves
  // to the custom monster library — the buttons follow whichever tab is active.
  const saveToLibrary = (uid, values) =>
    type === "pc" ? saveCharacter(uid, values) : saveCustomMonster(uid, values);

  const libraryName = type === "pc" ? "Character Library" : "My Monsters";

  const handleSaveToLibraryAndAdd = async () => {
    if (!user || !name || !maxHp || !initiative) return;
    const parsedAc = parseInt(ac);
    const savedName = name;
    const savedType = type;
    setSaveStatus(null);
    // Adding to the encounter is local and always succeeds — don't block it
    // on the cloud save, just report separately if that part fails.
    addCombatants();
    resetForm();
    try {
      await saveToLibrary(user.uid, {
        name: savedName,
        maxHp: parseInt(maxHp),
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
      });
      setSaveStatus({ type: "success", message: `Saved "${savedName}" and added to the encounter.` });
    } catch (err) {
      console.error("Failed to save to library:", err);
      const destination = savedType === "pc" ? "Character Library" : "My Monsters";
      setSaveStatus({
        type: "error",
        message: `Added "${savedName}" to the encounter, but saving to ${destination} failed (${err.code || err.message}).`,
      });
    }
  };

  const handleSaveToLibraryOnly = async () => {
    if (!user || !name || !maxHp) return;
    const parsedAc = parseInt(ac);
    setSaveStatus(null);
    try {
      await saveToLibrary(user.uid, {
        name,
        maxHp: parseInt(maxHp),
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
      });
      resetForm();
      setSaveStatus({ type: "success", message: `Saved "${name}" to ${libraryName}.` });
    } catch (err) {
      console.error("Failed to save to library:", err);
      setSaveStatus({ type: "error", message: `Couldn't save "${name}" (${err.code || err.message}).` });
    }
  };

  const saveDisabledReason = !user ? "Sign in to save to your library" : undefined;

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
            onClick={handleSaveToLibraryAndAdd}
          >
            Save to My Library and Add
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled={!user}
            title={saveDisabledReason}
            onClick={handleSaveToLibraryOnly}
          >
            Save to My Library Only
          </button>
        </div>
        <button type="submit">Add</button>
      </div>
    </form>
  );
};

export default NewCombatantForm;
