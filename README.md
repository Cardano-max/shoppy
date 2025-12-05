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

## Next Steps

1. Set up authentication
2. Implement API routes for CRUD operations
3. Add form validation
4. Implement file uploads for images
5. Add real-time updates
6. Set up email notifications
7. Implement payment gateway integration
8. Add analytics and reporting

## License

This project is created for educational purposes.



