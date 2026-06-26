import winston from 'winston';
import path from 'path';
import mongoose from 'mongoose';

// Define log level and format
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);



// Create directory path inside the workspace for persistent logs
const logsDir = path.join(process.cwd(), 'logs');

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: winston.format.json(),
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'combined.log'),
    format: winston.format.json(),
  }),
];

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
  levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports,
});

export interface AuditLogOptions {
  event: string;
  outcome: 'success' | 'failure';
  severity: 'info' | 'warn' | 'error' | 'critical';
  userId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}

/**
 * Log structured audit events to files and/or DB.
 */
export function auditLog(options: AuditLogOptions) {
  const logMessage = `Event: ${options.event} | Outcome: ${options.outcome} | Severity: ${options.severity} | User: ${options.userId || 'anonymous'}`;
  
  const meta = {
    event: options.event,
    outcome: options.outcome,
    severity: options.severity,
    userId: options.userId,
    details: options.details,
    ipAddress: options.ipAddress,
  };

  switch (options.severity) {
    case 'critical':
    case 'error':
      logger.error(logMessage, meta);
      break;
    case 'warn':
      logger.warn(logMessage, meta);
      break;
    case 'info':
    default:
      logger.info(logMessage, meta);
      break;
  }

  // Proactively save to database audit logs if MongoDB is connected and we import the model
  // (We'll do this once models are created in the next branch to avoid circular dependencies)
  try {
    if (mongoose.connection.readyState === 1) {
      // If db connection is active, write to AuditLog collection asynchronously
      const AuditLog = mongoose.models.AuditLog;
      if (AuditLog) {
        AuditLog.create({
          event: options.event,
          outcome: options.outcome,
          severity: options.severity,
          userId: options.userId ? new mongoose.Types.ObjectId(options.userId) : undefined,
          details: options.details,
          ipAddress: options.ipAddress,
          createdAt: new Date(),
        }).catch((err: unknown) => {
          logger.error('Failed to write audit log to database', { error: err instanceof Error ? err.message : String(err) });
        });
      }
    }
  } catch {
    // Ignore error if model is not loaded yet
  }
}

export default logger;
