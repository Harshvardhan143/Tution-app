export const ROLES = {
  STUDENT: 'student',
  STAFF: 'staff',
  ADMIN: 'admin',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const SECURITY = {
  BCRYPT_ROUNDS: 12,
  MAX_LOGIN_ATTEMPTS: 5,
  LOCK_TIME_MS: 30 * 60 * 1000, // 30 minutes
  PASSWORD_HISTORY_LIMIT: 5,
  
  // JWT Expirations
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  
  // Redis Blacklist Key Prefix
  REDIS_BLACKLIST_PREFIX: 'jwt_blacklist:',
  REDIS_RATE_LIMIT_PREFIX: 'rate_limit:',
  
  // Cookie settings (if used)
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const BATCH_SECTIONS = {
  GRADE_10: 'Class 10',
  GRADE_11: 'Class 11',
  GRADE_12: 'Class 12',
  JEE: 'JEE Batch',
  NEET: 'NEET Batch',
} as const;

export const ATTENDANCE_STATUS = {
  PRESENT: 'P',
  ABSENT: 'A',
  PENDING: 'PN',
  NONE: '-',
} as const;

export type AttendanceStatus = typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
