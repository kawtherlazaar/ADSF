import { useState } from "react";

function ActualiteCard({ actualite }) {
  const [showContent, setShowContent] = useState(false);

  return (
    <div className="card h-100 shadow-sm">
      {/* IMAGE */}
      {actualite.image && (
        <img
          src={`http://localhost:5300/uploads/actualites/${actualite.image}`}
          className="card-img-top"
          alt={actualite.titre}
          style={{ height: "200px", objectFit: "cover" }}
        />
      )}

      <div className="card-body">
        {/* CATEGORIE */}
        <span className="badge bg-primary mb-2">
          {actualite.categorie}
        </span>

        {/* TITRE */}
        <h5 className="card-title mt-2">
          {actualite.titre}
        </h5>

        {/* DATE */}
        <small className="text-muted d-block mb-2">
          📅 {new Date(actualite.datePublication).toLocaleDateString("fr-FR")}
        </small>

        {/* RESUME (always visible) */}
        <p className="fw-semibold">
          {actualite.resume}
        </p>

        {/* CONTENU (visible after click) */}
        {showContent && actualite.contenu && (
          <div className="mt-3">
            <hr />
            <p className="text-muted">
              {actualite.contenu}
            </p>
          </div>
        )}

        {/* BUTTON */}
        {actualite.contenu && (
          <button
            className="btn btn-link p-0 mt-2"
            onClick={() => setShowContent(!showContent)}
          >
            {showContent ? "Voir moins ▲" : "Voir plus ▼"}
          </button>
        )}
      </div>
    </div>
  );
}

export default ActualiteCard;
