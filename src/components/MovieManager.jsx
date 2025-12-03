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
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  const handleImageMovieChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setNewMovie((prev) => ({ ...prev, image: null }));
    }
  };

  const uploadImageToCloudinary = async (file) => {
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
        throw new Error("Error al subir imagen");
      }

      const data = await res.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        console.error("Cloudinary no devolvió una URL segura:", data);
        throw new Error("URL de imagen no válida");
      }
    } catch (error) {
      console.error("Error inesperado al subir imagen:", error);
      throw error;
    }
  };

  const addMovie = async (e) => {
    e.preventDefault();
    
    if (
      !newMovie.name ||
      !newMovie.genre ||
      !newMovie.description ||
      !newMovie.dateTime
    ) {
      alert("Por favor, completa todos los campos de texto.");
      return;
    }

    if (!selectedFile && !newMovie.image) {
      alert("Por favor, selecciona una imagen.");
      return;
    }

    try {
      setIsUploadingImage(true);
      
      let imageUrl = newMovie.image;
      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile);
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
          image: imageUrl,
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
        setSelectedFile(null);
        if (movieImageInputRef.current) movieImageInputRef.current.value = "";
        alert("Película agregada exitosamente");
      } else {
        const errorText = await res.text();
        console.error("Error al agregar película:", res.status, errorText);
        alert("Error al agregar la película");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar la solicitud");
    } finally {
      setIsUploadingImage(false);
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
    setSelectedFile(null);
    setEditingMovie(movie);
  };

  const updateMovie = async (e) => {
    e.preventDefault();
    if (!editingMovie) return;

    if (
      !newMovie.name ||
      !newMovie.genre ||
      !newMovie.description ||
      !newMovie.dateTime
    ) {
      alert("Por favor, completa todos los campos de texto.");
      return;
    }

    try {
      setIsUploadingImage(true);

      let imageUrl = newMovie.image;

      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile);
      }

      const token = sessionStorage.getItem("token");
      const formData = new FormData();
      formData.append("name", newMovie.name);
      formData.append("genre", newMovie.genre);
      formData.append("description", newMovie.description);
      formData.append("dateTime", newMovie.dateTime);
      formData.append("image", imageUrl);

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${editingMovie._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        fetchMovies();
        setNewMovie({
          name: "",
          genre: "",
          description: "",
          dateTime: "",
          image: null,
        });
        setSelectedFile(null);
        setEditingMovie(null);
        if (movieImageInputRef.current) movieImageInputRef.current.value = "";
        alert("Película actualizada exitosamente");
      } else {
        const errorText = await res.text();
        console.error("Error al actualizar película:", res.status, errorText);
        alert("Error al actualizar la película");
      }
    } catch (error) {
      console.error("Error inesperado al actualizar película:", error);
      alert("Error al procesar la solicitud");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const deleteMovie = async (movieId) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta película?")) {
      return;
    }

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
      alert("Película eliminada exitosamente");
    } else {
      const errorMessage = await res.text();
      console.error("Error al eliminar película:", res.status, errorMessage);
      alert("Error al eliminar la película");
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
          disabled={isUploadingImage}
        />
        <input
          placeholder="Genero"
          type="text"
          name="genre"
          value={newMovie.genre}
          onChange={handleInputMovieChange}
          disabled={isUploadingImage}
        />
        <input
          placeholder="Descripción"
          type="text"
          name="description"
          value={newMovie.description}
          onChange={handleInputMovieChange}
          disabled={isUploadingImage}
        />
        <input
          type="datetime-local"
          name="dateTime"
          value={newMovie.dateTime}
          onChange={handleInputMovieChange}
          disabled={isUploadingImage}
        />
        <input
          type="file"
          name="image"
          ref={movieImageInputRef}
          onChange={handleImageMovieChange}
          disabled={isUploadingImage}
          accept="image/*"
        />
        <div className="form-buttons">
          <button type="submit" disabled={isUploadingImage}>
            {isUploadingImage
              ? "Subiendo imagen..."
              : editingMovie
              ? "Actualizar Película"
              : "Agregar Película"}
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
                setSelectedFile(null);
                if (movieImageInputRef.current)
                  movieImageInputRef.current.value = "";
              }}
              disabled={isUploadingImage}
            >
              Cancelar
            </button>
          )}
        </div>
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