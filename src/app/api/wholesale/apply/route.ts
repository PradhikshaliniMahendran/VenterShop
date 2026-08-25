import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import WholesaleApplication from '@/models/WholesaleApplication';

// 1. GET: Fetch user's wholesale application status
export async function GET() {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const application = await WholesaleApplication.findOne({ userId: user.id });

    return NextResponse.json({ application });
  } catch (error) {
    console.error('Error fetching wholesale application:', error);
    return NextResponse.json({ error: 'Failed to fetch application details' }, { status: 500 });
  }
}

// 2. POST: Submit B2B wholesale application
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      businessName,
      contactPerson,
      email,
      phone,
      businessAddress,
      city,
      province,
      postalCode,
      expectedOrderVolume,
      wholesaleCategory,
      additionalNotes,
    } = await request.json();

    if (!businessName || !contactPerson || !email || !phone || !businessAddress || !city || !province || !postalCode || !expectedOrderVolume) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }

    // Check if an application already exists
    const existingApp = await WholesaleApplication.findOne({ userId: user.id });
    if (existingApp && (existingApp.status === 'PENDING' || existingApp.status === 'APPROVED')) {
      return NextResponse.json(
        { error: 'You already have a pending or active B2B application.' },
        { status: 400 }
      );
    }

    // Delete rejected application if reapplying
    if (existingApp && existingApp.status === 'REJECTED') {
      await WholesaleApplication.deleteOne({ userId: user.id });
    }

    const newApp = await WholesaleApplication.create({
      userId: user.id,
      businessName,
      contactPerson,
      email: email.toLowerCase().trim(),
      phone,
      businessAddress,
      city,
      province,
      postalCode,
      expectedOrderVolume,
      wholesaleCategory,
      additionalNotes,
      status: 'PENDING',
    });

    return NextResponse.json({
      message: 'Application submitted successfully for review.',
      application: newApp,
    });
  } catch (error) {
    console.error('Error submitting wholesale application:', error);
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
  }
}
