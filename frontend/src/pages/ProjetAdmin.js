import { useEffect, useState } from "react";
import {
  getProjects,
  addProject,
  updateProjectApi,
  deleteProjectApi,
} from "../services/project.service";

import {
  Table,
  Button,
  InputGroup,
  Form,
  Modal,
  Image,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";

function ProjetAdmin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie: "Education",
    statut: "en_cours",
    dateDebut: "",
    dateFin: "",
    imageFile: null,
  });
  const [editId, setEditId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // ===== GET PROJECTS =====
  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data.projects);
    } catch (err) {
      console.error(err);
      alert("Erreur fetch projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ===== FORM HANDLERS =====
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageFile") {
      const file = files[0];
      setForm({ ...form, imageFile: file });
      setPreviewImage(file ? URL.createObjectURL(file) : null);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateProjectApi(editId, form);
        alert("Projet modifié !");
      } else {
        await addProject(form);
        alert("Projet ajouté !");
      }
      fetchProjects();
      resetForm();
      setShowFormModal(false);
    } catch (err) {
      console.error(err);
      alert("Erreur !");
    }
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      titre: p.titre,
      description: p.description || "",
      categorie: p.categorie,
      statut: p.statut,
      dateDebut: p.dateDebut?.substring(0, 10) || "",
      dateFin: p.dateFin?.substring(0, 10) || "",
      imageFile: null,
    });
    setPreviewImage(p.image ? `http://localhost:5300/${p.image}` : null);
    setShowFormModal(true);
  };

  const handleDeleteConfirm = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteProjectApi(deleteId);
      alert("Projet supprimé !");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Erreur suppression");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const resetForm = () => {
    setEditId(null);
    setForm({
      titre: "",
      description: "",
      categorie: "Education",
      statut: "en_cours",
      dateDebut: "",
      dateFin: "",
      imageFile: null,
    });
    setPreviewImage(null);
  };

  // ===== SEARCH & PAGINATION =====
  const filteredProjects = projects.filter((p) =>
    p.titre.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const displayedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Gestion des Projets</h2>

      {/* ===== ADD BUTTON ===== */}
      <div className="mb-3 text-end">
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowFormModal(true);
          }}
        >
          ➕ Ajouter Projet
        </Button>
      </div>

      {/* ===== SEARCH ===== */}
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Recherche par titre..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
        />
      </InputGroup>

      {/* ===== TABLE ===== */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Statut</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedProjects.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">
                Aucun projet
              </td>
            </tr>
          ) : (
            displayedProjects.map((p) => (
              <tr key={p._id}>
                <td>{p.titre}</td>
                <td>{p.categorie}</td>
                <td>{p.statut}</td>
                <td>
                  {p.image && (
                    <Image
                      src={`http://localhost:5300/${p.image}`}
                      width="80"
                      rounded
                    />
                  )}
                </td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(p)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteConfirm(p._id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* ===== FORM MODAL ===== */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Modifier Projet" : "Ajouter Projet"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control
                    type="text"
                    name="titre"
                    value={form.titre}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="imageFile"
                    onChange={handleChange}
                  />
                  {previewImage && (
                    <Image
                      src={previewImage}
                      rounded
                      thumbnail
                      className="mt-2"
                      width="120"
                    />
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select
                    name="categorie"
                    value={form.categorie}
                    onChange={handleChange}
                  >
                    <option value="Education">Education</option>
                    <option value="Environnement">Environnement</option>
                    <option value="Développement">Développement</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    name="statut"
                    value={form.statut}
                    onChange={handleChange}
                  >
                    <option value="en_cours">En cours</option>
                    <option value="termine">Terminé</option>
                    <option value="archive">Archivé</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date début</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateDebut"
                    value={form.dateDebut}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date fin</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateFin"
                    value={form.dateFin}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowFormModal(false)} className="me-2">
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                {editId ? "Modifier" : "Ajouter"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ===== DELETE MODAL ===== */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Voulez-vous vraiment supprimer ce projet ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default ProjetAdmin;