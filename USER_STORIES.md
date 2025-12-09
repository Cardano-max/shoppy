# 📖 SHOOPY E-COMMERCE PLATFORM - COMPLETE USER STORIES & ARCHITECTURE

## 🎯 PROJECT VISION
A complete multi-tenant e-commerce platform where **store owners** can manage their online stores and **customers** can shop from those stores.

---

## 👥 USER PERSONAS

### 1. **Store Owner (Admin)**
- Wants to set up an online store quickly
- Needs to manage products, inventory, orders
- Wants to track sales and analytics
- Needs to process payments and shipments

### 2. **Customer (Shopper)**
- Wants to browse products
- Needs to add items to cart
- Wants secure checkout
- Needs order tracking

---

## 🗺️ COMPLETE USER JOURNEY

### **PHASE 1: LANDING & DISCOVERY**

#### Story 1.1: Landing Page
**As a** visitor
**I want to** see what Shoopy offers
**So that** I can decide if I want to create a store

**Acceptance Criteria:**
- [ ] Hero section with value proposition
- [ ] Features showcase
- [ ] Pricing plans
- [ ] "Start Free Trial" CTA
- [ ] "View Demo Store" CTA
- [ ] Testimonials section
- [ ] Footer with links

#### Story 1.2: Demo Store Preview
**As a** visitor
**I want to** see a live demo store
**So that** I can understand what my store will look like

**Acceptance Criteria:**
- [ ] Browse demo products
- [ ] Add to cart (demo mode)
- [ ] See checkout flow (demo)
- [ ] View order confirmation (demo)

---

### **PHASE 2: ONBOARDING & SETUP**

#### Story 2.1: Store Owner Registration
**As a** new user
**I want to** create an account
**So that** I can start my online store

**Acceptance Criteria:**
- [ ] Email validation
- [ ] Password strength checker
- [ ] Store name input
- [ ] Store category selection
- [ ] Email verification sent
- [ ] Welcome email with next steps

#### Story 2.2: Store Setup Wizard
**As a** new store owner
**I want to** complete store setup
**So that** my store is ready to sell

**Acceptance Criteria:**
- [ ] Step 1: Store Details (name, logo, description)
- [ ] Step 2: First Product Addition
- [ ] Step 3: Payment Setup (later)
- [ ] Step 4: Shipping Settings
- [ ] Step 5: Store Domain/URL
- [ ] Progress indicator
- [ ] Skip option for later
- [ ] "Launch Store" button

#### Story 2.3: Dashboard Overview
**As a** store owner
**I want to** see my store's performance
**So that** I can understand my business

**Acceptance Criteria:**
- [ ] Today's sales (₹ amount)
- [ ] Total orders count
- [ ] Low stock alerts
- [ ] Recent orders list
- [ ] Sales chart (7 days)
- [ ] Quick actions (Add Product, View Orders)
- [ ] Store status (Online/Offline)

---

### **PHASE 3: PRODUCT MANAGEMENT**

#### Story 3.1: Add Product (Complete Flow)
**As a** store owner
**I want to** add a new product
**So that** customers can buy it

**Acceptance Criteria:**
- [ ] Product name (required)
- [ ] SKU (auto-generated option)
- [ ] Description (rich text)
- [ ] Multiple images upload
- [ ] Category selection
- [ ] Pricing (cost, MRP, sale price)
- [ ] Stock quantity
- [ ] Product variants (size, color)
- [ ] Weight/dimensions
- [ ] SEO settings
- [ ] Publish/Draft status
- [ ] Save → Shows in Products list
- [ ] Auto-sync to storefront

#### Story 3.2: Inventory Management
**As a** store owner
**I want to** track inventory
**So that** I don't oversell

**Acceptance Criteria:**
- [ ] Current stock display
- [ ] Low stock warnings (<10)
- [ ] Out of stock badge
- [ ] Stock adjustment (add/remove)
- [ ] Stock history log
- [ ] Auto-decrement on order
- [ ] Restock alerts

#### Story 3.3: Bulk Product Import
**As a** store owner
**I want to** import products via CSV
**So that** I can add many products quickly

**Acceptance Criteria:**
- [ ] Download CSV template
- [ ] Upload CSV file
- [ ] Validation errors shown
- [ ] Preview before import
- [ ] Import confirmation
- [ ] Error report if failures

---

### **PHASE 4: ORDER MANAGEMENT (CRITICAL)**

#### Story 4.1: New Order Creation (Manual)
**As a** store owner
**I want to** create an order manually
**So that** I can process offline sales

