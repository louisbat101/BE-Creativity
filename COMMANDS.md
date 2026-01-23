# BE Creative SD - Command Reference

Quick reference for all common commands needed to work with BE Creative SD.

## 📦 Installation Commands

### Install All Dependencies
```bash
npm run install:all
```

### Install Backend Only
```bash
cd backend
npm install
```

### Install Frontend Only
```bash
cd frontend
npm install
```

---

## 🚀 Running the Application

### Start Both Servers (Recommended)
```bash
npm run dev
```
Starts backend on port 5000 and frontend on port 3000.

### Start Backend Only
```bash
npm run backend:dev
```
Backend runs on `http://localhost:5000`

### Start Frontend Only
```bash
npm run frontend:start
```
Frontend runs on `http://localhost:3000`

### Start Backend (Production)
```bash
npm run backend:start
```

---

## 📁 Navigation Commands

### Go to Backend
```bash
cd backend
```

### Go to Frontend
```bash
cd frontend
```

### Go to Project Root
```bash
cd ..
```

---

## 🔧 Backend Commands

### Install Backend Dependencies
```bash
cd backend && npm install
```

### Start Backend (Development)
```bash
cd backend && npm run dev
```

### Start Backend (Production)
```bash
cd backend && npm start
```

### Check Backend Health
```bash
curl http://localhost:5000/api/health
```

---

## ⚛️ Frontend Commands

### Install Frontend Dependencies
```bash
cd frontend && npm install
```

### Start Frontend Development
```bash
cd frontend && npm start
```

### Build Frontend for Production
```bash
cd frontend && npm run build
```

### Run Frontend Tests
```bash
cd frontend && npm test
```

---

## 🗄️ Environment Setup

### Copy Backend Template
```bash
cd backend
copy .env.example .env
```

### Edit Backend Environment
```bash
# Windows
notepad backend\.env

# macOS/Linux
nano backend/.env
```

### Create Frontend Environment (if needed)
```bash
cd frontend
echo REACT_APP_API_URL=http://localhost:5000/api > .env
```

---

## 🗄️ Database Commands

### Start Local MongoDB
```bash
# Windows (PowerShell)
mongod

# macOS (with Homebrew)
brew services start mongodb-community

# Linux (systemd)
sudo systemctl start mongod
```

### Stop MongoDB
```bash
# Windows - Ctrl+C

# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongod
```

### Connect to MongoDB CLI
```bash
# Local
mongo

# MongoDB Atlas
mongo "mongodb+srv://username:password@cluster.mongodb.net/database"
```

### Check MongoDB Status
```bash
# Windows - Check if mongod is running

# macOS
brew services list

# Linux
sudo systemctl status mongod
```

---

## 🔐 Admin Access

### Access Admin Panel
```
http://localhost:3000/admin
```

### Test Admin Login
```bash
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'
```

---

## 🧪 Testing Commands

### Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# List products
curl http://localhost:5000/api/products

# Admin login
curl -X POST http://localhost:5000/api/auth/admin-login \
  -H "Content-Type: application/json" \
  -d '{"password":"your_password"}'
```

### Using Postman
1. Import collection from API_TESTING.md
2. Set environment variables
3. Run requests

---

## 📦 Package Management

### Install Package (Backend)
```bash
cd backend
npm install package-name
```

### Install Package (Frontend)
```bash
cd frontend
npm install package-name
```

### Update All Packages (Backend)
```bash
cd backend
npm update
```

### Update All Packages (Frontend)
```bash
cd frontend
npm update
```

### Remove Package (Backend)
```bash
cd backend
npm uninstall package-name
```

### Remove Package (Frontend)
```bash
cd frontend
npm uninstall package-name
```

---

## 🐛 Debugging Commands

### Check Node Version
```bash
node --version
```

### Check NPM Version
```bash
npm --version
```

### Check Port 3000 (Windows)
```bash
netstat -ano | findstr :3000
```

### Check Port 5000 (Windows)
```bash
netstat -ano | findstr :5000
```

### Kill Process on Port (Windows)
```bash
taskkill /PID <PID> /F
```

### Check Ports (macOS/Linux)
```bash
lsof -i :3000
lsof -i :5000
```

### Kill Process (macOS/Linux)
```bash
kill -9 <PID>
```

---

## 📝 Git Commands (if using Git)

### Initialize Git
```bash
git init
```

### Add All Files
```bash
git add .
```

### Commit Changes
```bash
git commit -m "Initial project setup"
```

### Check Status
```bash
git status
```

### View Log
```bash
git log --oneline
```

---

## 🔍 Logging Commands

### View Backend Logs
```bash
# Logs appear in terminal where npm run dev is running
# Look for console.log() output
```

### Check Frontend Console
```bash
# Open browser DevTools: F12
# Go to Console tab
```

### Check Browser Network
```bash
# Open browser DevTools: F12
# Go to Network tab
# Make API calls and watch requests
```

---

## 📂 File Operations

### Create .env file from template
```bash
cd backend
copy .env.example .env
```

### View file contents
```bash
# Windows (PowerShell)
Get-Content backend\.env

