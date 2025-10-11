/**
 * Type safety utilities and helpers
 * 
 * These utilities help prevent common type-related bugs and ensure
 * consistency across the application.
 */

import { ID, FlexibleID, FormID } from './common';

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard to check if a value is a valid database ID
 */
export function isDatabaseID(value: unknown): value is ID {
  return typeof value === 'string' && /^\d+$/.test(value) && value.length > 0;
}

/**
 * Type guard to check if a value is a valid form ID
 */
export function isFormID(value: unknown): value is FormID {
  return (
    (typeof value === 'string' && /^\d+$/.test(value)) ||
    (typeof value === 'number' && Number.isInteger(value) && value > 0)
  );
}

/**
 * Type guard to check if a value is a valid flexible ID
 */
export function isFlexibleID(value: unknown): value is FlexibleID {
  return isFormID(value);
}

// ============================================================================
// ID CONVERSION UTILITIES
// ============================================================================

/**
 * Safely convert any ID-like value to database ID (string)
 * Throws error if conversion is not possible
 */
export function toDatabaseID(value: FlexibleID | undefined | null): ID {
  if (value === undefined || value === null) {
    throw new Error('ID cannot be undefined or null');
  }
  
  const stringValue = String(value);
  
  if (!/^\d+$/.test(stringValue)) {
    throw new Error(`Invalid ID format: ${value}`);
  }
  
  return stringValue;
}

/**
 * Safely convert form ID to database ID
 * Handles both string and number inputs
 */
export function formIDToDatabaseID(formID: FormID): ID {
  return toDatabaseID(formID);
}

/**
 * Convert database ID to number for database operations
 * Only use this for IDs that are guaranteed to be within safe integer range
 */
export function databaseIDToNumber(id: ID): number {
  const num = parseInt(id, 10);
  
  if (isNaN(num)) {
    throw new Error(`Invalid ID: ${id}`);
  }
  
  if (num > Number.MAX_SAFE_INTEGER) {
    throw new Error(`ID ${id} exceeds JavaScript safe integer limit. Use string operations instead.`);
  }
  
  return num;
}

// ============================================================================
// FORM DATA UTILITIES
// ============================================================================

/**
 * Safely extract ID from form data
 * Handles both string and number inputs
 */
export function extractFormID(formData: Record<string, unknown>, fieldName: string): ID {
  const value = formData[fieldName];
  
  if (value === undefined || value === null) {
    throw new Error(`Field ${fieldName} is required`);
  }
  
  return toDatabaseID(value as FlexibleID);
}

/**
 * Safely extract optional ID from form data
 * Returns undefined if field is not present or empty
 */
export function extractOptionalFormID(formData: Record<string, unknown>, fieldName: string): ID | undefined {
  const value = formData[fieldName];
  
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  
  return toDatabaseID(value as FlexibleID);
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Validate that an ID is within safe integer range
 * Use this before converting to number for database operations
 */
export function isSafeIntegerID(id: ID): boolean {
  const num = parseInt(id, 10);
  return !isNaN(num) && num <= Number.MAX_SAFE_INTEGER;
}

/**
 * Get a human-readable error message for ID validation failures
 */
export function getIDValidationError(id: unknown): string | null {
  if (typeof id === 'string') {
    if (!/^\d+$/.test(id)) {
      return 'ID must contain only digits';
    }
    if (id.length === 0) {
      return 'ID cannot be empty';
    }
    if (!isSafeIntegerID(id)) {
      return `ID ${id} exceeds JavaScript safe integer limit`;
    }
    return null;
  }
  
  if (typeof id === 'number') {
    if (!Number.isInteger(id)) {
      return 'ID must be an integer';
    }
    if (id <= 0) {
      return 'ID must be positive';
    }
    if (id > Number.MAX_SAFE_INTEGER) {
      return `ID ${id} exceeds JavaScript safe integer limit`;
    }
    return null;
  }
  
  return 'ID must be a string or number';
}

// ============================================================================
// DEBUGGING UTILITIES
// ============================================================================

/**
 * Log ID precision information for debugging
 */
export function logIDPrecision(id: unknown, context: string = 'ID'): void {
  if (typeof id === 'string') {
    const num = parseInt(id, 10);
    const isSafe = isSafeIntegerID(id);
    console.log(`${context}:`, {
      original: id,
      parsed: num,
      isSafe,
      precision: isSafe ? 'preserved' : 'may be lost'
    });
  } else if (typeof id === 'number') {
    const isSafe = id <= Number.MAX_SAFE_INTEGER;
    console.log(`${context}:`, {
      original: id,
      isSafe,
      precision: isSafe ? 'preserved' : 'may be lost'
    });
  }
}

/**
 * Assert that an ID is valid and safe
 * Throws error if ID is invalid or unsafe
 */
export function assertValidID(id: unknown, context: string = 'ID'): asserts id is ID {
  const error = getIDValidationError(id);
  if (error) {
    throw new Error(`${context} validation failed: ${error}`);
  }
}