**Acceptance Criteria:**
- [ ] Select/Create customer
- [ ] Add products (search, select)
- [ ] Quantity adjustment
- [ ] Apply discount/coupon
- [ ] Add shipping address
- [ ] Calculate total (subtotal + tax + shipping)
- [ ] Payment method selection
- [ ] Order notes
- [ ] Create order → Generates order number
- [ ] Send confirmation email/SMS

#### Story 4.2: Order Lifecycle Management
**As a** store owner
**I want to** manage order statuses
**So that** customers know their order progress

**Order Statuses:**
1. **Pending** → Order placed, payment pending
2. **Confirmed** → Payment received
3. **Processing** → Preparing items
4. **Packed** → Items packed, ready to ship
5. **Shipped** → Order dispatched
6. **Out for Delivery** → With courier
7. **Delivered** → Successfully delivered
8. **Cancelled** → Order cancelled
9. **Returned** → Order returned
10. **Refunded** → Money refunded

**Acceptance Criteria:**
- [ ] Status change dropdown
- [ ] Status history timeline
- [ ] Automated emails on status change
- [ ] SMS notifications
- [ ] Customer notification preferences
- [ ] Status change reasons/notes
- [ ] Timestamp for each status

#### Story 4.3: Order Fulfillment
**As a** store owner
**I want to** fulfill orders
**So that** I can ship products

**Acceptance Criteria:**
- [ ] Print packing slip
- [ ] Generate shipping label
- [ ] Add tracking number
- [ ] Mark as shipped
- [ ] Courier integration (optional)
- [ ] Bulk fulfillment
- [ ] Inventory auto-deduction

#### Story 4.4: Order Returns & Refunds
**As a** store owner
**I want to** process returns
**So that** I can handle customer issues

**Acceptance Criteria:**
- [ ] Return request from order
- [ ] Return reason selection
- [ ] Return approval/rejection
- [ ] Refund amount calculation
- [ ] Process refund
- [ ] Restock items option
- [ ] Return tracking

---

### **PHASE 5: CUSTOMER MANAGEMENT**

#### Story 5.1: Customer Portal
**As a** customer
**I want to** create an account
**So that** I can track my orders

**Acceptance Criteria:**
- [ ] Customer registration
- [ ] Email verification
- [ ] Profile management
- [ ] Address book (multiple addresses)
- [ ] Order history
- [ ] Track orders
- [ ] Download invoices
- [ ] Wishlist

#### Story 5.2: Customer Segmentation
**As a** store owner
**I want to** segment customers
**So that** I can target marketing

**Acceptance Criteria:**
- [ ] Consumer vs Retailer tags
- [ ] VIP customers
- [ ] Order value segments
- [ ] Location-based groups
- [ ] Custom tags
- [ ] Export customer lists

---

### **PHASE 6: STOREFRONT (Customer-Facing)**

#### Story 6.1: Browse Products
**As a** customer
**I want to** browse products
**So that** I can find what I want

**Acceptance Criteria:**
- [ ] Product grid/list view
- [ ] Category filtering
- [ ] Price range filter
- [ ] Search functionality
- [ ] Sort options (price, new, popular)
- [ ] Product quick view
- [ ] Pagination/infinite scroll

#### Story 6.2: Product Details Page
**As a** customer
**I want to** see product details
**So that** I can make informed decisions

**Acceptance Criteria:**
- [ ] Image gallery with zoom
- [ ] Product title & description
- [ ] Price (with discount badge)
- [ ] Stock availability
- [ ] Variant selector (size/color)
- [ ] Quantity selector
- [ ] Add to cart button
- [ ] Related products
- [ ] Product reviews (future)

#### Story 6.3: Shopping Cart
**As a** customer
**I want to** manage my cart
**So that** I can review before buying

**Acceptance Criteria:**
- [ ] Add items to cart
- [ ] Update quantities
- [ ] Remove items
- [ ] Apply coupon code
- [ ] See subtotal
- [ ] Continue shopping
- [ ] Proceed to checkout
- [ ] Cart persistence (logged in)
- [ ] Abandoned cart save

#### Story 6.4: Checkout Flow
**As a** customer
**I want to** complete purchase
**So that** I can receive my order

**Acceptance Criteria:**
- [ ] Step 1: Shipping address
- [ ] Step 2: Delivery method
- [ ] Step 3: Payment method
- [ ] Step 4: Order review
- [ ] Apply coupon
- [ ] See order summary
- [ ] Terms & conditions
- [ ] Place order button
- [ ] Order confirmation page
- [ ] Confirmation email
- [ ] Redirect to order tracking

