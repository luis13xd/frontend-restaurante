import { useState, useEffect } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { motion } from "framer-motion";
import nosotrosImg1 from "../assets/nosotrosImg1.jpeg";
import nosotrosImg2 from "../assets/nosotrosImg2.jpeg";
import nosotrosImg3 from "../assets/nosotrosImg3.jpeg";
import Footer from "../components/Footer";

function Home() {
  const { cart, addToCart, removeFromCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Obtener categorías
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/categories`)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]._id); // Selecciona la primera categoría por defecto
        }
      })
      .catch((err) => console.error("Error al obtener categorías:", err));
  }, []);

  // Obtener productos de la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      fetch(`${import.meta.env.VITE_API_URL}/public/products?categoryId=${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => setProducts(data))
        .catch((err) => console.error("Error al obtener productos:", err));
    }
  }, [selectedCategory]);

  const [movies, setMovies] = useState([]);
  // Obtener películas
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/movies/public`) // ✅ Esto es correcto
      .then((res) => res.json())
      .then((data) => setMovies(data))
      .catch((err) => console.error("Error al obtener películas:", err));
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    fade: true,
  };

  return (
    <div>
      <br />
      <h2>Carta Infusión</h2>

      {/* Menú de categorías */}
      <div className="categories-menu">
        {categories.map((category) => (
          <button
            key={category._id}
            className={category._id === selectedCategory ? "active" : ""}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Productos de la categoría seleccionada */}
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => {
            const cartItem = cart.find((item) => item._id === product._id);
            return (
              <div key={product._id} className="product-card">
                <div className="product-info">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/photos/${product.image}`} 
                    alt={product.name}
                    className="product-image"
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>${product.price}</strong></p>
                  
                  {/* Controles de carrito */}
                  <div className="cart-controls">
                    {cartItem?.quantity > 0 && (
                      <>
                        <button className="decrease-btn" onClick={() => removeFromCart(product._id)}>
                          <FaMinus />
                        </button>
                        <span className="quantity">{cartItem.quantity}</span>
                      </>
                    )}
                    <button className="increase-btn" onClick={() => addToCart(product)}>
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

      {/* Sección de películas */}
      <h2 className="title">Cartelera de Cine</h2>
      <div className="slider-container">
        <Slider {...sliderSettings}>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div key={movie._id} className="movie-slide">
                <img
                  src={`${import.meta.env.VITE_API_URL}/photos/${movie.image}`}
                  alt={movie.name}
                  className="movie-image"
                />
                <div className="movie-info">
                  <h3>{movie.name}</h3>
                  <p>
                    <strong>Género:</strong> {movie.genre}
                  </p>
                  <p>{movie.description}</p>
                  <p>
                    <strong>Fecha y Hora:</strong>{" "}
                    {new Date(movie.dateTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Lugar:</strong>{" "}
                    Restaurante Infusión
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p>No hay películas disponibles.</p>
          )}
        </Slider>
      </div>

      {/* Sección Nosotros */}
      <section id="nosotros" className="nosotros-section">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Sobre Nosotros
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          En Infusión Mística, fusionamos ingredientes naturales con la esencia
          del bienestar. Cada taza es una experiencia sensorial única.
        </motion.p>

        <div className="nosotros-grid">
          <motion.div
            className="nosotros-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={nosotrosImg1} alt="Historia" />
            <h3>Nuestra Historia</h3>
            <p>
              Desde nuestros inicios, nos dedicamos a seleccionar las mejores
              hierbas y especias.
            </p>
          </motion.div>

          <motion.div
            className="nosotros-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={nosotrosImg2} alt="Misión" />
            <h3>Nuestra Misión</h3>
            <p>Brindar infusiones únicas que fortalezcan cuerpo y alma.</p>
          </motion.div>

          <motion.div
            className="nosotros-card"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <img src={nosotrosImg3} alt="Compromiso" />
            <h3>Compromiso</h3>
            <p>
              100% ingredientes naturales, cultivados con respeto a la
              naturaleza.
            </p>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
