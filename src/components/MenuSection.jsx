import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";

function MenuSection() {
  const { cart, addToCart, removeFromCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/categories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Categorías obtenidas:", data);
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]._id);
        }
        setCategoriesLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener categorías:", err);
        setCategoriesLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setProductsLoading(true);
      let url = `${
        import.meta.env.VITE_API_URL
      }/public/products?categoryId=${selectedCategory}`;
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Productos obtenidos:", data);
          setProducts(data);
          setProductsLoading(false);
        })
        .catch((err) => {
          console.error("Error al obtener productos:", err);
          setProductsLoading(false);
        });
    }
  }, [selectedCategory]);

  return (
    <div className="menu-section" id="cartaRestaurant">
      <br />
      <br />
      <br />

      <h2>Carta Infusión</h2>

      {/* Menú de categorías */}
      <div className="categories-menu">
        {categoriesLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              fontSize: "16px",
              color: "#666",
            }}
          >
            <p>Cargando menú...</p>
          </div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <button
              key={category._id}
              className={category._id === selectedCategory ? "active" : ""}
              onClick={() => setSelectedCategory(category._id)}
            >
              {category.name}
            </button>
          ))
        ) : (
          <p>No hay categorías disponibles.</p>
        )}
      </div>

      {/* Productos de la categoría seleccionada */}
      <div className="products-container">
        {productsLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
              color: "#666",
            }}
          >
            <p>Cargando productos...</p>
          </div>
        ) : products.length > 0 ? (
          products.map((product) => {
            const cartItem = cart.find((item) => item._id === product._id);
            return (
              <div key={product._id} className="product-card">
                <div className="product-info">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-product.jpg";
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>
                    <strong>${product.price}</strong>
                  </p>

                  {/* Controles de carrito */}
                  <div className="cart-controls">
                    {cartItem?.quantity > 0 && (
                      <>
                        <button
                          className="decrease-btn"
                          onClick={() => removeFromCart(product._id)}
                          aria-label={`Reducir cantidad de ${product.name}`}
                        >
                          <FaMinus />
                        </button>
                        <span className="quantity">{cartItem.quantity}</span>
                      </>
                    )}
                    <button
                      className="increase-btn"
                      onClick={() => addToCart(product)}
                      aria-label={`Agregar ${product.name} al carrito`}
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No hay productos disponibles en esta categoría.</p>
        )}
      </div>
      <br /><br />
    </div>
  );
}

export default MenuSection;
