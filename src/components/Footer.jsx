import { FaFacebookF, FaInstagram, FaPhone, FaEnvelope } from "react-icons/fa";
import "./Footer.css";
import logo from "../assets/qr.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo */}
        <div className="footer-logo">
          <img src={logo} alt="Infusión" />
        </div>

        {/* Información de contacto */}
        <div className="footer-info">
          <h3>Contacto</h3>
          <p>
            <FaPhone /> 316-320-2148
          </p>
          <p>
            <FaEnvelope /> infusion0220@gmail.com
          </p>
        </div>

        {/* Redes sociales */}
        <div className="footer-social">
          <a href="" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
        </div>
      </div>

      {/* Línea separadora */}
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Infusión Restaurante - Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;
