import { User, Student, Staff } from '@/models';
import { UnauthorizedError, ValidationError, NotFoundError } from '@/lib/errors';
import { signAccessToken, signRefreshToken, verifyRefreshToken, revokeToken } from '@/lib/server/jwt';
import { SECURITY, ROLES } from '@/config/constants';
import { auditLog } from '@/lib/audit-logger';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { Resend } from 'resend';
import { env } from '@/config/env';

const resend = new Resend(env.RESEND_API_KEY);

export class AuthService {
  static async login(emailOrUsername: string, passwordString: string, ipAddress?: string) {
    // 1. Find user (including password field for comparison)
    const user = await User.findOne({ 
      $or: [{ email: emailOrUsername.toLowerCase() }, { username: emailOrUsername }] 
    }).select('+password');

    if (!user) {
      auditLog({ event: 'login', outcome: 'failure', severity: 'warn', details: { emailOrUsername }, ipAddress });
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.isDeleted || !user.isActive) {
      throw new UnauthorizedError('Account is inactive or deactivated');
    }

    // 2. Check lockout
    if (user.lockUntil && user.lockUntil > new Date()) {
      throw new UnauthorizedError('Account is temporarily locked. Please try again later.');
    }

    // 3. Verify password
    const isMatch = await user.comparePassword(passwordString);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= SECURITY.MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = new Date(Date.now() + SECURITY.LOCK_TIME_MS);
        auditLog({ event: 'account_locked', outcome: 'success', severity: 'warn', userId: user.id, ipAddress });
      }
      await user.save();
      auditLog({ event: 'login', outcome: 'failure', severity: 'warn', userId: user.id, ipAddress });
      throw new UnauthorizedError('Invalid credentials');
    }

    // 4. Reset lockout on success
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLoginAt = new Date();
    user.lastLoginIp = ipAddress;
    await user.save();

    // 5. Generate tokens
    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email || user.username,
    };

    const accessToken = signAccessToken({ ...payload, jti: accessJti });
    const refreshToken = signRefreshToken({ ...payload, jti: refreshJti });

    auditLog({ event: 'login', outcome: 'success', severity: 'info', userId: user.id, ipAddress });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        requirePasswordChange: user.requirePasswordChange,
      },
      accessToken,
      refreshToken,
    };
  }

  static async logout(accessTokenJti: string, refreshTokenStr?: string) {
    // Revoke access token (using a reasonable 1 hour expiry to match ACCESS_TOKEN_EXPIRY)
    // In ms: 15m is 900 seconds, giving it generous 3600 just in case.
    if (accessTokenJti) {
      await revokeToken(accessTokenJti, 3600);
    }
    
    // If refresh token is provided, verify it to get its JTI and revoke it
    if (refreshTokenStr) {
      const decoded = verifyRefreshToken(refreshTokenStr);
      if (decoded && decoded.jti) {
        await revokeToken(decoded.jti, 7 * 24 * 60 * 60);
      }
    }
    
    return true;
  }

  static async refresh(refreshTokenStr: string) {
    const decoded = verifyRefreshToken(refreshTokenStr);
    if (!decoded) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    // Check if the old access token is still bound to this refresh token, we don't necessarily revoke it here 
    // unless we want strict rotation where old access tokens die immediately on refresh.
    // For now, just revoke the used refresh token and issue a new pair (Refresh Token Rotation).
    
    await revokeToken(decoded.jti, 7 * 24 * 60 * 60);

    // Verify user still exists/active
    const user = await User.findById(decoded.userId);
    if (!user || user.isDeleted || !user.isActive) {
      throw new UnauthorizedError('Account is inactive or deactivated');
    }

    const accessJti = randomUUID();
    const refreshJti = randomUUID();

    const payload = {
      userId: user.id,
      role: user.role,
      email: user.email || user.username,
    };

    const newAccessToken = signAccessToken({ ...payload, jti: accessJti });
    const newRefreshToken = signRefreshToken({ ...payload, jti: refreshJti });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async seed() {
    const adminCount = await User.countDocuments({ role: ROLES.ADMIN });
    if (adminCount > 0) return { message: 'Database already seeded' };

    // Seed Admin
    await User.create({
      username: 'admin',
      email: 'admin@eduspark.com',
      password: 'password123',
      name: 'EduSpark Admin',
      role: ROLES.ADMIN,
    });

    // Seed Demo Student
    const studentUser = await User.create({
      username: 'arjun.mehta',
      email: 'arjun@student.com',
      password: 'password123',
      name: 'Arjun Mehta',
      role: ROLES.STUDENT,
    });

    await Student.create({
      user: studentUser._id,
      rollNo: 'TUT-001',
      grade: 'Class 10',
      batch: 'Morning Batch A',
      admissionStatus: 'active',
      subjects: [],
    });

    // Seed Demo Staff
    const staffUser = await User.create({
      username: 'rajesh.kumar',
      email: 'rajesh@staff.com',
      password: 'password123',
      name: 'Rajesh Kumar',
      role: ROLES.STAFF,
    });

    await Staff.create({
      user: staffUser._id,
      employeeCode: 'EMP-001',
      batches: ['Morning Batch A'],
      subjects: [],
    });

    return { message: 'Database seeded successfully' };
  }

  static async changePassword(userId: string, oldPasswordStr: string, newPasswordStr: string) {
    const user = await User.findById(userId).select('+password +passwordHistory');
    if (!user) throw new NotFoundError('User not found');

    const isMatch = await user.comparePassword(oldPasswordStr);
    if (!isMatch) throw new UnauthorizedError('Incorrect old password');

    // Check history (naive implementation: could compare bcrypt hash if we keep hashes in history)
    // For now, since bcrypt hashes are salted, we'd have to compare `newPasswordStr` against all hashes in history
    for (const pastHash of user.passwordHistory) {
      if (await bcrypt.compare(newPasswordStr, pastHash)) {
        throw new ValidationError([{ field: 'newPassword', message: 'Cannot use a recently used password' }], 'Cannot use a recently used password');
      }
    }

    // Update history
    user.passwordHistory.unshift(user.password as string);
    if (user.passwordHistory.length > SECURITY.PASSWORD_HISTORY_LIMIT) {
      user.passwordHistory.pop();
    }

    user.password = newPasswordStr; // pre-save hook will hash it
    user.requirePasswordChange = false;
    user.passwordChangedAt = new Date();
    await user.save();
    
    return true;
  }

  static async requestPasswordReset(email: string) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return true anyway to prevent email enumeration
      return true;
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 mins expiry
    };
    await user.save();

    // Send email via Resend
    try {
      await resend.emails.send({
        from: 'EduSpark Academy <noreply@eduspark.com>', // Need verified domain
        to: user.email as string,
        subject: 'Password Reset OTP - EduSpark Academy',
        html: `<p>Your password reset OTP is <strong>${otp}</strong>.</p><p>It is valid for 10 minutes.</p>`,
      });
    } catch (error: unknown) {
      console.error('Failed to send OTP email', error);
      // In development or if Resend fails, just log it. (Don't expose OTP to frontend)
    }

    return true;
  }
}
