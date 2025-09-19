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

  const scrollToHome = () => {
    const section = document.getElementById("homeImage");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCarta = () => {
    const section = document.getElementById("cartaRestaurant");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToCine = () => {
    const section = document.getElementById("cine");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToNosotros = () => {
    const section = document.getElementById("nosotros");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToUbication = () => {
    const section = document.getElementById("ubication");
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
        <Link to="/">
          <a onClick={scrollToHome} style={{ cursor: "pointer" }}>
            Inicio
          </a>
        </Link>
        <a onClick={scrollToCarta} style={{ cursor: "pointer" }}>
          Carta
        </a>
        <a onClick={scrollToCine} style={{ cursor: "pointer" }}>
          Cine
        </a>
        <a onClick={scrollToNosotros} style={{ cursor: "pointer" }}>
          Nosotros
        </a>
        <a onClick={scrollToUbication} style={{ cursor: "pointer" }}>
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
