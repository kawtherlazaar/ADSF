import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getDashboard } from "../services/dashbord.service";

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
  "/images/hero4.jpg",
  "/images/hero5.jpg",
  "/images/hero6.jpg",
  "/images/hero7.jpg",
  "/images/hero8.jpg",
  "/images/hero9.jpg",
  "/images/hero10.jpg",
];

function Homme() {
  const [data, setData] = useState(null);
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  // 🔹 fetch dashboard stats
  useEffect(() => {
    getDashboard()
      .then(setData)
      .catch(console.error);
  }, []);

  // 🔹 HERO SLIDESHOW (هذا اللي كان ناقص)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000); // كل 5 ثواني

    return () => clearInterval(interval);
  }, []);

  const totaux = data?.totaux || {};

  return (
    <>
      {/* ===== HERO ===== */}
      <div
        className="hero-section text-white d-flex align-items-center"
        style={{
          backgroundImage: `url(${images[index]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          transition: "background-image 1s ease-in-out", // نعومة التبديل
        }}
      >
        <div className="container">
          <div className="text-center mb-5">
            <h1 className="fw-bold">
              Association Développement Sans Frontière
            </h1>

            <p className="lead mt-3">
              Association humanitaire engagée dans l’aide sociale,
              le bénévolat et le développement communautaire.
            </p>

            <button
              className="btn btn-primary mt-3 px-4 py-2"
              onClick={() => navigate("/projets")}
            >
              Voir nos Projets
            </button>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="container py-5">
        <h1 className="text-center fw-bold mb-4">
          Nos chiffres clés
        </h1>

        <Row className="g-4 justify-content-center">
          <Col md={4}>
            <Card className="shadow-sm text-center h-100">
              <Card.Body>
                <i className="bi bi-list-ul fs-1 text-primary" />
                <h6 className="mt-2">Projets</h6>
                <h3 className="fw-bold">{totaux.projets ?? 0}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center h-100">
              <Card.Body>
                <i className="bi bi-people fs-1 text-success" />
                <h6 className="mt-2">Bénévoles</h6>
                <h3 className="fw-bold">{totaux.membres ?? 0}</h3>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="shadow-sm text-center h-100">
              <Card.Body>
                <i className="bi bi-person-check fs-1 text-warning" />
                <h6 className="mt-2">Bénéficiaires</h6>
                <h3 className="fw-bold">+3000</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Homme;
