import { NextResponse, NextRequest } from 'next/server';
import { AppError } from './errors';
import { HTTP_STATUS } from '@/config/constants';
import { connectDB } from './server/mongoose';
import { auditLog } from './audit-logger';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    errors?: unknown[];
  };
}

export function successResponse<T>(
  data: T,
  messageOrStatus?: string | number,
  statusCodeOverride?: number
) {
  let message: string | undefined;
  let statusCode: number = HTTP_STATUS.OK;

  if (typeof messageOrStatus === 'string') {
    message = messageOrStatus;
    if (typeof statusCodeOverride === 'number') {
      statusCode = statusCodeOverride;
    }
  } else if (typeof messageOrStatus === 'number') {
    statusCode = messageOrStatus;
  }

  const responseBody: ApiResponse<T> = {
    success: true,
    message,
    data,
  };
  return NextResponse.json(responseBody, { status: statusCode });
}

export function errorResponse(message: string, statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors?: unknown[]) {
  const responseBody: ApiResponse<null> = {
    success: false,
    error: {
      message,
      statusCode,
      errors,
    },
  };
  return NextResponse.json(responseBody, { status: statusCode });
}

type ApiHandlerContext = {
  params: Promise<Record<string, string | string[]>>;
};

type ApiHandler = (
  req: NextRequest,
  context: ApiHandlerContext
) => Promise<NextResponse> | NextResponse;

/**
 * Wrapper for Next.js API Routes to handle DB connection, custom error catching,
 * standardized JSON formats, and request logging.
 */
export function withApiHandler(handler: ApiHandler) {
  return async (req: NextRequest, context: ApiHandlerContext) => {
    const startTime = Date.now();
    const url = new URL(req.url);
    const method = req.method;

    try {
      // Connect to Database
      await connectDB();

      // Execute Route Handler
      const response = await handler(req, context);

      // Log success duration
      const duration = Date.now() - startTime;
      console.log(`[API] ${method} ${url.pathname} - ${response.status} (${duration}ms)`);

      return response;
    } catch (err: unknown) {
      const duration = Date.now() - startTime;
      const error = err as Error & {
        code?: number;
        statusCode?: number;
        keyValue?: Record<string, unknown>;
        errors?: Record<string, { path: string; message: string }>;
        path?: string;
      };
      
      console.error(`[API ERROR] ${method} ${url.pathname} (${duration}ms):`, error);

      // Handle custom AppError
      if (error instanceof AppError) {
        // Log severe error events to database audit logs if needed
        if (error.statusCode >= 500) {
          auditLog({
            event: 'API_ERROR_INTERNAL',
            outcome: 'failure',
            severity: 'error',
            details: { path: url.pathname, method, message: error.message },
          });
        }
        return errorResponse(error.message, error.statusCode, error.errors);
      }

      // Handle MongoDB Duplicate Key Error (11000)
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue || {})[0] || 'field';
        return errorResponse(
          `A record with this ${field} already exists.`,
          HTTP_STATUS.CONFLICT
        );
      }

      // Handle Mongoose CastError or ValidationError
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors || {}).map((validationErr) => ({
          field: validationErr.path,
          message: validationErr.message,
        }));
        return errorResponse('Validation Failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
      }

      if (error.name === 'CastError') {
        return errorResponse(`Invalid ID value for field: ${error.path}`, HTTP_STATUS.BAD_REQUEST);
      }

      // Log unhandled exceptions to Database Audit Logs
      auditLog({
        event: 'API_UNHANDLED_EXCEPTION',
        outcome: 'failure',
        severity: 'critical',
        details: { path: url.pathname, method, message: error.message || 'Unknown error' },
      });

      // General fallback error
      const isProduction = process.env.NODE_ENV === 'production';
      const message = isProduction ? 'Internal Server Error' : error.message || 'Unknown Server Error';
      return errorResponse(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
  };
}
