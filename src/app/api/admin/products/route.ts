import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Product from '@/models/Product';
import Category from '@/models/Category';

// 1. GET: Fetch all products for admin grid
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const products = await Product.find()
      .populate('categoryId', 'name slug')
      .sort({ createdAt: -1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// 2. POST: Create a new product
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      slug,
      sku,
      description,
      shortDescription,
      images,
      retailPrice,
      communityPrice,
      wholesalePrice,
      stock,
      lowStockThreshold,
      wholesaleMinQty,
      categoryId,
      isActive,
      isFeatured,
      isBestSeller,
      isNewArrival,
      bulkPricing,
      eligibleCustomerTypes,
    } = body;

    if (!name || !slug || !sku || !description || retailPrice === undefined || categoryId === undefined) {
      return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 });
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
    }

    // Verify slug uniqueness
    const slugExists = await Product.findOne({ slug: slug.trim().toLowerCase() });
    if (slugExists) {
      return NextResponse.json({ error: 'Product slug is already in use' }, { status: 400 });
    }

    const newProduct = await Product.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      sku: sku.trim().toUpperCase(),
      description: description.trim(),
      shortDescription: shortDescription?.trim(),
      images: images || [],
      retailPrice: parseFloat(retailPrice),
      communityPrice: communityPrice !== undefined ? parseFloat(communityPrice) : parseFloat(retailPrice),
      wholesalePrice: wholesalePrice !== undefined ? parseFloat(wholesalePrice) : parseFloat(retailPrice),
      stock: parseInt(stock) || 0,
      lowStockThreshold: parseInt(lowStockThreshold) || 5,
      wholesaleMinQty: wholesaleMinQty !== undefined ? parseInt(wholesaleMinQty) : 1,
      categoryId,
      isActive: isActive ?? true,
      isFeatured: isFeatured ?? false,
      isBestSeller: isBestSeller ?? false,
      isNewArrival: isNewArrival ?? false,
      bulkPricing: bulkPricing || [],
      eligibleCustomerTypes: eligibleCustomerTypes || ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
    });

    return NextResponse.json({
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to create product' }, { status: 500 });
  }
}

// 3. PUT: Update an existing product
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      productId,
      name,
      slug,
      sku,
      description,
      shortDescription,
      images,
      retailPrice,
      communityPrice,
      wholesalePrice,
      stock,
      lowStockThreshold,
      wholesaleMinQty,
      categoryId,
      isActive,
      isFeatured,
      isBestSeller,
      isNewArrival,
      bulkPricing,
      eligibleCustomerTypes,
    } = body;

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Verify slug uniqueness if slug changed
    if (slug && slug.trim().toLowerCase() !== product.slug) {
      const slugExists = await Product.findOne({ slug: slug.trim().toLowerCase() });
      if (slugExists) {
        return NextResponse.json({ error: 'Product slug is already in use' }, { status: 400 });
      }
      product.slug = slug.trim().toLowerCase();
    }

    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return NextResponse.json({ error: 'Category does not exist' }, { status: 400 });
      }
      product.categoryId = categoryId;
    }

    if (name) product.name = name.trim();
    if (sku) product.sku = sku.trim().toUpperCase();
    if (description) product.description = description.trim();
    if (shortDescription !== undefined) product.shortDescription = shortDescription.trim();
    if (images) product.images = images;
    if (retailPrice !== undefined) product.retailPrice = parseFloat(retailPrice);
    if (communityPrice !== undefined) product.communityPrice = parseFloat(communityPrice);
    if (wholesalePrice !== undefined) product.wholesalePrice = parseFloat(wholesalePrice);
    if (stock !== undefined) product.stock = parseInt(stock) || 0;
    if (lowStockThreshold !== undefined) product.lowStockThreshold = parseInt(lowStockThreshold) || 5;
    if (wholesaleMinQty !== undefined) product.wholesaleMinQty = parseInt(wholesaleMinQty) || 1;
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (isBestSeller !== undefined) product.isBestSeller = isBestSeller;
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
    if (bulkPricing) product.bulkPricing = bulkPricing;
    if (eligibleCustomerTypes) product.eligibleCustomerTypes = eligibleCustomerTypes;

    await product.save();

    return NextResponse.json({
      message: 'Product updated successfully',
      product,
    });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: error.message || 'Failed to update product' }, { status: 500 });
  }
}

// 4. DELETE: Delete a product
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Product deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
