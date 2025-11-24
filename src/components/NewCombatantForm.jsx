import { useState } from "react";

const NewCombatantForm = ({ dispatch }) => {
  const [name, setName] = useState("");
  const [hp, setHp] = useState("");
  const [initiative, setInitiative] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !hp || !initiative) return;

    const newCombatant = {
      id: Date.now(), // simple unique ID
      name,
      hp: parseInt(hp),
      initiative: parseInt(initiative),
    };

    <label>
  Advantage on next turn:
  <input
    type="checkbox"
    checked={newCombatant.advantage}
    onChange={e =>
      setNewCombatant({
        ...newCombatant,
        advantage: e.target.checked
      })
    }
  />
</label>

<label>
  Disadvantage on next turn:
  <input
    type="checkbox"
    checked={newCombatant.disadvantage}
    onChange={e =>
      setNewCombatant({
        ...newCombatant,
        disadvantage: e.target.checked
      })
    }
  />
</label>

<label>
  Condition:
  <select
    value={newCombatant.condition}
    onChange={e =>
      setNewCombatant({
        ...newCombatant,
        condition: e.target.value
      })
    }
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

    dispatch({ type: "ADD_COMBATANT", payload: newCombatant });

    // Reset form
    setName("");
    setHp("");
    setInitiative("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
      <h2>Add Combatant</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="HP"
        value={hp}
        onChange={e => setHp(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Initiative"
        value={initiative}
        onChange={e => setInitiative(e.target.value)}
        required
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default NewCombatantForm;
