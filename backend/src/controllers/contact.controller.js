import Contact from "../models/contact.model.js";

/* 🟢 PUBLIC : envoyer message (ANONYME) */
export const sendMessage = async (req, res) => {
  try {
    const { nom, email, telephone, sujet, message } = req.body;

    const contact = await Contact.create({
      nom,
      email,
      telephone,
      sujet,
      message,
    });

    res.status(201).json({
      message: "Message envoyé avec succès",
      contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : liste messages (filter + pagination) */
export const getMessages = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { lu, search } = req.query;

    const filter = { supprime: false };

    if (lu !== undefined) {
      filter.lu = lu === "true";
    }

    if (search) {
      filter.$or = [
        { nom: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { telephone: { $regex: search, $options: "i" } },
        { sujet: { $regex: search, $options: "i" } },
      ];
    }

    const total = await Contact.countDocuments(filter);

    const messages = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      messages,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : marquer comme lu */
export const markAsRead = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { lu: true },
      { new: true }
    );

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* 🔐 ADMIN : soft delete */
export const deleteMessage = async (req, res) => {
  try {
    await Contact.findByIdAndUpdate(req.params.id, {
      supprime: true,
    });

    res.json({ message: "Message supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
