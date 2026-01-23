// Proxy server that serves both frontend and backend
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve frontend static files if build directory exists
const buildPath = path.join(__dirname, 'frontend/build');
if (fs.existsSync(buildPath)) {
  app.use(express.static(buildPath));
  
  // Fallback to index.html for React routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
} else {
  // If no build, return a message
  app.get('/', (req, res) => {
    res.json({ message: 'BE Creative SD - Frontend build not found. Please run npm run build' });
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ BE Creative SD running on port ${PORT}`);
});
