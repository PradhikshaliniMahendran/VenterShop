import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb/mongoose';
import { getCurrentUser } from '@/lib/auth/auth';
import User from '@/models/User';

// 1. GET: Fetch saved addresses
export async function GET() {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ addresses: userDoc.addresses });
  } catch (error) {
    console.error('Error fetching addresses:', error);
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 });
  }
}

// 2. POST: Add new address
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, addressLine1, addressLine2, city, province, postalCode, country, phone, addressType, isDefault } = await request.json();

    if (!fullName || !addressLine1 || !city || !province || !postalCode || !phone) {
      return NextResponse.json({ error: 'Please provide all required fields' }, { status: 400 });
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If setting as default, mark all other addresses as not default
    if (isDefault || userDoc.addresses.length === 0) {
      userDoc.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    userDoc.addresses.push({
      fullName,
      addressLine1,
      addressLine2,
      city,
      province,
      postalCode,
      country: country || 'Canada',
      phone,
      addressType: addressType || 'Home',
      isDefault: isDefault || userDoc.addresses.length === 0, // Auto default if first address
    });

    await userDoc.save();

    return NextResponse.json({ message: 'Address added successfully', addresses: userDoc.addresses });
  } catch (error) {
    console.error('Error adding address:', error);
    return NextResponse.json({ error: 'Failed to add address' }, { status: 500 });
  }
}

// 3. PUT: Update existing address
export async function PUT(request: Request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { addressId, fullName, addressLine1, addressLine2, city, province, postalCode, country, phone, addressType, isDefault } = await request.json();

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Find address index
    const addrIndex = userDoc.addresses.findIndex((addr) => addr._id?.toString() === addressId);
    if (addrIndex === -1) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    // If setting this address as default, unset others
    if (isDefault) {
      userDoc.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    // Update the subdocument fields
    const addrToUpdate = userDoc.addresses[addrIndex];
    if (fullName) addrToUpdate.fullName = fullName;
    if (addressLine1) addrToUpdate.addressLine1 = addressLine1;
    addrToUpdate.addressLine2 = addressLine2; // optional, clear if unset
    if (city) addrToUpdate.city = city;
    if (province) addrToUpdate.province = province;
    if (postalCode) addrToUpdate.postalCode = postalCode;
    if (country) addrToUpdate.country = country;
    if (phone) addrToUpdate.phone = phone;
    if (addressType) addrToUpdate.addressType = addressType;
    addrToUpdate.isDefault = isDefault ?? addrToUpdate.isDefault;

    // If we updated to not default, and it was default, make sure we have at least one default
    if (isDefault === false) {
      const hasDefault = userDoc.addresses.some((a) => a.isDefault);
      if (!hasDefault && userDoc.addresses.length > 0) {
        userDoc.addresses[0].isDefault = true;
      }
    }

    await userDoc.save();

    return NextResponse.json({ message: 'Address updated successfully', addresses: userDoc.addresses });
  } catch (error) {
    console.error('Error updating address:', error);
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 });
  }
}

// 4. DELETE: Delete address
export async function DELETE(request: Request) {
  try {
    await connectToDatabase();
    const user = await getCurrentUser();
    if (!user || user.role === 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('id');

    if (!addressId) {
      return NextResponse.json({ error: 'Address ID is required' }, { status: 400 });
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const addrToDelete = userDoc.addresses.find((a) => a._id?.toString() === addressId);
    if (!addrToDelete) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 });
    }

    const wasDefault = addrToDelete.isDefault;

    // Filter out the deleted address
    userDoc.addresses = userDoc.addresses.filter((a) => a._id?.toString() !== addressId) as any;

    // If deleted address was default, make another one default
    if (wasDefault && userDoc.addresses.length > 0) {
      userDoc.addresses[0].isDefault = true;
    }

    await userDoc.save();

    return NextResponse.json({ message: 'Address deleted successfully', addresses: userDoc.addresses });
  } catch (error) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
  }
}
