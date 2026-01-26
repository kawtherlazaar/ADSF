import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/actualites");
  },
  filename: (req, file, cb) => {
  const cleanName = file.originalname
    .replace(/\s+/g, "")
    .replace(/[^a-zA-Z0-9.]/g, "");

  cb(null, Date.now() + "-" + cleanName);
},

  
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Images JPG / PNG uniquement"), false);
  }
};

export const uploadActualiteImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 3 * 1024 * 1024 },
});
