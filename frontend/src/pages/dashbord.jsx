import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner, Table } from "react-bootstrap";
import AdminSidebar from "../components/admin/Adminsidebar";

const API_URL = "http://localhost:5300/api/dashboard";

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner />
      </div>
    );
  }

  const {
    totaux = {},
    membresParStatut = {},
    mediasParType = {},
    derniersAjouts = {},
  } = data || {};

  return (
    <Container fluid>
      <Row>
        {/* SIDEBAR */}
        <Col md={3} className="p-0">
          <AdminSidebar />
        </Col>

        {/* CONTENT */}
        <Col md={9} className="p-4">
          <h3 className="fw-bold mb-4">Dashboard</h3>

          {/* ===== STATS ===== */}
          <Row className="g-4 mb-4">
            <Stat title="Membres" value={totaux.membres} />
            <Stat title="Projets" value={totaux.projets} />
            <Stat title="Partenaires" value={totaux.partenaires} />
            <Stat title="Médias" value={totaux.medias} />
          </Row>

          {/* ===== MEMBRES PAR STATUT ===== */}
          <Row className="mb-4">
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Membres par statut</Card.Title>
                  <ul className="mt-3">
                    <li>🟡 En attente : <b>{membresParStatut.enAttente ?? 0}</b></li>
                    <li>🟢 Approuvés : <b>{membresParStatut.approuves ?? 0}</b></li>
                    <li>🔴 Rejetés : <b>{membresParStatut.rejetes ?? 0}</b></li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>

            {/* ===== MEDIA CARD ONLY ===== */}
            <Col md={6}>
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>Médias</Card.Title>
                  <p className="mt-3">📸 Photos : <b>{mediasParType.photos ?? 0}</b></p>
                  <p>🎥 Vidéos : <b>{mediasParType.videos ?? 0}</b></p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* ===== TABLE DERNIERS AJOUTS ===== */}
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Derniers ajouts</Card.Title>

              <Table striped bordered hover responsive className="mt-3">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Nom / Titre</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {(derniersAjouts.membres || []).map((m) => (
                    <tr key={m._id}>
                      <td>Membre</td>
                      <td>{m.prenom} {m.nom}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {(derniersAjouts.projets || []).map((p) => (
                    <tr key={p._id}>
                      <td>Projet</td>
                      <td>{p.titre}</td>
                      <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}

                  {(derniersAjouts.medias || []).map((m) => (
                    <tr key={m._id}>
                      <td>Média</td>
                      <td>{m.titre}</td>
                      <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

/* ===== SMALL COMPONENT ===== */
function Stat({ title, value }) {
  return (
    <Col md={3}>
      <Card className="shadow-sm text-center h-100">
        <Card.Body>
          <h6>{title}</h6>
          <h3 className="fw-bold">{value ?? 0}</h3>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default Dashboard;
