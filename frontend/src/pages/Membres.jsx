import { useCallback, useEffect, useState } from "react";
import {
  getMembres,
  approuverMembre,
  rejeterMembre,
} from "../services/membre.service";
import {
  Table,
  Spinner,
  Badge,
  Button,
  Form,
  Modal,
} from "react-bootstrap";

function Membres() {
  const [statut, setStatut] = useState("");
  const [membres, setMembres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [recherche, setRecherche] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);

  // 👁 VOIR
  const [showModal, setShowModal] = useState(false);
  const [selectedMembre, setSelectedMembre] = useState(null);

  const loadData = useCallback(() => {
    setLoading(true);
    getMembres({ page, recherche, statut })
      .then((res) => {
        setMembres(res.membres);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, recherche, statut]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleApprove = async (id) => {
    await approuverMembre(id);
    loadData();
  };

  const handleReject = async (id) => {
    await rejeterMembre(id);
    loadData();
  };

  const handleVoir = (membre) => {
    setSelectedMembre(membre);
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <h3 className="mb-4">👥 Gestion des membres</h3>

      {/* 🔍 Recherche */}
      <Form
        className="mb-3 d-flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setPage(1);
          setRecherche(searchInput);
        }}
      >
        <Form.Control
          placeholder="Rechercher par nom ou email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">Rechercher</Button>
      </Form>

      {/* 🎯 Filtres */}
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <Button
          size="sm"
          variant={statut === "" ? "dark" : "outline-dark"}
          onClick={() => {
            setStatut("");
            setPage(1);
          }}
        >
          🔘 Tous
        </Button>

        <Button
          size="sm"
          variant={statut === "en_attente" ? "warning" : "outline-warning"}
          onClick={() => {
            setStatut("en_attente");
            setPage(1);
          }}
        >
          🟡En attente
        </Button>

        <Button
          size="sm"
          variant={statut === "approuve" ? "success" : "outline-success"}
          onClick={() => {
            setStatut("approuve");
            setPage(1);
          }}
        >
          🟢 Approuvés
        </Button>

        <Button
          size="sm"
          variant={statut === "rejete" ? "danger" : "outline-danger"}
          onClick={() => {
            setStatut("rejete");
            setPage(1);
          }}
        >
          🔴Rejetés
        </Button>
      </div>

      {/* 📋 Table */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nom</th>
            <th className="d-none d-md-table-cell">Email</th>
            <th className="d-none d-lg-table-cell">Téléphone</th>
            <th>Statut</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {membres.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center text-muted">
                Aucun membre trouvé
              </td>
            </tr>
          )}

          {membres.map((m) => (
            <tr key={m._id}>
              <td>{m.prenom} {m.nom}</td>

              <td className="d-none d-md-table-cell">{m.email}</td>

              <td className="d-none d-lg-table-cell">{m.telephone}</td>

              <td>
                <Badge
                  bg={
                    m.statut === "approuve"
                      ? "success"
                      : m.statut === "rejete"
                      ? "danger"
                      : "warning"
                  }
                >
                  {m.statut}
                </Badge>
              </td>

              <td>
                <div className="d-flex flex-column flex-md-row gap-2 justify-content-center">
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() => handleVoir(m)}
                  >
                    👁 Voir
                  </Button>

                  <Button
                    size="sm"
                    variant="success"
                    disabled={m.statut === "approuve"}
                    onClick={() => handleApprove(m._id)}
                  >
                    ✓ Approuver
                  </Button>

                  <Button
                    size="sm"
                    variant="danger"
                    disabled={m.statut === "rejete"}
                    onClick={() => handleReject(m._id)}
                  >
                    ✕ Rejeter
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* 📄 Pagination */}
      <div className="d-flex justify-content-between mt-3">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ◀ Précédent
        </Button>

        <strong>
          Page {page} / {totalPages}
        </strong>

        <Button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Suivant ▶
        </Button>
      </div>

      {/* 👁 MODAL VOIR */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>📄 Inscription bénévole</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedMembre && (
            <>
              <p><strong>Nom :</strong> {selectedMembre.nom}</p>
              <p><strong>Prénom :</strong> {selectedMembre.prenom}</p>
              <p><strong>Email :</strong> {selectedMembre.email}</p>
              <p><strong>Téléphone :</strong> {selectedMembre.telephone}</p>
              <p><strong>Disponibilité :</strong> {selectedMembre.disponibilite}</p>
              <p>
                <strong>Compétences :</strong>{" "}
                {selectedMembre.competences.length
                  ? selectedMembre.competences.join(", ")
                  : "Aucune"}
              </p>
              <p className="text-muted">
                Inscrit le :{" "}
                {new Date(selectedMembre.createdAt).toLocaleDateString()}
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
    </div>
  );
}

export default Membres;
