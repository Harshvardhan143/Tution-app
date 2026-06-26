import { HTTP_STATUS } from '@/config/constants';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors?: unknown[];

  constructor(message: string, statusCode: number, errors?: unknown[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad Request') {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource Not Found') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource Conflict') {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class ValidationError extends AppError {
  constructor(errors: unknown[], message: string = 'Validation Failed') {
    super(message, HTTP_STATUS.UNPROCESSABLE_ENTITY, errors);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Too Many Requests') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Internal Server Error') {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}
