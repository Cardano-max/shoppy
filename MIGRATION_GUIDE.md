# Database Migration Guide

**Issue:** Registration fails with error: `The table 'public.User' does not exist in the current database`

**Cause:** PostgreSQL database is connected, but tables haven't been created yet.

**Solution:** Run Prisma migration to create all database tables.

---

## ✅ Quick Fix (Recommended)

### Update Vercel Build Command

1. **Go to Vercel Dashboard**
   - Navigate to your project: `shoppy3`
   - Click **Settings** → **General**

2. **Update Build Command**
   - Scroll to **Build & Development Settings**
   - Find **Build Command**
   - Click **Override**
   - Enter:
     ```bash
     prisma generate && prisma db push --accept-data-loss && next build
     ```
   - Click **Save**

3. **Redeploy**
   - Go to **Deployments** tab
   - Click the 3 dots (**...**) on the latest deployment
   - Click **Redeploy**
   - Wait for build to complete (~2-3 minutes)

4. **Test Registration**
   - Visit: `https://your-app.vercel.app/register`
   - Fill in the registration form
   - Submit
   - ✅ Should work now!

---

## Alternative Methods

### Option A: Vercel CLI

```bash
# 1. Install Vercel CLI (if not installed)
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Link to your project
vercel link

# 4. Pull production environment variables
vercel env pull .env.production

# 5. Run migration
npx prisma db push

# 6. (Optional) Seed demo data
npx prisma db seed
```

### Option B: Local Connection to Production DB

```bash
# 1. Get DATABASE_URL from Vercel
# Go to Settings → Environment Variables → DATABASE_URL (copy value)

# 2. Set environment variable temporarily
export DATABASE_URL="postgresql://user:password@host:5432/database"

# 3. Generate Prisma Client
npx prisma generate

# 4. Push schema to database
npx prisma db push

# 5. (Optional) Seed demo data
npx prisma db seed
```

---

## What This Does

The migration will create all 26 database tables:

### Core Tables
- ✅ User (for authentication)
- ✅ Store (multi-tenant stores)
- ✅ StoreMembership (user-store relationships)

### Catalog Tables
- ✅ Product (products catalog)
- ✅ ProductVariant (product variations)
- ✅ Category (product categories)
- ✅ Collection (product collections)
- ✅ MediaAsset (product images)

### Sales Tables
- ✅ Order (customer orders)
- ✅ OrderItem (order line items)
- ✅ OrderStatusHistory (order timeline)
- ✅ Invoice (invoices)
- ✅ Estimate (price quotes)

### Customer Tables
- ✅ Customer (customer records)
- ✅ Address (shipping/billing addresses)

### Payment Tables
- ✅ Payment (payment records)
- ✅ Refund (refund transactions)
- ✅ Transaction (wallet transactions)

### Inventory Tables
- ✅ InventoryAdjustment (stock adjustments audit trail)

### Marketing Tables
- ✅ Coupon (discount codes)
- ✅ Banner (promotional banners)
- ✅ AbandonedCart (cart recovery)

### Shipping Tables
- ✅ Shipment (shipment tracking)

### Other Tables
- ✅ StorePlan (subscription plans)
- ✅ PurchaseOrder (purchase orders)
- ✅ ActivityLog (activity tracking)

### NextAuth Tables
- ✅ Account (OAuth accounts)
- ✅ Session (user sessions)
- ✅ VerificationToken (email verification)

---

## Verification

After running the migration, verify it worked:

### Method 1: Try Registration
1. Visit: `https://your-app.vercel.app/register`
2. Fill in form and submit
3. ✅ Should create account successfully

### Method 2: Check Database
If using Vercel Postgres:
1. Go to Vercel → Storage → Your Postgres DB
2. Click **Data** tab
3. You should see all 26 tables listed

If using Neon/Supabase:
1. Go to your database dashboard
2. Check Tables/Schema
3. Verify tables exist

---

## Troubleshooting

### Issue: Build still fails after updating command

**Solution:**
- Clear Vercel cache: Settings → Clear Cache
- Redeploy again
- Check build logs for specific error

### Issue: "prisma command not found"

**Solution:**
Ensure `prisma` is in `dependencies` (not `devDependencies`) in `package.json`:
```json
{
  "dependencies": {
    "prisma": "^5.22.0",
    "@prisma/client": "^5.22.0"
  }
}
```

### Issue: Migration runs but tables still missing

**Solution:**
- Check if DATABASE_URL environment variable is correct
- Verify database provider in `prisma/schema.prisma` is `postgresql`
- Check Vercel function logs for errors

### Issue: "Cannot find module '@prisma/client'"

**Solution:**
Add to `package.json` scripts:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

---

## After Migration Success

Once tables are created:

1. ✅ **Test Registration**
   - Create a new account
   - Should redirect to onboarding

2. ✅ **Test Login**
   - Login with created account
   - Should access dashboard

3. ✅ **(Optional) Seed Demo Data**
   ```bash
   npx prisma db seed
   ```
   This adds:
   - 2 demo users
   - 3 products with variants
   - 2 customers with addresses
   - 2 sample orders
   - Inventory adjustments
   - Categories, collections, etc.

4. ✅ **Remove Migration Flag** (Optional)
   After first successful deployment, you can remove `--accept-data-loss` from build command:
   ```bash
   prisma generate && prisma db push && next build
   ```

---

## Security Note

The `--accept-data-loss` flag is used during initial setup because:
- First deployment has no data to lose
- Subsequent deployments will add new columns safely
- Remove it after initial setup for extra safety

For future schema changes, use proper migrations:
```bash
npx prisma migrate dev --name your_migration_name
```

---

## Summary

**Problem:** Database tables don't exist
**Solution:** Run `prisma db push` via build command
**Time:** ~5 minutes
**Result:** Fully functional registration and login ✅

---

*Last Updated: 2025-12-09*
*Related: DEPLOYMENT_UPDATE.md, DEPLOYMENT.md*
