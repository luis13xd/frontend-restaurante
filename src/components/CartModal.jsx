import { useCart } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types"; 
import "./CartModal.css";

function CartModal({ onClose }) {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (cart.length === 0) return;

    const mensaje = cart.map(
      (item) => `${item.quantity} ${item.name} - $${item.price * item.quantity}`
    ).join("\n");

    const mensajeCompleto = `Hola, quiero hacer un pedido:\n\n${mensaje}\n\nTotal: $${total}`;
    const whatsappUrl = `https://wa.me/+573138687180?text=${encodeURIComponent(mensajeCompleto)}`;

    window.open(whatsappUrl, "_blank"); 
  };

  return (
    <div className="modalcarrito-overlay">
      <div className="modalcarrito-container">
        <button className="modalcarrito-btnclose" onClick={onClose}>
          <FaTimes />
        </button>
        <h3 className="modalcarrito-heading">Carrito de Compras</h3>

        {cart.length === 0 ? (
          <p className="modalcarrito-emptymsg">El carrito está vacío.</p>
        ) : (
          <>
            <div className="modalcarrito-listbox">
              {cart.map((item) => (
                <div key={item._id} className="modalcarrito-card">
                  <img src={item.image} alt={item.name} className="modalcarrito-cardimg" />
                  <div className="modalcarrito-carddata">
                    <h4 className="modalcarrito-cardtitle">{item.name}</h4>
                    <p className="modalcarrito-cardprice">${item.price} x {item.quantity}</p>
                    <button 
                      className="modalcarrito-cardremove" 
                      onClick={() => removeFromCart(item._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="modalcarrito-totalbox">
              <h4 className="modalcarrito-totaltext">Total: ${total}</h4>
            </div>

            <button className="modalcarrito-whatsappbtn" onClick={handleOrder}>
              Pedir por WhatsApp
            </button>
          </>
        )}
      </div>
    </div>
  );
}

CartModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default CartModal;