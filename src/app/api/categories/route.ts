import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Category from '@/models/Category';
import { fallbackCategories } from '@/lib/data/fallbackData';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    if (categories && categories.length > 0) {
      return NextResponse.json({ categories });
    }
    return NextResponse.json({ categories: fallbackCategories });
  } catch (error) {
    console.warn('Database offline or unreachable, serving fallback categories:', error);
    return NextResponse.json({ categories: fallbackCategories });
  }
}
