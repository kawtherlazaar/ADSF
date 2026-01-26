import { Col, Container, Row } from "react-bootstrap";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
export default function Footer() {

return(

<footer className="footer-dark pt-5">
  <Container>
    <Row className="align-items-start mb-4">

      {/* LEFT COLUMN */}
      <Col md={6} className="mb-4 mb-md-0">

        <a
          href="https://www.google.com/maps/search/?api=1&query=Complexe+administratif+d'Oswa+Tataouine"
          target="_blank"
          rel="noopener noreferrer"
          className="d-flex align-items-start mb-3 text-decoration-none text-light"
        >
          <img src="/images/location.png" alt="location" className="me-3 footer-icon" />
          <div>
            <strong>Complexe administratif d'Oswa</strong><br />
            3ème étage – route de Médenine Km1, Tataouine
          </div>
        </a>

        <a
          href="tel:+21695794563"
          className="d-flex align-items-center mb-3 text-decoration-none text-light"
        >
          <img src="/images/phone.png" alt="phone" className="me-3 footer-icon" />
          <span>+216 29 287 310</span>
        </a>

        <a
          href="mailto:adsf.tataouine@gmail.com"
          className="d-flex align-items-center text-decoration-none text-light"
        >
          <img src="/images/email.png" alt="email" className="me-3 footer-icon" />
          <span>adsf.tataouine@gmail.com</span>
        </a>
      </Col>

      {/* RIGHT COLUMN */}
      <Col md={6} className="text-md-start text-center">
        <h5 className="mb-3 text-white">À propos de l’association</h5>
        <p className="footer-text">
          Development Sans Frontière est une organisation engagée dans le
          développement solidaire et durable à travers l’innovation et la
          technologie.
        </p>

        <div className="d-flex justify-content-center gap-4 mt-3">
               <a href="https://www.facebook.com/Adsf.tataouine" className="facebook-icon">
              <FaFacebookF />
            </a>
             <a href="https://wa.me/21629287310
" className="whatsapp-icon">
          <FaWhatsapp />
          </a>
        </div>

        
      </Col>
    </Row>

    {/* COPYRIGHT */}
    <Row className="footer-bottom text-center text-md-start">
      <Col id="re">
        © {new Date().getFullYear()} Development Sans Frontière. Tous droits réservés.
      </Col>
      
    </Row>
  </Container>
</footer>
);
}
