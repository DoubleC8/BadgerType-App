import { useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import Cursor from "./Cursor";

const TypewriterText = ({ title }) => {
  const controls = useAnimation();
  const sentence = title.split("");

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      display: "none",
    },

    visible: {
      opacity: 1,
      display: "inline",
      transition: {
        opacity: { duration: 0.05 },
      },
    },
  };

  useEffect(() => {
    const playAnimation = async () => {
      while (true) {
        await controls.start("visible");
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await controls.start("hidden"); // Instantly snaps all letters back to display: none
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    };

    playAnimation();
  }, [controls]);

  return (
    <div className="flex items-center text-3xl font-bold text-(--text-secondary)">
      <motion.p
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {sentence.map((char, index) => (
          <motion.span key={index} variants={childVariants}>
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </motion.p>
      <Cursor />
    </div>
  );
};

export default TypewriterText;
