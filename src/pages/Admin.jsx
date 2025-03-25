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
    selectedCategoryRef.current = categoryId; // Guardar referencia de la categoría
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
        // Manejar errores de Cloudinary
        const errorData = await res.json();
        console.error("Error al subir imagen a Cloudinary:", errorData);
        return;
      }

      const data = await res.json();
      console.log("Respuesta de Cloudinary:", data); // <-- Revisa si llega la URL

      if (data.secure_url) {
        setNewProduct((prev) => ({ ...prev, image: data.secure_url }));
      } else {
        console.error("Cloudinary no devolvió una URL segura:", data);
      }
    } catch (error) {
      // Manejar errores de red o errores inesperados
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

    console.log("Datos del producto antes de actualizar:", newProduct);

    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);

    // Solo agregar la imagen si se seleccionó una nueva
    if (newProduct.image && newProduct.image !== editingProduct.image) {
        formData.append("image", newProduct.image);
    }

    try {
        const res = await fetch(
            `${import.meta.env.VITE_API_URL}/products/${editingProduct._id}`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            }
        );

        const responseData = await res.json();
        console.log("Respuesta del servidor:", responseData);

        if (res.ok) {
            setProducts((prevProducts) =>
                prevProducts.map((p) =>
                    p._id === responseData._id ? responseData : p
                )
            );
            setEditingProduct(null);
            setNewProduct({ name: "", description: "", price: "", image: null });
            if (productFormRef.current) {
                productFormRef.current.reset();
            }
        } else {
            console.error("Error al actualizar producto:", res.status, responseData);
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
    </div>
  );
}

export default AdminPanel;
