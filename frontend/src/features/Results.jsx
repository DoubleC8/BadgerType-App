import { motion } from "motion/react";
import StatBox from "../components/StatBox";

const Results = ({ timeElapsed, wpm, accuracy, errors }) => {
  return (
    <motion.div
      initial={{ x: "-100vw", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 50, damping: 15 }}
      className="w-full h-3/10 flex gap-6"
    >
      <StatBox stat={"WPM"} score={wpm} />
      <StatBox stat={"Accuracy"} score={`${accuracy}%`} errors={errors} />
      <StatBox stat={"Time"} score={`${timeElapsed}s`} />
    </motion.div>
  );
};

export default Results;
