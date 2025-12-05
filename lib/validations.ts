import { z } from 'zod'

// Product validations
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  description: z.string().optional(),
  sku: z.string().min(1, 'SKU is required').max(100),
  price: z.number().min(0, 'Price must be non-negative'),
  compareAtPrice: z.number().min(0).optional().nullable(),
  costPerItem: z.number().min(0).optional().nullable(),
  trackQuantity: z.boolean().default(true),
  quantity: z.number().int().min(0).default(0),
  categoryId: z.string().optional().nullable(),
  collectionId: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).default('ACTIVE'),
  images: z.array(z.string()).optional(),
  weight: z.number().min(0).optional().nullable(),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz']).optional().nullable(),
})

export const updateProductSchema = createProductSchema.partial()

export const createProductVariantSchema = z.object({
  productId: z.string(),
  name: z.string().min(1, 'Variant name is required'),
  sku: z.string().min(1, 'SKU is required'),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional().nullable(),
  quantity: z.number().int().min(0).default(0),
  optionValues: z.record(z.string()).optional(),
})

// Customer validations
export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Customer name is required').max(200),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z.string().min(10, 'Phone must be at least 10 digits').max(15).optional().nullable(),
  type: z.enum(['CONSUMER', 'RETAILER']).default('CONSUMER'),
  notes: z.string().optional().nullable(),
  walletPoints: z.number().min(0).default(0),
  advance: z.number().min(0).default(0),
  due: z.number().min(0).default(0),
})

export const updateCustomerSchema = createCustomerSchema.partial()

export const createAddressSchema = z.object({
  customerId: z.string(),
  type: z.enum(['SHIPPING', 'BILLING']),
  line1: z.string().min(1, 'Address line is required'),
  line2: z.string().optional().nullable(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
})

// Order validations
export const createOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string().optional().nullable(),
    variantId: z.string().optional().nullable(),
    name: z.string(),
    quantity: z.number().int().min(1),
    price: z.number().min(0),
    discount: z.number().min(0).default(0),
  })).min(1, 'At least one item is required'),
  notes: z.string().optional().nullable(),
  deliveryMethod: z.enum(['DELIVERY', 'PICKUP']).default('DELIVERY'),
  shippingAddressId: z.string().optional().nullable(),
  expectedDeliveryDate: z.string().optional().nullable(),
  discount: z.number().min(0).default(0),
  tax: z.number().min(0).default(0),
  shippingCost: z.number().min(0).default(0),
})

export const updateOrderStatusSchema = z.object({
  status: z.enum(['NEW', 'CONFIRMED', 'SHIPMENT_READY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED']),
  notes: z.string().optional().nullable(),
})

// Category validations
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateCategorySchema = createCategorySchema.partial()

// Collection validations
export const createCollectionSchema = z.object({
  name: z.string().min(1, 'Collection name is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateCollectionSchema = createCollectionSchema.partial()

// Coupon validations
export const createCouponSchema = z.object({
  code: z.string().min(1, 'Coupon code is required').max(50).toUpperCase(),
  description: z.string().optional().nullable(),
  type: z.enum(['PERCENTAGE', 'FIXED']),
  value: z.number().min(0),
  minOrderValue: z.number().min(0).optional().nullable(),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  usageCount: z.number().int().min(0).default(0),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  enabled: z.boolean().default(true),
  autoApply: z.boolean().default(false),
})

export const updateCouponSchema = createCouponSchema.partial()

// Banner validations
export const createBannerSchema = z.object({
  title: z.string().min(1, 'Banner title is required').max(200),
  description: z.string().optional().nullable(),
  imageUrl: z.string().min(1, 'Image URL is required'),
  linkUrl: z.string().optional().nullable(),
  position: z.enum(['HERO', 'SECONDARY', 'FOOTER']).default('HERO'),
  sortOrder: z.number().int().min(0).default(0),
  enabled: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
})

export const updateBannerSchema = createBannerSchema.partial()

// Invoice validations
export const createInvoiceSchema = z.object({
  orderId: z.string(),
  dueDate: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  items: z.array(z.object({
    description: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0),
    tax: z.number().min(0).default(0),
  })).optional(),
})

export const updateInvoiceSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED']),
  paidAt: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
})

// Store Settings validations
export const updateStoreSettingsSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  category: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  logo: z.string().optional().nullable(),
  favicon: z.string().optional().nullable(),
  domain: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  currency: z.string().default('INR').optional(),
  timezone: z.string().optional().nullable(),
})

// Transaction/Wallet validations
export const createTransactionSchema = z.object({
  customerId: z.string(),
  type: z.enum(['CREDIT', 'DEBIT', 'REFUND']),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  description: z.string().min(1, 'Description is required'),
  reference: z.string().optional().nullable(),
})

// Query/Filter validations
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

export const productFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  collectionId: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'ARCHIVED']).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
})

export const orderFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  customerId: z.string().optional(),
  status: z.enum(['NEW', 'CONFIRMED', 'SHIPMENT_READY', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED', 'RETURNED']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

export const customerFilterSchema = paginationSchema.extend({
  search: z.string().optional(),
  type: z.enum(['CONSUMER', 'RETAILER']).optional(),
})
