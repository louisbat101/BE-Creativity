// Proxy server that serves both frontend and backend
import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Log startup
console.log('🚀 BE Creative SD Server Starting...');
console.log('📁 Current directory:', __dirname);
console.log('🔍 NODE_ENV:', process.env.NODE_ENV || 'development');

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve frontend static files if build directory exists
const buildPath = path.join(__dirname, 'frontend/build');
console.log('📦 Checking for frontend build at:', buildPath);
console.log('✓ Build exists?', fs.existsSync(buildPath));

if (fs.existsSync(buildPath)) {
  console.log('✅ Frontend build found, serving static files');
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
  // If no build, try to build it
  console.warn('⚠️  Frontend build not found, attempting to build...');
  
  // Check if we're on a production server or if build should be auto-triggered
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (isProduction && fs.existsSync(path.join(__dirname, 'frontend/package.json'))) {
    // Attempt to build (non-blocking)
    console.log('🔨 Running: npm run build');
    exec('cd frontend && npm run build', (error, stdout, stderr) => {
      if (error) {
        console.error('❌ Build failed:', error.message);
        console.error('stderr:', stderr);
      } else {
        console.log('✅ Frontend build completed successfully');
      }
    });
  }
  
  // Serve a waiting message while build is in progress
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'Starting up',
      message: 'Application is initializing. Please try again in 30 seconds.',
      timestamp: new Date().toISOString()
    });
  });
  
  app.use((req, res) => {
    res.status(503).json({ 
      error: 'Service Unavailable',
      message: 'Application is starting up. Frontend build in progress. Please refresh in 30 seconds.',
      timestamp: new Date().toISOString(),
      buildPath: buildPath
    });
  });
}

const PORT = process.env.PORT || 5001;
const HOST = '0.0.0.0';

// Wrap everything in try-catch for safety
try {
  const server = app.listen(PORT, HOST, () => {
    console.log(`✅ BE Creative SD Server running`);
    console.log(`📦 Listening on ${HOST}:${PORT}`);
    console.log(`🌐 Frontend served from: ${buildPath || 'checking...'}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
  });

  // Handle server errors
  server.on('error', (err) => {
    console.error('❌ Server error:', err);
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use`);
    }
    process.exit(1);
  });
} catch (err) {
  console.error('❌ Fatal error starting server:', err);
  process.exit(1);
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught exception:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
