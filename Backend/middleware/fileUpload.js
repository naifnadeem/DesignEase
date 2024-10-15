import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File upload middleware
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/svg+xml') {
      uploadPath = path.join(__dirname, '../uploads/images');
    } else if (file.mimetype === 'video/mp4') {
      uploadPath = path.join(__dirname, '../uploads/videos');
    } else if (file.mimetype === 'text/html') {
      uploadPath = path.join(__dirname, '../uploads/html');
    } else {
      return cb(new Error('Only image (JPEG, PNG, SVG), video (MP4), and HTML files are allowed!'));
    }

    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Optional: You can add a timestamp or unique ID to avoid name conflicts
    const ext = path.extname(file.originalname);
    const fileName = path.basename(file.originalname, ext) + ext;
    cb(null, fileName);
  },
});

const upload = multer({ 
  storage, 
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'text/html'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, SVG, MP4, and HTML files are allowed!'));
    }
  }
});

export default upload;
