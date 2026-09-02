import { useState } from "react";
import { monsterLibrary, CR_ORDER } from "../data/monsterLibrary";

const PAGE_SIZE = 8; // 2 rows of 4

// One page per CR bracket; a bracket with more than PAGE_SIZE monsters
// splits into consecutive sub-pages so every page stays a fixed size.
const buildPages = () => {
  const byCr = new Map();
  monsterLibrary.forEach((monster) => {
    if (!byCr.has(monster.cr)) byCr.set(monster.cr, []);
    byCr.get(monster.cr).push(monster);
  });

  const pages = [];
  CR_ORDER.forEach((cr) => {
    const monsters = byCr.get(cr);
    if (!monsters || monsters.length === 0) return;
    const subPageCount = Math.ceil(monsters.length / PAGE_SIZE);
    for (let i = 0; i < subPageCount; i++) {
      pages.push({
        cr,
        subPageIndex: i,
        subPageCount,
        monsters: monsters.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE),
      });
    }
  });
  return pages;
};

const PAGES = buildPages();

const MonsterLibrary = ({ onSelect, selectedName }) => {
  const [pageIndex, setPageIndex] = useState(0);
  const page = PAGES[pageIndex];

  return (
    <div className="monster-library">
      <h2>Monster Library</h2>
      <p className="library-hint">
        SRD 5.1 creatures, open-licensed under CC-BY-4.0. Select one to load
        its name and HP into the form below, then set an initiative and hit Add.
      </p>

      <div className="monster-page-nav">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setPageIndex((i) => i - 1)}
          disabled={pageIndex === 0}
        >
          ← Prev
        </button>
        <span className="monster-page-label">
          Challenge Rating {page.cr}
          {page.subPageCount > 1 && ` (page ${page.subPageIndex + 1} of ${page.subPageCount})`}
        </span>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setPageIndex((i) => i + 1)}
          disabled={pageIndex === PAGES.length - 1}
        >
          Next →
        </button>
      </div>

      <div className="monster-grid">
        {page.monsters.map((monster) => (
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
