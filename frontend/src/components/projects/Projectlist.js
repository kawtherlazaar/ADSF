import { useEffect, useState } from "react";
import { getAllProjects } from "../../services/project.service";
import ProjectCard from "./projectCard";

function ProjectsList() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getAllProjects().then(setProjects);
  }, []);

  return (
    <div className="row">
      {projects.length === 0 && <p>Aucun projet</p>}

      {projects.map((p) => (
        <ProjectCard key={p._id} project={p} />
      ))}
    </div>
  );
}

export default ProjectsList;
