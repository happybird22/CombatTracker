const Controls = ({ dispatch }) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <button onClick={() => dispatch({ type: "NEXT_TURN" })}>
        Next Turn
      </button>
    </div>
  );
};

export default Controls;