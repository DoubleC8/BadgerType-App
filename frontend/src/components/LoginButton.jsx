import { SignInButton } from "@clerk/react";
import React from "react";

const LoginButton = () => {
  return (
    <SignInButton>
      <button className="w-fit h-10 px-6 rounded-lg bg-(--bg-secondary) text-(--text-secondary) text-lg font-(family-name:--geist) font-bold hover:cursor-pointer hover:bg-(--accent) hover:text-(--text) ease-in-out duration-300">
        Sign In
      </button>
    </SignInButton>
  );
};

export default LoginButton;
