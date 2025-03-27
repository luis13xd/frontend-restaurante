import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Admin.css";

function AdminPanel() {
  const navigate = useNavigate();
  const productFormRef = useRef(null);
  const selectedCategoryRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const hasData =
    newProduct.name ||
    newProduct.description ||
    newProduct.price ||
    newProduct.image;
  const imageInputRef = useRef(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) navigate("/login");
    else fetchCategories(token);
  }, [navigate]);

  const fetchCategories = async (token) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data);
  };

  const fetchProducts = async (categoryId) => {
    selectedCategoryRef.current = categoryId;
    if (!selectedCategory) setSelectedCategory(categoryId);
    const token = sessionStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${categoryId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await res.json();
    setProducts(data);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  const handleInputChange = (e, setter) => setter(e.target.value);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("Archivo seleccionado:", file);
    if (!file) {
      console.warn("No se seleccionó ningún archivo.");
      return;
    }
    // Si estamos editando un producto, almacenamos la imagen localmente
    if (editingProduct) {
      setNewProduct((prev) => ({ ...prev, image: file, imageFile: file }));
      console.log("Modo edición: imagen guardada localmente.");
      return;
    }
    // Si estamos creando un producto, subimos la imagen a Cloudinary
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
      console.log("Respuesta de Cloudinary:", data);

      if (data.secure_url) {
        setNewProduct((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        console.error("Cloudinary no devolvió una URL segura:", data);
      }
    } catch (error) {
      console.error("Error inesperado al subir imagen:", error);
    }
  };

  const addCategory = async () => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newCategory }),
    });
    if (res.ok) {
      fetchCategories(token);
      setNewCategory("");
    }
  };

  const updateCategory = async (categoryId) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editedCategoryName }),
      }
    );
    if (res.ok) {
      fetchCategories(token);
      setEditingCategory(null); // Salir del modo edición
    }
  };

  const deleteCategory = async (categoryId) => {
    const token = sessionStorage.getItem("token");
    await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCategories(token);
    setSelectedCategory(null);
    setProducts([]);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (
      !newProduct.name ||
      !newProduct.image ||
      !newProduct.price ||
      !newProduct.description
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const token = sessionStorage.getItem("token");

    console.log("Datos de newProduct:", newProduct); // Log del newProduct
    const categoryId = selectedCategoryRef.current || selectedCategory;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newProduct.name,
        description: newProduct.description,
        price: newProduct.price,
        image: newProduct.image,
        categoryId: categoryId,
      }),
    });
    if (res.ok) {
      fetchProducts(categoryId);
      setNewProduct({ name: "", description: "", price: "", image: null });
      if (imageInputRef.current) {
        imageInputRef.current.value = ""; // Limpiar el valor del input de imagen
      }
    } else {
      const errorText = await res.text();
      console.error("Error en la solicitud:", res.status, errorText);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image, // Mantener la imagen original
    });
    if (!selectedCategory) {
      setSelectedCategory(product.categoryId);
    }
    setTimeout(() => {
      if (productFormRef.current) {
        productFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  function toggleProductActive(productId) {
    fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}/toggle-active`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }
    )
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === productId ? { ...p, activo: data.activo } : p
          )
        );
      })
      .catch((err) => console.error("Error al cambiar estado:", err.message));
  }

  const updateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);

    if (newProduct.imageFile) {
      formData.append("image", newProduct.imageFile); // Adjuntar imagen si hay una nueva
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }, // No usar "Content-Type": "application/json" con FormData
          body: formData,
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((p) =>
            p._id === responseData._id ? responseData : p
          )
        );
        setEditingProduct(null);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          image: null,
          imageFile: null,
        });

        if (productFormRef.current) {
          productFormRef.current.reset();
        }

        if (imageInputRef.current) {
          imageInputRef.current.value = ""; // Limpiar input de imagen
        }
      } else {
        console.error(
          "Error al actualizar producto:",
          res.status,
          responseData
        );
      }
    } catch (error) {
      console.error("Error inesperado al actualizar producto:", error);
    }
  };

  const deleteProduct = async (productId) => {
    const token = sessionStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/products/${productId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (res.ok) {
      console.log("Producto eliminado exitosamente");
      fetchProducts(selectedCategory);
    } else {
      const errorMessage = await res.text();
      console.error("Error al eliminar producto:", res.status, errorMessage);
    }
  };

  //seccion de peliculas peiculas
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
        setNewMovie((prev) => ({ ...prev, image: data.secure_url })); // Guardar la URL de Cloudinary
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
      image: movie.image, // Asegúrate de que la URL de la imagen esté aquí
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
  
    let imageUrl = newMovie.image; // Usar la imagen existente por defecto
  
    if (newMovie.imageFile) {
      // Subir la nueva imagen a Cloudinary
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
        imageUrl = cloudinaryData.secure_url; // Obtener la nueva URL de la imagen
        console.log("Nueva URL de Cloudinary:", imageUrl); // Log para depuración
      } catch (error) {
        console.error("Error inesperado al subir imagen:", error);
        return;
      }
    }
  
    formData.append("image", imageUrl); // Agregar la URL de la imagen al formData
    console.log("FormData enviado:", formData); // Log para depuración
  
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/movies/${editingMovie._id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData, // Enviar FormData
        }
      );
  
      const responseData = await res.json(); // Obtener la respuesta como JSON
      console.log("Respuesta del backend:", responseData); // Log para depuración
  
      if (res.ok) {
        fetchMovies();
        setNewMovie({ name: "", genre: "", description: "", dateTime: "", image: null });
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
    const res = await fetch(`${import.meta.env.VITE_API_URL}/movies/${movieId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  
    if (res.ok) {
      console.log("Película eliminada exitosamente");
      fetchMovies();
    } else {
      const errorMessage = await res.text();
      console.error("Error al eliminar película:", res.status, errorMessage);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-menu">
        <h1>Administrador</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Salir
        </button>
      </div>
      <h2>Categorías</h2>
      <input
        type="text"
        placeholder="Nueva categoría"
        value={newCategory}
        onChange={(e) => handleInputChange(e, setNewCategory)}
      />
      <button onClick={addCategory}>Agregar</button>
      <div className="categories-menu">
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              {editingCategory === category._id ? (
                <>
                  <input
                    type="text"
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                  />
                  <button onClick={() => updateCategory(category._id)}>
                    Guardar
                  </button>
                  <button onClick={() => setEditingCategory(null)}>
                    Cancelar
                  </button>
                </>
              ) : (
                <>
                  <span onClick={() => fetchProducts(category._id)}>
                    {category.name}
                  </span>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setEditingCategory(category._id);
                      setEditedCategoryName(category.name);
                    }}
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteCategory(category._id)}
                  >
                    <FaTrash size={15} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {selectedCategory && (
        <div className="formulario">
          <h2>Productos</h2>
          <div className="formulario-inputs">
            <form
              ref={productFormRef}
              onSubmit={editingProduct ? updateProduct : addProduct}
              className="formulario-contenedor"
            >
              <input
                type="text"
                placeholder="Nombre"
                className="input"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Descripción"
                className="input"
                value={newProduct.description}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, description: e.target.value })
                }
              />
              <input
                type="number"
                placeholder="Precio"
                value={newProduct.price}
                className="input"
                onChange={(e) =>
                  setNewProduct({ ...newProduct, price: e.target.value })
                }
              />
              <input
                type="file"
                onChange={handleImageChange}
                className="input"
                ref={imageInputRef}
              />
              <button type="submit" className="boton-principal">
                {editingProduct ? "Actualizar Producto" : "Agregar Producto"}
              </button>
              {hasData && (
                <button
                  type="button"
                  className="boton-cancelar"
                  onClick={() => {
                    setNewProduct({
                      name: "",
                      description: "",
                      price: "",
                      image: null,
                    });
                    setEditingProduct(null);
                    productFormRef.current.reset();
                  }}
                >
                  Cancelar
                </button>
              )}
            </form>
          </div>

          <ul>
            {products.map((product) => (
              <li key={product._id}>
                <img
                  className="product-image"
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100px", height: "100px" }}
                />

                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>
                  <strong>Precio:</strong> ${product.price}
                </p>

                <div>
                  <button
                    onClick={() => toggleProductActive(product._id)}
                    style={{
                      backgroundColor: product.activo ? "green" : "red",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    {product.activo ? "Activo" : "Inactivo"}
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => handleEditProduct(product)}
                  >
                    <FaEdit size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => deleteProduct(product._id)}
                  >
                    <FaTrash size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

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
          <input type="file" name="image" onChange={handleImageMovieChange} />
          <button type="submit">Guardar</button>
        </form>

        <h3>Películas Agregadas</h3>
        <ul>
          {movies.map((movie) => (
            <li key={movie._id}>
              {movie.image && (
                <img
                  src={movie.image} // Usar la URL de Cloudinary directamente
                  alt={movie.name}
                  width="100"
                />
              )}
              <h4>{movie.name}</h4>
              <p>{movie.genre}</p>
              <p>{movie.description}</p>
              <p>{new Date(movie.dateTime).toLocaleString()}</p>
              <button
                className="icon-btn"
                onClick={() => handleEditMovie(movie)}
              >
                <FaEdit size={15} />
              </button>
              <button
                className="icon-btn"
                onClick={() => deleteMovie(movie._id)}
              >
                <FaTrash size={15} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminPanel;
