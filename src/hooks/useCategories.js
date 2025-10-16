import { useState, useEffect } from "react";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) fetchCategories(token);
  }, []);

  const fetchCategories = async (token) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  const addCategory = async () => {
    const token = sessionStorage.getItem("token");
    try {
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
    } catch (error) {
      console.error("Error al agregar categoría:", error);
    }
  };

  const updateCategory = async (categoryId) => {
    const token = sessionStorage.getItem("token");
    try {
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
        setEditingCategory(null);
        setEditedCategoryName("");
      }
    } catch (error) {
      console.error("Error al actualizar categoría:", error);
    }
  };

  const deleteCategory = async (categoryId) => {
    const token = sessionStorage.getItem("token");
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/categories/${categoryId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories(token);
    } catch (error) {
      console.error("Error al eliminar categoría:", error);
    }
  };

  return {
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
    refreshCategories: () => fetchCategories(sessionStorage.getItem("token")),
  };
}