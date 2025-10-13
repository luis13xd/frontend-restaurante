import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import CartModal from "./CartModal";
import "./Navbar.css";
import logo from "../assets/logo.jpeg";

function Navbar() {
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [active, setActive] = useState("inicio");
  const location = useLocation(); // 👈 Hook de React

  useEffect(() => {
    const sections = document.querySelectorAll("section, div[id]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  if (
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin")
  ) {
    return null;
  }

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
          className={active === "homeImage" ? "active" : ""}
        >
          Inicio
        </a>
        <a
          onClick={() => handleClick("cartaRestaurant", "carta")}
          className={active === "cartaRestaurant" ? "active" : ""}
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
          className={active === "ubication" ? "active" : ""}
        >
          Ubicación
        </a>
      </div>

      <div className="cart-icon" onClick={() => setIsCartOpen(true)}>
        <FaShoppingCart />
        {cart.length > 0 && <span className="cart-count">{cart.length}</span>}
      </div>

      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </nav>
  );
}

export default Navbar;
