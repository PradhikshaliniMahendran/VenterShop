import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import { Voucher } from '@/models/Voucher';
import Offer from '@/models/Offer';
import Community from '@/models/Community';
import Category from '@/models/Category';
import Product from '@/models/Product';

// 1. GET: Fetch all Vouchers and active Offers
export async function GET() {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [vouchers, offers] = await Promise.all([
      Voucher.find()
        .populate('categoryIds', 'name')
        .populate('productIds', 'name')
        .populate('communityIds', 'name')
        .sort({ createdAt: -1 }),
      Offer.find()
        .populate('categoryIds', 'name')
        .populate('productIds', 'name')
        .populate('communityIds', 'name')
        .sort({ createdAt: -1 }),
    ]);

    return NextResponse.json({
      vouchers,
      offers,
    });
  } catch (error) {
    console.error('Error fetching vouchers & offers:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 500 });
  }
}

// 2. POST: Create a new Voucher or Offer
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type, // 'VOUCHER' or 'OFFER'
      code, // voucher specific
      name, // offer specific
      description,
      discountType,
      discountValue,
      minimumOrderValue, // voucher specific
      startDate,
      endDate,
      usageLimit, // voucher specific
      perCustomerLimit, // voucher specific
      customerTypes,
      categoryIds,
      productIds,
      communityIds,
      isActive,
    } = body;

    if (!type || !description || !discountType || discountValue === undefined || !startDate || !endDate) {
      return NextResponse.json({ error: 'Please provide all required parameters.' }, { status: 400 });
    }

    if (type === 'VOUCHER') {
      if (!code) {
        return NextResponse.json({ error: 'Voucher code is required' }, { status: 400 });
      }

      // Check code uniqueness
      const exists = await Voucher.findOne({ code: code.toUpperCase().trim() });
      if (exists) {
        return NextResponse.json({ error: 'Voucher code is already in use' }, { status: 400 });
      }

      const newVoucher = await Voucher.create({
        code: code.toUpperCase().trim(),
        description: description.trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        minimumOrderValue: parseFloat(minimumOrderValue || 0),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit: usageLimit !== '' ? parseInt(usageLimit) : undefined,
        perCustomerLimit: parseInt(perCustomerLimit) || 1,
        customerTypes: customerTypes || ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
        categoryIds: categoryIds || [],
        productIds: productIds || [],
        communityIds: communityIds || [],
        isActive: isActive ?? true,
      });

      return NextResponse.json({ message: 'Voucher coupon created successfully', campaign: newVoucher });
    } else if (type === 'OFFER') {
      if (!name) {
        return NextResponse.json({ error: 'Offer name is required' }, { status: 400 });
      }

      const newOffer = await Offer.create({
        name: name.trim(),
        description: description.trim(),
        discountType,
        discountValue: parseFloat(discountValue),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        customerTypes: customerTypes || ['NORMAL', 'COMMUNITY', 'WHOLESALE'],
        categoryIds: categoryIds || [],
        productIds: productIds || [],
        communityIds: communityIds || [],
        isActive: isActive ?? true,
      });

      return NextResponse.json({ message: 'Storefront offer created successfully', campaign: newOffer });
    }

    return NextResponse.json({ error: 'Invalid campaign type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to create campaign' }, { status: 500 });
  }
}

// 3. PUT: Update an existing Campaign
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      type,
      campaignId,
      code,
      name,
      description,
      discountType,
      discountValue,
      minimumOrderValue,
      startDate,
      endDate,
      usageLimit,
      perCustomerLimit,
      customerTypes,
      categoryIds,
      productIds,
      communityIds,
      isActive,
    } = body;

    if (!campaignId || !type) {
      return NextResponse.json({ error: 'Campaign ID and Type are required' }, { status: 400 });
    }

    if (type === 'VOUCHER') {
      const voucher = await Voucher.findById(campaignId);
      if (!voucher) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });

      if (code && code.toUpperCase().trim() !== voucher.code) {
        const exists = await Voucher.findOne({ code: code.toUpperCase().trim() });
        if (exists) return NextResponse.json({ error: 'Voucher code is already in use' }, { status: 400 });
        voucher.code = code.toUpperCase().trim();
      }

      if (description) voucher.description = description.trim();
      if (discountType) voucher.discountType = discountType;
      if (discountValue !== undefined) voucher.discountValue = parseFloat(discountValue);
      if (minimumOrderValue !== undefined) voucher.minimumOrderValue = parseFloat(minimumOrderValue);
      if (startDate) voucher.startDate = new Date(startDate);
      if (endDate) voucher.endDate = new Date(endDate);
      voucher.usageLimit = usageLimit !== '' && usageLimit !== undefined ? parseInt(usageLimit) : undefined;
      if (perCustomerLimit !== undefined) voucher.perCustomerLimit = parseInt(perCustomerLimit) || 1;
      if (customerTypes) voucher.customerTypes = customerTypes;
      if (categoryIds) voucher.categoryIds = categoryIds;
      if (productIds) voucher.productIds = productIds;
      if (communityIds) voucher.communityIds = communityIds;
      if (isActive !== undefined) voucher.isActive = isActive;

      await voucher.save();
      return NextResponse.json({ message: 'Voucher updated successfully', campaign: voucher });
    } else if (type === 'OFFER') {
      const offer = await Offer.findById(campaignId);
      if (!offer) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });

      if (name) offer.name = name.trim();
      if (description) offer.description = description.trim();
      if (discountType) offer.discountType = discountType;
      if (discountValue !== undefined) offer.discountValue = parseFloat(discountValue);
      if (startDate) offer.startDate = new Date(startDate);
      if (endDate) offer.endDate = new Date(endDate);
      if (customerTypes) offer.customerTypes = customerTypes;
      if (categoryIds) offer.categoryIds = categoryIds;
      if (productIds) offer.productIds = productIds;
      if (communityIds) offer.communityIds = communityIds;
      if (isActive !== undefined) offer.isActive = isActive;

      await offer.save();
      return NextResponse.json({ message: 'Offer updated successfully', campaign: offer });
    }

    return NextResponse.json({ error: 'Invalid campaign type' }, { status: 400 });
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    return NextResponse.json({ error: error.message || 'Failed to update campaign' }, { status: 500 });
  }
}

// 4. DELETE: Delete a Voucher or Offer
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    
    const adminUser = await getCurrentUser();
    if (!adminUser || (adminUser.role !== 'ADMIN' && adminUser.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('id');
    const type = searchParams.get('type');

    if (!campaignId || !type) {
      return NextResponse.json({ error: 'Campaign ID and Type are required' }, { status: 400 });
    }

    if (type === 'VOUCHER') {
      const deleted = await Voucher.findByIdAndDelete(campaignId);
      if (!deleted) return NextResponse.json({ error: 'Voucher not found' }, { status: 404 });
    } else if (type === 'OFFER') {
      const deleted = await Offer.findByIdAndDelete(campaignId);
      if (!deleted) return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    } else {
      return NextResponse.json({ error: 'Invalid campaign type' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Campaign deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return NextResponse.json({ error: 'Failed to delete campaign' }, { status: 500 });
  }
}
