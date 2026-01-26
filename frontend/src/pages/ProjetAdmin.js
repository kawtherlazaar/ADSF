import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  Spinner,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import AdminSidebar from "../components/admin/Adminsidebar";
import { getAllProjects, addProject, updateProjectApi, deleteProjectApi } from "../services/project.service";

function ProjetAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recherche, setRecherche] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    categorie: "Education",
    statut: "en_cours",
    dateDebut: "",
    dateFin: "",
    image: null,
  });

  const loadData = useCallback(() => {
    setLoading(true);
    getAllProjects()
      .then((res) => {
        console.log("Réponse API projets:", res);
        const projetData = res.projects || res.data?.projects || res.data || [];
        const projetsArray = Array.isArray(projetData) ? projetData : [];
        console.log("Projets chargés:", projetsArray);

        if (recherche) {
          setProjects(
            projetsArray.filter((p) =>
              p.titre?.toLowerCase().includes(recherche.toLowerCase())
            )
          );
        } else {
          setProjects(projetsArray);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement:", err);
        setProjects([]);
        setLoading(false);
      });
  }, [recherche]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleShowModal = (project = null) => {
    if (project) {
      setFormData({
        titre: project.titre || "",
        description: project.description || "",
        categorie: project.categorie || "Education",
        statut: project.statut || "en_cours",
        dateDebut: project.dateDebut ? project.dateDebut.split("T")[0] : "",
        dateFin: project.dateFin ? project.dateFin.split("T")[0] : "",
        image: null,
      });
      setEditingId(project._id);
    } else {
      setFormData({
        titre: "",
        description: "",
        categorie: "Education",
        statut: "en_cours",
        dateDebut: "",
        dateFin: "",
        image: null,
      });
      setEditingId(null);
    }
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.titre || !formData.description) {
        alert("Veuillez remplir les champs obligatoires");
        return;
      }

      const submitData = new FormData();
      submitData.append('titre', formData.titre);
      submitData.append('description', formData.description);
      submitData.append('categorie', formData.categorie);
      submitData.append('statut', formData.statut);
      submitData.append('dateDebut', formData.dateDebut);
      submitData.append('dateFin', formData.dateFin);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      if (editingId) {
        await updateProjectApi(editingId, submitData);
        alert("Projet mis à jour avec succès");
      } else {
        await addProject(submitData);
        alert("Projet créé avec succès");
      }
      setShowModal(false);
      loadData();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement:", err);
      alert("Erreur lors de l'enregistrement: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet?")) {
      try {
        await deleteProjectApi(id);
        loadData();
      } catch (err) {
        console.error("Erreur lors de la suppression:", err);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (loading) return <Spinner className="mt-5" />;

  return (
    <Container fluid>
      <Row>
        <Col md={3} className="p-0">
          <AdminSidebar />
        </Col>
        <Col md={9}>
          <div className="p-4">
            <h3 className="mb-4">Gestion des Projets</h3>

            {/* Bouton Ajouter */}
            <Button
              variant="success"
              className="mb-3"
              onClick={() => handleShowModal()}
            >
              + Ajouter un projet
            </Button>

            {/* Recherche */}
            <Form className="mb-3 d-flex">
              <Form.Control
                placeholder="Rechercher..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <Button className="ms-2" onClick={loadData}>
                Rechercher
              </Button>
            </Form>

            {/* Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Titre</th>
                  <th>Description</th>
                  <th>Catégorie</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p._id}>
                    <td style={{ width: "100px" }}>
                      {p.image && p.image.trim() ? (
                        <img
                          src={`http://localhost:5300/${p.image}`}
                          alt={p.titre}
                          style={{ width: "80px", height: "60px", objectFit: "cover" }}
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-muted">Pas d'image</span>
                      )}
                    </td>
                    <td>{p.titre}</td>
                    <td>{p.description?.substring(0, 50)}...</td>
                    <td>{p.categorie || "Education"}</td>
                    <td>{p.statut || "en_cours"}</td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowModal(p)}
                        className="me-2"
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(p._id)}
                      >
                        Supprimer
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {projects.length === 0 && (
              <div className="alert alert-info">Aucun projet</div>
            )}
          </div>
        </Col>
      </Row>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Modifier le projet" : "Ajouter un projet"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Titre *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Titre du projet"
                value={formData.titre}
                onChange={handleChange}
                name="titre"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Description du projet"
                value={formData.description}
                onChange={handleChange}
                name="description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                as="select"
                value={formData.categorie}
                onChange={handleChange}
                name="categorie"
              >
                <option>Education</option>
                <option>Environnement</option>
                <option>Développement</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Statut</Form.Label>
              <Form.Control
                as="select"
                value={formData.statut}
                onChange={handleChange}
                name="statut"
              >
                <option value="en_cours">En cours</option>
                <option value="termine">Terminé</option>
                <option value="archive">Archivé</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de début</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateDebut}
                onChange={handleChange}
                name="dateDebut"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date de fin</Form.Label>
              <Form.Control
                type="date"
                value={formData.dateFin}
                onChange={handleChange}
                name="dateFin"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleChange}
                name="image"
                accept="image/*"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ProjetAdmin;
