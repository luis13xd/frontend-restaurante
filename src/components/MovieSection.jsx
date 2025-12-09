import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./MovieSection.css";

function MovieSection() {
  const [movies, setMovies] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);

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

  const sliderSettings = {
    dots: true,
    infinite: movies.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: movies.length > 1,
    autoplaySpeed: 4000,
    fade: true,
    adaptiveHeight: false,
    arrows: true,
  };

  return (
    <div className="movie-section" id="cine">
      <h2>Cartelera de Cine</h2>
      
      <div className="slider-container">
        {moviesLoading ? (
          <div className="loading-message">
            <p>Cargando cartelera...</p>
          </div>
        ) : movies.length > 0 ? (
          <Slider {...sliderSettings}>
            {movies.map((movie) => (
              <div key={movie._id} className="movie-slide">
                <div className="movie-image-container">
                  <img
                    src={movie.image}
                    alt={movie.name}
                    className="movie-image"
                    onError={(e) => {
                      e.target.src = "/placeholder-movie.jpg";
                    }}
                  />
                </div>
                
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
          <div className="no-movies">
            <p>No hay películas disponibles en este momento.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MovieSection;