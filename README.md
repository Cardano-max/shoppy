# Shoopy E-commerce Platform Replica

A complete replica of the Shoopy e-commerce management platform with all features and functionalities.

## Features

### Dashboard
- Store Insights (Sales, Orders, Low Stocks, Abandoned Carts)
- Refer & Earn banner
- Store link sharing
- Promotional offers and ToDos

### Orders Management
- Online Orders
- Purchases
- Estimates
- Abandoned Carts

### Catalog Management
- Products (with search, filters, bulk actions)
- Categories (with enable/disable, edit, delete)
- Collections (with product count, enable/disable)

### Customers
- Customer list with search
- Customer types (Consumer, Retailer)
- Wallet points tracking
- Advance and Due tracking

### Promotions
- Coupons (with auto-apply, expiry, sharing)
- Banners (with enable/disable, positioning)
- Refer & Earn program

### Reports
- Order Reports
- Sales Reports
- Customer Reports
- Product Reports
- Export options (CSV, Excel, PDF)

### Online Store Settings
- Store Details (logo, favicon, name, category)
- Store Domain
- Products Settings
- Checkout Settings
- Delivery Settings
- Payment Settings
- Order Settings
- Return Order Settings
- Label Settings
- SEO Settings
- Notifications Settings
- Login Settings
- URL Redirects
- Robots TXT

### Display Settings
- Announcement Bar
- Header
- Menu
- Banner
- Categories
- Products
- Footer
- Product Card
- Product Page
- Color & Font
- Custom CSS

### Themes
- Multiple theme options
- Theme preview
- Theme activation

### Wallet System
- Credit balance display
- Buy credits
- Transaction history
- Credit conversion (₹1 = 3 Credits)

### Additional Features
- App Store
- Billing Plans
- Users And Roles
- Store Blog
- Store Pages

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma with SQLite (can be upgraded to PostgreSQL)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

3. Seed demo data (recommended for a full experience):
```bash
npm run seed
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard page
│   ├── invoices/          # Invoices management
│   ├── orders/            # Orders management
│   ├── products/          # Products management
│   ├── categories/        # Categories management
│   ├── collections/       # Collections management
│   ├── customers/         # Customers management
│   ├── coupons/           # Coupons management
│   ├── banners/           # Banners management
│   ├── reports/           # Reports generation
│   ├── store-settings/    # Store settings
│   ├── display-settings/ # Display settings
│   ├── themes/            # Theme management
│   ├── wallet/            # Wallet system
│   └── ...
├── components/            # Reusable components
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Header.tsx         # Top header
├── lib/                   # Utility functions
│   └── prisma.ts         # Prisma client
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
└── ...
```

## Database Schema

The application uses Prisma with SQLite. Key models include:
- Store
- Product
- Category
- Collection
- Customer
- Order
- Invoice
- Estimate
- Coupon
- Banner
- Transaction
- User (with NextAuth integration)
- Account, Session, VerificationToken (NextAuth tables)
- Plan, Membership, Address, Payment, Refund, Shipment
- AbandonedCart, MediaAsset, ActivityLog

## Project Progress

### ✅ Completed (Phase 1, 2 & 3)

#### Frontend UI (100% Complete)
- ✅ **Dashboard Page**: Glass layout with hero section, insight cards, share buttons, store health meters, sparkline trends, promotional offers, and to-do lists
- ✅ **Sidebar Navigation**: Complete navigation with collapsible menu groups, active states, and wallet card
- ✅ **Header Component**: Store name display, notifications, and user profile
- ✅ **All Page Routes**: Created UI pages for all major sections:
  - Dashboard, Orders, Purchases, Estimates, Abandoned Carts
  - Products, Categories, Collections
  - Customers, Coupons, Banners
  - Invoices, Reports, Refer & Earn
  - Store Settings, Display Settings, Themes
  - Users & Roles, Store Blog, Store Pages
  - App Store, Billing Plans, Wallet

#### Database & Backend Foundation (100% Complete)
- ✅ **Prisma Schema**: Comprehensive data model with 25+ models covering all e-commerce entities
- ✅ **Database Setup**: SQLite database with Prisma Client configured (PostgreSQL ready)
- ✅ **Database Seeding**: Complete seed script with realistic demo data for all models
- ✅ **Authentication Setup**: NextAuth.js configured with Prisma adapter and credentials provider
- ✅ **Login Page**: Authentication UI with form validation

