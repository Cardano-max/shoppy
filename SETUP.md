# Setup and Testing Guide

## Prerequisites

Before running the application, you need to have Node.js installed on your system.

### Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Install the LTS version (recommended: v18 or higher)
3. Verify installation by opening a new terminal and running:
   ```bash
   node --version
   npm --version
   ```

## Setup Steps

### 1. Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Prisma
- Lucide React (icons)
- And other dependencies

### 2. Set Up Database

Generate Prisma client and create the database:

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma client
- Create the SQLite database file (`prisma/dev.db`)
- Set up all the database tables

### 3. Seed Demo Data

Populate the database with realistic demo content (stores, users, catalog, orders, wallets, etc.):

```bash
npm run seed
```

> Re-run this command any time you want to reset the database to a clean demo state.

### 4. Run Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

### 5. Test the Application

Once the server is running, you can:

1. **Open your browser** and navigate to `http://localhost:3000`
2. **Test the Dashboard** - You should see the main dashboard with store insights
3. **Navigate through pages** using the sidebar:
   - Dashboard
   - Invoices
   - Orders (Online, Purchase, Estimate, Abandoned Carts)
   - Products, Categories, Collections
   - Customers
   - Coupons, Banners, Refer & Earn
   - Reports
   - Store Settings, Display Settings, Themes
   - Wallet
   - App Store
   - Billing Plans

## Testing Checklist

### ✅ Navigation
- [ ] Sidebar navigation works correctly
- [ ] All menu items are clickable
- [ ] Active page is highlighted
- [ ] Sub-menus expand/collapse properly

### ✅ Dashboard
- [ ] Store Insights cards display correctly
- [ ] Refer & Earn banner is visible
- [ ] Store link section is present
- [ ] Promotional offers and ToDos sections show

### ✅ Orders & Invoices
- [ ] Orders table displays correctly
- [ ] Status tabs work
- [ ] Search and filters function
- [ ] Invoices page loads with data

### ✅ Catalog
- [ ] Products page shows product list
- [ ] Categories page displays categories
- [ ] Collections page shows collections grid

### ✅ Customers
- [ ] Customer table displays
- [ ] Search functionality works
- [ ] Filter dropdowns function

### ✅ Promotions
- [ ] Coupons table displays
- [ ] Banners grid shows correctly
- [ ] Toggle switches work

### ✅ Settings
- [ ] Store Settings page loads
- [ ] Display Settings navigation works
- [ ] Themes grid displays

### ✅ Wallet
- [ ] Wallet balance displays
- [ ] Transaction history table shows
- [ ] Filters work

## Troubleshooting

### Issue: `npm` command not found
**Solution**: Install Node.js from https://nodejs.org/

### Issue: Port 3000 already in use
**Solution**: Either stop the process using port 3000, or run:
```bash
PORT=3001 npm run dev
```

### Issue: Prisma errors
**Solution**: Make sure you've run:
```bash
npx prisma generate
npx prisma db push
```

### Issue: Module not found errors
**Solution**: Delete `node_modules` and `package-lock.json`, then run:
```bash
npm install
```

### Issue: TypeScript errors
**Solution**: Run:
```bash
npm run build
```
This will show any TypeScript errors that need to be fixed.

## Build for Production

To create a production build:

```bash
npm run build
npm start
```

## Additional Commands

- `npm run lint` - Check for linting errors
- `npm run build` - Build the application
- `npx prisma studio` - Open Prisma Studio to view/edit database
- `npx prisma migrate dev` - Create a new migration

## Next Steps

After verifying everything works:

1. **Add Authentication** - Implement user login/signup
2. **Connect to Real Database** - Switch from SQLite to PostgreSQL if needed
3. **Add API Functionality** - Implement full CRUD operations
4. **Add File Uploads** - Implement image upload for products, logos, etc.
5. **Add Real-time Features** - Implement WebSocket for live updates
6. **Add Email Notifications** - Set up email service
7. **Deploy** - Deploy to Vercel, AWS, or your preferred platform



