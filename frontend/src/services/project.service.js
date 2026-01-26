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

// GET all projects (alias)
export const getAllProjects = async () => {
  return getProjects();
};

// ADD project
export const addProject = async (project) => {
  const token = localStorage.getItem("token");

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: project, // project is FormData
  });

  if (!res.ok) {
    throw new Error("Erreur ajout projet");
  }

  return await res.json();
};

// UPDATE project
export const updateProjectApi = async (id, project) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(project),
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