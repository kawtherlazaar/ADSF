import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("video")) {
      cb(null, "uploads/media/videos");
    } else {
      cb(null, "uploads/media/images");
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, ""));
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "video/mp4"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Images JPG/PNG ou vidéo MP4 seulement"), false);
  }
};

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: { fileSize: 90 * 1024 * 1024 }, // 90MB للفيديو
});
