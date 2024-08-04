import multer from "multer";

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "video/mp3": "mp3",
  "video/mpeg": "mp3",
  "video/mp4": "mp4",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    // Vérifie si l'extension est définie et est l'un des types autorisés
    if (extension) {
      callback(null, "./assets/photos_artisans");
    } else {
      callback(new Error("Type de fichier non pris en charge"));
    }
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    
    if (!extension) {
      return callback(new Error("Type de fichier non pris en charge"));
    }

    callback(null, `${Date.now()}-${name}.${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const extension = MIME_TYPES[file.mimetype];
  if (extension) {
    callback(null, true);
  } else {
    callback(new Error("Type de fichier non pris en charge"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 }, // Limite la taille des fichiers à 10 Mo
}).fields([
  { name: "recto", maxCount: 1 },
  { name: "verso", maxCount: 1 },
  { name: "selfie", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

export default upload;