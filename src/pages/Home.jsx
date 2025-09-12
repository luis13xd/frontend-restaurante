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
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener categorías
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/public/categories`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Categorías obtenidas:", data); // Debug
        setCategories(data);
        if (data.length > 0) {
          setSelectedCategory(data[0]._id); // Establecer la primera categoría al cargar
        }
      })
      .catch((err) => {
        console.error("Error al obtener categorías:", err);
        setError("Error al cargar categorías");
      });
  }, []);

  // Obtener productos de la categoría seleccionada
  useEffect(() => {
    if (selectedCategory) {
      let url = `${import.meta.env.VITE_API_URL}/public/products?categoryId=${selectedCategory}`;
      
      console.log("Obteniendo productos de URL:", url); // Debug
      
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("Productos obtenidos:", data); // Debug
          setProducts(data);
        })
        .catch((err) => {
          console.error("Error al obtener productos:", err);
          setError("Error al cargar productos");
        });
    }
  }, [selectedCategory]);

  // Obtener películas - CORREGIDO
  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/public/movies`; // ✅ URL corregida
    console.log("Obteniendo películas de URL:", url); // Debug
    
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Películas obtenidas:", data); // Debug
        setMovies(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener películas:", err);
        setError("Error al cargar películas");
        setLoading(false);
      });
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
    adaptiveHeight: true, // Añadido para mejor responsive
  };

  // Mostrar loading mientras se cargan los datos
  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando contenido...</p>
      </div>
    );
  }

  // Mostrar error si algo falla
  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <br />
      <h2>Carta Infusión 1.0</h2>

      {/* Menú de categorías */}
      <div className="categories-menu">
        {categories.length > 0 ? (
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
        {products.length > 0 ? (
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
                      e.target.src = '/placeholder-product.jpg'; // Imagen por defecto
                    }}
                  />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p><strong>${product.price}</strong></p>
                  
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
        ) : selectedCategory ? (
          <p>No hay productos disponibles en esta categoría.</p>
        ) : (
          <p>Selecciona una categoría para ver los productos.</p>
        )}
      </div>

      {/* Sección de películas */}
      <h2 className="title">Cartelera de Cine</h2>
      <div className="slider-container">
        {movies.length > 0 ? (
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie._id} className="movie-slide">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="movie-image"
                  onError={(e) => {
                    e.target.src = '/placeholder-movie.jpg'; // Imagen por defecto
                  }}
                />
                <div className="movie-info">
                  <h3>{movie.name}</h3>
                  <p>
                    <strong>Género:</strong> {movie.genre}
                  </p>
                  <p>{movie.description}</p>
                  <p>
                    <strong>Fecha y Hora:</strong>{" "}
                    {new Date(movie.dateTime).toLocaleString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  <p>
                    <strong>Lugar:</strong>{" "}
                    Restaurante Infusión
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="no-movies">
            <p>No hay películas disponibles en este momento.</p>
          </div>
        )}
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