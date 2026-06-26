import { v2 as cloudinary } from 'cloudinary';
import { env } from '@/config/env';

// Configure Cloudinary
const isMock = env.CLOUDINARY_CLOUD_NAME === 'dummy_cloudinary_cloud_name';

if (!isMock) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
} else {
  console.warn('⚠️ Cloudinary credentials are placeholders. Using mock uploader for development.');
}

export interface UploadResult {
  secure_url: string;
  public_id: string;
}

/**
 * Uploads a file buffer to Cloudinary or returns a mock URL in dev mode.
 */
export async function uploadImage(
  fileBuffer: Buffer,
  folder: string = 'eduspark/profiles'
): Promise<UploadResult> {
  if (isMock || env.NODE_ENV === 'test') {
    // Generate a mock secure URL
    const mockId = `mock_${Math.random().toString(36).substring(7)}`;
    return {
      secure_url: `https://res.cloudinary.com/demo/image/upload/v1600000000/${folder}/${mockId}.jpg`,
      public_id: `${folder}/${mockId}`,
    };
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload stream failed:', error);
          return reject(new Error(`Image upload failed: ${error.message}`));
        }
        if (!result) {
          return reject(new Error('Image upload failed: Empty result from Cloudinary'));
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    ).end(fileBuffer);
  });
}

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  if (isMock || env.NODE_ENV === 'test' || publicId.startsWith('mock_')) {
    return true;
  }

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    return false;
  }
}
export default cloudinary;
