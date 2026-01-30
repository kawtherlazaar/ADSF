import { useEffect, useState } from "react";
import { Row, Col, Card, Spinner, Badge, Container, Button, Modal, Form, Alert } from "react-bootstrap";
import { getDashboard } from "../services/dashbord.service";
import mediaService from "../services/media.service";
import AdminSidebar from "../components/admin/Adminsidebar"; // عدّل المسار حسب مشروعك

function Dashboard() {
  const [data, setData] = useState(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaForm, setMediaForm] = useState({ titre: '', type: 'photo', description: '', fichier: null, sourceVideo: '' });
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleMediaFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'fichier') {
      setMediaForm({ ...mediaForm, fichier: files[0] });
    } else {
      setMediaForm({ ...mediaForm, [name]: value });
    }
  };

  const handleMediaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('titre', mediaForm.titre);
      formData.append('description', mediaForm.description);
      formData.append('type', mediaForm.type);
      if (mediaForm.type === 'photo' && mediaForm.fichier) {
        formData.append('fichier', mediaForm.fichier);
      } else if (mediaForm.type === 'video' && mediaForm.sourceVideo) {
        formData.append('sourceVideo', mediaForm.sourceVideo);
      }
      await mediaService.createMedia(formData);
      setAlert({ type: 'success', message: 'Média ajouté avec succès!' });
      setShowMediaModal(false);
      setMediaForm({ titre: '', type: 'photo', description: '', fichier: null, sourceVideo: '' });
      // Reload dashboard data
      const newData = await getDashboard();
      setData(newData);
    } catch (error) {
      setAlert({ type: 'danger', message: 'Erreur lors de l\'ajout du média.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboard().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  const { totaux, membresParStatut, mediasParType, derniersAjouts } = data;

  return (
    <Container fluid>
      <Row>
        {/* ===== SIDEBAR ===== */}
        <Col md={3} className="p-0">
          <AdminSidebar />
        </Col>

        {/* ===== CONTENT ===== */}
        <Col md={9}>
          <div className="p-4">
            <h3 className="mb-4 fw-bold">Dashboard</h3>

            {/* ===== STATS ===== */}
            <Row className="g-4 mb-4">
              <Stat title="Membres" value={totaux.membres} icon="people" />
              <Stat title="Projets" value={totaux.projets} icon="kanban" />
              <Stat title="Partenaires" value={totaux.partenaires} icon="handshake" />
              <Stat title="Médias" value={totaux.medias} icon="image" />
              <Stat title="Bénévoles" value={totaux.benevoles} icon="heart-hands" />
            </Row>

            {/* ===== STATUS + MEDIAS ===== */}
            <Row className="g-4">
              <Col md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title>Membres par statut</Card.Title>
                    <ul className="list-unstyled mt-3">
                      <li>🟡 En attente: <b>{membresParStatut.enAttente}</b></li>
                      <li>🟢 Approuvés: <b>{membresParStatut.approuves}</b></li>
                      <li>🔴 Rejetés: <b>{membresParStatut.rejetes}</b></li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="shadow-sm h-100">
                  <Card.Body>
                    <Card.Title>Médias</Card.Title>
                    <p className="mt-3">📸 Photos: <b>{mediasParType.photos}</b></p>
                    <p>🎥 Vidéos: <b>{mediasParType.videos}</b></p>
                    <Button variant="primary" onClick={() => setShowMediaModal(true)} className="mt-3">
                      Ajouter Média
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* ===== DERNIERS AJOUTS ===== */}
            <Row className="mt-4">
              <Col>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>Derniers ajouts</Card.Title>

                    <Section title="Membres" items={derniersAjouts.membres} />
                    <Section title="Projets" items={derniersAjouts.projets} />
                    <Section title="Médias" items={derniersAjouts.medias} />
                    <Section title="Bénévoles" items={derniersAjouts.benevoles} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* ===== ALERT ===== */}
      {alert && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert(null)} className="mt-3">
          {alert.message}
        </Alert>
      )}

      {/* ===== MODAL ===== */}
      <Modal show={showMediaModal} onHide={() => setShowMediaModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Média</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleMediaSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titre</Form.Label>
              <Form.Control
                type="text"
                name="titre"
                value={mediaForm.titre}
                onChange={handleMediaFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={mediaForm.description}
                onChange={handleMediaFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select name="type" value={mediaForm.type} onChange={handleMediaFormChange}>
                <option value="photo">Photo</option>
                <option value="video">Vidéo</option>
              </Form.Select>
            </Form.Group>
            {mediaForm.type === 'photo' && (
              <Form.Group className="mb-3">
                <Form.Label>Fichier Image</Form.Label>
                <Form.Control
                  type="file"
                  name="fichier"
                  onChange={handleMediaFormChange}
                  required
                />
              </Form.Group>
            )}
            {mediaForm.type === 'video' && (
              <Form.Group className="mb-3">
                <Form.Label>URL de la Vidéo (YouTube)</Form.Label>
                <Form.Control
                  type="text"
                  name="sourceVideo"
                  value={mediaForm.sourceVideo}
                  onChange={handleMediaFormChange}
                  placeholder="ex: https://www.youtube.com/watch?v=..."
                  required
                />
              </Form.Group>
            )}
            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? <Spinner animation="border" size="sm" /> : 'Ajouter'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

/* ===== COMPONENTS ===== */

function Stat({ title, value, icon }) {
  return (
    <Col md={3}>
      <Card className="shadow-sm text-center h-100">
        <Card.Body>
          <i className={`bi bi-${icon} fs-1 text-primary`} />
          <h6 className="mt-2">{title}</h6>
          <h3 className="fw-bold">{value}</h3>
        </Card.Body>
      </Card>
    </Col>
  );
}
function Section({ title, items = [] }) {
  return (
    <>
      <h6 className="mt-3">{title}</h6>
      {items.length === 0 ? (
        <Badge bg="secondary">Aucun</Badge>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item._id}>
              {item.titre || item.nom || `${item.prenom} ${item.nom}`}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}



export default Dashboard;
