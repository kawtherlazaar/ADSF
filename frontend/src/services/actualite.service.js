const API_URL = "http://localhost:5300/api/actualites";

/* 🔓 PUBLIC */
export async function fetchActualites({
  page = 1,
  limit = 6,
  categorie,
  search,
} = {}) {
  const params = new URLSearchParams({
    page,
    limit,
    ...(categorie && { categorie }),
    ...(search && { search }),
  });

  const res = await fetch(`${API_URL}?${params}`);

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des actualités");
  }

  return res.json();
}

/* 🔐 ADMIN – CREATE */
export async function createActualite(data) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur création actualité");
  }

  return res.json();
}

/* 🔐 ADMIN – UPDATE */
export async function updateActualite(id, data) {
  const token = localStorage.getItem("token");

  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== "") {
      formData.append(key, data[key]);
    }
  });

  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur modification");
  }

  return res.json();
}

/* 🔐 ADMIN – DELETE */
export async function deleteActualite(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Erreur suppression");
  }

  return res.json();
}
