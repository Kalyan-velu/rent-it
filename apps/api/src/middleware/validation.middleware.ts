import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize string inputs to prevent XSS attacks
 */
export const sanitizeInput = (field: string) =>
  body(field).customSanitizer((value) => {
    if (typeof value === 'string') {
      return DOMPurify.sanitize(value, { ALLOWED_TAGS: [] });
    }
    return value;
  });

/**
 * Validate and sanitize common fields
 */
export const validateEmail = () =>
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required');

export const validateString = (field: string, min = 1, max = 255) =>
  body(field)
    .isString()
    .trim()
    .isLength({ min, max })
    .withMessage(`${field} must be between ${min} and ${max} characters`);

export const validateRequired = (field: string) =>
  body(field).notEmpty().withMessage(`${field} is required`);

/**
 * Middleware to check validation results
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation failed',
      details: errors.array(),
    });
    return;
  }
  next();
};

/**
 * SQL injection prevention - validate UUID format
 */
export const validateUUID = (field: string) =>
  body(field)
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    .withMessage(`${field} must be a valid UUID`);

/**
 * Prevent SQL injection in query parameters
 */
export const sanitizeQueryParams = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  // Sanitize common query params
  if (req.query.search && typeof req.query.search === 'string') {
    req.query.search = DOMPurify.sanitize(req.query.search, {
      ALLOWED_TAGS: [],
    });
  }

  if (req.query.page) {
    req.query.page = Math.max(
      1,
      parseInt(req.query.page as string) || 1
    ).toString();
  }

  if (req.query.limit) {
    const limit = parseInt(req.query.limit as string) || 10;
    req.query.limit = Math.min(Math.max(1, limit), 100).toString();
  }

  next();
};
