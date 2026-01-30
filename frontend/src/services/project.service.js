const API_URL = "http://localhost:5300/api/projects";

// GET all projects
export const getProjects = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur fetch projects");
  }

  return await res.json();
};

// ADD project (avec image possible)
export const addProject = async (project) => {
  const token = localStorage.getItem("token");

  let body;
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  // Si project contient un fichier image
  if (project.imageFile) {
    body = new FormData();
    body.append("titre", project.titre);
    body.append("description", project.description);
    body.append("categorie", project.categorie);
    body.append("statut", project.statut);
    body.append("dateDebut", project.dateDebut);
    body.append("dateFin", project.dateFin);
    body.append("image", project.imageFile); // fichier
    // لا تحط Content-Type، browser يضبطه وحده
  } else {
    // sinon envoyer en JSON
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(project);
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body,
  });

  if (!res.ok) {
    throw new Error("Erreur ajout projet");
  }

  return await res.json();
};

// UPDATE project (avec image possible)
export const updateProjectApi = async (id, project) => {
  const token = localStorage.getItem("token");

  let body;
  let headers = {
    Authorization: `Bearer ${token}`,
  };

  if (project.imageFile) {
    body = new FormData();
    body.append("titre", project.titre);
    body.append("description", project.description);
    body.append("categorie", project.categorie);
    body.append("statut", project.statut);
    body.append("dateDebut", project.dateDebut);
    body.append("dateFin", project.dateFin);
    body.append("image", project.imageFile);
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(project);
  }

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers,
    body,
  });

  if (!res.ok) {
    throw new Error("Erreur mise à jour projet");
  }

  return await res.json();
};

// DELETE project
export const deleteProjectApi = async (id) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Erreur suppression projet");
  }

  return await res.json();
};
