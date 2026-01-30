import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { inscrire } from "../services/membre.service";
import "../Styles/InscriptionMembre.css";

function InscriptionMembre() {
  const initialFormState = {
    nom: "",
    prenom: "",
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

  useEffect(() => {
    const valid =
      form.nom.trim() !== "" &&
      form.prenom.trim() !== "" &&
      form.telephone.trim() !== "" &&
      form.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      form.competences.trim() !== "";

    setIsFormValid(valid);
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!isFormValid) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setLoading(true);

    try {
      // ✅ payload مطابق للـ BACK
      const payload = {
        nom: form.nom.trim(),
        prenom: form.prenom.trim(),
        email: form.email.trim(),
        telephone: form.telephone.trim(),
        disponibilite: form.disponibilite,
        competences: form.competences
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
      };

      const res = await inscrire(payload);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Erreur lors de l'inscription");
      }

      setSuccess("Votre inscription a été envoyée avec succès ✅");
      setForm(initialFormState);
      setStep(1);
    } catch (err) {
      setError(err.message || "Erreur serveur");
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
                <h2 className="text-center mb-4 fw-bold">
                  Devenir Bénévole
                </h2>

                <ProgressBar
                  now={progress}
                  className="mb-4"
                  animated
                  striped
                />

                <Form onSubmit={handleSubmit}>
                  {/* STEP 1 */}
                  {step === 1 && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Prénom *</Form.Label>
                        <Form.Control
                          name="prenom"
                          value={form.prenom}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Nom *</Form.Label>
                        <Form.Control
                          name="nom"
                          value={form.nom}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Button onClick={() => setStep(2)} disabled={!form.nom || !form.prenom}>
                        Suivant
                      </Button>
                    </>
                  )}

                  {/* STEP 2 */}
                  {step === 2 && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Téléphone *</Form.Label>
                        <Form.Control
                          name="telephone"
                          value={form.telephone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Button variant="secondary" onClick={() => setStep(1)}>
                        Précédent
                      </Button>{" "}
                      <Button onClick={() => setStep(3)}>Suivant</Button>
                    </>
                  )}

                  {/* STEP 3 */}
                  {step === 3 && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Compétences (séparées par des virgules) *</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="competences"
                          value={form.competences}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Disponibilité</Form.Label>
                        <Form.Select
                          name="disponibilite"
                          value={form.disponibilite}
                          onChange={handleChange}
                        >
                          <option value="A temps partiel">A temps partiel</option>
                          <option value="A temps plein">A temps plein</option>
                          <option value="Occasionnel">Occasionnel</option>
                          <option value="À distance">À distance</option>
                        </Form.Select>
                      </Form.Group>

                      <Button variant="secondary" onClick={() => setStep(2)}>
                        Précédent
                      </Button>{" "}
                      <Button onClick={() => setStep(4)}>Suivant</Button>
                    </>
                  )}

                  {/* STEP 4 */}
                  {step === 4 && (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Label>Motivation (optionnel)</Form.Label>
                        <Form.Control
                          as="textarea"
                          name="motivation"
                          value={form.motivation}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Button variant="secondary" onClick={() => setStep(3)}>
                        Précédent
                      </Button>{" "}
                      <Button type="submit" disabled={loading || !isFormValid}>
                        {loading ? "Envoi..." : "Soumettre"}
                      </Button>
                    </>
                  )}

                  {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
                  {success && <Alert variant="success" className="mt-3">{success}</Alert>}
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
