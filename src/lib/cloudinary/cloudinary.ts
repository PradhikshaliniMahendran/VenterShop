import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary only if credentials are set (to avoid crash during build without envs)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadImage(fileStr: string, folder = 'ventershop'): Promise<{ secure_url: string; public_id: string }> {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileStr, {
      folder: folder,
    });
    return {
      secure_url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
}

export async function deleteImage(publicId: string): Promise<{ result: string }> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
}

export default cloudinary;
