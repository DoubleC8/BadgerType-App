const StatBox = ({ stat, score, errors }) => {
  return (
    <div className="w-1/3 p-3 h-full bg-(--bg-secondary) rounded-lg flex flex-col">
      <h1 className="lg:text-4xl text-2xl">{stat}</h1>

      <p className="mt-auto flex items-end justify-center lg:text-8xl text-7xl font-bold text-(--accent)">
        {score}
      </p>

      <div className="h-8 mt-6 flex items-center justify-center">
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
