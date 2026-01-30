// src/controllers/project.controller.js
import Project from "../models/project.model.js";

/* =====================================================
   🟢 GET PROJECTS
   - Pagination
   - Filtres (statut, categorie)
   - Recherche (titre)
===================================================== */
export const getProjects = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const filters = {};

    if (req.query.statut) {
      filters.statut = req.query.statut;
    }

    if (req.query.categorie) {
      filters.categorie = req.query.categorie;
    }

    if (req.query.search) {
      filters.titre = {
        $regex: req.query.search,
        $options: "i",
      };
    }

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
   image تجي من req.file (multer)
===================================================== */
export const createProject = async (req, res) => {
  try {
    const project = await Project.create({
      titre: req.body.titre,
      description: req.body.description,
      categorie: req.body.categorie,
      statut: req.body.statut,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
      image: req.file ? req.file.path : "", // ✅ هنا التعديل
    });

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
    const data = {
      titre: req.body.titre,
      description: req.body.description,
      categorie: req.body.categorie,
      statut: req.body.statut,
      dateDebut: req.body.dateDebut,
      dateFin: req.body.dateFin,
    };

    // لو فما image جديدة
    if (req.file) {
      data.image = req.file.path;
    }

    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      data,
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
