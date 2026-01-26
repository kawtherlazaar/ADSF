import { useEffect, useState } from "react";
import { getProjects } from "../services/project.service";
import ProjectCard from "../components/projects/projectCard";

function Projets() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getProjects()
      .then(data => {
        setProjects(data.projects || []);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Nos Projets</h2>

      <div className="row">
        {projects.map(p => (
          <div className="col-md-4 mb-3" key={p._id}>
            <ProjectCard project={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projets;
