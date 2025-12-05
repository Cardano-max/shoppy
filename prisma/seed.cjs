'use strict';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

const RESET_ORDER = [
  'verificationToken',
  'session',
  'account',
  'activityLog',
  'transaction',
  'banner',
  'coupon',
  'purchaseOrder',
  'abandonedCart',
  'estimate',
  'invoice',
  'orderStatusHistory',
  'shipment',
  'refund',
  'payment',
  'orderItem',
  'order',
  'address',
  'customer',
  'mediaAsset',
  'inventoryAdjustment',
  'productVariant',
  'product',
  'category',
  'collection',
  'storeMembership',
  'store',
  'storePlan',
  'user',
];

async function resetDatabase() {
  for (const model of RESET_ORDER) {
    if (typeof prisma[model]?.deleteMany === 'function') {
      await prisma[model].deleteMany();
    }
  }
}

async function createUsers() {
  const [ownerHash, staffHash] = await Promise.all([
    bcrypt.hash('Password123!', 10),
    bcrypt.hash('Password123!', 10),
  ]);

  const owner = await prisma.user.create({
    data: {
      email: 'founder@kiwiparty.in',
      name: 'Kiwi Founder',
      phone: '9714823492',
      password: ownerHash,
      status: 'ACTIVE',
    },
  });

  const staff = await prisma.user.create({
    data: {
      email: 'ops@kiwiparty.in',
      name: 'Operations Lead',
      phone: '9812345678',
      password: staffHash,
      status: 'ACTIVE',
    },
  });

  return { owner, staff };
}

