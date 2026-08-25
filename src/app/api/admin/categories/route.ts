import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Category from '@/models/Category';
import Product from '@/models/Product';

// 1. POST: Create a new category
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, slug, icon, displayOrder, isActive } = await request.json();

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    // Check slug uniqueness
    const slugExists = await Category.findOne({ slug: slug.trim().toLowerCase() });
    if (slugExists) {
      return NextResponse.json({ error: 'Category slug is already in use' }, { status: 400 });
    }

    const newCategory = await Category.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      icon: icon || 'Layers',
      displayOrder: parseInt(displayOrder) || 0,
      isActive: isActive ?? true,
    });

    return NextResponse.json({
      message: 'Category created successfully',
      category: newCategory,
    });
  } catch (error: any) {
    console.error('Error creating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to create category' }, { status: 500 });
  }
}

// 2. PUT: Update an existing category
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { categoryId, name, slug, icon, displayOrder, isActive } = await request.json();

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check slug uniqueness if it changed
    if (slug && slug.trim().toLowerCase() !== category.slug) {
      const slugExists = await Category.findOne({ slug: slug.trim().toLowerCase() });
      if (slugExists) {
        return NextResponse.json({ error: 'Category slug is already in use' }, { status: 400 });
      }
      category.slug = slug.trim().toLowerCase();
    }

    if (name) category.name = name.trim();
    if (icon) category.icon = icon;
    if (displayOrder !== undefined) category.displayOrder = parseInt(displayOrder) || 0;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    return NextResponse.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: error.message || 'Failed to update category' }, { status: 500 });
  }
}

// 3. DELETE: Delete a category (with safety check)
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('id');

    if (!categoryId) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Safety Constraint: Check if active products belong to this category
    const productsCount = await Product.countDocuments({ categoryId });
    if (productsCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category. Active products are categorized under it. Re-assign them first.' },
        { status: 400 }
      );
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
