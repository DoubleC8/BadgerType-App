import { MdRefresh } from "react-icons/md";

const RetryButton = ({ onRetry }) => {
  return (
    <button
      onClick={onRetry}
      className={
        "w-1/8 h-10 text-(--text-secondary) flex justify-center items-center gap-1 p-1 rounded-lg bg-(--bg-secondary) text-2xl font-bold hover:bg-(--bg-secondary)/50 hover:cursor-pointer ease-in-out duration-300"
      }
    >
      <p>Retry</p>
      <MdRefresh className="text-(--accent)" />
    </button>
  );
};

export default RetryButton;
