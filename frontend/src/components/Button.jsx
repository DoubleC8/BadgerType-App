import React from "react";

const Button = ({ onAction, title, buttonColor, textColor }) => {
  return (
    <button
      onClick={onAction}
      className={`lg:w-1/5
        w-1/4 h-13 p-3 text-(--${textColor}) bg-(--${buttonColor}) rounded-lg text-xl font-bold hover:cursor-pointer hover:opacity-80 ease-in-out duration-300`}
    >
      {title}
    </button>
  );
};

export default Button;
