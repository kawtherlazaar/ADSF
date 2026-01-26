import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert, Spinner, ProgressBar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { inscrire } from "../services/membre.service";
import "../Styles/InscriptionMembre.css";

function InscriptionMembre() {
  const initialFormState = {
    nomComplet: "",
    email: "",
    telephone: "",
    competences: "",
    disponibilite: "A temps partiel",
    motivation: "",
  };
  
  const [form, setForm] = useState(initialFormState);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Validation des formulaires
  useEffect(() => {
    validateForm();
  }, [form]);

  const validateForm = () => {
    const isValid = 
      form.nomComplet.trim() !== "" && 
      form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.competences.trim() !== "";
    
    setIsFormValid(isValid);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const validateStep = (stepNum) => {
    if (stepNum === 1) {
      return form.nomComplet.trim() !== "";
    } else if (stepNum === 2) {
      return form.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    } else if (stepNum === 3) {
      return form.competences.trim() !== "";
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const prevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const resetForm = () => {
    setForm(initialFormState);
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Veuillez remplir tous les champs obligatoires correctement.");
      return;
    }

    setLoading(true);

    try {
      const res = await inscrire(form);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      setSuccess("Votre inscription a été envoyée avec succès ✅");
      resetForm();

      // Supprimer le message de succès après 5 secondes
      setTimeout(() => {
        setSuccess("");
      }, 5000);
    } catch (err) {
      setError(err.message || "Une erreur inattendue s'est produite");
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="inscription-membre-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="p-4 shadow-sm">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Devenir Bénévole</h2>
                  <p className="text-muted">
                    Rejoignez notre équipe et contribuez à notre mission.
                  </p>
                </div>

                <ProgressBar now={progress} className="mb-4" animated striped variant="success" />

                <Form onSubmit={handleSubmit} noValidate>
                  {step === 1 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-person-circle me-2 text-primary"></i>
                        Votre identité
                      </h5>
                      <Row>
                        <Col>
                          <Form.Group className="mb-4 input-group-custom">
                            <Form.Label className="form-label-custom">
                              <i className="bi bi-person-fill me-2"></i>Nom
                              complet *
                            </Form.Label>
                            <Form.Control
                              type="text"
                              name="nomComplet"
                              placeholder="Jean Dupont"
                              value={form.nomComplet}
                              onChange={handleChange}
                              className="form-control-custom"
                              required
                              isInvalid={form.nomComplet.trim() === "" && form.nomComplet !== ""}
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez saisir votre nom complet.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                        <Button variant="outline-secondary" onClick={() => navigate("/")}>
                          <i className="bi bi-arrow-left me-2"></i>Retour
                        </Button>
                        <Button
                          variant="primary"
                          onClick={nextStep}
                          disabled={!validateStep(1)}
                        >
                          Suivant <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-telephone-fill me-2 text-primary"></i>
                        Vos coordonnées
                      </h5>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-4 input-group-custom">
                            <Form.Label className="form-label-custom">
                              <i className="bi bi-envelope-fill me-2"></i>Email
                              *
                            </Form.Label>
                            <Form.Control
                              type="email"
                              name="email"
                              placeholder="jean.dupont@example.com"
                              value={form.email}
                              onChange={handleChange}
                              className="form-control-custom"
                              required
                              isInvalid={form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)}
                            />
                            <Form.Control.Feedback type="invalid">
                              Veuillez saisir un email valide.
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-4 input-group-custom">
                            <Form.Label className="form-label-custom">
                              <i className="bi bi-phone-fill me-2"></i>
                              Téléphone
                            </Form.Label>
                            <Form.Control
                              type="tel"
                              name="telephone"
                              placeholder="06 12 34 56 78"
                              value={form.telephone}
                              onChange={handleChange}
                              className="form-control-custom"
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                        <Button variant="outline-secondary" onClick={prevStep}>
                          <i className="bi bi-arrow-left me-2"></i>Précédent
                        </Button>
                        <Button
                          variant="primary"
                          onClick={nextStep}
                          disabled={!validateStep(2)}
                        >
                          Suivant <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-tools me-2 text-primary"></i>
                        Vos compétences et disponibilités
                      </h5>
                      <Form.Group className="mb-4 input-group-custom">
                        <Form.Label className="form-label-custom">
                          <i className="bi bi-lightbulb-fill me-2"></i>
                          Compétences *
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="competences"
                          placeholder="Ex: Développement web, gestion de projet, communication..."
                          value={form.competences}
                          onChange={handleChange}
                          className="form-control-custom"
                          required
                          isInvalid={form.competences.trim() === "" && form.competences !== ""}
                        />
                        <Form.Control.Feedback type="invalid">
                          Veuillez décrire vos compétences.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group className="mb-4 input-group-custom">
                        <Form.Label className="form-label-custom">
                          <i className="bi bi-calendar-check-fill me-2"></i>
                          Disponibilité *
                        </Form.Label>
                        <Form.Select
                          name="disponibilite"
                          value={form.disponibilite}
                          onChange={handleChange}
                          className="form-control-custom"
                        >
                          <option value="A temps partiel">A temps partiel</option>
                          <option value="A temps plein">A temps plein</option>
                          <option value="Ponctuellement">Ponctuellement</option>
                        </Form.Select>
                      </Form.Group>
                      <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                        <Button variant="outline-secondary" onClick={prevStep}>
                          <i className="bi bi-arrow-left me-2"></i>Précédent
                        </Button>
                        <Button
                          variant="primary"
                          onClick={nextStep}
                          disabled={!validateStep(3)}
                        >
                          Suivant <i className="bi bi-arrow-right ms-2"></i>
                        </Button>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div>
                      <h5 className="mb-4 fw-bold">
                        <i className="bi bi-heart-fill me-2 text-primary"></i>
                        Votre motivation
                      </h5>
                      <Form.Group className="mb-4 input-group-custom">
                        <Form.Label className="form-label-custom">
                          <i className="bi bi-quote me-2"></i>Pourquoi
                          souhaitez-vous nous rejoindre ?
                        </Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          name="motivation"
                          placeholder="Partagez quelques mots sur votre motivation..."
                          value={form.motivation}
                          onChange={handleChange}
                          className="form-control-custom"
                        />
                      </Form.Group>
                      <div className="d-flex justify-content-between mt-5 pt-3 border-top">
                        <Button variant="outline-secondary" onClick={prevStep}>
                          <i className="bi bi-arrow-left me-2"></i>Précédent
                        </Button>
                        <Button
                          variant="success"
                          type="submit"
                          disabled={loading || !isFormValid}
                          className="btn-submit"
                        >
                          {loading ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              <span className="ms-2">Envoi en cours...</span>
                            </>
                          ) : (
                            <>
                              <i className="bi bi-check-circle-fill me-2"></i>
                              Soumettre l'inscription
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {error && (
                    <Alert as="output" variant="danger" className="mt-4 d-flex align-items-center">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </Alert>
                  )}
                  {success && (
                    <Alert as="output" variant="success" className="mt-4 d-flex align-items-center">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {success}
                    </Alert>
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default InscriptionMembre;