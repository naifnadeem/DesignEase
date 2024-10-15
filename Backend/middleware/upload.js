import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 10, 
  },
  fileFilter(req, file, cb) {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/svg+xml', 'video/mp4', 'text/html'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, SVG, MP4, and HTML files are allowed!'), false);
    }
  },
});

export default upload;
