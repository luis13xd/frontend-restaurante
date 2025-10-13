import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MenuManager from "../components/MenuManager";
import MovieManager from "../components/MovieManager";
import "./Admin.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("menu"); // "menu" o "movies"

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="admin-panel">
      <h1>Administrador</h1>

      <button className="logout-btn" onClick={handleLogout}>
        Salir
      </button>

      <div className="admin-menu">
        <div className="admin-tabs">
          <button
            className={activeTab === "menu" ? "active" : ""}
            onClick={() => setActiveTab("menu")}
          >
            Gestión de Carta
          </button>
          <button
            className={activeTab === "movies" ? "active" : ""}
            onClick={() => setActiveTab("movies")}
          >
            Gestión de Cartelera
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === "menu" && <MenuManager />}
        {activeTab === "movies" && <MovieManager />}
      </div>
    </div>
  );
}

export default AdminPanel;
