import axios from 'axios'

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5300'

class ContactService {
  sendContact(data) {
    return axios.post(`${API_URL}/api/contacts`, data)
  }

  getAllContacts() {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/api/contacts`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }

  getContactById(id) {
    const token = localStorage.getItem('token')
    return axios.get(`${API_URL}/api/contacts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }

  deleteContact(id) {
    const token = localStorage.getItem('token')
    return axios.delete(`${API_URL}/api/contacts/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
  }
}

export default new ContactService()
