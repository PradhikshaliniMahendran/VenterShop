import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth/auth';
import mongoose from 'mongoose';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Get active user to determine correct pricing field for filtering/sorting
    const user = await getCurrentUser();
    const customerType = user ? user.customerType : 'NORMAL';

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categorySlug = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'newest';

    // 1. Build Query Filter
    const queryFilter: any = { isActive: true };

    // Search query matches name, SKU, or description
    if (q) {
      const searchRegex = new RegExp(q.trim(), 'i');
      queryFilter.$or = [
        { name: searchRegex },
        { sku: searchRegex },
        { description: searchRegex },
        { shortDescription: searchRegex },
      ];
    }

    // Filter by Category Slug
    if (categorySlug && categorySlug !== 'all') {
      const categoryDoc = await Category.findOne({ slug: categorySlug, isActive: true });
      if (categoryDoc) {
        queryFilter.categoryId = categoryDoc._id;
      } else {
        // If category is provided but invalid, return empty array immediately
        return NextResponse.json({ products: [] });
      }
    }

    // Filter by Customer Type availability (if any product is restricted)
    queryFilter.eligibleCustomerTypes = customerType;

    // Filter by Stock Status
    if (inStock === 'true') {
      queryFilter.stock = { $gt: 0 };
    }

    // Determine target price field for this customer type
    let priceField = 'retailPrice';
    if (customerType === 'WHOLESALE') {
      priceField = 'wholesalePrice';
    } else if (customerType === 'COMMUNITY') {
      priceField = 'communityPrice';
    }

    // Filter by Price Bounds (applied to the specific user-type price field)
    if (minPrice || maxPrice) {
      queryFilter[priceField] = {};
      if (minPrice) {
        queryFilter[priceField].$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        queryFilter[priceField].$lte = parseFloat(maxPrice);
      }
    }

    // 2. Build Sort Options
    let sortOptions: any = {};
    if (sort === 'price-asc') {
      sortOptions[priceField] = 1;
    } else if (sort === 'price-desc') {
      sortOptions[priceField] = -1;
    } else if (sort === 'newest') {
      sortOptions.createdAt = -1;
    } else if (sort === 'bestselling') {
      sortOptions.isBestSeller = -1;
      sortOptions.createdAt = -1;
    } else if (sort === 'popular') {
      sortOptions.isFeatured = -1;
      sortOptions.createdAt = -1;
    } else {
      sortOptions.createdAt = -1; // Fallback to newest
    }

    // 3. Fetch products
    const products = await Product.find(queryFilter)
      .populate('categoryId', 'name slug')
      .sort(sortOptions);

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching products API:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
