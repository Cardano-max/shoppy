# How to Install Node.js and Run the Project

## Step-by-Step Installation

### 1. Download Node.js
- Go to: https://nodejs.org/
- Click "Download Node.js (LTS)" - this is the recommended version
- The file will be something like: `node-v20.x.x-x64.msi` (for Windows)

### 2. Install Node.js
- Run the downloaded installer
- Click "Next" through the installation wizard
- **Important**: Make sure "Add to PATH" is checked (it should be by default)
- Click "Install"
- Wait for installation to complete
- Click "Finish"

### 3. Verify Installation
Open a **NEW** PowerShell or Command Prompt window and run:
```bash
node --version
npm --version
```

You should see version numbers like:
```
v20.10.0
10.2.3
```

### 4. Navigate to Project
In the new terminal, navigate to your project:
```bash
cd "C:\Users\ateeb\Desktop\job finde"
```

### 5. Install Dependencies
```bash
npm install
```
This will take 1-2 minutes to download all packages.

### 6. Setup Database
```bash
npx prisma generate
npx prisma db push
```

### 7. Start the Server
```bash
npm run dev
```

### 8. Open Browser
Open: http://localhost:3000

## Alternative: Use Node Version Manager (nvm-windows)

If you prefer a version manager:
1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install it
3. Run: `nvm install lts` then `nvm use lts`

## Troubleshooting

**If `node` command still not found after installation:**
1. Close ALL terminal windows
2. Open a NEW terminal
3. Try again

**If you get permission errors:**
- Run PowerShell as Administrator
- Or use Command Prompt instead

**If port 3000 is busy:**
- The app will automatically use port 3001
- Check the terminal output for the actual URL



