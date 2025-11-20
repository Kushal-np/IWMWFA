import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const fileType = file.mimetype;
  if (fileType.startsWith("image/")) {
    cb(null, true); // Accept image file
  } else {
    cb(null, false); // Reject non-image file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

export { upload }; // ← Changed to named export