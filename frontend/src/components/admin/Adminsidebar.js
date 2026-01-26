import { Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  if (role !== "admin") return null;

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div
      className="vh-100 text-white p-3"
      style={{ width: 240, background: "#0f172a" }}
    >
      <h4 className="mb-4 fw-bold text-center">Dev Sans Frontières</h4>

      <Nav className="flex-column gap-2">
        <NavLink className="nav-link text-white" to="/dashboard">
          <i className="bi bi-speedometer2 me-2"></i> Dashboard
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/membres">
          <i className="bi bi-people me-2"></i> Membres
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/projets">
          <i className="bi bi-kanban me-2"></i> Projets
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/actualites">
          <i className="bi bi-newspaper me-2"></i> Actualités
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/medias">
          <i className="bi bi-image me-2"></i> Médias
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/partenaires">
          <i className="bi bi-handshake me-2"></i> Partenaires
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/contact">
          <i className="bi bi-envelope me-2"></i> Messages
        </NavLink>

        <NavLink className="nav-link text-white" to="/dashboard/parametres">
          <i className="bi bi-gear me-2"></i> Paramètres
        </NavLink>

        <hr className="border-secondary my-3" />

        <button
          onClick={logout}
          className="btn btn-outline-danger w-100"
        >
          <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
        </button>
      </Nav>
    </div>
  );
}
