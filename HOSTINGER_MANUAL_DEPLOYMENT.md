# BE Creativity - Manual Deployment Guide for Hostinger

## Files to Upload to Hostinger File Manager

Upload these files/folders to your public_html directory:

### Root Level Files:
- `server.js` - Main Node.js server
- `package.json` - Root dependencies
- `package-lock.json` - Locked dependencies
- `.env` (if you have one) - Environment variables

### Folders to Upload:
- `frontend/` - React app (entire folder)
- `backend/` - Express backend (entire folder)

### IMPORTANT: Do NOT Upload:
- `node_modules/` folders (will be reinstalled on server)
- `.git/` folder
- `*.md` documentation files (to save space)

## Steps in Hostinger File Manager:

1. **Log into Hostinger Control Panel**
2. **Click "Files"** in the left sidebar
3. **Navigate to public_html folder** (or root folder for your domain)
4. **Upload the following in this order:**
   - server.js
   - package.json
   - package-lock.json
   - frontend/ folder
   - backend/ folder

5. **Then in Hostinger Terminal (or via SSH):**
   ```bash
   npm install
   npm start
   ```

6. **Or configure a cron job to run automatically**

## Expected Result:
- App runs on port 5001
- Accessible at: https://becreativesd.com
- Serves React frontend + Express API from same domain

## Troubleshooting:
- Check `error.log` in Hostinger logs
- Verify `frontend/build/` exists after upload
- Ensure all dependencies installed: `npm install`
