# Quick Start Guide

## ⚡ Fast Setup (3 Steps)

### Step 1: Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/ (LTS version recommended)
- Install it
- Restart your terminal

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database, Seed & Run
```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push

# Seed demo data
npm run seed

# Start development server
npm run dev
```

### Step 4: Open Browser
Navigate to: **http://localhost:3000**

## ✅ What to Test

1. **Dashboard** - Should show store insights and metrics
2. **Navigation** - Click through all sidebar items
3. **Orders** - View orders table with filters
4. **Products** - See product listing
5. **Customers** - Check customer management
6. **Settings** - Explore store and display settings
7. **Wallet** - View wallet balance and transactions

## 🐛 Common Issues

**"npm is not recognized"**
→ Install Node.js from nodejs.org

**"Port 3000 already in use"**
→ Change port: `PORT=3001 npm run dev`

**"Prisma errors"**
→ Run: `npx prisma generate && npx prisma db push`

## 📝 Project Structure

```
├── app/              # All pages (Next.js App Router)
├── components/       # Reusable components
├── lib/              # Utilities (Prisma client)
├── prisma/           # Database schema
└── package.json      # Dependencies
```

## 🚀 Ready to Go!

Once you see "Ready" in the terminal, open http://localhost:3000 and start exploring!



