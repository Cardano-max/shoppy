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

### ✅ Completed (Phase 1 & 2)

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
- ✅ **Database Setup**: SQLite database with Prisma Client configured
- ✅ **Database Seeding**: Complete seed script with realistic demo data for all models
- ✅ **Authentication Setup**: NextAuth.js configured with Prisma adapter and credentials provider
- ✅ **Login Page**: Authentication UI with form validation
- ✅ **API Routes Foundation**: Basic API routes created for:
  - Products (`/api/products`)
  - Customers (`/api/customers`)
  - Orders (`/api/orders`)
  - Invoices (`/api/invoices`)
  - Authentication (`/api/auth/[...nextauth]`)

### 🚧 In Progress (Phase 3)

#### Backend API Implementation (40% Complete)
- ✅ **Authentication**: NextAuth.js setup with credentials provider
- 🚧 **API Routes**: Basic routes exist, need full CRUD operations
- 🚧 **Form Validation**: Need to add Zod schemas for all forms
- 🚧 **Error Handling**: Need comprehensive error handling across all routes
- 🚧 **Authorization**: Role-based access control (Owner, Manager, Staff)

### 📋 Planned (Phase 4 & 5)

#### Core Functionality (0% Complete)
- ⏳ **Customer Management**:
  - Add/Edit/Delete customers
  - Search and filter functionality
  - Wallet points management
  - Advance/Due tracking
  - Customer type management (Consumer/Retailer)
- ⏳ **Product Management**:
  - Add/Edit/Delete products with variants
  - Bulk upload/import
  - Inventory management
  - Media uploads (images/videos)
  - SEO settings
- ⏳ **Order Management**:
  - Order lifecycle (Pending → Confirmed → Shipped → Delivered)
  - Order status updates
  - Payment tracking
  - Refund processing
  - Shipping management
- ⏳ **Invoice Management**:
  - Generate invoices
  - PDF generation
  - Invoice numbering sequences
  - Tax calculations
- ⏳ **Category & Collection Management**:
  - CRUD operations
  - Enable/Disable functionality
  - Product assignment

#### Advanced Features (0% Complete)
- ⏳ **Coupon System**:
  - Create/edit coupons with rules
  - Auto-apply functionality
  - Usage limits and expiry
  - Sharing capabilities
- ⏳ **Banner Management**:
  - Upload and manage banners
  - Enable/Disable
  - Positioning controls
- ⏳ **Reports & Analytics**:
  - Order reports
  - Sales reports
  - Customer reports
  - Product reports
  - Export to CSV/Excel/PDF
- ⏳ **Store Settings**:
  - Store details configuration
  - Domain settings
  - Payment gateway integration
  - Delivery settings
  - SEO configuration
- ⏳ **Display Settings**:
  - Theme customization
  - Color & font settings
  - Custom CSS
  - Layout configuration
- ⏳ **Wallet System**:
  - Credit purchase
  - Transaction history
  - Credit conversion
  - Wallet settings

#### Integration & Infrastructure (0% Complete)
- ⏳ **File Storage**: S3-compatible storage for media uploads
- ⏳ **Email Notifications**: Order confirmations, invoices, etc.
- ⏳ **Background Jobs**: Report generation, email sending
- ⏳ **Real-time Updates**: WebSocket or Server-Sent Events
- ⏳ **Payment Gateway**: Integration with payment providers
- ⏳ **Multi-tenant Support**: Store context and isolation

#### Testing & Documentation (0% Complete)
- ⏳ **Unit Tests**: Component and utility tests
- ⏳ **Integration Tests**: API route tests
- ⏳ **E2E Tests**: Critical user flows
- ⏳ **API Documentation**: OpenAPI/Swagger docs
- ⏳ **Deployment Guide**: Production setup instructions

## Progress Summary

| Category | Status | Completion |
|----------|--------|------------|
| Frontend UI | ✅ Complete | 100% |
| Database Schema | ✅ Complete | 100% |
| Database Seeding | ✅ Complete | 100% |
| Authentication Setup | ✅ Complete | 100% |
| API Routes (Basic) | 🚧 In Progress | 40% |
| Core Functionality | 📋 Planned | 0% |
| Advanced Features | 📋 Planned | 0% |
| Integration & Infrastructure | 📋 Planned | 0% |
| Testing & Documentation | 📋 Planned | 0% |
| **Overall Project** | 🚧 In Progress | **~35%** |

## Next Steps (Priority Order)

1. **Complete API Routes** (High Priority)
   - Implement full CRUD for customers, products, orders, invoices
   - Add form validation with Zod
   - Wire frontend forms to API endpoints

2. **Customer Management** (High Priority)
   - Add Customer form modal/page
   - Search and filter functionality
   - Wallet points management

3. **Product Management** (High Priority)
   - Product form with variants
   - Media upload functionality
   - Inventory management

4. **Order Management** (Medium Priority)
   - Order status workflow
   - Payment tracking
   - Shipping integration

5. **File Storage** (Medium Priority)
   - Set up S3 or local storage
   - Image upload endpoints
   - Media management

6. **Advanced Features** (Lower Priority)
   - Reports generation
   - Email notifications
   - Payment gateway integration

## License

This project is created for educational purposes.



