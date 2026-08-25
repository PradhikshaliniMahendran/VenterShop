import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import Community from '@/models/Community';

export async function GET() {
  try {
    await connectToDatabase();
    const communities = await Community.find({ isActive: true }).sort({ createdAt: 1 });
    return NextResponse.json({ communities });
  } catch (error) {
    console.error('Error fetching public communities:', error);
    return NextResponse.json({ communities: [] });
  }
}
