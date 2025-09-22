import { Link } from "react-router-dom";
import { useState } from "react";
// import { FaShoppingCart, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

const [active, setActive] = useState("inicio");

  const handleClick = (sectionId, sectionName) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setActive(sectionName);
    }
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="Logo" />
      </Link>

      <div className="nav-links">
        <a
          onClick={() => handleClick("homeImage", "inicio")}
          className={active === "inicio" ? "active" : ""}
        >
          Inicio
        </a>
        <a
          onClick={() => handleClick("cartaRestaurant", "carta")}
          className={active === "carta" ? "active" : ""}
        >
          Carta
        </a>
        <a
          onClick={() => handleClick("cine", "cine")}
          className={active === "cine" ? "active" : ""}
        >
          Cine
        </a>
        <a
          onClick={() => handleClick("nosotros", "nosotros")}
          className={active === "nosotros" ? "active" : ""}
        >
          Nosotros
        </a>
        <a
          onClick={() => handleClick("ubication", "ubicacion")}
          className={active === "ubicacion" ? "active" : ""}
        >
          Ubicación
        </a>
      </div>

      <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
        <FaShoppingCart />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {/* <div className="auth-links">
        <Link to="/login">
          <FaSignInAlt />
        </Link>
        <Link to="/register">
          <FaUserPlus />
        </Link>
      </div> */}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </nav>
  );
}

export default Navbar;