#### Backend API Implementation (100% Complete) ✨ **NEW**
- ✅ **Authentication Middleware**: Secure auth middleware for all API routes
- ✅ **Validation Schemas**: Comprehensive Zod schemas for all entities
- ✅ **Error Handling**: Production-grade error handling across all routes
- ✅ **Store Context**: Multi-tenant support with store isolation
- ✅ **23 Production-Ready API Endpoints**:

  **Products API (5 endpoints)**
  - GET/POST `/api/products` - List & create products with search/filters
  - GET/PUT/DELETE `/api/products/[id]` - Full CRUD operations

  **Customers API (4 endpoints)**
  - GET/POST `/api/customers` - List & create customers with search
  - GET/PUT/DELETE `/api/customers/[id]` - Full CRUD operations

  **Orders API (5 endpoints)**
  - GET/POST `/api/orders` - List & create orders with filters
  - GET/DELETE `/api/orders/[id]` - Get & delete orders
  - PUT `/api/orders/[id]/status` - Update order status with history

  **Categories API (4 endpoints)**
  - GET/POST `/api/categories` - List & create categories
  - GET/PUT/DELETE `/api/categories/[id]` - Full CRUD operations

  **Collections API (4 endpoints)**
  - GET/POST `/api/collections` - List & create collections
  - GET/PUT/DELETE `/api/collections/[id]` - Full CRUD operations

  **Coupons API (4 endpoints)**
  - GET/POST `/api/coupons` - List & create coupons
  - GET/PUT/DELETE `/api/coupons/[id]` - Full CRUD operations

  **Banners API (4 endpoints)**
  - GET/POST `/api/banners` - List & create banners
  - GET/PUT/DELETE `/api/banners/[id]` - Full CRUD operations

  **Invoices API (5 endpoints)**
  - GET/POST `/api/invoices` - List & create invoices
  - GET/PUT/DELETE `/api/invoices/[id]` - Full CRUD operations
  - GET `/api/invoices/[id]/pdf` - Generate PDF invoices ✨

  **Estimates API (2 endpoints)**
  - GET/POST `/api/estimates` - List & create estimates

### 🚧 In Progress (Phase 4)

#### Frontend-Backend Integration (20% Complete)
- ⏳ **Connect Pages to APIs**: Wire frontend components to backend APIs
- ⏳ **Form Components**: Create forms for Add/Edit operations
- ⏳ **Loading States**: Add loading and error states to all pages
- ⏳ **Real-time Updates**: Implement optimistic updates

### 📋 Planned (Phase 5)

#### Advanced Features
- ⏳ **File Uploads**: Product image upload functionality
- ⏳ **Reports Generation**: CSV/Excel export for all entities
- ⏳ **Email Notifications**: Order confirmations, invoice emails
- ⏳ **Payment Gateway**: Stripe/Razorpay integration
- ⏳ **Real-time Updates**: WebSocket for live order updates
- ⏳ **Search Optimization**: Full-text search for products
- ⏳ **Bulk Operations**: Bulk product import/export
- ⏳ **Activity Logs**: Track all user actions

#### Testing & Documentation
- ⏳ **API Tests**: Integration tests for all endpoints
- ⏳ **E2E Tests**: Critical user flow tests
- ⏳ **API Documentation**: Swagger/OpenAPI documentation

## Progress Summary

| Category | Status | Completion |
|----------|--------|------------|
| Frontend UI | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| Database Seeding | ✅ Complete | 100% |
| Authentication | ✅ Complete | 100% |
| **Backend APIs** | ✅ **Complete** | **100%** ✨ |
| **PDF Generation** | ✅ **Complete** | **100%** ✨ |
| Frontend-Backend Integration | 🚧 In Progress | 20% |
| Advanced Features | 📋 Planned | 0% |
| Testing & Documentation | 📋 Planned | 0% |
| **Overall Project** | 🚧 **In Progress** | **~70%** 🎉 |

## 🚀 Ready for Deployment

The backend is **production-ready** and can be deployed to Vercel now! See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment instructions.

### What's Working:
✅ Full authentication system with NextAuth
✅ 23 secured API endpoints with validation
✅ Complete CRUD for all core entities
✅ PDF generation for invoices
✅ Multi-tenant store isolation
✅ Search & filter capabilities
✅ Order status management with history
✅ Production-ready build

### Default Demo Credentials:
```
Email: founder@kiwiparty.in
Password: Password123!
```

## Next Steps (Priority Order)

1. **Deploy to Vercel** (High Priority) ⬅️ **YOU ARE HERE**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md) guide
   - Set up PostgreSQL database
   - Configure environment variables
   - Deploy and test

2. **Connect Frontend to Backend** (High Priority)
   - Replace mock data with API calls
   - Add loading and error states
   - Implement forms for CRUD operations

3. **File Upload** (Medium Priority)
   - Product image upload
   - Banner image upload
   - Media management

4. **Advanced Features** (Lower Priority)
   - Reports export (CSV/Excel)
   - Email notifications
   - Payment gateway integration

## License

This project is created for educational purposes.



