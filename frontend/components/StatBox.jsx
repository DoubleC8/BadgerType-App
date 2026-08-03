const StatBox = ({ stat, score }) => {
  return (
    <div className="w-1/3 p-3 h-full bg-(--bg-secondary) rounded-lg flex flex-col">
      <h1
        className="lg:text-4xl
                text-2xl"
      >
        {stat}
      </h1>
      <p
        className="lg:text-8xl 
                h-full flex items-center justify-center text-7xl font-bold text-(--accent)"
      >
        {score}
      </p>
    </div>
  );
};

export default StatBox;
