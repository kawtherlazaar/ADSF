import React, { useEffect, useState } from "react";
import {
  fetchPartners,
  deletePartner,
  createPartner,
} from "../services/partner.service";
import { Button, Modal, Form, Spinner } from "react-bootstrap";

function Partners() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    description: "",
    siteWeb: "",
    logo: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const res = await fetchPartners();
      setPartners(res.data || []);
    } catch (err) {
      setError("Erreur chargement des partenaires");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce partenaire ?")) return;

    try {
      await deletePartner(id);
      setPartners(partners.filter((p) => p._id !== id));
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createPartner(formData);
      setShowModal(false);
      setFormData({
        nom: "",
        description: "",
        siteWeb: "",
        logo: "",
      });
      loadPartners();
    } catch (err) {
      alert("Erreur création partenaire");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-center mt-5">Chargement...</p>;

  return (
    <div className="container mt-5">
      <h2>Gestion des partenaires</h2>

      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="mb-3"
      >
        Ajouter Partenaire
      </Button>

      {error && <div className="alert alert-danger">{error}</div>}

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nom</th>
            <th>Description</th>
            <th>Site Web</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((p) => (
            <tr key={p._id}>
              <td style={{ width: "100px" }}>
                {p.logo && p.logo.trim() ? (
                  <img
                    src={`http://localhost:5300/${p.logo}`}
                    alt={p.nom}
                    style={{ width: "80px", height: "60px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-muted">Pas de logo</span>
                )}
              </td>
              <td>{p.nom}</td>
              <td>{p.description}</td>
              <td>
                {p.siteWeb ? (
                  <a href={p.siteWeb} target="_blank" rel="noopener noreferrer">
                    {p.siteWeb}
                  </a>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(p._id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un Partenaire</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Site Web</Form.Label>
              <Form.Control
                type="url"
                name="siteWeb"
                value={formData.siteWeb}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                name="logo"
                onChange={handleInputChange}
                accept="image/*"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? <Spinner animation="border" size="sm" /> : "Ajouter"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default Partners;