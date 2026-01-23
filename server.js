// Proxy server that serves both frontend and backend
const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve frontend static files
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Import backend routes
const backendApp = require('./backend/src/server.js');

// Use backend API routes
app.use('/api', backendApp);

// Fallback to index.html for React routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build/index.html'));
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ BE Creative SD running on port ${PORT}`);
});