---

### **PHASE 7: PAYMENT PROCESSING**

#### Story 7.1: Payment Methods
**As a** store owner
**I want to** accept payments
**So that** I can receive money

**Payment Options:**
- [ ] Cash on Delivery (COD)
- [ ] Prepaid (Online)
- [ ] UPI
- [ ] Cards (Visa/Mastercard)
- [ ] Net Banking
- [ ] Wallets (Paytm, PhonePe)

#### Story 7.2: Payment Gateway Integration
**As a** store owner
**I want to** integrate Razorpay/Stripe
**So that** customers can pay online

**Acceptance Criteria:**
- [ ] Razorpay setup
- [ ] Payment link generation
- [ ] Payment success handling
- [ ] Payment failure handling
- [ ] Webhook for status updates
- [ ] Automatic order confirmation
- [ ] Payment receipt email

#### Story 7.3: Refund Processing
**As a** store owner
**I want to** process refunds
**So that** I can handle returns

**Acceptance Criteria:**
- [ ] Full refund
- [ ] Partial refund
- [ ] Refund reason
- [ ] Refund to original method
- [ ] Refund status tracking
- [ ] Refund confirmation email

---

### **PHASE 8: INVOICING & BILLING**

#### Story 8.1: Invoice Generation
**As a** store owner
**I want to** generate invoices automatically
**So that** orders have proper documentation

**Acceptance Criteria:**
- [ ] Auto-generate on order confirmation
- [ ] Invoice number sequence
- [ ] GST/Tax calculation
- [ ] Store details (GSTIN)
- [ ] Customer details
- [ ] Itemized list
- [ ] Subtotal, tax, total
- [ ] Download PDF
- [ ] Email to customer

#### Story 8.2: Tax Management
**As a** store owner
**I want to** configure taxes
**So that** invoices are compliant

**Acceptance Criteria:**
- [ ] GST rate configuration
- [ ] Tax inclusive/exclusive
- [ ] State-wise GST
- [ ] Tax reports
- [ ] Tax invoices

---

### **PHASE 9: SHIPPING & LOGISTICS**

#### Story 9.1: Shipping Settings
**As a** store owner
**I want to** set shipping rules
**So that** customers know delivery costs

**Acceptance Criteria:**
- [ ] Free shipping threshold
- [ ] Flat rate shipping
- [ ] Weight-based pricing
- [ ] Zone-based pricing
- [ ] Courier integration
- [ ] Estimated delivery dates

#### Story 9.2: Order Tracking
**As a** customer
**I want to** track my order
**So that** I know when it arrives

**Acceptance Criteria:**
- [ ] Tracking page with order number
- [ ] Status timeline
- [ ] Estimated delivery date
- [ ] Courier tracking link
- [ ] Real-time updates
- [ ] SMS/Email updates

---

### **PHASE 10: PROMOTIONS & MARKETING**

#### Story 10.1: Coupon Management
**As a** store owner
**I want to** create discount coupons
**So that** I can run promotions

**Acceptance Criteria:**
- [ ] Coupon code creation
- [ ] Discount type (%, fixed)
- [ ] Minimum order value
- [ ] Usage limit per customer
- [ ] Total usage limit
- [ ] Expiry date
- [ ] Auto-apply option
- [ ] Coupon analytics

#### Story 10.2: Banner Management
**As a** store owner
**I want to** add promotional banners
**So that** I can highlight offers

**Acceptance Criteria:**
- [ ] Upload banner images
- [ ] Link to product/category
- [ ] Position ordering
- [ ] Enable/disable
- [ ] Schedule (start/end date)
- [ ] Mobile/desktop variants

---

### **PHASE 11: ANALYTICS & REPORTS**

#### Story 11.1: Sales Dashboard
**As a** store owner
**I want to** see sales analytics
**So that** I understand business performance

**Acceptance Criteria:**
- [ ] Today's revenue
- [ ] This week/month/year
- [ ] Sales chart (daily, weekly, monthly)
- [ ] Top selling products
- [ ] Revenue by category
- [ ] Average order value
- [ ] Conversion rate

#### Story 11.2: Export Reports
**As a** store owner
**I want to** export reports
**So that** I can analyze offline

**Acceptance Criteria:**
- [ ] Order report (CSV/Excel)
- [ ] Sales report
- [ ] Product report
- [ ] Customer report
- [ ] Tax report
- [ ] Date range filter
- [ ] Download PDF/Excel

