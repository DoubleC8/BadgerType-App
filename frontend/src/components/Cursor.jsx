import { motion } from "motion/react";

const Cursor = () => {
  return (
    <motion.div
      aria-hidden={true}
      className="inline-block bg-(--accent) w-0.5 h-9 align-middle -ml-0.5 -translate-y-0.5"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "easeInOut" }}
    />
  );
};

export default Cursor;
