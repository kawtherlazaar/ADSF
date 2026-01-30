import { Card } from "react-bootstrap";

export default function StatCard({ title, value, icon, color }) {
  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Body className="d-flex align-items-center">
        <div
          className={`rounded-circle bg-${color} text-white d-flex align-items-center justify-content-center`}
          style={{ width: 50, height: 50 }}
        >
          <i className={`bi ${icon} fs-4`}></i>
        </div>

        <div className="ms-3">
          <h5 className="mb-0">{value}</h5>
          <small className="text-muted">{title}</small>
        </div>
      </Card.Body>
    </Card>
  );
}
