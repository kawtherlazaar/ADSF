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
    const actualite = new Actualite({
      ...req.body,
      image: req.file ? req.file.filename : null,
    });

    await actualite.save();
    res.status(201).json(actualite);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/* 🔐 ADMIN : modifier */
export const updateActualite = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.file) {
      data.image = req.file.filename;
    }

    const actualite = await Actualite.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    res.json(actualite);
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
