import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1 });
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching categories API:', error);
    return NextResponse.json({ categories: [] }, { status: 500 });
  }
}
