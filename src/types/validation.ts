/**
 * Centralized validation schemas using Zod
 * 
 * All validation schemas are defined here to ensure consistency
 * and prevent duplication across the application.
 */

import { z } from 'zod';

// ============================================================================
// COMMON VALIDATION PATTERNS
// ============================================================================

// ID validation that accepts both string and number, validates as positive integer
const idValidation = z.union([
  z.number().int().positive(),
  z.string().regex(/^\d+$/, "Must be numeric").refine(val => parseInt(val) > 0, "Must be positive")
]);

// URL validation (optional)
const optionalUrl = z.string().url("Invalid URL format").optional().or(z.literal(''));

// Slug validation
const slugValidation = z.string()
  .min(2, "Slug must be at least 2 characters")
  .max(200, "Slug cannot exceed 200 characters")
  .regex(/^[a-z0-9-]+$/, "Slug must be lowercase, alphanumeric, and use hyphens for spaces");

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export const ValidationSchemas = {
  // Category Form Validation
  validateCategory: z.object({
    name: z.string()
      .min(2, "Category name must be at least 2 characters long")
      .max(100, "Category name cannot exceed 100 characters"),
    slug: slugValidation.optional(),
    description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().or(z.literal('')),
    icon_url: optionalUrl,
    banner_image: optionalUrl,
    sort_order: z.union([
      z.number().int("Sort order must be an integer").min(0, "Sort order cannot be negative"),
      z.string().regex(/^\d+$/, "Sort order must be numeric").refine(val => parseInt(val) >= 0, "Sort order cannot be negative")
    ]).optional(),
    is_active: z.boolean().optional(),
  }),

  // Field Form Validation
  validateField: z.object({
    name: z.string()
      .min(2, "Field name must be at least 2 characters long")
      .max(100, "Field name cannot exceed 100 characters"),
    slug: slugValidation.optional(),
    description: z.string().max(1000, "Description cannot exceed 1000 characters").optional().or(z.literal('')),
    icon_url: optionalUrl,
    banner_image: optionalUrl,
    sort_order: z.union([
      z.number().int("Sort order must be an integer").min(0, "Sort order cannot be negative"),
      z.string().regex(/^\d+$/, "Sort order must be numeric").refine(val => parseInt(val) >= 0, "Sort order cannot be negative")
    ]).optional(),
    is_active: z.boolean().optional(),
    category_id: idValidation, // Accepts both string and number
  }),

  // Course Form Validation
  validateCourse: z.object({
    title: z.string()
      .min(2, "Course title must be at least 2 characters long")
      .max(200, "Course title cannot exceed 200 characters"),
    slug: slugValidation.optional(),
    description: z.string().max(5000, "Description cannot exceed 5000 characters").optional().or(z.literal('')),
    short_description: z.string().max(500, "Short description cannot exceed 500 characters").optional().or(z.literal('')),
    banner_image: optionalUrl,
    thumbnail_image: optionalUrl,
    duration_hours: z.union([
      z.number().int("Duration must be an integer").min(0, "Duration cannot be negative").max(1000, "Duration cannot exceed 1000 hours"),
      z.string().regex(/^\d+$/, "Duration must be numeric").refine(val => parseInt(val) >= 0 && parseInt(val) <= 1000, "Duration must be between 0 and 1000 hours")
    ]).optional(),
    difficulty_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    price: z.union([
      z.number().min(0, "Price cannot be negative").max(9999.99, "Price cannot exceed 9999.99"),
      z.string().regex(/^\d+(\.\d{1,2})?$/, "Price must be numeric").refine(val => {
        const num = parseFloat(val);
        return num >= 0 && num <= 9999.99;
      }, "Price must be between 0 and 9999.99")
    ]).optional(),
    is_free: z.boolean().optional(),
    is_published: z.boolean().optional(),
    field_id: idValidation, // Accepts both string and number
    instructor_id: z.string().uuid("Invalid instructor ID format").optional().or(z.literal('')),
    prerequisites: z.string().max(2000, "Prerequisites cannot exceed 2000 characters").optional().or(z.literal('')),
    learning_outcomes: z.union([z.string().optional(), z.array(z.string())]).optional(),
    course_modules: z.any().optional(), // Complex object, handled separately
    tags: z.union([z.string().optional(), z.array(z.string())]).optional(),
  }),

  // Module Form Validation
  validateModule: z.object({
    course_id: idValidation, // Accepts both string and number
    title: z.string()
      .min(2, "Module title must be at least 2 characters long")
      .max(200, "Module title cannot exceed 200 characters"),
    description: z.string().max(2000, "Description cannot exceed 2000 characters").optional().or(z.literal('')),
    content_type: z.enum(['video', 'text', 'quiz', 'assignment']),
    content_url: optionalUrl,
    duration_minutes: z.union([
      z.number().int("Duration must be an integer").min(0, "Duration cannot be negative").max(600, "Duration cannot exceed 600 minutes"),
      z.string().regex(/^\d+$/, "Duration must be numeric").refine(val => parseInt(val) >= 0 && parseInt(val) <= 600, "Duration must be between 0 and 600 minutes")
    ]).optional(),
    sort_order: z.union([
      z.number().int("Sort order must be an integer").min(0, "Sort order cannot be negative"),
      z.string().regex(/^\d+$/, "Sort order must be numeric").refine(val => parseInt(val) >= 0, "Sort order cannot be negative")
    ]).optional(),
    is_published: z.boolean().optional(),
  }),

  // Login Form Validation
  validateLogin: z.object({
    username: z.string()
      .min(3, "Username must be at least 3 characters long")
      .max(50, "Username cannot exceed 50 characters"),
    password: z.string()
      .min(6, "Password must be at least 6 characters long")
      .max(100, "Password cannot exceed 100 characters"),
    fingerprint: z.string().optional(),
  }),

  // Forgot Password Email Validation
  validateForgotPasswordEmail: z.object({
    email: z.string().email("Invalid email address"),
  }),

  // Reset Password Validation
  validateResetPassword: z.object({
    token: z.string().min(1, "Reset token is required"),
    password: z.string()
      .min(8, "Password must be at least 8 characters long")
      .max(100, "Password cannot exceed 100 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
};
