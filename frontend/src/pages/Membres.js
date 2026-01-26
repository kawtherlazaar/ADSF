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
} from "react-bootstrap";

function Membres() {
  const [statut, setStatut] = useState("");

  const [membres, setMembres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 🔍 البحث الحقيقي (للـ API)
  const [recherche, setRecherche] = useState("");

  // ✍️ اللي تكتب فيها
  const [searchInput, setSearchInput] = useState("");

  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
      getMembres({ page, recherche, statut })

      .then((res) => {
        setMembres(res.membres);
        setTotalPages(res.totalPages);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [page, recherche,statut]);

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

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );

  return (
    <div className="container-fluid">
      <h3 className="mb-4">👥 Gestion des membres</h3>

      {/* 🔍 Recherche */}
      <Form
        className="mb-3 d-flex flex-column flex-md-row gap-2"
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

        <Button
          type="submit"
          variant="primary"
        >
          Rechercher
        </Button>
      </Form>
      {/* 🎯 Filtres par statut */}
<div className="d-flex gap-2 mb-3 flex-wrap">
  <Button
    variant={statut === "" ? "dark" : "outline-dark"}
    size="sm"
    onClick={() => {
      setPage(1);
      setStatut("");
    }}
  >
    🔘 Tous
  </Button>

  <Button
    variant={statut === "en_attente" ? "warning" : "outline-warning"}
    size="sm"
    onClick={() => {
      setPage(1);
      setStatut("en_attente");
    }}
  >
    🟡 En attente
  </Button>

  <Button
    variant={statut === "approuve" ? "success" : "outline-success"}
    size="sm"
    onClick={() => {
      setPage(1);
      setStatut("approuve");
    }}
  >
    🟢 Approuvés
  </Button>

  <Button
    variant={statut === "rejete" ? "danger" : "outline-danger"}
    size="sm"
    onClick={() => {
      setPage(1);
      setStatut("rejete");
    }}
  >
    🔴 Rejetés
  </Button>
</div>


      {/* 📋 Table */}
      <div className="table-responsive">
        <Table striped bordered hover className="align-middle">
          <thead className="table-light">
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
                <td>{m.nomComplet}</td>

                <td className="d-none d-md-table-cell">
                  {m.email}
                </td>

                <td className="d-none d-lg-table-cell">
                  {m.telephone || "-"}
                </td>

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
                      variant="success"
                      disabled={m.statut === "approuve"}
                      onClick={() => handleApprove(m._id)}
                    >
                      ✓ Approver
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
      </div>

      {/* 📄 Pagination */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          ◀ Précédent
        </Button>

        <span className="fw-bold">
          Page {page} / {totalPages}
        </span>

        <Button
          variant="secondary"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Suivant ▶
        </Button>
      </div>
  </div>
  );
}

export default Membres;
