import { useState, useEffect } from "react";
import { fetchActualites } from "../services/actualite.service";
import "../Styles/Actualites.css";

function ActualitesPublic() {
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadActualites();
  }, []);

  const loadActualites = async () => {
    try {
      setLoading(true);
      const response = await fetchActualites({ page: 1, limit: 6 });
      setActualites(response.data || []);
      setError(null);
    } catch (err) {
      console.error("Erreur lors du chargement des actualités:", err);
      setError("Impossible de charger les actualités.");
      setActualites([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
        <p className="mt-3">Chargement des actualités...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Actualités</h1>

      {error && (
        <div className="alert alert-warning alert-dismissible fade show">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
          />
        </div>
      )}

      {actualites.length > 0 ? (
        <div className="row">
          {actualites.map((actualite) => (
            <div key={actualite._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 actualite-card">

                {/* صورة أو placeholder */}
                {actualite.image ? (
                  <img
                    src={`http://localhost:5300${actualite.image}`}
                    className="card-img-top"
                    alt={actualite.titre}
                    style={{ height: "200px", objectFit: "cover" }}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  <div
                    style={{
                      height: "200px",
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                      fontStyle: "italic",
                    }}
                  >
                    Pas d'image
                  </div>
                )}

                <div className="card-body">
                  <h5 className="card-title">{actualite.titre}</h5>
                  <p className="card-text">{actualite.resume}</p>
                  <small className="text-muted">
                    {actualite.datePublication &&
                      new Date(actualite.datePublication).toLocaleDateString(
                        "fr-FR"
                      )}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <h4>Aucune actualité</h4>
          <p>Il n'y a pas d'actualités disponibles pour le moment.</p>
        </div>
      )}
    </div>
  );
}

export default ActualitesPublic;
