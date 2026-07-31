import Cursor from "./Cursor";

const TypingDisplay = ({ randomWords }) => {
  return (
    <div className="min-h-1/2 p-3 border-4 border-dashed border-(--accent) rounded-lg flex flex-col justify-center bg-(--bg-secondary) text-(--text-secondary) text-4xl tracking-widest font-(family-name:--geist)">
      <p>{randomWords}</p>
      <Cursor />
    </div>
  );
};

export default TypingDisplay;
