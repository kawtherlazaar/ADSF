import React, { useState, useEffect } from 'react';
import mediaService from '../services/media.service';
import authService from '../services/auth.service';
import '../Styles/GalleryPage.css';

const GalleryPage = () => {
    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newMedia, setNewMedia] = useState({ titre: '', type: 'photo', description: '', statut: 'actif', lien: '' });
    const [currentMedia, setCurrentMedia] = useState(null);
    const [file, setFile] = useState(null);
    const [filter, setFilter] = useState('all');

    const [showLogin, setShowLogin] = useState(false);
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = authService.getCurrentUser();
        if (loggedInUser) {
            setUser(loggedInUser);
        }
        loadMedias();
    }, []);

    useEffect(() => {
        let result = media;
        if (filter !== 'all') {
            result = media.filter(m => m.type === filter);
        }
        setFilteredMedia(result);
    }, [filter, media]);

    const loadMedias = async () => {
        try {
            const response = await mediaService.getMedias();
            setMedia(response.data);
        } catch (error) {
            setError('Erreur lors du chargement des médias.');
            console.error('Erreur de chargement des médias!', error);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await authService.login(credentials.email, credentials.password);
            setUser(response.data);
            setShowLogin(false);
        } catch (error) {
            setError('Email ou mot de passe incorrect.');
        }
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMedia({ ...newMedia, [name]: value });
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentMedia({ ...currentMedia, [name]: value });
    };

    const handleAddMedia = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titre', newMedia.titre);
        formData.append('type', newMedia.type);
        formData.append('description', newMedia.description);
        formData.append('statut', newMedia.statut);
        if (newMedia.type === 'video') {
            formData.append('lien', newMedia.lien);
        } else if (file) {
            formData.append('fichier', file);
        }

        try {
            await mediaService.createMedia(formData);
            setShowModal(false);
            setNewMedia({ titre: '', type: 'photo', description: '', statut: 'actif', lien: '' });
            setFile(null);
            loadMedias();
        } catch (error) {
            setError('Erreur lors de l\'ajout du média.');
            console.error(error);
        }
    };

    const handleUpdateMedia = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('titre', currentMedia.titre);
        formData.append('type', currentMedia.type);
        formData.append('description', currentMedia.description);
        formData.append('statut', currentMedia.statut);
        if (currentMedia.type === 'video') {
            formData.append('lien', currentMedia.lien);
        }
        if (file) {
            formData.append('fichier', file);
        }

        try {
            await mediaService.updateMedia(currentMedia._id, formData);
            setShowEditModal(false);
            setCurrentMedia(null);
            setFile(null);
            loadMedias();
        } catch (error) {
            setError('Erreur lors de la mise à jour du média.');
            console.error(error);
        }
    };

    const handleDeleteMedia = async () => {
        try {
            await mediaService.deleteMedia(currentMedia._id);
            setShowDeleteModal(false);
            setCurrentMedia(null);
            loadMedias();
        } catch (error) {
            setError('Erreur lors de la suppression du média.');
            console.error(error);
        }
    };

    const openEditModal = (mediaItem) => {
        setCurrentMedia(mediaItem);
        setShowEditModal(true);
    };

    const openDeleteModal = (mediaItem) => {
        setCurrentMedia(mediaItem);
        setShowDeleteModal(true);
    };

    return (
        <div className="gallery-container">
            <div className="gallery-header">
                <h1>Galerie Média</h1>
                {user ? (
                    <div>
                        <span>Bonjour, {user.username}</span>
                        <button onClick={handleLogout} className="btn btn-secondary">Déconnexion</button>
                        <button onClick={() => setShowModal(true)} className="btn btn-primary">Ajouter Média</button>
                    </div>
                ) : (
                    <button onClick={() => setShowLogin(true)} className="btn btn-primary">Connexion Admin</button>
                )}
            </div>

            {error && <p className="error">{error}</p>}

            <div className="filter-buttons">
                <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Tout</button>
                <button onClick={() => setFilter('photo')} className={filter === 'photo' ? 'active' : ''}>Photos</button>
                <button onClick={() => setFilter('video')} className={filter === 'video' ? 'active' : ''}>Vidéos</button>
            </div>

            <div className="gallery-grid">
                {filteredMedia.map((item) => (
                    <div key={item._id} className="gallery-item">
                        {item.type === 'photo' ? (
                            <img src={`http://localhost:5300/${item.fichier}`} alt={item.titre} onError={(e) => {
                                e.target.style.display = "none";
                            }} />
                        ) : (
                            <video controls src={item.lien ? item.lien : `http://localhost:5300/${item.fichier}`}></video>
                        )}
                        <div className="gallery-item-info">
                            <h4>{item.titre}</h4>
                            <p>{item.description}</p>
                        </div>
                        {user && (
                            <div className="admin-actions">
                                <button onClick={() => openEditModal(item)} className="btn btn-warning">Modifier</button>
                                <button onClick={() => openDeleteModal(item)} className="btn btn-danger">Supprimer</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {showLogin && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowLogin(false)} onKeyPress={(e) => e.key === 'Enter' && setShowLogin(false)} role="button" tabIndex="0">&times;</span>
                        <form onSubmit={handleLogin}>
                            <h2>Connexion</h2>
                            <input type="email" placeholder="Email" value={credentials.email} onChange={(e) => setCredentials({ ...credentials, email: e.target.value })} required />
                            <input type="password" placeholder="Mot de passe" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} required />
                            <button type="submit" className="btn btn-primary">Se connecter</button>
                        </form>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowModal(false)} onKeyPress={(e) => e.key === 'Enter' && setShowModal(false)} role="button" tabIndex="0">&times;</span>
                        <form onSubmit={handleAddMedia}>
                            <h2>Ajouter un nouveau média</h2>
                            <input type="text" name="titre" placeholder="Titre" value={newMedia.titre} onChange={handleInputChange} required />
                            <select name="type" value={newMedia.type} onChange={handleInputChange}>
                                <option value="photo">Photo</option>
                                <option value="video">Vidéo</option>
                            </select>
                            {newMedia.type === 'photo' ? (
                                <input type="file" name="fichier" onChange={handleFileChange} required />
                            ) : (
                                <input type="text" name="lien" placeholder="URL de la vidéo" value={newMedia.lien || ''} onChange={handleInputChange} required />
                            )}
                            <textarea name="description" placeholder="Description" value={newMedia.description} onChange={handleInputChange}></textarea>
                            <button type="submit" className="btn btn-primary">Ajouter</button>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && currentMedia && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowEditModal(false)} onKeyPress={(e) => e.key === 'Enter' && setShowEditModal(false)} role="button" tabIndex="0">&times;</span>
                        <form onSubmit={handleUpdateMedia}>
                            <h2>Modifier le média</h2>
                            <input type="text" name="titre" placeholder="Titre" value={currentMedia.titre} onChange={handleEditInputChange} required />
                            <select name="type" value={currentMedia.type} onChange={handleEditInputChange}>
                                <option value="photo">Photo</option>
                                <option value="video">Vidéo</option>
                            </select>
                            {currentMedia.type === 'photo' ? (
                                <input type="file" name="fichier" onChange={handleFileChange} />
                            ) : (
                                <input type="text" name="lien" placeholder="URL de la vidéo" value={currentMedia.lien || ''} onChange={handleEditInputChange} />
                            )}
                            <textarea name="description" placeholder="Description" value={currentMedia.description} onChange={handleEditInputChange}></textarea>
                            <button type="submit" className="btn btn-primary">Mettre à jour</button>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && currentMedia && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirmer la suppression</h2>
                        <p>Êtes-vous sûr de vouloir supprimer "{currentMedia.titre}" ?</p>
                        <button onClick={handleDeleteMedia} className="btn btn-danger">Supprimer</button>
                        <button onClick={() => setShowDeleteModal(false)} className="btn btn-secondary">Annuler</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GalleryPage;
