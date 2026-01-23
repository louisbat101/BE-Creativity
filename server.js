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
  app.use(express.static(buildPath, { maxAge: '1d' }));
  
  // Fallback to index.html for React routing
  app.get('*', (req, res) => {
    const indexPath = path.join(buildPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).json({ error: 'index.html not found' });
    }
  });
} else {
  // If no build, proxy API requests and provide a message
  console.warn('⚠️  Frontend build not found at', buildPath);
  
  app.get('/api/*', (req, res, next) => {
    // Allow API requests to work even without frontend
    next();
  });
  
  app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', message: 'Frontend assets are being built' });
  });
  
  app.use((req, res) => {
    res.status(503).json({ 
      error: 'Service Unavailable',
      message: 'Frontend is being built. Please try again in a moment.',
      timestamp: new Date().toISOString()
    });
  });
}

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`✅ BE Creative SD running on port ${PORT}`);
});
