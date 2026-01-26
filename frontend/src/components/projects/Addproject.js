import { useState } from "react";
import { addProject } from "../../services/project.service";

function Addproject() {
  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie: "",
    statut: "en_cours",
    dateDebut: "",
    dateFin: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addProject(form);
      alert("Projet ajouté avec succès");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout du projet");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">

      <input
        name="titre"
        className="form-control mb-2"
        placeholder="Titre"
        onChange={handleChange}
        required
      />

      <textarea
        name="description"
        className="form-control mb-2"
        placeholder="Description"
        onChange={handleChange}
      />

      {/* CATEGORIE */}
      <select
        name="categorie"
        className="form-control mb-2"
        onChange={handleChange}
        required
      >
        <option value="">-- Choisir catégorie --</option>
        <option value="Education">Education</option>
        <option value="Environnement">Environnement</option>
        <option value="Développement">Développement</option>
      </select>

      {/* STATUT */}
      <select
        name="statut"
        className="form-control mb-2"
        onChange={handleChange}
      >
        <option value="en_cours">En cours</option>
        <option value="termine">Terminé</option>
        <option value="archive">Archivé</option>
      </select>

      <input
        type="date"
        name="dateDebut"
        className="form-control mb-2"
        onChange={handleChange}
      />

      <input
        type="date"
        name="dateFin"
        className="form-control mb-3"
        onChange={handleChange}
      />

      <input
        type="text"
        name="image"
        className="form-control mb-2"
        placeholder="URL Image (https://...)"
        onChange={handleChange}
        value={form.image}
      />

      {form.image && (
        <div className="mb-3">
          <img
            src={form.image}
            alt="Aperçu"
            style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        </div>
      )}

      <button className="btn btn-success">Ajouter</button>
    </form>
  );
}

export default Addproject;
