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