import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";  
import { fileURLToPath } from 'url';
import authRoutes from "./routes/authRoute.js";
import adminRouter from "./routes/adminRouter.js";
import upload from './middleware/fileUpload.js';
import { generateThumbnailForHtmlFile } from './middleware/thumbnailGenerator.js';
import SaveTemplate from './models/savedTemplate.model.js';
import Logo from './models/logo.model.js';
import authenticateUser from "./middleware/auth.js";
import blogRoute from "./routes/blogRoutes.js";
import adminBlogRoute from "./routes/adminBlogRoutes.js";
import totalRoutes from './routes/totalRoutes.js'; // Ensure correct path to your routes file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS Setup to Allow Multiple Frontend Origins
const allowedOrigins = [process.env.CLIENT_URL, 'https://design-ease.vercel.app', 'https://design-ease-vazq.vercel.app'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define uploads path
const uploadsPath = path.join(__dirname, 'uploads');
console.log('Uploads path:', uploadsPath);

// Serve static files from the uploads folder
app.use("/uploads", express.static(uploadsPath));
app.use("/uploads/images", express.static(path.join(uploadsPath, 'images')));
app.use("/uploads/videos", express.static(path.join(uploadsPath, 'videos')));
app.use("/uploads/html", express.static(path.join(uploadsPath, 'html')));

// File upload API endpoint
app.post('/api/admin/upload', upload.single('file'), async (req, res) => {
  if (req.file) {
    try {
      if (req.file.mimetype === 'text/html') {
        const thumbnailPath = path.join(path.dirname(req.file.path), `${req.file.originalname}.png`);
        await generateThumbnailForHtmlFile(req.file.path, thumbnailPath);
      }
      res.status(201).send(`File uploaded successfully to ${req.file.path}`);
    } catch (err) {
      console.error("Error processing file upload:", err);
      res.status(500).json({ message: 'Error processing file upload', error: err.message });
    }
  } else {
    res.status(400).json({ message: 'No file uploaded or unsupported file type' });
  }
});

// Gallery routes to retrieve files
app.get("/api/admin/gallery/images", (req, res) => {
  const imagesPath = path.join(uploadsPath, 'images');
  const images = fs.readdirSync(imagesPath).filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.svg') || file.endsWith('.svg+xml'));
  res.json(images);
});

app.get("/api/admin/gallery/videos", (req, res) => {
  const videosPath = path.join(uploadsPath, 'videos');
  const videos = fs.readdirSync(videosPath).filter(file => file.endsWith('.mp4'));
  res.json(videos);
});

app.get("/api/admin/gallery/html", (req, res) => {
  const htmlPath = path.join(uploadsPath, 'html');
  const htmlFiles = fs.readdirSync(htmlPath).filter(file => file.endsWith('.html'));
  
  const htmlFilesWithThumbnails = htmlFiles.map(file => {
    const thumbnail = file.replace('.html', '.png');
    return {
      file,
      thumbnail
    };
  });
  
  res.json(htmlFilesWithThumbnails);
});

app.delete("/api/admin/gallery/:type/:filename", (req, res) => {
  const { type, filename } = req.params;
  
  let folderPath;
  switch (type) {
    case 'images':
      folderPath = path.join(uploadsPath, 'images');
      break;
    case 'videos':
      folderPath = path.join(uploadsPath, 'videos');
      break;
    case 'html':
      folderPath = path.join(uploadsPath, 'html');
      break;
    default:
      return res.status(400).json({ message: 'Invalid file type' });
  }

  const filePath = path.join(folderPath, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting ${type}:`, err);
      return res.status(500).json({ message: `Error deleting ${type}` });
    }
    res.json({ message: `${filename} deleted successfully` });
  });
});

// Serve uploaded files
app.get("/uploads/images/:file", (req, res) => {
  const filePath = path.join(uploadsPath, 'images', req.params.file);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Error sending file' });
    }
    console.log('File sent:', filePath);
  });
});

app.get("/uploads/videos/:file", (req, res) => {
  const filePath = path.join(uploadsPath, 'videos', req.params.file);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Error sending file' });
    }
    console.log('File sent:', filePath);
  });
});

app.get("/uploads/html/:file", (req, res) => {
  const filePath = path.join(uploadsPath, 'html', req.params.file);

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${err}`);
      if (err.code === 'ENOENT') {
        return res.status(404).json({ message: 'File not found' });
      }
      return res.status(500).json({ message: 'Error sending file' });
    }
    console.log('File sent:', filePath);
  });
});

// Updated API endpoint to save templates
app.post('/api/templates', authenticateUser, async (req, res) => {
  console.log('Received template data:', req.body);
  const { name, htmlContent, thumbnail, userId } = req.body;
  
  if (!name || !htmlContent || !thumbnail || !userId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const template = new SaveTemplate({
    name,
    htmlContent,
    thumbnail,
    userId
  });

  try {
    await template.save();
    res.status(201).json({ message: 'Template saved successfully', template });
  } catch (err) {
    console.error('Error saving template:', err);
    res.status(500).json({ message: 'Error saving template', error: err.message });
  }
});

app.get('/api/templates', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const templates = await SaveTemplate.find({ userId }); // Fetch templates for the authenticated user
    res.status(200).json(templates);
  } catch (err) {
    console.error('Error fetching templates:', err);
    res.status(500).json({ message: 'Error fetching templates', error: err.message });
  }
});

// API endpoint to get logos for the authenticated user
app.get('/api/logos', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.id; // Get the authenticated user's ID
    const logos = await Logo.find({ userId }); // Fetch logos for the authenticated user
    res.status(200).json(logos);
  } catch (err) {
    console.error('Error fetching logos:', err);
    res.status(500).json({ message: 'Error fetching logos', error: err.message });
  }
});

app.post('/api/saveLogo', authenticateUser, async (req, res) => {
  console.log('Received logo data:', req.body);
  const { name, image, elements, layers } = req.body;
  const userId = req.user.id;

  if (!name || !image || !elements || !layers) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const logo = new Logo({
    name,
    image,
    elements,
    layers,
    userId
  });

  try {
    await logo.save();
    res.status(201).json({ message: 'Logo saved successfully', logo });
  } catch (err) {
    console.error('Error saving logo:', err);
    res.status(500).json({ message: 'Error saving logo', error: err.message });
  }
});

// Routes for user authentication, blogs, and totals
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/blogs", blogRoute);
app.use("/api/adminBlogs", adminBlogRoute);
app.use("/api/total", totalRoutes);

// Handle errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve static files for production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

