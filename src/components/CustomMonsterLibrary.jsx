import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToCustomMonsters, saveCustomMonster, deleteCustomMonster } from "../services/customMonsterService";

const CustomMonsterLibrary = ({ onSelect, selectedName }) => {
  const { user } = useAuth();
  const [monsters, setMonsters] = useState([]);
  const [name, setName] = useState("");
  const [ac, setAc] = useState("");
  const [maxHp, setMaxHp] = useState("");
  const [cr, setCr] = useState("");
  const [saveStatus, setSaveStatus] = useState(null);

  useEffect(() => {
    if (!user) {
      setMonsters([]);
      return;
    }
    return subscribeToCustomMonsters(user.uid, setMonsters);
  }, [user]);

  const handleDelete = async (monsterId, monsterName) => {
    if (!window.confirm(`Delete "${monsterName}" from your monster library?`)) return;
    try {
      await deleteCustomMonster(user.uid, monsterId);
    } catch (err) {
      console.error("Failed to delete custom monster:", err);
      setSaveStatus({ type: "error", message: `Couldn't delete "${monsterName}" (${err.code || err.message}).` });
    }
  };

  const handleAddMonster = async (e) => {
    e.preventDefault();
    const parsedMaxHp = parseInt(maxHp);
    const parsedAc = parseInt(ac);
    if (!name || !Number.isInteger(parsedMaxHp)) return;

    setSaveStatus(null);
    try {
      await saveCustomMonster(user.uid, {
        name,
        maxHp: parsedMaxHp,
        ac: Number.isInteger(parsedAc) ? parsedAc : null,
        cr,
      });
      setSaveStatus({ type: "success", message: `Saved "${name}" to your monster library.` });
      setName("");
      setAc("");
      setMaxHp("");
      setCr("");
    } catch (err) {
      console.error("Failed to save custom monster:", err);
      setSaveStatus({ type: "error", message: `Couldn't save "${name}" (${err.code || err.message}).` });
    }
  };

  if (!user) {
    return (
      <div className="character-library">
        <h2>My Monsters</h2>
        <p className="library-hint">
          Sign in above to build your own custom monster library, saved to
          your account and available in any encounter.
        </p>
      </div>
    );
  }

  return (
    <div className="character-library">
      <h2>My Monsters</h2>
      <p className="library-hint">
        Custom monsters saved to your account. Select one to load it into the
        form below.
      </p>

      {monsters.length > 0 && (
        <div className="monster-grid">
          {monsters.map(monster => (
            <div
              key={monster.id}
              className={`monster-btn saved-item${selectedName === monster.name ? " selected" : ""}`}
            >
              <button type="button" className="saved-item-select" onClick={() => onSelect(monster)}>
                <span className="monster-name">{monster.name}</span>
                <span className="monster-stats">
                  {monster.ac != null && `AC ${monster.ac} · `}HP {monster.maxHp}
                  {monster.cr && ` · CR ${monster.cr}`}
                </span>
              </button>
              <button
                type="button"
                className="saved-item-delete"
                onClick={() => handleDelete(monster.id, monster.name)}
                aria-label={`Delete ${monster.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {saveStatus && (
        <p className={`save-status save-status-${saveStatus.type}`}>{saveStatus.message}</p>
      )}

      <div className="custom-monster-form">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max HP"
          value={maxHp}
          onChange={e => setMaxHp(e.target.value)}
        />
        <input
          type="number"
          placeholder="AC (optional)"
          value={ac}
          onChange={e => setAc(e.target.value)}
        />
        <input
          type="text"
          placeholder="CR (optional)"
          value={cr}
          onChange={e => setCr(e.target.value)}
        />
        <button type="button" className="btn-secondary" onClick={handleAddMonster}>
          Save New Monster
        </button>
      </div>
    </div>
  );
};

export default CustomMonsterLibrary;
