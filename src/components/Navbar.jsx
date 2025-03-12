import { Link } from "react-router-dom";
import { useState } from "react";
import { FaShoppingCart, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

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

      <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
          <FaShoppingCart />
          {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
        </div>

      <div className="auth-links">
        <Link to="/login">
          <FaSignInAlt />
        </Link>
        <Link to="/register">
          <FaUserPlus />
        </Link>
      </div>
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </nav>
  );
}

export default Navbar;
