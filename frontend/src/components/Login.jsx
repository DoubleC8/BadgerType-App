import { Show, SignInButton, UserButton } from "@clerk/react";
import AuthSync from "./AuthSync";
import LoginButton from "./LoginButton";
import { IoStatsChart } from "react-icons/io5";

const Login = () => {
  return (
    <div>
      <Show when="signed-out">
        <LoginButton />
      </Show>
      <Show when="signed-in">
        <AuthSync />
        <UserButton
          appearance={{
            variables: {
              colorNeutral: "var(--text-secondary)",
              colorForeground: "var(--text)",
              colorBackground: "var(--bg-secondary)",
              fontFamily: "var(--geist)",
              fontSize: "md",
              borderRadius: "0.5rem",
            },
          }}
          userProfileProps={{
            appearance: {
              variables: {
                colorPrimary: "var(--text-secondary)",
                colorNeutral: "var(--text-secondary)",
                colorForeground: "var(--text)",
                colorBackground: "var(--bg-secondary)",
                fontFamily: "var(--geist)",
                fontSize: "lg",
                borderRadius: "0.5rem",
              },
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              label="My Stats"
              labelIcon={<IoStatsChart />}
              href="/profile"
            />
            <UserButton.Action label="manageAccount" />
            <UserButton.Action label="signOut" />
          </UserButton.MenuItems>
        </UserButton>
      </Show>
    </div>
  );
};

export default Login;
