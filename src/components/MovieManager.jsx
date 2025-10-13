import { useState, useRef, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./MovieManager.css";

function MovieManager() {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    name: "",
    genre: "",
    description: "",
    dateTime: "",
    image: null,
    imageFile: null,
  });
  const [editingMovie, setEditingMovie] = useState(null);
  const movieImageInputRef = useRef(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setMovies(data);
  };

  const handleInputMovieChange = (e) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleImageMovieChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "infusion2");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dntqcucm0/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error al subir imagen a Cloudinary:", errorData);
        return;
      }

      const data = await res.json();
      if (data.secure_url) {
        setNewMovie((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        console.error("Cloudinary no devolvió una URL segura:", data);
      }
    } catch (error) {
      console.error("Error inesperado al subir imagen:", error);
    }
  };

  const addMovie = async (e) => {
    e.preventDefault();
    if (
      !newMovie.name ||
      !newMovie.genre ||
      !newMovie.description ||
      !newMovie.dateTime ||
      !newMovie.image
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const token = sessionStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/movies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newMovie.name,
        genre: newMovie.genre,
        description: newMovie.description,
        dateTime: newMovie.dateTime,
        image: newMovie.image,
      }),
    });

    if (res.ok) {
      fetchMovies();
      setNewMovie({
        name: "",
        genre: "",
        description: "",
        dateTime: "",
        image: null,
      });
      if (movieImageInputRef.current) movieImageInputRef.current.value = "";
    } else {
      const errorText = await res.text();
      console.error("Error al agregar película:", res.status, errorText);
    }
  };

  const handleEditMovie = (movie) => {
    setNewMovie({
      name: movie.name || "",
      genre: movie.genre || "",
      description: movie.description || "",
      dateTime: movie.dateTime ? movie.dateTime.split(".")[0] : "",
      image: movie.image,
    });
    setEditingMovie(movie);
  };

  const updateMovie = async (e) => {
    e.preventDefault();
    if (!editingMovie) return;

    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newMovie.name);
    formData.append("genre", newMovie.genre);
    formData.append("description", newMovie.description);
    formData.append("dateTime", newMovie.dateTime);

    let imageUrl = newMovie.image;

    if (newMovie.imageFile) {
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", newMovie.imageFile);
      cloudinaryFormData.append("upload_preset", "infusion2");

      try {
        const cloudinaryRes = await fetch(
          "https://api.cloudinary.com/v1_1/dntqcucm0/image/upload",
          {
            method: "POST",
            body: cloudinaryFormData,
          }
        );

        if (!cloudinaryRes.ok) {
          const errorData = await cloudinaryRes.json();
          console.error("Error al subir imagen a Cloudinary:", errorData);
          return;
        }

        const cloudinaryData = await cloudinaryRes.json();
        imageUrl = cloudinaryData.secure_url;
        console.log("Nueva URL de Cloudinary:", imageUrl);
      } catch (error) {
        console.error("Error inesperado al subir imagen:", error);
        return;
      }
    }

    formData.append("image", imageUrl);
    console.log("FormData enviado:", formData);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${editingMovie._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const responseData = await res.json();
      console.log("Respuesta del backend:", responseData);

      if (res.ok) {
        fetchMovies();
        setNewMovie({
          name: "",
          genre: "",
          description: "",
          dateTime: "",
          image: null,
        });
        setEditingMovie(null);
        if (movieImageInputRef.current) movieImageInputRef.current.value = "";
      } else {
        const errorText = await res.text();
        console.error("Error al actualizar película:", res.status, errorText);
      }
    } catch (error) {
      console.error("Error inesperado al actualizar película:", error);
    }
  };

  const deleteMovie = async (movieId) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/movies/${movieId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (res.ok) {
      console.log("Película eliminada exitosamente");
      fetchMovies();
    } else {
      const errorMessage = await res.text();
      console.error("Error al eliminar película:", res.status, errorMessage);
    }
  };

  return (
    <div>
      <h2>Administrar Películas</h2>
      <form onSubmit={editingMovie ? updateMovie : addMovie}>
        <input
          placeholder="Nombre"
          type="text"
          name="name"
          value={newMovie.name}
          onChange={handleInputMovieChange}
        />
        <input
          placeholder="Genero"
          type="text"
          name="genre"
          value={newMovie.genre}
          onChange={handleInputMovieChange}
        />
        <input
          placeholder="Descripción"
          type="text"
          name="description"
          value={newMovie.description}
          onChange={handleInputMovieChange}
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={newMovie.dateTime}
          onChange={handleInputMovieChange}
        />
        <input
          type="file"
          name="image"
          ref={movieImageInputRef}
          onChange={handleImageMovieChange}
        />
        <br />
        <button type="submit">
          {editingMovie ? "Actualizar Película" : "Agregar Película"}
        </button>
        {editingMovie && (
          <button
            type="button"
            onClick={() => {
              setEditingMovie(null);
              setNewMovie({
                name: "",
                genre: "",
                description: "",
                dateTime: "",
                image: null,
              });
              if (movieImageInputRef.current)
                movieImageInputRef.current.value = "";
            }}
          >
            Cancelar
          </button>
        )}
      </form>
      <br />
      <h3>Películas Agregadas</h3>
      <ul className="movie-list">
        {movies.map((movie) => (
          <li key={movie._id} className="movie-card">
            {movie.image && <img src={movie.image} alt={movie.name} />}
            <div className="movie-infor">
              <h4>{movie.name}</h4>
              <p>{movie.genre}</p>
              <p>{movie.description}</p>
              <span className="movie-date">
                {new Date(movie.dateTime).toLocaleString()}
              </span>
            </div>
            <div className="movie-actions">
              <button
                className="icon-btn"
                onClick={() => handleEditMovie(movie)}
              >
                <FaEdit size={15} />
              </button>
              <button
                className="icon-btn delete"
                onClick={() => deleteMovie(movie._id)}
              >
                <FaTrash size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MovieManager;
