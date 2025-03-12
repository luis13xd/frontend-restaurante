import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const scrollToNosotros = () => {
    const section = document.getElementById("nosotros");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="nav-links">
        <Link to="/">Inicio</Link>
        <a onClick={scrollToNosotros} style={{ cursor: "pointer" }}>Nosotros</a>
      </div>

      <div className="auth-links">
        <Link to="/login">
          <FaSignInAlt />
        </Link>
        <Link to="/register">
          <FaUserPlus />
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
