import mongoose, { Document, Schema } from 'mongoose';

export interface ITokenBlacklist extends Document {
  jti: string;
  expiresAt: Date;
}

const tokenBlacklistSchema = new Schema<ITokenBlacklist>({
  jti: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true },
});

// TTL index to automatically delete documents when expiresAt is reached
tokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const TokenBlacklist = mongoose.models.TokenBlacklist || mongoose.model<ITokenBlacklist>('TokenBlacklist', tokenBlacklistSchema);
