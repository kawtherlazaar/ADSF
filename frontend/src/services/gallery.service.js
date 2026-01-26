import axios from 'axios';

const API_URL = 'http://localhost:5300/api/gallery/';

const authHeader = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

const getGalleryItems = () => {
  return axios.get(API_URL);
};

const getGalleryItem = (id) => {
  return axios.get(API_URL + id);
};

const createGalleryItem = (data) => {
  return axios.post(API_URL, data, {
    headers: {
      ...authHeader(),
      'Content-Type': 'multipart/form-data'
    }
  });
};

const updateGalleryItem = (id, data) => {
  return axios.put(API_URL + id, data, { headers: authHeader() });
};

const deleteGalleryItem = (id) => {
  return axios.delete(API_URL + id, { headers: authHeader() });
};

const galleryService = {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};

export default galleryService;