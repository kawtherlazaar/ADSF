import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";
import { useTheme } from "../../hooks/useTheme";


function AppNavbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Navbar bg={theme === 'dark' ? "dark" : "light"} variant={theme === 'dark' ? "dark" : "light"} expand="lg" className="navbar-custom" style={{
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderBottom: `1px solid ${theme === 'dark' ? '#334155' : '#dee2e6'}`
    }}>
      <Container>
        {/* Logo / Nom جمعية */}
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <img
            src="/logo.png"
            alt="Logo"
            width="35"
            height="35"
            
            style={{ objectFit: "cover" ,
                borderRadius: "30%",
                marginRight: "12px",
                padding: "2px"
              }}
            className="logo"
          />
          Dev Sans Frontière
        </Navbar.Brand>

        {/* Bouton téléphone */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-links">
            <Nav.Link as={Link} to="/">
             Acceuil
            </Nav.Link>
            <Nav.Link as={Link} to="/projets">
              Projets
            </Nav.Link>
            <Nav.Link as={Link} to="/actualites">
              Actualités
            </Nav.Link>
            <Nav.Link as={Link} to="/medias">
              Médias
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              Contact
            </Nav.Link>
            <Nav.Link as={Link} to="/devenir-benevole" className="benevole-link">
               benevole

            </Nav.Link>
            <Nav.Link as={Link} to="/login" className="login-link">
              Admin
            </Nav.Link>
             <div className="theme-toggle-wrapper">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
           
          </Nav>
          
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
