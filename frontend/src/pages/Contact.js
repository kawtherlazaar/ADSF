import { useCallback, useEffect, useState } from "react";
import {
  Table,
  Spinner,
  Button,
  Form,
  Modal,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import AdminSidebar from "../components/admin/Adminsidebar";
import contactService from "../services/contact.service";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [recherche, setRecherche] = useState("");     // اللي نكتبوه
  const [searchValue, setSearchValue] = useState(""); // اللي نبحثو به

  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  // 🔹 تحميل الداتا (كان وقت البحث ولا أول مرة)
  const loadData = useCallback(() => {
    setLoading(true);
    setError(null);

    contactService
      .getAllContacts({ search: searchValue })
      .then((res) => {
        const data = res.data?.messages || res.data?.data || [];
        setContacts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || err.message);
        setContacts([]);
        setLoading(false);
      });
  }, [searchValue]);

  // 🔹 أول تحميل + وقت البحث
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleShowModal = (contact) => {
    setSelectedContact(contact);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
      try {
        await contactService.deleteContact(id);
        loadData();
      } catch (err) {
        console.error(err);
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
            <h3 className="mb-4">Gestion des Messages de Contact</h3>

            {error && (
              <div className="alert alert-danger">
                {error}
                <button
                  type="button"
                  className="btn-close float-end"
                  onClick={() => setError(null)}
                ></button>
              </div>
            )}

            {/* 🔍 Recherche */}
            <Form
              className="mb-3 d-flex"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchValue(recherche); // البحث يصير هنا فقط
              }}
            >
              <Form.Control
                placeholder="Rechercher par nom, email ou téléphone..."
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
              <Button type="submit" className="ms-2">
                🔍
              </Button>
            </Form>

            {/* 📋 Table */}
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Sujet</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length > 0 ? (
                  contacts.map((c) => (
                    <tr key={c._id}>
                      <td>{c.nom}</td>
                      <td>{c.email}</td>
                      <td>{c.telephone|| "-"}</td>
                      <td>{c.sujet}</td>
                      <td>
                        {new Date(c.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          className="me-2"
                          onClick={() => handleShowModal(c)}
                        >
                          Voir
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(c._id)}
                        >
                          Supprimer
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center text-muted">
                      Aucun message
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Col>
      </Row>

      {/* 👁️ Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Message de {selectedContact?.nom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContact && (
            <>
              <p><strong>Nom:</strong> {selectedContact.nom}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Téléphone:</strong> {selectedContact.telephone|| "-"}</p>
              <p><strong>Sujet:</strong> {selectedContact.sujet}</p>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(selectedContact.createdAt).toLocaleDateString("fr-FR")}
              </p>
              <hr />
              <p><strong>Message:</strong></p>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {selectedContact.message}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Contact;
