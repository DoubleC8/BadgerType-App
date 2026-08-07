import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";

const Header = () => {
  return (
    <header className="flex justify-between items-center font-(family-name:--pixelfy)">
      <div className="flex gap-3 items-center">
        <Link to="/" className="flex gap-3 items-center">
          <img src="../badger-type-app-icon.png" className="w-10 h-10" />
          <h1 className="text-5xl text-(--accent)">BADGERTYPE</h1>
        </Link>
        <FaStar className="text-(--accent)" />
        <p className="text-2xl">Type Fast. Fear Nothing.</p>
      </div>
      <div className="flex gap-3 items-center">
        <Show when="signed-out">
          <SignInButton />
          <SignUpButton />
        </Show>
        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
};

export default Header;
