import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { ROLES, Role } from '@/config/constants';

export interface IUser extends Document {
  email?: string;
  username: string;
  password?: string;
  name: string;
  phone?: string;
  profilePicture?: string;
  role: Role;
  isActive: boolean;
  isDeleted: boolean;
  loginAttempts: number;
  lockUntil?: Date;
  requirePasswordChange: boolean;
  passwordChangedAt?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  passwordHistory: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    password: { type: String, select: false },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    profilePicture: { type: String },
    role: { type: String, enum: Object.values(ROLES), required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    requirePasswordChange: { type: Boolean, default: false },
    passwordChangedAt: { type: Date },
    lastLoginAt: { type: Date },
    lastLoginIp: { type: String },
    passwordHistory: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
