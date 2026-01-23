# Hostinger Deployment Configuration

## Startup Script
Your application will start with the command: `npm start`

## What happens:
1. Node.js runs `npm start` from package.json
2. This executes: `node server.js`
3. The server checks for frontend/build directory
4. If not found, it attempts to build the frontend
5. Once ready, it serves the application on port 5001

## Troubleshooting
If you see a 503 error:
1. Check that all dependencies are installed
2. Verify the frontend build exists at `frontend/build/index.html`
3. Ensure Node.js v18+ is running

## Manual Build (if auto-build fails)
```
npm run build
npm start
```

## Monitoring
The server logs startup information to console. On Hostinger, you can check deployment logs in the hPanel.

## API Endpoints
- GET `/` - Serves React application
- GET `/health` - Health check endpoint
- All other routes fallback to index.html for React routing
