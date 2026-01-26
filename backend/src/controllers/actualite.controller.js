import Actualite from "../models/actualite.model.js";

/* 🟢 PUBLIC : liste avec filter + pagination */
export const getActualites = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const { categorie, search } = req.query;

    let filter = {
      supprime: false,
      statut: "actif",
    };

    if (categorie) {
      filter.categorie = categorie;
    }

    if (search) {
      filter.titre = { $regex: search, $options: "i" };
    }

    const total = await Actualite.countDocuments(filter);

    const actualites = await Actualite.find(filter)
      .sort({ datePublication: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      data: actualites,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : créer actualité */
export const createActualite = async (req, res) => {
  try {
    const actualite = await Actualite.create({
      ...req.body,
      image: req.file
        ? `/uploads/actualites/${req.file.filename}`
        : null,
    });

    res.status(201).json({
      message: "Actualité ajoutée avec succès",
      actualite,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/* 🔐 ADMIN : modifier */
export const updateActualite = async (req, res) => {
  try {
    const updated = await Actualite.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file && { image: req.file.path }),
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : SOFT DELETE */
export const deleteActualite = async (req, res) => {
  try {
    await Actualite.findByIdAndUpdate(req.params.id, {
      supprime: true,
      statut: "archive",
    });

    res.json({ message: "Actualité supprimée (soft delete)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
