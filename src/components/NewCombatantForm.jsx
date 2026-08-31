import { useState } from "react";
import MonsterLibrary from "./MonsterLibrary";
import CharacterLibrary from "./CharacterLibrary";

const NewCombatantForm = ({ dispatch }) => {
  const [name, setName] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [initiative, setInitiative] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [condition, setCondition] = useState("");
  const [showMonsterLibrary, setShowMonsterLibrary] = useState(false);
  const [showCharacterLibrary, setShowCharacterLibrary] = useState(false);
  const [selectedMonster, setSelectedMonster] = useState(null);

  const handleSelectMonster = (monster) => {
    setSelectedMonster(monster);
    setName(monster.name);
    setMaxHp(String(monster.maxHp));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !maxHp || !initiative) return;

    const count = Math.max(1, parseInt(quantity) || 1);

    for (let i = 1; i <= count; i++) {
      dispatch({
        type: "ADD_COMBATANT",
        payload: {
          id: Date.now() + i,
          name: count > 1 ? `${name} ${i}` : name,
          hp: parseInt(maxHp),
          maxHp: parseInt(maxHp),
          tempHp: 0,
          initiative: parseInt(initiative),
          advantage,
          disadvantage,
          condition,
        },
      });
    }

    // Reset form
    setName("");
    setMaxHp("");
    setInitiative("");
    setQuantity("1");
    setAdvantage(false);
    setDisadvantage(false);
    setCondition("");
    setSelectedMonster(null);
  };

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
          onClick={() => setShowCharacterLibrary(prev => !prev)}
        >
          {showCharacterLibrary ? "Hide Character Library" : "Access Character Library"}
        </button>
      </div>

      {showMonsterLibrary && (
        <MonsterLibrary
          onSelect={handleSelectMonster}
          selectedName={selectedMonster?.name}
        />
      )}
      {showCharacterLibrary && <CharacterLibrary />}

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
        placeholder="Initiative"
        value={initiative}
        onChange={e => setInitiative(e.target.value)}
        required
      />
      <input
        type="number"
        min="1"
        placeholder="Quantity"
        value={quantity}
        onChange={e => setQuantity(e.target.value)}
      />

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
        Condition:
        <select value={condition} onChange={e => setCondition(e.target.value)}>
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

      <div className="form-actions">
        <div className="save-buttons-row">
          <button
            type="button"
            className="btn-secondary"
            disabled
            title="Requires an account (coming soon)"
          >
            Save as Character and Add
          </button>
          <button
            type="button"
            className="btn-secondary"
            disabled
            title="Requires an account (coming soon)"
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

