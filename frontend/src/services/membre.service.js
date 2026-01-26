// src/services/member.service.js
const API_URL = "http://localhost:5300/api/members";

export async function getMembres({
  page = 1,
  recherche = "",
  statut = "",
}) {
  const token = localStorage.getItem("token");

  let url = `${API_URL}?page=${page}`;

  if (recherche) {
    url += `&recherche=${recherche}`;
  }

  if (statut) {
    url += `&statut=${statut}`;
  }

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur chargement membres");

  return res.json();
}

export async function approuverMembre(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/approuver`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur approbation");

  return res.json();
}

export async function rejeterMembre(id) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/${id}/rejeter`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Erreur rejet");

  return res.json();
}

export async function inscrire(formData) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  return res;
}

export default {
  inscrire,
  getMembres,
  approuverMembre,
  rejeterMembre,
};
