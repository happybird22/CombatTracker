import { monsterLibrary } from "../data/monsterLibrary";

const MonsterLibrary = ({ onSelect, selectedName }) => {
  return (
    <div className="monster-library">
      <h2>Monster Library</h2>
      <p className="library-hint">
        SRD 5.1 creatures, open-licensed under CC-BY-4.0. Select one to load
        its name and HP into the form below, then set an initiative and hit Add.
      </p>

      <div className="monster-grid">
        {monsterLibrary.map(monster => (
          <button
            type="button"
            key={monster.name}
            className={`monster-btn${selectedName === monster.name ? " selected" : ""}`}
            onClick={() => onSelect(monster)}
          >
            <span className="monster-name">{monster.name}</span>
            <span className="monster-stats">
              AC {monster.ac} · HP {monster.maxHp} · CR {monster.cr}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MonsterLibrary;
