import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { subscribeToCharacters, deleteCharacter } from "../services/characterService";

const CharacterLibrary = ({ onSelect, selectedName }) => {
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);

  useEffect(() => {
    if (!user) {
      setCharacters([]);
      return;
    }
    return subscribeToCharacters(user.uid, setCharacters);
  }, [user]);

  const handleDelete = async (characterId, name) => {
    if (!window.confirm(`Delete saved character "${name}"?`)) return;
    try {
      await deleteCharacter(user.uid, characterId);
    } catch (err) {
      console.error("Failed to delete character:", err);
      window.alert(`Couldn't delete "${name}" (${err.code || err.message}).`);
    }
  };

  if (!user) {
    return (
      <div className="character-library">
        <h2>Character Library</h2>
        <p className="library-hint">
          Sign in above to save your party's characters and reuse them in any
          encounter without re-entering their stats.
        </p>
      </div>
    );
  }

  return (
    <div className="character-library">
      <h2>Character Library</h2>
      <p className="library-hint">
        Select a saved character to load its name, HP and AC into the form
        below, then set an initiative and hit Add.
      </p>

      {characters.length === 0 ? (
        <p className="library-hint">
          No saved characters yet — use "Save as Character" below to add one.
        </p>
      ) : (
        <div className="monster-grid">
          {characters.map(character => (
            <div
              key={character.id}
              className={`monster-btn saved-item${selectedName === character.name ? " selected" : ""}`}
            >
              <button type="button" className="saved-item-select" onClick={() => onSelect(character)}>
                <span className="monster-name">{character.name}</span>
                <span className="monster-stats">
                  {character.ac != null && `AC ${character.ac} · `}HP {character.maxHp}
                </span>
              </button>
              <button
                type="button"
                className="saved-item-delete"
                onClick={() => handleDelete(character.id, character.name)}
                aria-label={`Delete ${character.name}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharacterLibrary;
