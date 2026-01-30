import React, { useState } from 'react'
import contactService from '../services/contact.service'

function ContactForm() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setError(null)
      await contactService.sendContact(formData)
      setSuccess(true)
      setFormData({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: ''
      })
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err)
      setError('Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mt-5 mb-5">
      <h1 className="mb-4">Nous Contacter</h1>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          {success && (
            <div className="alert alert-success" role="alert">
              Votre message a été envoyé avec succès!
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="nom" className="form-label">Nom</label>
              <input
                type="text"
                className="form-control"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="telephone" className="form-label">Téléphone</label>
              <input
                type="tel"
                className="form-control"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label htmlFor="sujet" className="form-label">Sujet</label>
              <input
                type="text"
                className="form-control"
                id="sujet"
                name="sujet"
                value={formData.sujet}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                className="form-control"
                id="message"
                name="message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ContactForm
