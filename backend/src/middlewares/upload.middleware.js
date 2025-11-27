const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Path relative to where server.js runs (backend/src)
// This will create backend/uploads
const uploadsDirPath = path.join(__dirname, "../../uploads");

// Ensure uploads directory exists
if (!fs.existsSync(uploadsDirPath)) {
  fs.mkdirSync(uploadsDirPath, { recursive: true });
}

const storageEngine = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadsDirPath);
  },
  filename(req, file, callback) {
    // generate unique filename: fieldname-timestamp-randomstring.ext
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    callback(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, callback) {
  const allowedFileTypes = /jpeg|jpg|png|gif|webp/;
  const extensionMatched = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetypeMatched = allowedFileTypes.test(file.mimetype);

  if (extensionMatched && mimetypeMatched) {
    callback(null, true);
  } else {
    callback(
      new Error("Only image files (JPEG, JPG, PNG, GIF, WebP) are allowed!")
    );
  }
}

const uploadBookCoverImage = multer({
  storage: storageEngine,
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter(req, file, callback) {
    checkFileType(file, callback);
  },
}).single("coverImage");

const uploadAvatarImage = multer({
  storage: storageEngine,
  limits: {
    files: 1,
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter(req, file, callback) {
    checkFileType(file, callback);
  },
}).single("avatar");

module.exports = { uploadBookCoverImage, uploadAvatarImage };
