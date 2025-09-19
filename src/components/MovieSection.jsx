import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function MovieSection() {
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

  // Obtener películas
  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/public/movies`;
    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Películas obtenidas:", data);
        setMovies(data);
        setMoviesLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener películas:", err);
        setMoviesLoading(false);
      });
  }, []);

  // Configuración del slider
  const sliderSettings = {
    dots: true,
    infinite: movies.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: movies.length > 1,
    autoplaySpeed: 3000,
    fade: true,
    adaptiveHeight: true,
  };

  return (
    <div className="movie-section" id="cine">
      <br />
      <br /> 
      <br />

      <h2>Cartelera de Cine</h2>
      {/* Slider de películas */}
      <div className="slider-container">
        {moviesLoading ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
              color: "#666",
            }}
          >
            <p>Cargando cartelera...</p>
          </div>
        ) : movies.length > 0 ? (
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie._id} className="movie-slide">
                <img
                  src={movie.image}
                  alt={movie.name}
                  className="movie-image"
                  onError={(e) => {
                    e.target.src = "/placeholder-movie.jpg";
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
                    {new Date(movie.dateTime).toLocaleString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p>
                    <strong>Lugar:</strong> Restaurante Infusión
                  </p>
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div
            className="no-movies"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <p>No hay películas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieSection;
