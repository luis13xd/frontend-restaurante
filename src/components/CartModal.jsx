import { useCart } from "../context/CartContext";
import { FaTimes } from "react-icons/fa";
import PropTypes from "prop-types"; 
import "./CartModal.css";

function CartModal({ onClose }) {
  const { cart, removeFromCart } = useCart();

  // Calcular el total del pedido
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Generar el mensaje para WhatsApp
  const handleOrder = () => {
    if (cart.length === 0) return;

    const mensaje = cart.map(
      (item) => `${item.quantity} ${item.name} - $${item.price * item.quantity}`
    ).join("\n");

    const mensajeCompleto = `Hola, quiero hacer un pedido:\n\n${mensaje}\n\nTotal: $${total}`;
    const whatsappUrl = `https://wa.me/+573138687180?text=${encodeURIComponent(mensajeCompleto)}`;

    window.open(whatsappUrl, "_blank"); // Abrir WhatsApp en nueva pestaña
  };

  return (
    <div className="cart-modal">
      <div className="cart-content">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
        <h3>Carrito de Compras</h3>

        {cart.length === 0 ? (
          <p>El carrito está vacío.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>${item.price} x {item.quantity}</p>
                  <button onClick={() => removeFromCart(item._id)}>Eliminar</button>
                </div>
              </div>
            ))}

            {/* Total del pedido */}
            <div className="cart-total">
              <h4>Total: ${total}</h4>
            </div>

            {/* Botón de pedir */}
            <button className="order-btn" onClick={handleOrder}>
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
