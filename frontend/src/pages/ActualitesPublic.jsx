import { useEffect, useState } from "react";
import { fetchActualites } from "../services/actualite.service";
import ActualiteCard from "../components/actualites/ActualiteCard";
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
      console.error(err);
      setError("Impossible de charger les actualités.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" />
        <p className="mt-2">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <h2 className="mb-4 text-center">Actualités</h2>

      {error && (
        <div className="alert alert-warning text-center">
          {error}
        </div>
      )}

      <div className="row">
        {actualites.length > 0 ? (
          actualites.map((actualite) => (
            <div
              key={actualite._id}
              className="col-md-6 col-lg-4 mb-4"
            >
              {/* ✅ غير هكا */}
              <ActualiteCard actualite={actualite} />
            </div>
          ))
        ) : (
          <div className="alert alert-info text-center">
            Aucune actualité disponible
          </div>
        )}
      </div>
    </div>
  );
}

export default ActualitesPublic;
