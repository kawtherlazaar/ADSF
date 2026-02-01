import Member from "../models/member.model.js";
import Project from "../models/project.model.js";
import Partner from "../models/partner.model.js";
import Media from "../models/media.model.js";
import Actualite from "../models/actualite.model.js";

/* 📊 STATISTIQUES DASHBOARD (ADMIN) */
export const getStatistiquesDashboard = async (req, res) => {
  try {
    /* 🔢 Totaux */
    const totalMembres = await Member.countDocuments();
    const totalProjets = await Project.countDocuments();
    const totalPartenaires = await Partner.countDocuments();
    const totalMedias = await Media.countDocuments();
    const totalActualites = await Actualite.countDocuments();

    /* 👥 Membres par statut */
const membresParStatut = {
  enAttente: await Member.countDocuments({ statut: "en_attente" }),
  approuves: await Member.countDocuments({ statut: "approuve" }),
  rejetes: await Member.countDocuments({ statut: "rejete" }),
};


    /* 🖼️ Médias par type */
    const mediasParType = {
      photos: await Media.countDocuments({ type: "photo" }),
      videos: await Media.countDocuments({ type: "video" }),
    };

    /* 🆕 Derniers ajouts */
    const derniersMembres = await Member.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const derniersProjets = await Project.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const derniersMedias = await Media.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totaux: {
        membres: totalMembres,
        projets: totalProjets,
        partenaires: totalPartenaires,
        medias: totalMedias,
        actualites: totalActualites,
      },
      membresParStatut,
      mediasParType,
      derniersAjouts: {
        membres: derniersMembres,
        projets: derniersProjets,
        medias: derniersMedias,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors du chargement du dashboard",
      erreur: error.message,
    });
  }
};
