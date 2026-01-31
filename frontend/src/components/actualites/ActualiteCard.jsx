import { Card, Badge, Button } from "react-bootstrap";
import { useState } from "react";

function ActualiteCard({ actualite }) {
  const [showMore, setShowMore] = useState(false);

  if (!actualite) return null;

  const resume =
    actualite.resume || "Aucun résumé disponible";

  // ✅ gérer catégorie(s)
  const categories = actualite.categories
    ? actualite.categories
    : actualite.categorie
    ? [actualite.categorie]
    : [];

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={
          actualite.image
            ? `http://localhost:5300${actualite.image}`
            : "/images/default-news.jpg"
        }
        height="200"
        style={{ objectFit: "cover" }}
        onError={(e) => (e.target.src = "/images/default-news.jpg")}
      />

      <Card.Body>
        {/* 🔹 catégories */}
        {categories.length > 0 && (
          <div className="mb-2">
            {categories.map((cat, index) => (
              <Badge
                key={index}
                bg="info"
                className="me-1"
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        <Card.Title>{actualite.titre}</Card.Title>

        {/* 🔹 date */}
        {actualite.datePublication && (
          <Badge bg="secondary" className="mb-2">
            {new Date(actualite.datePublication).toLocaleDateString("fr-FR")}
          </Badge>
        )}

        <Card.Text className="text-muted mt-2">
          {showMore ? resume : resume.slice(0, 120)}
          {resume.length > 120 && (
            <>
              {!showMore && "... "}
              <Button
                variant="link"
                size="sm"
                className="p-0 ms-1"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? "Voir moins" : "Voir plus"}
              </Button>
            </>
          )}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default ActualiteCard;
