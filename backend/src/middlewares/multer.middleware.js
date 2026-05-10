import multer from "multer";
import path from "path";
import fs from "fs";

fs.mkdirSync("public/uploads", { recursive: true });

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "public/uploads");
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error("Only PDF, DOC, and DOCX resume files are allowed"));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
