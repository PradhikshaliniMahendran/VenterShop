import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import Setting from '@/models/Setting';

// 1. GET: Fetch global settings
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await Setting.findOne();
    if (!settings) {
      // Auto seed defaults if settings not found
      settings = await Setting.create({
        freeDeliveryThreshold: 75,
        primaryEmail: 'admin@ventershop.ca',
        maintenanceMode: false,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 550 });
  }
}

// 2. PUT: Update global settings
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { freeDeliveryThreshold, primaryEmail, maintenanceMode } = await request.json();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }

    if (freeDeliveryThreshold !== undefined) settings.freeDeliveryThreshold = parseFloat(freeDeliveryThreshold);
    if (primaryEmail) settings.primaryEmail = primaryEmail.trim().toLowerCase();
    if (maintenanceMode !== undefined) settings.maintenanceMode = maintenanceMode;

    await settings.save();

    return NextResponse.json({
      message: 'Global settings updated successfully',
      settings,
    });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: error.message || 'Failed to update settings' }, { status: 550 });
  }
}
