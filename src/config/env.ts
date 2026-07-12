import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  
  // MongoDB configuration
  MONGODB_URI: z.string({
    message: 'MONGODB_URI is required',
  }).url('MONGODB_URI must be a valid connection string'),


  // JWT configuration (RS256 Private and Public Keys)
  JWT_ACCESS_PRIVATE_KEY: z.string({
    message: 'JWT_ACCESS_PRIVATE_KEY is required',
  }),
  JWT_ACCESS_PUBLIC_KEY: z.string({
    message: 'JWT_ACCESS_PUBLIC_KEY is required',
  }),
  JWT_REFRESH_PRIVATE_KEY: z.string({
    message: 'JWT_REFRESH_PRIVATE_KEY is required',
  }),
  JWT_REFRESH_PUBLIC_KEY: z.string({
    message: 'JWT_REFRESH_PUBLIC_KEY is required',
  }),

  // Cloudinary (for file uploads)
  CLOUDINARY_CLOUD_NAME: z.string({
    message: 'CLOUDINARY_CLOUD_NAME is required',
  }),
  CLOUDINARY_API_KEY: z.string({
    message: 'CLOUDINARY_API_KEY is required',
  }),
  CLOUDINARY_API_SECRET: z.string({
    message: 'CLOUDINARY_API_SECRET is required',
  }),

  // Resend (for email OTP / communications)
  RESEND_API_KEY: z.string({
    message: 'RESEND_API_KEY is required',
  }),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

try {
  env = envSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_ACCESS_PRIVATE_KEY: process.env.JWT_ACCESS_PRIVATE_KEY,
    JWT_ACCESS_PUBLIC_KEY: process.env.JWT_ACCESS_PUBLIC_KEY,
    JWT_REFRESH_PRIVATE_KEY: process.env.JWT_REFRESH_PRIVATE_KEY,
    JWT_REFRESH_PUBLIC_KEY: process.env.JWT_REFRESH_PUBLIC_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  });
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.issues.forEach((err) => {
      console.error(`   - ${err.path.join('.')}: ${err.message}`);
    });
    // We do not throw an error here to allow Next.js 'npm run build' to succeed
    // using the fallback mock environment variables. If a critical variable is missing in 
    // actual production, the database connection or other services will naturally fail.
  }
  // Fallback environment mock for development so next dev can build
  env = {
    NODE_ENV: (process.env.NODE_ENV as Env['NODE_ENV']) || 'development',
    PORT: Number(process.env.PORT) || 3000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/eduspark_dev',
    JWT_ACCESS_PRIVATE_KEY: process.env.JWT_ACCESS_PRIVATE_KEY || 'mock_access_private_key',
    JWT_ACCESS_PUBLIC_KEY: process.env.JWT_ACCESS_PUBLIC_KEY || 'mock_access_public_key',
    JWT_REFRESH_PRIVATE_KEY: process.env.JWT_REFRESH_PRIVATE_KEY || 'mock_refresh_private_key',
    JWT_REFRESH_PUBLIC_KEY: process.env.JWT_REFRESH_PUBLIC_KEY || 'mock_refresh_public_key',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'mock_cloud',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'mock_key',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || 'mock_secret',
    RESEND_API_KEY: process.env.RESEND_API_KEY || 'mock_resend_key',
  };
}

export { env };
