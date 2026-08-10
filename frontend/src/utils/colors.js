const getAccuracyColor = (accuracy) => {
  const acc = parseFloat(accuracy);
  switch (true) {
    case acc >= 75:
      return "(--green)";
    case acc > 50:
      return "(--yellow)";
    case acc < 50:
      return "(--red)";
    default:
      return "(--text-secondary)";
  }

  return color;
};

export default getAccuracyColor;
