// src/controllers/project.controller.js
import Project from "../models/project.model.js";

/* =====================================================
   🟢 GET PROJECTS
   - Pagination
   - Filtres (status, category)
   - Recherche (title)
===================================================== */
export const getProjects = async (req, res) => {
  try {
    /* Pagination */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    /* Filtres */
    const filters = {};

    if (req.query.status) {
      filters.status = req.query.status;
    }

    if (req.query.category) {
      filters.category = req.query.category;
    }

    /* Recherche par titre */
    if (req.query.search) {
      filters.title = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    /* Requête */
    const projects = await Project.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(filters);

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalProjects: total,
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =====================================================
   🟢 GET PROJECT BY ID
===================================================== */
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   🟢 CREATE PROJECT (ADMIN)
===================================================== */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   🟢 UPDATE PROJECT (ADMIN)
===================================================== */
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* =====================================================
   🟢 DELETE PROJECT (ADMIN)
===================================================== */
export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Projet introuvable" });
    }

    res.json({ message: "Projet supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
