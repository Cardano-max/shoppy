# Deployment Guide - Shoopy E-commerce Platform

## 🚀 Quick Deploy to Vercel

### Option 1: One-Click Deploy (Recommended)

1. **Click the Deploy Button:**
   - Visit: https://vercel.com/new
   - Import your GitHub repository: `Cardano-max/shoppy`
   - Select branch: `claude/complete-implementation-testing-01XTaVZLFM7zhcTTew6k3zAY`

2. **Configure Environment Variables:**
   ```
   DATABASE_URL=your_postgresql_connection_string
   NEXTAUTH_SECRET=your_generated_secret_key
   NEXTAUTH_URL=https://your-app-name.vercel.app
   ```

3. **Generate NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

4. **Click Deploy!**

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   ```

5. **Deploy to Production:**
   ```bash
   vercel --prod
   ```

## 📊 Database Setup (PostgreSQL)

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to "Storage" tab
3. Click "Create Database" → Select "Postgres"
4. Vercel will automatically add `DATABASE_URL` to your environment variables

### Option 2: External PostgreSQL Provider

**Recommended providers:**
- **Neon** (https://neon.tech) - Free tier, serverless PostgreSQL
- **Supabase** (https://supabase.com) - Free tier, includes auth & storage
- **Railway** (https://railway.app) - Free tier available
- **PlanetScale** (https://planetscale.com) - MySQL alternative

**Steps:**
1. Create a database on your chosen provider
2. Copy the connection string
3. Add to Vercel environment variables as `DATABASE_URL`

### Update Prisma Schema for PostgreSQL

Edit `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // Change from sqlite to postgresql
  url      = env("DATABASE_URL")
}
```

### Run Migrations

After deployment, run:
```bash
npx prisma db push
npx prisma db seed
```

Or add to Vercel build command:
```json
{
  "buildCommand": "prisma generate && prisma db push && next build"
}
```

## 🔑 Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXTAUTH_SECRET` | Secret key for NextAuth.js | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Your app URL | `https://your-app.vercel.app` |

## ✅ Post-Deployment Checklist

- [ ] Verify database connection
- [ ] Test authentication (login with demo credentials)
- [ ] Seed demo data if needed
- [ ] Test API endpoints
- [ ] Test PDF generation
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring (Vercel Analytics)

## 🔐 Default Demo Credentials

```
Email: founder@kiwiparty.in
Password: Password123!
```

**⚠️ Important:** Change these credentials in production!

## 📝 API Endpoints Available

All endpoints are protected with authentication:

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product

### Customers
- `GET /api/customers` - List all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get customer
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Orders
- `GET /api/orders` - List all orders
- `POST /api/orders` - Create order
- `GET /api/orders/[id]` - Get order
- `DELETE /api/orders/[id]` - Delete order
- `PUT /api/orders/[id]/status` - Update order status

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category
- `GET /api/categories/[id]` - Get category
- `PUT /api/categories/[id]` - Update category
- `DELETE /api/categories/[id]` - Delete category

### Collections
- `GET /api/collections` - List all collections
- `POST /api/collections` - Create collection
- `GET /api/collections/[id]` - Get collection
- `PUT /api/collections/[id]` - Update collection
- `DELETE /api/collections/[id]` - Delete collection

### Coupons
- `GET /api/coupons` - List all coupons
- `POST /api/coupons` - Create coupon
- `GET /api/coupons/[id]` - Get coupon
- `PUT /api/coupons/[id]` - Update coupon
- `DELETE /api/coupons/[id]` - Delete coupon

### Banners
- `GET /api/banners` - List all banners
- `POST /api/banners` - Create banner
- `GET /api/banners/[id]` - Get banner
- `PUT /api/banners/[id]` - Update banner
- `DELETE /api/banners/[id]` - Delete banner

### Invoices
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/[id]` - Get invoice
- `PUT /api/invoices/[id]` - Update invoice
- `DELETE /api/invoices/[id]` - Delete invoice
- `GET /api/invoices/[id]/pdf` - Generate PDF

### Estimates
- `GET /api/estimates` - List all estimates
- `POST /api/estimates` - Create estimate

## 🐛 Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify DATABASE_URL is correct
- Ensure Prisma schema is compatible with your database

### Database Connection Issues
- Verify the DATABASE_URL format
- Check if database allows connections from Vercel IPs
- For Neon/Supabase, use the "pooling" connection string

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set and at least 32 characters
- Verify NEXTAUTH_URL matches your deployment URL
- Check if cookies are enabled in browser

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Deployment](https://www.prisma.io/docs/guides/deployment)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

## 🎉 Success!

Once deployed, your e-commerce platform will be live at:
```
https://your-app-name.vercel.app
```

Test the login page and explore all the features!
