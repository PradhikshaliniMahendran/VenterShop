import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

// 1. Parse .env.local manually to load environment variables
try {
  const envLocalPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envLocalPath)) {
    const envConfig = fs.readFileSync(envLocalPath, 'utf-8');
    for (const line of envConfig.split('\n')) {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let val = (match[2] || '').trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        } else if (val.startsWith("'") && val.endsWith("'")) {
          val = val.substring(1, val.length - 1);
        }
        process.env[key] = val;
      }
    }
  }
} catch (e) {
  console.warn('Could not parse .env.local file. Proceeding with system environment variables.');
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in environment variables or .env.local');
  process.exit(1);
}

// Import models using relative paths to bypass TS path aliases in direct CLI executions
import User from '../src/models/User';
import Admin from '../src/models/Admin';
import Product from '../src/models/Product';
import Category from '../src/models/Category';
import Community from '../src/models/Community';
import { Voucher } from '../src/models/Voucher';
import Offer from '../src/models/Offer';
import Setting from '../src/models/Setting';
import { hashPassword } from '../src/lib/auth/password';

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);
  console.log('Connected successfully!');

  // Clean collections
  console.log('Cleaning existing database collections...');
  await Promise.all([
    User.deleteMany({}),
    Admin.deleteMany({}),
    Product.deleteMany({}),
    Category.deleteMany({}),
    Community.deleteMany({}),
    Voucher.deleteMany({}),
    Offer.deleteMany({}),
    Setting.deleteMany({}),
  ]);
  console.log('Database cleaned.');

  // Create default setting
  console.log('Seeding default store settings...');
  const setting = await Setting.create({
    storeName: 'VENTERSHOP',
    tagline: 'Your Trusted Online Store for Quality Products',
    freeDeliveryThreshold: 75,
    currency: 'CAD',
    primaryEmail: 'info@ventershop.ca',
    primaryPhone: '+1 (800) 555-0199',
    address: '100 University Ave, Toronto, ON, Canada',
    maintenanceMode: false,
  });
  console.log('Settings seeded.');

  // Create Admins
  console.log('Seeding administrative users...');
  const adminSuper = await Admin.create({
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@ventershop.ca',
    password: hashPassword('admin123'),
    role: 'SUPER_ADMIN',
    isActive: true,
  });
  const adminStaff = await Admin.create({
    firstName: 'Staff',
    lastName: 'Member',
    email: 'staff@ventershop.ca',
    password: hashPassword('staff123'),
    role: 'ADMIN',
    isActive: true,
  });
  console.log('Admins seeded.');

  // Create Communities
  console.log('Seeding community groups...');
  const commToronto = await Community.create({
    name: 'Toronto Tamil Community',
    description: 'Serving community members in the Greater Toronto Area (GTA).',
    isActive: true,
    membershipCode: 'TORONTO100',
    memberCount: 1,
  });
  const commVancouver = await Community.create({
    name: 'Vancouver Community',
    description: 'Serving community members in British Columbia.',
    isActive: true,
    membershipCode: 'VANCOUVER200',
    memberCount: 0,
  });
  console.log('Communities seeded.');

  // Create Categories
  console.log('Seeding product categories...');
  const catGroceries = await Category.create({
    name: 'Groceries',
    slug: 'groceries',
    description: 'Fresh vegetables, rice, lentils, and everyday kitchen essentials.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823171/samples/food/potatoes.jpg',
    isActive: true,
    displayOrder: 1,
  });
  const catAnimalFeed = await Category.create({
    name: 'Animal Feed',
    slug: 'animal-feed',
    description: 'Quality nutrition and feeds for livestock and domestic pets.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823165/samples/animals/three-dogs.jpg',
    isActive: true,
    displayOrder: 2,
  });
  const catBooks = await Category.create({
    name: 'Books',
    slug: 'books',
    description: 'Educational resources, fiction, non-fiction, and Tamil literature.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823156/samples/ecommerce/accessories-bag.jpg',
    isActive: true,
    displayOrder: 3,
  });
  const catElectronics = await Category.create({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Premium gadgets, mobile accessories, audio, and personal hardware.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823169/samples/food/fish-vegetables.jpg',
    isActive: true,
    displayOrder: 4,
  });
  const catDailyNeeds = await Category.create({
    name: 'Daily Needs',
    slug: 'daily-needs',
    description: 'Toiletries, organic soaps, home cleaning products, and hygiene items.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823171/samples/ecommerce/leather-bag-gray.jpg',
    isActive: true,
    displayOrder: 5,
  });
  const catHome = await Category.create({
    name: 'Home',
    slug: 'home',
    description: 'Elegant home improvement, kitchen utensils, and decor essentials.',
    image: 'https://res.cloudinary.com/demo/image/upload/v1655823170/samples/food/spices.jpg',
    isActive: true,
    displayOrder: 6,
  });
  console.log('Categories seeded.');

  // Create Products
  console.log('Seeding product inventory items...');
  const prodRice = await Product.create({
    name: 'Premium Basmati Rice 5kg',
    slug: 'premium-basmati-rice-5kg',
    sku: 'GROC-BAS-001',
    categoryId: catGroceries._id,
    description: 'High-quality, long-grain basmati rice imported from top harvest fields. Perfect for biryani and everyday meals.',
    shortDescription: 'Long-grain premium basmati rice.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823171/samples/food/potatoes.jpg'],
    retailPrice: 22.0,
    communityPrice: 19.5,
    wholesalePrice: 16.0,
    stock: 120,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    wholesaleMinQty: 5,
    bulkPricing: [
      { minQty: 10, discountPercent: 5 }, // 5% off if buying 10+
      { minQty: 25, discountPercent: 10 }, // 10% off if buying 25+
    ],
  });

  const prodDogFood = await Product.create({
    name: 'Premium Canine Nutrition 12kg',
    slug: 'premium-canine-nutrition-12kg',
    sku: 'FEED-DOG-002',
    categoryId: catAnimalFeed._id,
    description: 'All-natural dog food formulated for adult dogs. Rich in protein, healthy fats, and essential digestive vitamins.',
    shortDescription: 'All-natural balanced food for adult dogs.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823165/samples/animals/three-dogs.jpg'],
    retailPrice: 45.0,
    communityPrice: 40.0,
    wholesalePrice: 32.0,
    stock: 45,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    wholesaleMinQty: 2,
    bulkPricing: [
      { minQty: 5, discountPercent: 8 }, // 8% off for 5+
      { minQty: 10, discountPercent: 12 }, // 12% off for 10+
    ],
  });

  const prodTSBook = await Product.create({
    name: 'Advanced Programming in TypeScript',
    slug: 'advanced-programming-in-typescript',
    sku: 'BOOK-TSC-003',
    categoryId: catBooks._id,
    description: 'The definitive guide to master type systems, decorators, architectural design patterns, and application scalability in TypeScript.',
    shortDescription: 'Master modern TypeScript development.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823156/samples/ecommerce/accessories-bag.jpg'],
    retailPrice: 34.99,
    communityPrice: 31.0,
    wholesalePrice: 24.5,
    stock: 15,
    lowStockThreshold: 3,
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    wholesaleMinQty: 1,
  });

  const prodHeadphones = await Product.create({
    name: 'Wireless Active Noise-Cancelling Headphones',
    slug: 'wireless-active-noise-cancelling-headphones',
    sku: 'ELEC-ANC-004',
    categoryId: catElectronics._id,
    description: 'Premium over-ear headphones with custom dynamic drivers, up to 40 hours of playback, and intelligent ambient control.',
    shortDescription: 'Over-ear hybrid ANC audio.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823169/samples/food/fish-vegetables.jpg'],
    retailPrice: 129.99,
    communityPrice: 119.0,
    wholesalePrice: 95.0,
    stock: 12,
    lowStockThreshold: 2,
    isActive: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    wholesaleMinQty: 2,
  });

  const prodSoap = await Product.create({
    name: 'Handcrafted Organic Lavender Soap',
    slug: 'handcrafted-organic-lavender-soap',
    sku: 'NEEDS-SOP-005',
    categoryId: catDailyNeeds._id,
    description: 'Triple-milled organic soap bar made with cold-pressed olive oil and pure lavender extract. Safe for sensitive skin.',
    shortDescription: 'All-natural relaxing lavender soap.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823171/samples/ecommerce/leather-bag-gray.jpg'],
    retailPrice: 8.5,
    communityPrice: 7.25,
    wholesalePrice: 5.0,
    stock: 350,
    lowStockThreshold: 25,
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    wholesaleMinQty: 10,
    bulkPricing: [
      { minQty: 50, discountPercent: 10 },
      { minQty: 100, discountPercent: 15 },
    ],
  });

  const prodMug = await Product.create({
    name: 'Ceramic Heat-Insulated Coffee Mug',
    slug: 'ceramic-heat-insulated-coffee-mug',
    sku: 'HOME-MUG-006',
    categoryId: catHome._id,
    description: 'Double-walled ceramic coffee mug with splash-proof lid. Retains heat for 4 hours and stays cool to the touch.',
    shortDescription: 'Elegant insulated ceramic mug.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823170/samples/food/spices.jpg'],
    retailPrice: 18.0,
    communityPrice: 16.0,
    wholesalePrice: 12.0,
    stock: 80,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    wholesaleMinQty: 4,
  });

  const prodSpices = await Product.create({
    name: 'Organic Golden Turmeric Powder 500g',
    slug: 'organic-golden-turmeric-powder-500g',
    sku: 'GROC-SPICE-007',
    categoryId: catGroceries._id,
    description: 'Pure, organic turmeric powder rich in curcumin content. Harvested and ground under strict quality standards.',
    shortDescription: '100% Organic aromatic turmeric powder.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823170/samples/food/spices.jpg'],
    retailPrice: 14.99,
    communityPrice: 12.5,
    wholesalePrice: 9.99,
    stock: 150,
    lowStockThreshold: 15,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: true,
    wholesaleMinQty: 5,
  });

  const prodTea = await Product.create({
    name: 'Premium Ceylon Black Tea Loose Leaf 500g',
    slug: 'premium-ceylon-black-tea-loose-leaf-500g',
    sku: 'GROC-TEA-008',
    categoryId: catGroceries._id,
    description: 'Single-origin Ceylon black tea leaves delivering rich aroma and full-bodied taste for morning brews.',
    shortDescription: 'Single-origin premium Ceylon black tea.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823171/samples/food/potatoes.jpg'],
    retailPrice: 16.5,
    communityPrice: 14.0,
    wholesalePrice: 11.0,
    stock: 90,
    lowStockThreshold: 10,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    wholesaleMinQty: 4,
  });

  const prodCatFood = await Product.create({
    name: 'Gourmet Salmon Cat Kibble 5kg',
    slug: 'gourmet-salmon-cat-kibble-5kg',
    sku: 'FEED-CAT-009',
    categoryId: catAnimalFeed._id,
    description: 'Nutrient-rich salmon kibble formulated for indoor and outdoor cats. Promotes healthy coat and digestive balance.',
    shortDescription: 'Salmon formula balanced kibble for adult cats.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823165/samples/animals/three-dogs.jpg'],
    retailPrice: 32.0,
    communityPrice: 28.0,
    wholesalePrice: 22.0,
    stock: 60,
    lowStockThreshold: 8,
    isActive: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    wholesaleMinQty: 3,
  });

  const prodGhee = await Product.create({
    name: 'Pure Organic Grass-Fed Cow Ghee 1L',
    slug: 'pure-organic-grass-fed-cow-ghee-1l',
    sku: 'GROC-GHEE-010',
    categoryId: catGroceries._id,
    description: 'Traditional slow-cooked grass-fed cow ghee. Naturally aromatic, lactose-free, and ideal for cooking and sweets.',
    shortDescription: 'Slow-cooked organic grass-fed cow ghee.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823171/samples/food/potatoes.jpg'],
    retailPrice: 24.99,
    communityPrice: 21.5,
    wholesalePrice: 17.0,
    stock: 110,
    lowStockThreshold: 12,
    isActive: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    wholesaleMinQty: 4,
  });

  const prodCookware = await Product.create({
    name: 'Cast Iron Pre-Seasoned Skillet 10-Inch',
    slug: 'cast-iron-pre-seasoned-skillet-10-inch',
    sku: 'HOME-COOK-011',
    categoryId: catHome._id,
    description: 'Heavy-duty pre-seasoned cast iron skillet. Provides superior heat retention and distribution for baking and searing.',
    shortDescription: 'Pre-seasoned heavy duty cast iron skillet.',
    images: ['https://res.cloudinary.com/demo/image/upload/v1655823170/samples/food/spices.jpg'],
    retailPrice: 39.99,
    communityPrice: 34.5,
    wholesalePrice: 26.0,
    stock: 40,
    lowStockThreshold: 5,
    isActive: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: true,
    wholesaleMinQty: 2,
  });
  console.log('Products seeded.');

  // Create Customers
  console.log('Seeding sample customer accounts...');
  const userNormal = await User.create({
    firstName: 'John',
    lastName: 'Smith',
    email: 'normal@ventershop.ca',
    password: hashPassword('password123'),
    phone: '+1 (647) 555-0101',
    customerType: 'NORMAL',
    status: 'ACTIVE',
    preferredLanguage: 'en',
    addresses: [
      {
        fullName: 'John Smith',
        addressLine1: '250 Yonge St',
        addressLine2: 'Apt 402',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M5B 2L7',
        country: 'Canada',
        phone: '+1 (647) 555-0101',
        addressType: 'Home',
        isDefault: true,
      },
    ],
  });

  const userCommunity = await User.create({
    firstName: 'Aarav',
    lastName: 'Pillai',
    email: 'community@ventershop.ca',
    password: hashPassword('password123'),
    phone: '+1 (647) 555-0102',
    customerType: 'COMMUNITY',
    status: 'ACTIVE',
    communityId: commToronto._id,
    communityStatus: 'APPROVED',
    communityJoinDate: new Date(),
    preferredLanguage: 'ta', // Preferred Tamil
    addresses: [
      {
        fullName: 'Aarav Pillai',
        addressLine1: '500 Danforth Ave',
        city: 'Toronto',
        province: 'Ontario',
        postalCode: 'M4K 1P6',
        country: 'Canada',
        phone: '+1 (647) 555-0102',
        addressType: 'Home',
        isDefault: true,
      },
    ],
  });

  const userWholesale = await User.create({
    firstName: 'Robert',
    lastName: 'Tremblay',
    email: 'wholesale@ventershop.ca',
    password: hashPassword('password123'),
    phone: '+1 (514) 555-0103',
    customerType: 'WHOLESALE',
    status: 'ACTIVE',
    preferredLanguage: 'en',
    addresses: [
      {
        fullName: 'Robert Tremblay',
        addressLine1: '1200 Rue Sherbrooke W',
        city: 'Montreal',
        province: 'Quebec',
        postalCode: 'H3A 2M8',
        country: 'Canada',
        phone: '+1 (514) 555-0103',
        addressType: 'Business',
        isDefault: true,
      },
    ],
  });
  console.log('Customers seeded.');

  // Create Offers
  console.log('Seeding promotional offers...');
  // 1. Community groceries discount (10% off groceries for community members)
  await Offer.create({
    name: 'Community Grocery Special',
    description: 'Get an automatic 10% discount on all Groceries items as a Community Member.',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    customerTypes: ['COMMUNITY'],
    categoryIds: [catGroceries._id],
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Started yesterday
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expiries in 30 days
    voucherRequired: false,
    isActive: true,
  });

  // 2. B2B high-volume discount
  await Offer.create({
    name: 'Wholesale B2B Bulk Boost',
    description: 'Get an automatic $20.00 off orders over $300.00 for wholesale purchases.',
    discountType: 'FIXED',
    discountValue: 20.0,
    customerTypes: ['WHOLESALE'],
    minimumOrderValue: 300.0,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    voucherRequired: false,
    isActive: true,
  });
  console.log('Offers seeded.');

  // Create Vouchers
  console.log('Seeding coupon vouchers...');
  // 1. WELCOME10: percentage coupon for normal customer types
  await Voucher.create({
    code: 'WELCOME10',
    description: 'First-time shopper welcome deal! Get 10% off your entire purchase (minimum $30 order).',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    customerTypes: ['NORMAL'],
    minimumOrderValue: 30.0,
    perCustomerLimit: 1,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days
    isActive: true,
  });

  // 2. GROCERY10: Category-scoped coupon for Toronto Tamil Community members
  await Voucher.create({
    code: 'GROCERY10',
    description: 'Exclusive Toronto Tamil Community deal: Get 15% off any Grocery purchase.',
    discountType: 'PERCENTAGE',
    discountValue: 15,
    customerTypes: ['COMMUNITY'],
    communityIds: [commToronto._id],
    categoryIds: [catGroceries._id],
    minimumOrderValue: 20.0,
    perCustomerLimit: 2,
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    isActive: true,
  });
  console.log('Vouchers seeded.');

  console.log('------------------------------------------------------------');
  console.log('DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('------------------------------------------------------------');
  console.log('Use the following credentials for development testing:');
  console.log('- Admin Login: email="admin@ventershop.ca" password="admin123"');
  console.log('- Staff Login: email="staff@ventershop.ca" password="staff123"');
  console.log('- Normal Customer: email="normal@ventershop.ca" password="password123"');
  console.log('- Community Member (Toronto): email="community@ventershop.ca" password="password123"');
  console.log('- Wholesale B2B Buyer: email="wholesale@ventershop.ca" password="password123"');
  console.log('------------------------------------------------------------');

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('ERROR run seeding database:', err);
  process.exit(1);
});
