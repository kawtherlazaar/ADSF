import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Badge } from "react-bootstrap";

function BenevolePublic() {
  const [benevoles, setBenevoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBenevoles = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5300/api/members");
        if (!res.ok) {
          throw new Error("Erreur serveur");
        }

        const data = await res.json();

        // backend يرجّع Array متاع membres
        setBenevoles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error(err);
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
        <Spinner animation="border" />
        <p className="mt-3">Chargement des bénévoles...</p>
      </Container>
    );
  }

  return (
    <div>
      {/* HERO */}
      <section className="py-5 bg-primary text-white">
        <Container>
          <h1>Notre équipe de bénévoles</h1>
          <p className="lead">
            Des personnes engagées qui font la différence
          </p>
        </Container>
      </section>

      {/* LISTE */}
      <section className="py-5">
        <Container>
          {error && (
            <div className="alert alert-warning text-center">{error}</div>
          )}

          {benevoles.length === 0 ? (
            <div className="alert alert-info text-center">
              Aucun bénévole pour le moment
            </div>
          ) : (
            <Row>
              {benevoles.map((b) => (
                <Col md={6} lg={4} key={b._id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      {/* AVATAR */}
                      <div className="text-center mb-3">
                        <div
                          style={{
                            width: 90,
                            height: 90,
                            borderRadius: "50%",
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            fontSize: "2rem",
                            margin: "0 auto",
                          }}
                        >
                          {b.prenom?.charAt(0)}
                          {b.nom?.charAt(0)}
                        </div>

                        <h5 className="mt-2">
                          {b.prenom} {b.nom}
                        </h5>
                      </div>

                      {/* INFOS */}
                      {b.email && (
                        <p className="small text-muted mb-1">{b.email}</p>
                      )}

                      {b.telephone && (
                        <p className="small text-muted mb-1">
                          {b.telephone}
                        </p>
                      )}

                      {/* COMPETENCES (Array) */}
                      {Array.isArray(b.competences) &&
                        b.competences.length > 0 && (
                          <p className="small">
                            <strong>Compétences :</strong>{" "}
                            {b.competences.join(", ")}
                          </p>
                        )}

                      {/* BADGES */}
                      <div className="text-center mt-3">
                        <Badge bg="info" className="me-2">
                          {b.disponibilite}
                        </Badge>

                        <Badge
                          bg={
                            b.statut === "approuve"
                              ? "success"
                              : b.statut === "rejete"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {b.statut}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </div>
  );
}

export default BenevolePublic;
