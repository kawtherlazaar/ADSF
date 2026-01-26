import { useState } from "react";
import { createActualite } from "../services/actualite.service";

function Actualite() {
  const [form, setForm] = useState({
    titre: "",
    resume: "",
    contenu: "",
    categorie: "Communiqué",
    datePublication: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({
      ...form,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await createActualite(form);
      setMessage("✅ Actualité créée avec succès");
      setForm({
        titre: "",
        resume: "",
        contenu: "",
        categorie: "Communiqué",
        datePublication: "",
        image: null,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Créer une actualité</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="mb-3">
          <label className="form-label">Titre</label>
          <input
            type="text"
            name="titre"
            className="form-control"
            value={form.titre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Résumé</label>
          <textarea
            name="resume"
            className="form-control"
            value={form.resume}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contenu</label>
          <textarea
            name="contenu"
            className="form-control"
            value={form.contenu}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Catégorie</label>
          <select
            name="categorie"
            className="form-select"
            value={form.categorie}
            onChange={handleChange}
          >
            <option>Communiqué</option>
            <option>Projet</option>
            <option>Événement</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Date de publication</label>
          <input
            type="date"
            name="datePublication"
            className="form-control"
            value={form.datePublication}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Image</label>
          <input
            type="file"
            name="image"
            className="form-control"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Envoi..." : "Créer"}
        </button>
      </form>
    </div>
  );
}

export default Actualite;
