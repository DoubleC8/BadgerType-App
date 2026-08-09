const StatBox = ({ stat, score, errors }) => {
  return (
    <div className="w-1/3 p-3 h-full flex flex-col bg-(--bg-secondary) border-(--border) border-4 rounded-lg">
      <h1 className="text-2xl text-(--text-secondary)">{stat}</h1>

      <div className="h-full flex flex-col items-center justify-center">
        <p className="flex items-end justify-center text-5xl font-bold text-(--accent)">
          {score}
        </p>
        {errors !== undefined && (
          <p className="text-2xl text-(--red)">
            {errors} {errors === 1 ? "Error" : "Errors"}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatBox;
