import React from 'react';
import PropTypes from 'prop-types';
import './projectCard.css';

const ProjectCard = ({ project }) => {
    const imageUrl = project?.image?.trim()
        ? `http://localhost:5300/${project.image}`
        : 'default-image.jpg';

    return (
        <div className="project-card">
            <img src={imageUrl} alt={project?.titre} className="project-image" onError={(e) => {
                e.target.style.display = "none";
            }} />
            <div className="project-info">
                <h5 className="project-title">{project?.titre}</h5>
                <p className="project-description">{project?.description}</p>
                <a href={`/projects/${project?._id}`} className="btn btn-primary">Voir plus</a>
            </div>
        </div>
    );
};

ProjectCard.propTypes = {
    project: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        titre: PropTypes.string,
        description: PropTypes.string,
        image: PropTypes.string,
    }).isRequired,
};

export default ProjectCard;