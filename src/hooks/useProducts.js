import { useState, useRef } from "react";

export function useProducts() {
  const selectedCategoryRef = useRef(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async (categoryId) => {
    selectedCategoryRef.current = categoryId;
    if (!selectedCategory) setSelectedCategory(categoryId);
    
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  };

  const addProduct = async () => {
    if (
      !newProduct.name ||
      !newProduct.image ||
      !newProduct.price ||
      !newProduct.description
    ) {
      alert("Por favor, completa todos los campos.");
      return false;
    }

    const token = sessionStorage.getItem("token");
    const categoryId = selectedCategoryRef.current || selectedCategory;

    try {
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
        await fetchProducts(categoryId);
        setNewProduct({ name: "", description: "", price: "", image: null });
        return true;
      } else {
        const errorText = await res.text();
        console.error("Error en la solicitud:", res.status, errorText);
        return false;
      }
    } catch (error) {
      console.error("Error al agregar producto:", error);
      return false;
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return false;

    const token = sessionStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("price", newProduct.price);

    if (newProduct.imageFile) {
      formData.append("image", newProduct.imageFile);
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
        return true;
      } else {
        console.error("Error al actualizar producto:", res.status, responseData);
        return false;
      }
    } catch (error) {
      console.error("Error inesperado al actualizar producto:", error);
      return false;
    }
  };

  const deleteProduct = async (productId) => {
    const token = sessionStorage.getItem("token");
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.ok) {
        console.log("Producto eliminado exitosamente");
        await fetchProducts(selectedCategory);
        return true;
      } else {
        const errorMessage = await res.text();
        console.error("Error al eliminar producto:", res.status, errorMessage);
        return false;
      }
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      return false;
    }
  };

  const toggleProductActive = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${productId}/toggle-active`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p._id === productId ? { ...p, activo: data.activo } : p
        )
      );
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error.message);
      return false;
    }
  };

  const startEditingProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
    });
    if (!selectedCategory) {
      setSelectedCategory(product.categoryId);
    }
  };

  const cancelEditing = () => {
    setEditingProduct(null);
    setNewProduct({
      name: "",
      description: "",
      price: "",
      image: null,
    });
  };

  return {
    selectedCategory,
    setSelectedCategory,
    selectedCategoryRef,
    products,
    newProduct,
    setNewProduct,
    editingProduct,
    setEditingProduct,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    startEditingProduct,
    cancelEditing,
  };
}