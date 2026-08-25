import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Product from '@/models/Product';
import Category from '@/models/Category';
import { getCurrentUser } from '@/lib/auth/auth';
import { fallbackProducts } from '@/lib/data/fallbackData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    const categorySlug = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const inStock = searchParams.get('inStock');
    const sort = searchParams.get('sort') || 'newest';
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : null;

    try {
      await connectToDatabase();

      // Get active user to determine correct pricing field for filtering/sorting
      const user = await getCurrentUser();
      const customerType = user ? user.customerType : 'NORMAL';

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
          return NextResponse.json({ products: [] });
        }
      }

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

      if (minPrice || maxPrice) {
        queryFilter[priceField] = {};
        if (minPrice) {
          queryFilter[priceField].$gte = parseFloat(minPrice);
        }
        if (maxPrice) {
          queryFilter[priceField].$lte = parseFloat(maxPrice);
        }
      }

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
        sortOptions.createdAt = -1;
      }

      let query = Product.find(queryFilter)
        .populate('categoryId', 'name slug')
        .sort(sortOptions);

      if (limit) {
        query = query.limit(limit);
      }

      const products = await query;
      if (products && products.length > 0) {
        return NextResponse.json({ products });
      }
    } catch (dbError) {
      console.warn('Database error or offline, serving fallback products:', dbError);
    }

    // Serve fallback products
    let filtered = [...fallbackProducts];
    if (categorySlug && categorySlug !== 'all') {
      filtered = filtered.filter((p) => p.categoryId.slug === categorySlug);
    }
    if (q) {
      const lowerQ = q.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQ) ||
          p.sku.toLowerCase().includes(lowerQ) ||
          p.description.toLowerCase().includes(lowerQ)
      );
    }
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error('Error in products API:', error);
    return NextResponse.json({ products: fallbackProducts });
  }
}
