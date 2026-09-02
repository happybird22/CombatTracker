const Controls = ({ dispatch }) => {
  const handleClearEncounter = () => {
    if (!window.confirm("Clear the entire encounter? This removes all combatants.")) return;
    dispatch({ type: "CLEAR_ENCOUNTER" });
  };

  return (
    <div className="controls-row">
      <button onClick={() => dispatch({ type: "NEXT_TURN" })}>
        Next Turn
      </button>
      <button type="button" className="btn-secondary" onClick={handleClearEncounter}>
        Clear Encounter
      </button>
    </div>
  );
};

export default Controls;
