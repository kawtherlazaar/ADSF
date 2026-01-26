import axios from 'axios';
import authHeader from './auth-header';

const API_URL = 'http://localhost:5300/api/media';

class MediaService {
  getMedias(params) {
    return axios.get(API_URL, { params, headers: authHeader() });
  }

  getMediaById(id) {
    return axios.get(`${API_URL}/${id}`, { headers: authHeader() });
  }

  createMedia(data) {
    return axios.post(API_URL, data, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  updateMedia(id, data) {
    return axios.put(`${API_URL}/${id}`, data, {
      headers: {
        ...authHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  deleteMedia(id) {
    return axios.delete(`${API_URL}/${id}`, { headers: authHeader() });
  }
}

const mediaService = new MediaService();
export default mediaService;