# macOS/Linux
cat backend/.env
```

### Edit files
```bash
# VS Code (recommended)
code backend/.env

# Notepad (Windows)
notepad backend\.env

# Nano (macOS/Linux)
nano backend/.env

# Vi (macOS/Linux)
vi backend/.env
```

---

## 🚀 Deployment Commands

### Build Frontend
```bash
cd frontend && npm run build
```

### Build Output Location
```
frontend/build/
```

### Serve Build Locally
```bash
npx serve -s frontend/build
```

### Heroku Deployment
```bash
# Login
heroku login

# Create app
heroku create app-name

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 🔄 Useful Shortcuts

### Quick Backend Restart
```bash
# Ctrl+C to stop, then:
npm run backend:dev
```

### Quick Frontend Restart
```bash
# Ctrl+C to stop, then:
npm run frontend:start
```

### Clear Cache
```bash
# npm cache
npm cache clean --force

# Browser cache
# F12 → Application → Storage → Clear All
```

### Clear node_modules
```bash
# Backend
cd backend && rm -rf node_modules && npm install

# Frontend
cd frontend && rm -rf node_modules && npm install
```

---

## 🎯 Common Workflows

### First Time Setup
```bash
# 1. Install dependencies
npm run install:all

# 2. Setup environment
cd backend
copy .env.example .env
# Edit .env file with your settings

# 3. Start servers
cd ..
npm run dev

# 4. Visit application
# Frontend: http://localhost:3000
# Admin: http://localhost:3000/admin
```

### Daily Development
```bash
# Start servers
npm run dev

# That's it! Both run in parallel

# To stop: Ctrl+C
```

### Make Changes
```bash
# 1. Edit files in your IDE
# 2. Save (Ctrl+S)
# 3. Servers auto-reload
# 4. Refresh browser (F5)
```

### Add New Package
```bash
# For backend
cd backend && npm install package-name

# For frontend
cd frontend && npm install package-name
```

### Deploy to Production
```bash
# 1. Build frontend
npm run frontend:build

# 2. Deploy build folder to hosting
# (Upload to Netlify, Vercel, etc.)

# 3. Deploy backend
# (To Heroku, AWS, etc.)
```

---

## ⚡ Quick Reference Card

| Task | Command |
|------|---------|
| Start all | `npm run dev` |
| Install all | `npm run install:all` |
| Start backend | `npm run backend:dev` |
| Start frontend | `npm run frontend:start` |
| Build frontend | `npm run frontend:build` |
| Go to backend | `cd backend` |
| Go to frontend | `cd frontend` |
| Setup .env | `copy .env.example .env` |
| Check ports | `netstat -ano \| findstr :3000` |
| Kill process | `taskkill /PID <PID> /F` |

---

## 💡 Tips

1. **Keep servers running** - Have two terminal windows, one for each server
2. **Auto-reload enabled** - Changes auto-refresh without manual server restart
3. **Check console** - Browser console (F12) shows frontend errors
4. **Check logs** - Terminal shows backend logs
5. **Network tab** - Watch API calls being made in F12 → Network
6. **Environment variables** - Restart server after changing .env

---

## 🆘 If Something Breaks

### Restart Everything
```bash
# 1. Stop all servers (Ctrl+C)
# 2. Clear node_modules
cd backend && rm -rf node_modules && npm install
cd frontend && rm -rf node_modules && npm install
# 3. Restart servers
npm run dev
```

### Clear Port Issues
```bash
# Find what's using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F

# Then restart
npm run dev
```

### MongoDB Connection Issues
```bash
# Restart MongoDB
mongod

# Or use MongoDB Atlas (cloud) - change MONGODB_URI in .env
```

### API Not Responding
```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check logs in backend terminal
# Should see: "Server running on port 5000"
```

---

**All set? Run `npm run dev` and start building! 🚀**
