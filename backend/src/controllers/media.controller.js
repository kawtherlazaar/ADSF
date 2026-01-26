import Media from "../models/media.model.js";

export const getMedias = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { statut, type, search } = req.query;

    let filter = {};

    // ✅ filtre statut فقط إذا موجود
    if (statut && statut !== "all") {
      filter.statut = statut;
    }

    // ✅ filtre type (photo / video)
    if (type && type !== "all") {
      filter.type = type;
    }

    // ✅ recherche par titre
    if (search && search.trim() !== "") {
      filter.titre = { $regex: search, $options: "i" };
    }

    // 🔎 DEBUG (مهم)
    console.log("FILTER MEDIA:", filter);

    const total = await Media.countDocuments(filter);

    const medias = await Media.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: medias,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* 🔐 ADMIN : ajouter média */
export const createMedia = async (req, res) => {
  try {
    const { titre, type, lien } = req.body;

    const media = await Media.create({
      titre,
      type, // image | video
      fichier: req.file ? req.file.path : null,
      lien: lien || null,
    });

    res.status(201).json({
      message: "Média ajouté avec succès",
      media,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/* 🔐 ADMIN : modifier média */
export const updateMedia = async (req, res) => {
  try {
    const data = {
      ...req.body,
    };

    // 🖼️ si nouveau fichier uploadé
    if (req.file) {
      data.fichier = req.file.path;
    }

    const updated = await Media.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Média introuvable" });
    }

    res.json({
      message: "Média mis à jour",
      media: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : soft delete média */
export const deleteMedia = async (req, res) => {
  try {
    const media = await Media.findByIdAndUpdate(
      req.params.id,
      { deleted: true },
      { new: true }
    );

    if (!media) {
      return res.status(404).json({ message: "Média introuvable" });
    }

    res.json({
      message: "Média supprimé (soft delete)",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/* 🟢 PUBLIC : get media by id */
export const getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        message: "Média non trouvé",
      });
    }

    res.json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