async function seed() {
  console.log('Clearing existing records…');
  await resetDatabase();

  const { owner, staff } = await createUsers();

  console.log('Creating plans and store…');
  const plan = await prisma.storePlan.create({
    data: {
      name: 'Shoopy Pro',
      description: 'Everything you need to scale your commerce brand.',
      priceMonthly: 1499,
      priceYearly: 14999,
      features: JSON.stringify([
        'Unlimited products',
        'Advanced analytics',
        'Priority support',
      ]),
    },
  });

  const store = await prisma.store.create({
    data: {
      name: 'Happy Poppers',
      domain: 'kiwiparty.in',
      category: 'Gift Shop',
      phone: '9714823492',
      email: 'kiwipartydecorations@gmail.com',
      logo: '/images/kiwi-logo.png',
      favicon: '/images/kiwi-favicon.png',
      planId: plan.id,
      planStatus: 'ACTIVE',
      subscriptionEndsAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180),
      wallet: 9685,
    },
  });

  await prisma.storeMembership.createMany({
    data: [
      {
        role: 'OWNER',
        status: 'ACTIVE',
        storeId: store.id,
        userId: owner.id,
      },
      {
        role: 'STAFF',
        status: 'ACTIVE',
        storeId: store.id,
        userId: staff.id,
      },
    ],
  });

  console.log('Seeding categories and collections…');
  const categoryNames = [
    'Birthday Decorations',
    'Balloons & Props',
    'Lighting',
    'Party Games',
  ];

  const categories = await Promise.all(
    categoryNames.map((name, idx) =>
      prisma.category.create({
        data: {
          name,
          icon: ['🎉', '🎈', '💡', '🎲'][idx] || '⭐',
          storeId: store.id,
          status: 'ACTIVE',
        },
      })
    )
  );

  const collection = await prisma.collection.create({
    data: {
      name: 'Best Sellers',
      type: 'grid',
      products: 3,
      enabled: true,
      storeId: store.id,
    },
  });

  console.log('Creating products with variants…');
  const productPayloads = [
    {
      name: 'Premium Happy Birthday Decoration Combo – Silver Luxe',
      sku: 'SKU-1431',
      salePrice: 110,
      mrp: 120,
      categoryId: categories[0].id,
      description: '38 piece premium birthday decoration combo with foil curtains, balloons and bunting.',
      variants: [
        { title: 'Standard', sku: 'SKU-1431-STD', price: 110, stock: 600 },
        { title: 'Deluxe', sku: 'SKU-1431-DLX', price: 150, stock: 400 },
      ],
    },
    {
      name: 'Frozen Theme Decoration Kit – Blue & Silver',
      sku: 'SKU-1430',
      salePrice: 135,
      mrp: 150,
      categoryId: categories[0].id,
      description: 'Frozen inspired set with shimmer curtains, balloons, caps and table décor.',
      variants: [
        { title: 'Standard', sku: 'SKU-1430-STD', price: 135, stock: 550 },
        { title: 'Mega', sku: 'SKU-1430-MEGA', price: 210, stock: 250 },
      ],
    },
    {
      name: 'SFX Indoor Cold Pyro Pack',
      sku: 'SKU-2001',
      salePrice: 399,
      mrp: 450,
      categoryId: categories[2].id,
      description: 'Electronic cold pyro kit for safe indoor celebrations.',
      variants: [
        { title: 'Single Shot', sku: 'SKU-2001-SHOT', price: 399, stock: 120 },
      ],
    },
  ];

  const products = [];
  for (const payload of productPayloads) {
    const product = await prisma.product.create({
      data: {
        name: payload.name,
        sku: payload.sku,
        description: payload.description,
        salePrice: payload.salePrice,
        mrp: payload.mrp,
        quantity: payload.variants.reduce((sum, v) => sum + v.stock, 0),
        storeId: store.id,
        categoryId: payload.categoryId,
        status: 'ACTIVE',
        variants: {
          create: payload.variants.map((variant) => ({
            title: variant.title,
            sku: variant.sku,
            price: variant.price,
            stock: variant.stock,
            status: 'ACTIVE',
            attributes: JSON.stringify({ theme: 'party' }),
            storeId: store.id,
          })),
        },
      },
      include: { variants: true },
    });
    products.push(product);
  }

  const variantBySku = {};
  products.forEach((product) => {
    product.variants.forEach((variant) => {
      variantBySku[variant.sku] = { variant, productId: product.id };
    });
  });

  await prisma.mediaAsset.createMany({
    data: products.map((product, index) => ({
      storeId: store.id,
      productId: product.id,
      type: 'IMAGE',
      url: `/media/product-${index + 1}.jpg`,
      altText: `${product.name} hero`,
      metadata: JSON.stringify({ featured: index === 0 }),
    })),
  });

  await Promise.all(
    Object.values(variantBySku).map(({ variant }) =>
      prisma.inventoryAdjustment.create({
        data: {
          storeId: store.id,
          variantId: variant.id,
          reason: 'MANUAL',
          quantity: variant.stock,
          note: 'Initial stock import',
        },
      })
    )
  );

  console.log('Creating customers and addresses…');
  const customersSeed = [
    {
      profile: {
        name: 'Desh Deepak Misra',
        phone: '9988776655',
        email: 'desh@example.com',
      },
      shipping: {
        label: 'Home',
        name: 'Desh Deepak Misra',
        line1: '21 Marine Lines',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400001',
        phone: '9988776655',
      },
      billing: {
        label: 'Billing',
        name: 'Desh Deepak Misra',
        line1: '21 Marine Lines',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400001',
        phone: '9988776655',
      },
    },
    {
      profile: {
        name: 'Raksha Director',
        phone: '9123456780',
        email: 'raksha@example.com',
      },
      shipping: {
        label: 'Office',
        name: 'Raksha Director',
        line1: '11 Residency Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560025',
        phone: '9123456780',
      },
      billing: {
        label: 'Finance',
        name: 'Raksha Director',
        line1: '11 Residency Road',
        city: 'Bengaluru',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560025',
        phone: '9123456780',
      },
    },
  ];

  const customers = [];
  for (const seed of customersSeed) {
    const customer = await prisma.customer.create({
      data: { ...seed.profile, storeId: store.id },
    });
    const shipping = await prisma.address.create({
      data: {
        ...seed.shipping,
        type: 'SHIPPING',
        storeId: store.id,
        customerId: customer.id,
      },
    });
    const billing = await prisma.address.create({
      data: {
        ...seed.billing,
        type: 'BILLING',
        storeId: store.id,
        customerId: customer.id,
      },
    });
    customers.push({ customer, shipping, billing });
  }

  console.log('Creating orders, payments, and shipments…');
  const orderSeeds = [
    {
      orderNumber: 'ORD-0051',
      amount: 5600,
      status: 'CONFIRMED',
      orderDate: new Date('2025-11-11T10:00:00Z'),
      deliverBy: new Date('2025-11-15T10:00:00Z'),
      trackingNumber: 'BDART123456',
      paymentMethod: 'PREPAID',
      invoiceNumber: 'ORDER-FORM0046',
      customerIndex: 0,
      items: [
        { sku: 'SKU-1431-STD', quantity: 1 },
        { sku: 'SKU-1430-STD', quantity: 2 },
      ],
    },
    {
      orderNumber: 'ORD-0050',
      amount: 5430,
      status: 'CONFIRMED',
      orderDate: new Date('2025-11-06T08:00:00Z'),
      deliverBy: new Date('2025-11-10T08:00:00Z'),
      trackingNumber: 'BDART789012',
      paymentMethod: 'COD',
      invoiceNumber: 'ORDER-FORM0045',
      customerIndex: 1,
      items: [{ sku: 'SKU-1431-DLX', quantity: 1 }],
    },
  ];

  for (const seed of orderSeeds) {
    const bundle = customers[seed.customerIndex];
    await prisma.order.create({
      data: {
        orderNumber: seed.orderNumber,
        amount: seed.amount,
        status: seed.status,
        type: 'Delivery',
        orderDate: seed.orderDate,
        deliverBy: seed.deliverBy,
        customerId: bundle.customer.id,
        storeId: store.id,
        shippingAddressId: bundle.shipping.id,
        billingAddressId: bundle.billing.id,
        items: {
          create: seed.items.map(({ sku, quantity }) => {
            const mapping = variantBySku[sku];
            return {
              quantity,
              price: mapping.variant.price,
              productId: mapping.productId,
              variantId: mapping.variant.id,
            };
          }),
        },
        payments: {
          create: {
            provider: 'Razorpay',
            reference: `PAY-${seed.orderNumber}`,
            amount: seed.amount,
            currency: 'INR',
            method: seed.paymentMethod,
            status: seed.paymentMethod === 'COD' ? 'PENDING' : 'CAPTURED',
            storeId: store.id,
          },
        },
        shipments: {
          create: {
            carrier: 'Bluedart',
            trackingNumber: seed.trackingNumber,
            status: 'IN_TRANSIT',
            storeId: store.id,
          },
        },
        statusHistory: {
          create: [
            {
              oldStatus: 'PENDING',
              newStatus: seed.status,
              userId: owner.id,
              note: 'Auto-confirmed via seed',
            },
          ],
        },
        invoices: {
          create: {
            invoiceNumber: seed.invoiceNumber,
            amount: seed.amount,
            balance: 0,
            status: seed.paymentMethod === 'COD' ? 'Unpaid' : 'Paid',
            customerId: bundle.customer.id,
            storeId: store.id,
            source: 'Online',
          },
        },
      },
    });
  }

  console.log('Creating miscellaneous records…');
  await prisma.estimate.create({
    data: {
      estimateNumber: 'EST-0001',
      amount: 150,
      balance: 150,
      status: 'Pending',
      customerId: customers[0].customer.id,
      storeId: store.id,
    },
  });

  await prisma.abandonedCart.create({
    data: {
      cartNumber: 'CRT-13516190',
      amount: 1700,
      customerName: 'Navsari Resident',
      customerMobile: '9988775544',
      approxCity: 'Navsari',
      approxPincode: '396445',
      storeId: store.id,
    },
  });

  await prisma.coupon.create({
    data: {
      code: 'DISCOUNT10',
      value: '10%',
      maxDiscount: 500,
      orderAmount: 2500,
      autoApply: true,
      active: true,
      rules: JSON.stringify({ type: 'percentage', value: 10 }),
      storeId: store.id,
    },
  });

  await prisma.banner.create({
    data: {
      position: 1,
      images: '/media/banners/banner1.jpg',
      enabled: true,
      storeId: store.id,
    },
  });

  await prisma.transaction.create({
    data: {
      description: 'Credits from order ORD-0051',
      type: 'CREDIT',
      amount: 5600,
      credits: 5,
      balance: 9685,
      referenceId: 'ORD-0051',
      referenceType: 'ORDER',
      storeId: store.id,
    },
  });

  await prisma.activityLog.create({
    data: {
      storeId: store.id,
      userId: owner.id,
      entity: 'ORDER',
      entityId: 'ORD-0051',
      action: 'STATUS_CHANGE',
      payload: JSON.stringify({ to: 'CONFIRMED' }),
    },
  });

  await prisma.purchaseOrder.create({
    data: {
      vendorName: 'Kiwi Supplier Co.',
      reference: 'PO-2025-0001',
      status: 'Open',
      amount: 25000,
      expectedDate: new Date('2025-11-30T10:00:00Z'),
      notes: 'Monthly replenishment',
      storeId: store.id,
    },
  });

  console.log('Seed data created successfully ✅');
}

seed()
  .catch((error) => {
    console.error('Seeding failed ❌', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

