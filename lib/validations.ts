import { z } from 'zod'

// Product validations
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  sku: z.string().min(1, 'SKU is required'),
  description: z.string().optional(),
  salePrice: z.number().min(0, 'Sale price must be positive'),
  mrp: z.number().min(0, 'MRP must be positive'),
  quantity: z.number().int().min(0, 'Quantity must be non-negative'),
  image: z.string().optional(),
  categoryId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
})

export const updateProductSchema = createProductSchema.partial()

// Customer validations
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  type: z.enum(['Consumer', 'Retailer']).default('Consumer'),
  walletPoints: z.number().int().min(0).default(0),
  advance: z.number().min(0).default(0),
  due: z.number().min(0).default(0),
})

export const updateCustomerSchema = createCustomerSchema.partial()

// Order validations
export const createOrderSchema = z.object({
  orderNumber: z.string().min(1, 'Order number is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']).default('PENDING'),
  orderDate: z.string().or(z.date()).optional(),
  deliverBy: z.string().or(z.date()).optional(),
  type: z.enum(['Online', 'Offline']).default('Online'),
  customerId: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
  })).min(1, 'At least one item is required'),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  note: z.string().optional(),
})

// Category validations
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  icon: z.string().optional(),
  image: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
})

export const updateCategorySchema = createCategorySchema.partial()

// Collection validations
export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required'),
  type: z.string().optional(),
  enabled: z.boolean().default(true),
})

export const updateCollectionSchema = createCollectionSchema.partial()

// Coupon validations
export const createCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').toUpperCase(),
  value: z.string().min(1, 'Coupon value is required'),
  maxDiscount: z.number().min(0).optional(),
  orderAmount: z.number().min(0).optional(),
  perCustomer: z.number().int().min(0).default(0),
  source: z.string().optional(),
  autoApply: z.boolean().default(false),
  expiry: z.string().or(z.date()).optional(),
  active: z.boolean().default(true),
  rules: z.string().optional(),
})

export const updateCouponSchema = createCouponSchema.partial()

// Banner validations
export const createBannerSchema = z.object({
  position: z.number().int().min(0),
  images: z.string().min(1, 'Banner image URL is required'),
  enabled: z.boolean().default(true),
})

export const updateBannerSchema = createBannerSchema.partial()

// Invoice validations
export const createInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  balance: z.number().min(0).default(0),
  status: z.enum(['Unpaid', 'Paid', 'Overdue', 'Cancelled']).default('Unpaid'),
  source: z.enum(['Online', 'Offline']).default('Online'),
  dueDate: z.string().or(z.date()).optional(),
  customerId: z.string().optional(),
  orderId: z.string().optional(),
})

export const updateInvoiceSchema = createInvoiceSchema.partial()

// Estimate validations
export const createEstimateSchema = z.object({
  estimateNumber: z.string().min(1, 'Estimate number is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  balance: z.number().min(0).default(0),
  status: z.enum(['Pending', 'Accepted', 'Rejected', 'Expired']).default('Pending'),
  customerId: z.string().optional(),
})

export const updateEstimateSchema = createEstimateSchema.partial()
