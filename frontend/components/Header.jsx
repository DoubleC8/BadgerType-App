import { FaStar } from "react-icons/fa";

const Header = () => {
  return (
    <header className="flex gap-3 items-center">
      <img src="../public/badger-type-app-icon.png" className="w-10 h-10" />
      <h1 className="text-5xl text-(--accent)">BADGERTYPE</h1>
      <FaStar className="text-(--accent)" />
      <p className="text-2xl">Type Fast. Fear Nothing.</p>
    </header>
  );
};

export default Header;
