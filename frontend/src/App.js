import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppNavbar from './components/navbar/Navbar'
import Homme from './pages/Homme'
import Login from './pages/Login'
import Dashboard from './pages/dashbord'

import Projets from './pages/Projets'
import Membres from './pages/Membres'
import BenevolePublic from './pages/BenevolePublic'
import InscriptionMembre from './pages/InscriptionMembre'

import Partners from './pages/Partners'

import Contact from './pages/Contact'
import ContactForm from './pages/ContactForm'
import Footer from './components/Footer/Footer'
import ActualitesPublic from './pages/ActualitesPublic'
import GalleryPage from './pages/GalleryPage'
import ProtectedRoute from './components/Protectedroute'

import "./Styles/App.css"
import ProjectAdmin from './pages/ProjetAdmin'
import Actualites from './pages/Actualites'



function App() {
  useEffect(() => {
  document.title = "ADSF";
}, []);

  
  return (

    <BrowserRouter>
      {/* Navbar  tban kan fi les pages public */}
      <AppNavbar />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Homme />} />
        <Route path="/actualites" element={<ActualitesPublic />} />
        <Route path="/benevoles" element={<BenevolePublic />} />
        <Route path="/devenir-benevole" element={<InscriptionMembre />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/projets" element={<Projets />} />
        <Route path="/medias" element={<GalleryPage />} />

        {/* Admin */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        <Route path="/dashboard/projets" element={<ProtectedRoute><ProjectAdmin/></ProtectedRoute>} />

        <Route path="/dashboard/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
        <Route path="/dashboard/membres" element={<ProtectedRoute><Membres /></ProtectedRoute>} />
        <Route path="/dashboard/actualites" element={<ProtectedRoute><Actualites /></ProtectedRoute>} />
        <Route path="/dashboard/partenaires" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
        <Route path="/dashboard/medias" element={<ProtectedRoute><GalleryPage /></ProtectedRoute>} />



      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
