import Partner from "../models/partner.model.js";

/* 🟢 PUBLIC : afficher partenaires */
/* export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ statut: "actif" })
      .sort({ createdAt: -1 });

    res.json(partners);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; */
export const getPartners = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { statut, search } = req.query;

    // 🔍 Filter
    let filter = {};

    if (statut) {
      filter.statut = statut;
    }

    if (search) {
      filter.nom = { $regex: search, $options: "i" };
    }

    // 📊 Count total
    const total = await Partner.countDocuments(filter);

    // 📥 Fetch data
    const partners = await Partner.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: partners,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : ajouter partenaire */
export const createPartner = async (req, res) => {
  try {
    const { nom, description, statut } = req.body;

    const partner = await Partner.create({
      nom,
      description,
      statut,
      logo: req.file ? req.file.path : null,
    });

    res.status(201).json({
      message: "Partenaire ajouté avec succès",
      partner,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};



/* 🔐 ADMIN : modifier partenaire */
export const updatePartner = async (req, res) => {
  try {
    const updated = await Partner.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file && { logo: req.file.path }),
      },
      { new: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : supprimer partenaire */
export const deletePartner = async (req, res) => {
  try {
    await Partner.findByIdAndDelete(req.params.id);
    res.json({ message: "Partenaire supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
