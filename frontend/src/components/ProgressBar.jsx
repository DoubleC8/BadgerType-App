const ProgressBar = ({ progress, label }) => {
  return (
    <div className="w-full flex flex-col gap-2 font-(family-name:--geist)">
      <div className="flex justify-between text-sm font-bold text-(--text-secondary)">
        <span>{label}</span>
        <span>{Math.round(progress)}%</span>
      </div>

      {/* The track (background) */}
      <div className="w-full h-4 bg-(--bg-secondary) rounded-full overflow-hidden border border-(--border)">
        {/* The fill (animated width) */}
        <div
          className="h-full bg-(--accent) transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
