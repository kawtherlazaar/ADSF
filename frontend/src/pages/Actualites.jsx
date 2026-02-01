import { useEffect, useState } from "react";
import {
  createActualite,
  fetchActualites,
  updateActualite,
  deleteActualite,
} from "../services/actualite.service";
import { Table, Button, Form, Image, Pagination, Modal, Row, Col } from "react-bootstrap";
import "../Styles/Actualites.css";
function Actualite() {
  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    titre: "",
    resume: "",
    contenu: "",
    categorie: "Communiqué",
    datePublication: "",
    image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [editId, setEditId] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  /* ===== LIST STATE ===== */
  const [actualites, setActualites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  /* ===== SEARCH & FILTER & PAGINATION ===== */
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  /* ===== HANDLE CHANGE ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
    if (name === "image" && files?.[0]) setPreviewImage(URL.createObjectURL(files[0]));
  };

  /* ===== LOAD ACTUALITES (SERVER SIDE) ===== */
  const loadActualites = async (page = 1) => {
    try {
      const res = await fetchActualites({
        limit: itemsPerPage,
        page,
        search,
        categorie: filterCat || undefined,
      });
      setActualites(Array.isArray(res.data) ? res.data : []);
      setCurrentPage(res.page || page);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Erreur chargement actualités");
    }
  };

  useEffect(() => {
    loadActualites(1);
  }, [search, filterCat]);

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setMessage(null);

    try {
      if (editId) {
        await updateActualite(editId, form);
        setMessage("✅ Actualité modifiée avec succès");
      } else {
        await createActualite(form);
        setMessage("✅ Actualité créée avec succès");
      }
      resetForm();
      loadActualites(currentPage);
      setShowFormModal(false);
    } catch (err) {
      setError(err.message || "Erreur serveur");
    } finally { setLoading(false); }
  };

  /* ===== DELETE (SOFT DELETE) ===== */
  const handleDelete = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette actualité ?")) return;
    try {
      await deleteActualite(id); // backend fait soft delete
      setMessage("Actualité supprimée !");
      loadActualites(currentPage);
    } catch (err) { alert(err.message); }
  };

  /* ===== EDIT ===== */
  const handleEdit = (actu) => {
    setEditId(actu._id);
    setForm({
      titre: actu.titre,
      resume: actu.resume,
      contenu: actu.contenu,
      categorie: actu.categorie,
      datePublication: actu.datePublication?.substring(0, 10) || "",
      image: null,
    });
    setPreviewImage(actu.image ? `http://localhost:5300/uploads/actualite/${actu.image}` : null);
    setShowFormModal(true);
  };

  /* ===== RESET FORM ===== */
  const resetForm = () => {
    setEditId(null);
    setForm({
      titre: "",
      resume: "",
      contenu: "",
      categorie: "Communiqué",
      datePublication: "",
      image: null,
    });
    setPreviewImage(null);
  };

  return (
    <div className="container mt-5">
      <h2>Gestion des Actualités</h2>

      {/* ===== SEARCH & FILTER ===== */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            placeholder="Recherche par titre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="">Toutes catégories</option>
            <option>Communiqué</option>
            <option>Projet</option>
            <option>Événement</option>
          </Form.Select>
        </Col>
        <Col md={3} className="text-end">
          <Button variant="primary" onClick={() => { resetForm(); setShowFormModal(true); }}>
            ➕ Ajouter Actualité
          </Button>
        </Col>
      </Row>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* ===== TABLE ===== */}
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Date</th>
            <th>Image</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {actualites.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">Aucune actualité</td>
            </tr>
          ) : actualites.map((actu) => (
            <tr key={actu._id}>
              <td>{actu.titre}</td>
              <td>{actu.categorie}</td>
              <td>{new Date(actu.datePublication).toLocaleDateString()}</td>
             <td>
  {actu.image ? (
    <img
      src={`http://localhost:5300/uploads/actualites/${actu.image}`}
      style={{
        width: "70px",
        height: "70px",
        objectFit: "cover",
        borderRadius: "8px",
      }}
    />
  ) : (
    "—"
  )}
</td>


              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(actu)}>✏️</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(actu._id)}>🗑️</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={currentPage === i + 1}
              onClick={() => loadActualites(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}

      {/* ===== FORM MODAL ===== */}
      <Modal show={showFormModal} onHide={() => setShowFormModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editId ? "Modifier Actualité" : "Ajouter Actualité"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Titre</Form.Label>
                  <Form.Control type="text" name="titre" value={form.titre} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Résumé</Form.Label>
                  <Form.Control as="textarea" name="resume" value={form.resume} onChange={handleChange} required />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Contenu</Form.Label>
                  <Form.Control as="textarea" name="contenu" value={form.contenu} onChange={handleChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image</Form.Label>
                  <Form.Control type="file" name="image" onChange={handleChange} />
                  {previewImage && <Image src={previewImage} rounded thumbnail width="120" className="mt-2" />}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Catégorie</Form.Label>
                  <Form.Select name="categorie" value={form.categorie} onChange={handleChange}>
                    <option>Communiqué</option>
                    <option>Projet</option>
                    <option>Événement</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date Publication</Form.Label>
                  <Form.Control type="date" name="datePublication" value={form.datePublication} onChange={handleChange} required />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button variant="secondary" onClick={() => setShowFormModal(false)} className="me-2">Annuler</Button>
              <Button type="submit" variant="primary">{editId ? "Modifier" : "Ajouter"}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Actualite;