---

### **PHASE 12: NOTIFICATIONS**

#### Story 12.1: Email Notifications
**As a** user
**I want to** receive emails
**So that** I stay informed

**Emails:**
- [ ] Welcome email (store owner)
- [ ] Order confirmation (customer)
- [ ] Order shipped (customer)
- [ ] Order delivered (customer)
- [ ] Order cancelled (customer)
- [ ] Low stock alert (owner)
- [ ] New order (owner)
- [ ] Payment received (owner)

#### Story 12.2: SMS Notifications
**As a** customer
**I want to** receive SMS
**So that** I get instant updates

**SMS:**
- [ ] Order confirmation
- [ ] Order shipped with tracking
- [ ] Out for delivery
- [ ] Delivered confirmation

---

### **PHASE 13: SETTINGS & CONFIGURATION**

#### Story 13.1: Store Settings
**As a** store owner
**I want to** configure my store
**So that** it matches my brand

**Settings:**
- [ ] Store name & logo
- [ ] Store description
- [ ] Contact details
- [ ] Business address
- [ ] Currency settings
- [ ] Timezone
- [ ] Language
- [ ] Tax/GST number

#### Story 13.2: User Management
**As a** store owner
**I want to** add team members
**So that** they can help manage

**Roles:**
- [ ] Owner (full access)
- [ ] Manager (all except settings)
- [ ] Staff (orders, products only)

**Acceptance Criteria:**
- [ ] Invite users by email
- [ ] Assign roles
- [ ] Role permissions
- [ ] Activity log
- [ ] Remove users

---

## 🏗️ TECHNICAL ARCHITECTURE

### **Frontend Architecture**
```
/
├── Landing Page (/)
├── Demo Store (/demo)
├── Authentication
│   ├── Sign Up (/register)
│   ├── Sign In (/login)
│   ├── Forgot Password
│   └── Email Verification
│
├── Admin Dashboard (/dashboard)
│   ├── Overview
│   ├── Products
│   ├── Orders
│   ├── Customers
│   ├── Analytics
│   ├── Marketing
│   ├── Settings
│   └── Team
│
└── Customer Storefront (/store/[domain])
    ├── Home
    ├── Products
    ├── Product Detail
    ├── Cart
    ├── Checkout
    ├── Account
    └── Order Tracking
```

### **Backend Architecture**
```
API Routes:
├── /api/auth/*           # Authentication
├── /api/products/*       # Product CRUD
├── /api/orders/*         # Order management
├── /api/customers/*      # Customer management
├── /api/payments/*       # Payment processing
├── /api/shipping/*       # Shipping management
├── /api/analytics/*      # Reports & analytics
├── /api/coupons/*        # Promotion management
└── /api/webhooks/*       # External integrations
```

### **Database Schema**
- Users (store owners + customers)
- Stores (multi-tenant)
- Products & Variants
- Orders & Order Items
- Customers & Addresses
- Payments & Refunds
- Shipments & Tracking
- Coupons & Discounts
- Invoices
- Analytics

---

## 🎯 PRIORITY ORDER

### **MVP (Minimum Viable Product) - Week 1-2**
1. Landing page
2. Sign up/Sign in
3. Store setup wizard
4. Product management (add/edit/delete)
5. Order creation (manual)
6. Basic order status management
7. Invoice generation
8. Simple dashboard

### **Phase 2 - Week 3-4**
1. Customer storefront
2. Shopping cart
3. Checkout flow
4. COD payment
5. Order tracking
6. Email notifications
7. Customer management

### **Phase 3 - Week 5-6**
1. Payment gateway (Razorpay)
2. Shipping integration
3. Coupon system
4. Analytics dashboard
5. Export reports
6. SMS notifications

### **Phase 4 - Week 7-8**
1. Advanced inventory
2. Bulk operations
3. Customer portal
4. Team management
5. Advanced analytics
6. Mobile optimization

---

## ✅ SUCCESS CRITERIA

A user can:
1. ✅ Create store in < 5 minutes
2. ✅ Add first product in < 2 minutes
3. ✅ Receive first order
4. ✅ Process payment
5. ✅ Ship order
6. ✅ Customer can track order
7. ✅ Generate invoice PDF
8. ✅ View sales analytics

---

**READY TO BUILD THIS PROPERLY?** 🚀

Let me know and I'll start implementing from the landing page all the way through each feature with complete business logic!
