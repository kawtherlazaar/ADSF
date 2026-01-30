import { Card, Badge, Button } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";

function ProjetCard({ projet }) {
 
  const [showMore, setShowMore] = useState(false);

  
  if (!projet) return null;

  const STATUS_LABEL = {
    en_cours: { text: "En cours", bg: "warning" },
    termine: { text: "Terminé", bg: "success" },
    archive: { text: "Archivé", bg: "secondary" },
  };

  const status = STATUS_LABEL[projet.statut] || STATUS_LABEL.en_cours;

  const description =
    projet.description || "Aucune description disponible";

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={
          projet.image
            ? `http://localhost:5300/${projet.image}`
            : "/images/default-project.jpg"
        }
        height="200"
        style={{ objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title>{projet.titre}</Card.Title>

        <Badge bg="info" className="mb-2">
          {projet.categorie}
        </Badge>

        <div className="mb-2">
          <Badge bg={status.bg}>{status.text}</Badge>
        </div>

        <Card.Text className="text-muted">
          {showMore ? description : description.slice(0, 120)}
          {description.length > 120 && (
            <>
              {!showMore && "... "}
              <Button
                variant="link"
                size="sm"
                className="p-0"
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

export default ProjetCard;
