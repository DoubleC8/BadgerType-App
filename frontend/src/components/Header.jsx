import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import Login from "./Login";

const Header = () => {
  return (
    <header className="flex items-center justify-between font-(family-name:--pixelfy)">
      <div className="h-12 flex gap-3 items-center">
        <Link to="/" className="flex gap-3 items-center">
          <img src="../badger-type-app-icon.png" className="w-10 h-10" />
          <h1 className="text-5xl text-(--accent)">BADGERTYPE</h1>
        </Link>
        <FaStar className="text-(--accent)" />
        <p className="text-2xl">Type Fast. Fear Nothing.</p>
      </div>

      <Login />
    </header>
  );
};

export default Header;
