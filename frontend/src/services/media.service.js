import authHeader from "./auth-header";

const API_URL = "http://localhost:5300/api/medias";

const getHeaders = (isFormData = false) => {
  const headers = authHeader();

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const mediaService = {

  async getMedias(params = {}) {
    const query = new URLSearchParams(params).toString();

    const res = await fetch(`${API_URL}?${query}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch medias");
    return res.json();
  },

  async getMediaById(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to fetch media");
    return res.json();
  },

  async createMedia(data) {
    const isFormData = data instanceof FormData;

    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to create media");
    return res.json();
  },

  async updateMedia(id, data) {
    const isFormData = data instanceof FormData;

    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Failed to update media");
    return res.json();
  },

  async deleteMedia(id) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!res.ok) throw new Error("Failed to delete media");
    return res.json();
  },
};

export default mediaService;
