/**
 * Common type definitions for the entire application
 * 
 * IMPORTANT: All IDs should be strings to preserve precision for large integers
 * from databases like CockroachDB that use BIGSERIAL/BIGINT
 */

// Base ID type - always use string for database IDs
export type ID = string;

// Entity ID types
export type CategoryID = ID;
export type FieldID = ID;
export type CourseID = ID;
export type ModuleID = ID;
export type UserID = ID;
export type BlogID = ID;

// Form data types that can accept both string and number for backward compatibility
export type FormID = string | number;

// Utility type for API requests that need to handle both string and number IDs
export type FlexibleID = string | number;

/**
 * Type guard to check if a value is a valid ID
 */
export function isValidID(value: unknown): value is ID {
  return typeof value === 'string' && /^\d+$/.test(value) && value.length > 0;
}

/**
 * Safely convert any ID-like value to string
 */
export function toID(value: string | number | undefined | null): ID {
  if (value === undefined || value === null) {
    throw new Error('ID cannot be undefined or null');
  }
  return String(value);
}

/**
 * Safely convert ID to number for database operations (only if within safe range)
 */
export function toSafeNumber(id: ID): number {
  const num = parseInt(id, 10);
  if (isNaN(num) || num > Number.MAX_SAFE_INTEGER) {
    throw new Error(`ID ${id} exceeds JavaScript safe integer limit`);
  }
  return num;
}
