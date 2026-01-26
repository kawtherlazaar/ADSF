import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function BenevolePublic() {
  const [benevoles, setBenevoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadBenevoles = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5300/api/members");
        
        if (!res.ok) throw new Error("Erreur lors du chargement");
        
        const data = await res.json();
        console.log("Bénévoles reçus:", data);
        
        const benevolesArray = data.benevoles || (Array.isArray(data) ? data : []);
        setBenevoles(benevolesArray);
        setError(null);
      } catch (err) {
        console.error("Erreur:", err);
        setError("Impossible de charger les bénévoles");
        setBenevoles([]);
      } finally {
        setLoading(false);
      }
    };

    loadBenevoles();
  }, []);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des bénévoles...</p>
      </Container>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <h1 className="mb-3">Notre Équipe de Bénévoles</h1>
          <p className="lead">
            Découvrez les personnes engagées qui font la différence dans nos projets
          </p>
        </Container>
      </section>

      {/* Bénévoles */}
      <section className="py-5">
        <Container>
          {error && (
            <div className="alert alert-warning text-center">
              {error}
            </div>
          )}

          {benevoles.length > 0 ? (
            <Row>
              {benevoles.map((b) => (
                <Col md={6} lg={4} key={b._id} className="mb-4">
                  <Card className="h-100 shadow-sm" style={{ 
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow = "0 12px 30px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                  >
                    <Card.Body>
                      <div className="text-center mb-3">
                        <div className="avatar mb-3" style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontSize: "2.5rem",
                          fontWeight: "bold",
                          margin: "0 auto",
                        }}>
                          {b.prenom?.charAt(0)}{b.nom?.charAt(0)}
                        </div>
                        <h5 className="card-title mb-1">{b.prenom} {b.nom}</h5>
                      </div>

                      {b.email && (
                        <p className="text-muted small mb-2">
                          <i className="bi bi-envelope me-2"></i>
                          {b.email}
                        </p>
                      )}

                      {b.telephone && (
                        <p className="text-muted small mb-2">
                          <i className="bi bi-telephone me-2"></i>
                          {b.telephone}
                        </p>
                      )}

                      {b.competences && (
                        <p className="card-text small mb-3">
                          <strong>Compétences:</strong> {b.competences}
                        </p>
                      )}

                      <div className="text-center">
                        <Badge bg="info" className="me-2">
                          {b.disponibilite}
                        </Badge>
                        <Badge bg={b.statut === "actif" ? "success" : "secondary"}>
                          {b.statut}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div className="alert alert-info text-center py-5">
              <h4>Aucun bénévole pour le moment</h4>
              <p>Soyez le premier à rejoindre notre équipe engagée !</p>
            </div>
          )}

          {benevoles.length > 0 && (
            <div className="text-center mt-5">
              <h4>Vous aussi, rejoignez notre équipe !</h4>
              <p className="text-muted mb-4">
                Ensemble, nous pouvons faire la différence
              </p>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}

export default BenevolePublic;
