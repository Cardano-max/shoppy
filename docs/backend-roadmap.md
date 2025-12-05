# Backend Feature Assessment

## Current State
- Next.js App Router frontend with static UI components
- Prisma schema covering core entities (Store, Product, Customer, Order, Invoice, Estimate, Coupon, Banner, Transaction, etc.)
- SQLite database with Prisma Client v5 generated
- Basic API routes for products, customers, orders, invoices (GET/POST only, no validation/auth)
- No authentication, authorization, or session management
- Frontend is not wired to live data; all pages render static mock data

## Feature Gaps (vs Shoopy)
1. **Authentication & Authorization**
   - Admin login, password hashing, session cookies/JWTs
   - Role-based access (Owner, Manager, Staff)
2. **Stores & Users**
   - Multi-tenant store ownership, teams, invitations
   - Store plan/billing status, feature gating
3. **Catalog**
   - Product variants, inventory adjustments, bulk upload
   - Media uploads (images/videos), SEO data
4. **Orders & Fulfillment**
   - Order lifecycle (Pending â†’ Confirmed â†’ Shipped â†’ Delivered â†’ Canceled/Returned)
   - Shipping addresses, logistics info, RTO risk scoring
   - Payments & refunds tracking
5. **Invoices, Estimates, Purchases**
   - PDF generation, numbering sequences, tax calculations
   - Purchase orders to suppliers, GRN tracking
6. **Customers & Wallet**
   - Wallet transactions, loyalty points, referral tracking
   - Customer groups, tags, communication logs
7. **Promotions**
   - Coupon applicability rules, usage limits, scheduling
   - Banner assets, placement targeting
8. **Reports & Analytics**
   - Export filters, async generation, email delivery
9. **Online Store Settings**
   - Theme selection, content blocks, announcements
   - SEO, redirects, custom pages, blog posts
10. **App Store Integrations**
    - Webhooks, plugin marketplace metadata

## Recommended Backend Milestones
1. **Core Platform Setup**
   - Add authentication (NextAuth.js or custom) with Prisma adapter
   - Implement multi-tenant store context + middleware
2. **Data Model Enhancements**
   - Expand Prisma schema to cover: product variants, addresses, fulfillment, payments, media assets, activity logs
   - Create migrations + seeders for demo data
3. **Service Layer & API Routes**
   - Domain-driven service modules (catalog, orders, payments, promos, customers)
   - REST/GraphQL endpoints with validation (Zod/Valibot)
4. **File Storage & Media**
   - Integrate with S3-compatible storage for product/media uploads
5. **Background Jobs**
   - Queue for report generation, email sending, sync tasks (BullMQ / Cloud queue)
6. **Testing & Tooling**
   - Integration tests (Vitest/Jest) hitting Prisma test DB
   - API contract tests (OpenAPI/Swagger docs)
7. **Deployment Prep**
   - Environment configs (DATABASE_URL, storage, email, auth secrets)
   - CI pipeline for lint/test/prisma migrate

## Next Steps
- Finalize extended ERD & Prisma schema changes (Todo #2)
- Choose auth strategy (NextAuth w/ Credentials vs. custom JWT) based on deployment target
- Define service boundaries + folder structure (src/server/{modules})
- Plan seed data covering every module for demo/testing
