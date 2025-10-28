/**
 * Centralized type exports
 * 
 * This file provides a single entry point for all type definitions,
 * making imports cleaner and preventing confusion about where types are defined.
 */

// ============================================================================
// COMMON TYPES
// ============================================================================
export type {
  ID,
  CategoryID,
  FieldID,
  CourseID,
  ModuleID,
  UserID,
  BlogID,
  FormID,
  FlexibleID
} from './common';

export {
  isValidID,
  toID,
  toSafeNumber
} from './common';

// ============================================================================
// API TYPES
// ============================================================================
export type {
  // Base types
  ApiResponse,
  
  // Entity types
  Category,
  Field,
  Course,
  CourseModule,
  Blog,
  BlogCategory,
  Student,
  Enrollment,
  EnrollmentStats,
  AdminStats,
  
  // Create request types
  CreateCategoryRequest,
  CreateFieldRequest,
  CreateCourseRequest,
  CreateModuleRequest,
  CreateBlogRequest,
  CreateBlogCategoryRequest,
  
  // Update request types
  UpdateCategoryRequest,
  UpdateFieldRequest,
  UpdateCourseRequest,
  UpdateModuleRequest,
  UpdateEnrollmentRequest,
  UpdateBlogRequest,
  UpdateBlogCategoryRequest,
  
  // Filter types
  EnrollmentFilters,
  
  // Form data types
  CategoryFormData,
  FieldFormData,
  CourseFormData,
  ModuleFormData,
  BlogFormData,
  BlogCategoryFormData,
  
  // Response types
  BlogsResponse
} from './api';

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================
export { ValidationSchemas } from './validation';

// ============================================================================
// UTILITIES
// ============================================================================
export {
  // Type guards
  isDatabaseID,
  isFormID,
  isFlexibleID,
  
  // ID conversion utilities
  toDatabaseID,
  formIDToDatabaseID,
  databaseIDToNumber,
  
  // Form data utilities
  extractFormID,
  extractOptionalFormID,
  
  // Validation utilities
  isSafeIntegerID,
  getIDValidationError,
  
  // Debugging utilities
  logIDPrecision,
  assertValidID
} from './utils';