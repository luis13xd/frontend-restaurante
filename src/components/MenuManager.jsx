import { useRef } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useCategories,  } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import { useImageUpload } from "../hooks/useImageUpload";
import "./MenuManager.css";

function MenuManager() {
  const productFormRef = useRef(null);
  const imageInputRef = useRef(null);

  // Custom hooks
  const {
    categories,
    newCategory,
    setNewCategory,
    editingCategory,
    setEditingCategory,
    editedCategoryName,
    setEditedCategoryName,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const {
    selectedCategory,
    setSelectedCategory,
    products,
    newProduct,
    setNewProduct,
    editingProduct,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    startEditingProduct,
    cancelEditing,
  } = useProducts();

  const { uploadImage, isUploading } = useImageUpload();

  // Handlers
  const handleInputChange = (e, setter) => setter(e.target.value);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    const result = await uploadImage(file, !!editingProduct);
    
    if (result) {
      if (editingProduct) {
        setNewProduct((prev) => ({ ...prev, image: file, imageFile: file }));
      } else if (result.url) {
        setNewProduct((prev) => ({ ...prev, image: result.url }));
      }
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const success = await addProduct();
    if (success && imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const success = await updateProduct();
    if (success) {
      if (productFormRef.current) {
        productFormRef.current.reset();
      }
      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }
    }
  };

  const handleEditProduct = (product) => {
    startEditingProduct(product);
    setTimeout(() => {
      if (productFormRef.current) {
        productFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleCancelForm = () => {
    cancelEditing();
    if (productFormRef.current) {
      productFormRef.current.reset();
    }
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    await deleteCategory(categoryId);
    setSelectedCategory(null);
  };

  const hasData =
    newProduct.name ||
    newProduct.description ||
    newProduct.price ||
    newProduct.image;

  return (
    <div>
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
                    onClick={() => handleDeleteCategory(category._id)}
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
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
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
                disabled={isUploading}
              />
              <button 
                type="submit" 
                className="boton-principal"
                disabled={isUploading}
              >
                {isUploading 
                  ? "Subiendo imagen..." 
                  : editingProduct 
                    ? "Actualizar Producto" 
                    : "Agregar Producto"}
              </button>
              {hasData && (
                <button
                  type="button"
                  className="boton-cancelar"
                  onClick={handleCancelForm}
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
                />
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>
                  <strong>Precio:</strong>{" "}
                  {product.price.toLocaleString("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  })}
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

export default MenuManager;