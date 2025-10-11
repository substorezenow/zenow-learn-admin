/**
 * Comprehensive Form Validation Library for Zenow Learn Admin
 * 
 * This library provides TypeScript-first validation schemas and utilities
 * that match the backend validation rules exactly.
 */

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FieldValidationResult {
  isValid: boolean;
  error?: string;
}

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

export class ValidationUtils {
  /**
   * Validates email format
   */
  static validateEmail(email: string): FieldValidationResult {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
  }

  /**
   * Validates password strength
   */
  static validatePassword(password: string): FieldValidationResult {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }
    
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    if (password.length > 128) {
      return { isValid: false, error: 'Password must be less than 128 characters' };
    }
    
    // Check for at least one uppercase, lowercase, number, and special character
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one uppercase letter, lowercase letter, number, and special character' 
      };
    }
    
    return { isValid: true };
  }

  /**
   * Validates slug format (lowercase, alphanumeric, hyphens only)
   */
  static validateSlug(slug: string): FieldValidationResult {
    if (!slug) {
      return { isValid: false, error: 'Slug is required' };
    }
    
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      return { isValid: false, error: 'Slug can only contain lowercase letters, numbers, and hyphens' };
    }
    
    if (slug.startsWith('-') || slug.endsWith('-')) {
      return { isValid: false, error: 'Slug cannot start or end with a hyphen' };
    }
    
    return { isValid: true };
  }

  /**
   * Validates URL format
   */
  static validateUrl(url: string): FieldValidationResult {
    if (!url) {
      return { isValid: true }; // URLs are optional
    }
    
    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: 'Please enter a valid URL' };
    }
  }

  /**
   * Validates positive integer
   */
  static validatePositiveInteger(value: string | number, fieldName: string): FieldValidationResult {
    const num = typeof value === 'string' ? parseInt(value, 10) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }
    
    if (num < 0) {
      return { isValid: false, error: `${fieldName} must be a positive number` };
    }
    
    return { isValid: true };
  }

  /**
   * Validates positive decimal
   */
  static validatePositiveDecimal(value: string | number, fieldName: string, maxDecimals: number = 2): FieldValidationResult {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    
    if (isNaN(num)) {
      return { isValid: false, error: `${fieldName} must be a valid number` };
    }
    
    if (num < 0) {
      return { isValid: false, error: `${fieldName} must be a positive number` };
    }
    
    // Check decimal places
    const decimalPlaces = (num.toString().split('.')[1] || '').length;
    if (decimalPlaces > maxDecimals) {
      return { isValid: false, error: `${fieldName} cannot have more than ${maxDecimals} decimal places` };
    }
    
    return { isValid: true };
  }

  /**
   * Validates string length
   */
  static validateStringLength(value: string, fieldName: string, min: number, max: number): FieldValidationResult {
    if (!value) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    
    if (value.length < min) {
      return { isValid: false, error: `${fieldName} must be at least ${min} characters long` };
    }
    
    if (value.length > max) {
      return { isValid: false, error: `${fieldName} must be less than ${max} characters long` };
    }
    
    return { isValid: true };
  }

  /**
   * Validates UUID format
   */
  static validateUUID(value: string): FieldValidationResult {
    if (!value) {
      return { isValid: true }; // UUIDs are optional
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return { isValid: false, error: 'Please enter a valid UUID' };
    }
    
    return { isValid: true };
  }

  /**
   * Validates difficulty level
   */
  static validateDifficultyLevel(value: string): FieldValidationResult {
    const validLevels = ['beginner', 'intermediate', 'advanced'];
    
    if (!value) {
      return { isValid: false, error: 'Difficulty level is required' };
    }
    
    if (!validLevels.includes(value.toLowerCase())) {
      return { isValid: false, error: 'Difficulty level must be beginner, intermediate, or advanced' };
    }
    
    return { isValid: true };
  }

  /**
   * Validates content type
   */
  static validateContentType(value: string): FieldValidationResult {
    const validTypes = ['video', 'text', 'quiz', 'assignment'];
    
    if (!value) {
      return { isValid: false, error: 'Content type is required' };
    }
    
    if (!validTypes.includes(value)) {
      return { isValid: false, error: 'Content type must be video, text, quiz, or assignment' };
    }
    
    return { isValid: true };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

export class ValidationSchemas {
  /**
   * Category validation schema
   */
  static validateCategory(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Name validation
    const nameValidation = ValidationUtils.validateStringLength(data.name, 'Name', 2, 100);
    if (!nameValidation.isValid) {
      errors.push({ field: 'name', message: nameValidation.error!, code: 'INVALID_NAME' });
    }

    // Slug validation (optional, auto-generated if not provided)
    if (data.slug) {
      const slugValidation = ValidationUtils.validateSlug(data.slug);
      if (!slugValidation.isValid) {
        errors.push({ field: 'slug', message: slugValidation.error!, code: 'INVALID_SLUG' });
      }
    }

    // Description validation (optional)
    if (data.description && data.description.length > 1000) {
      errors.push({ 
        field: 'description', 
        message: 'Description must be less than 1000 characters', 
        code: 'INVALID_DESCRIPTION' 
      });
    }

    // Icon URL validation (optional)
    if (data.icon_url) {
      const iconUrlValidation = ValidationUtils.validateUrl(data.icon_url);
      if (!iconUrlValidation.isValid) {
        errors.push({ field: 'icon_url', message: iconUrlValidation.error!, code: 'INVALID_ICON_URL' });
      }
    }

    // Banner image URL validation (optional)
    if (data.banner_image) {
      const bannerValidation = ValidationUtils.validateUrl(data.banner_image);
      if (!bannerValidation.isValid) {
        errors.push({ field: 'banner_image', message: bannerValidation.error!, code: 'INVALID_BANNER_URL' });
      }
    }

    // Sort order validation (optional)
    if (data.sort_order !== undefined) {
      const sortOrderValidation = ValidationUtils.validatePositiveInteger(data.sort_order, 'Sort order');
      if (!sortOrderValidation.isValid) {
        errors.push({ field: 'sort_order', message: sortOrderValidation.error!, code: 'INVALID_SORT_ORDER' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Field validation schema
   */
  static validateField(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Category ID validation (required)
    const categoryIdValidation = ValidationUtils.validatePositiveInteger(data.category_id, 'Category');
    if (!categoryIdValidation.isValid) {
      errors.push({ field: 'category_id', message: categoryIdValidation.error!, code: 'INVALID_CATEGORY_ID' });
    }

    // Name validation
    const nameValidation = ValidationUtils.validateStringLength(data.name, 'Name', 2, 100);
    if (!nameValidation.isValid) {
      errors.push({ field: 'name', message: nameValidation.error!, code: 'INVALID_NAME' });
    }

    // Slug validation (optional, auto-generated if not provided)
    if (data.slug) {
      const slugValidation = ValidationUtils.validateSlug(data.slug);
      if (!slugValidation.isValid) {
        errors.push({ field: 'slug', message: slugValidation.error!, code: 'INVALID_SLUG' });
      }
    }

    // Description validation (optional)
    if (data.description && data.description.length > 1000) {
      errors.push({ 
        field: 'description', 
        message: 'Description must be less than 1000 characters', 
        code: 'INVALID_DESCRIPTION' 
      });
    }

    // Icon URL validation (optional)
    if (data.icon_url) {
      const iconUrlValidation = ValidationUtils.validateUrl(data.icon_url);
      if (!iconUrlValidation.isValid) {
        errors.push({ field: 'icon_url', message: iconUrlValidation.error!, code: 'INVALID_ICON_URL' });
      }
    }

    // Banner image URL validation (optional)
    if (data.banner_image) {
      const bannerValidation = ValidationUtils.validateUrl(data.banner_image);
      if (!bannerValidation.isValid) {
        errors.push({ field: 'banner_image', message: bannerValidation.error!, code: 'INVALID_BANNER_URL' });
      }
    }

    // Sort order validation (optional)
    if (data.sort_order !== undefined) {
      const sortOrderValidation = ValidationUtils.validatePositiveInteger(data.sort_order, 'Sort order');
      if (!sortOrderValidation.isValid) {
        errors.push({ field: 'sort_order', message: sortOrderValidation.error!, code: 'INVALID_SORT_ORDER' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Course validation schema
   */
  static validateCourse(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Field ID validation (required)
    const fieldIdValidation = ValidationUtils.validatePositiveInteger(data.field_id, 'Field');
    if (!fieldIdValidation.isValid) {
      errors.push({ field: 'field_id', message: fieldIdValidation.error!, code: 'INVALID_FIELD_ID' });
    }

    // Title validation
    const titleValidation = ValidationUtils.validateStringLength(data.title, 'Title', 2, 200);
    if (!titleValidation.isValid) {
      errors.push({ field: 'title', message: titleValidation.error!, code: 'INVALID_TITLE' });
    }

    // Slug validation (optional, auto-generated if not provided)
    if (data.slug) {
      const slugValidation = ValidationUtils.validateSlug(data.slug);
      if (!slugValidation.isValid) {
        errors.push({ field: 'slug', message: slugValidation.error!, code: 'INVALID_SLUG' });
      }
    }

    // Description validation (optional)
    if (data.description && data.description.length > 5000) {
      errors.push({ 
        field: 'description', 
        message: 'Description must be less than 5000 characters', 
        code: 'INVALID_DESCRIPTION' 
      });
    }

    // Short description validation (optional)
    if (data.short_description && data.short_description.length > 500) {
      errors.push({ 
        field: 'short_description', 
        message: 'Short description must be less than 500 characters', 
        code: 'INVALID_SHORT_DESCRIPTION' 
      });
    }

    // Banner image URL validation (optional)
    if (data.banner_image) {
      const bannerValidation = ValidationUtils.validateUrl(data.banner_image);
      if (!bannerValidation.isValid) {
        errors.push({ field: 'banner_image', message: bannerValidation.error!, code: 'INVALID_BANNER_URL' });
      }
    }

    // Thumbnail image URL validation (optional)
    if (data.thumbnail_image) {
      const thumbnailValidation = ValidationUtils.validateUrl(data.thumbnail_image);
      if (!thumbnailValidation.isValid) {
        errors.push({ field: 'thumbnail_image', message: thumbnailValidation.error!, code: 'INVALID_THUMBNAIL_URL' });
      }
    }

    // Duration hours validation (optional)
    if (data.duration_hours !== undefined) {
      const durationValidation = ValidationUtils.validatePositiveInteger(data.duration_hours, 'Duration hours');
      if (!durationValidation.isValid) {
        errors.push({ field: 'duration_hours', message: durationValidation.error!, code: 'INVALID_DURATION' });
      }
      
      const duration = typeof data.duration_hours === 'string' ? parseInt(data.duration_hours, 10) : data.duration_hours;
      if (duration > 1000) {
        errors.push({ 
          field: 'duration_hours', 
          message: 'Duration hours cannot exceed 1000', 
          code: 'INVALID_DURATION' 
        });
      }
    }

    // Difficulty level validation (optional)
    if (data.difficulty_level) {
      const difficultyValidation = ValidationUtils.validateDifficultyLevel(data.difficulty_level);
      if (!difficultyValidation.isValid) {
        errors.push({ field: 'difficulty_level', message: difficultyValidation.error!, code: 'INVALID_DIFFICULTY' });
      }
    }

    // Price validation (optional)
    if (data.price !== undefined) {
      const priceValidation = ValidationUtils.validatePositiveDecimal(data.price, 'Price', 2);
      if (!priceValidation.isValid) {
        errors.push({ field: 'price', message: priceValidation.error!, code: 'INVALID_PRICE' });
      }
      
      const price = typeof data.price === 'string' ? parseFloat(data.price) : data.price;
      if (price > 9999.99) {
        errors.push({ 
          field: 'price', 
          message: 'Price cannot exceed $9,999.99', 
          code: 'INVALID_PRICE' 
        });
      }
    }

    // Instructor ID validation (optional)
    if (data.instructor_id) {
      const instructorValidation = ValidationUtils.validateUUID(data.instructor_id);
      if (!instructorValidation.isValid) {
        errors.push({ field: 'instructor_id', message: instructorValidation.error!, code: 'INVALID_INSTRUCTOR_ID' });
      }
    }

    // Prerequisites validation (optional)
    if (data.prerequisites && data.prerequisites.length > 2000) {
      errors.push({ 
        field: 'prerequisites', 
        message: 'Prerequisites must be less than 2000 characters', 
        code: 'INVALID_PREREQUISITES' 
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Course Module validation schema
   */
  static validateCourseModule(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Course ID validation (required)
    const courseIdValidation = ValidationUtils.validatePositiveInteger(data.course_id, 'Course');
    if (!courseIdValidation.isValid) {
      errors.push({ field: 'course_id', message: courseIdValidation.error!, code: 'INVALID_COURSE_ID' });
    }

    // Title validation
    const titleValidation = ValidationUtils.validateStringLength(data.title, 'Title', 2, 200);
    if (!titleValidation.isValid) {
      errors.push({ field: 'title', message: titleValidation.error!, code: 'INVALID_TITLE' });
    }

    // Description validation (optional)
    if (data.description && data.description.length > 1000) {
      errors.push({ 
        field: 'description', 
        message: 'Description must be less than 1000 characters', 
        code: 'INVALID_DESCRIPTION' 
      });
    }

    // Content type validation (required)
    const contentTypeValidation = ValidationUtils.validateContentType(data.content_type);
    if (!contentTypeValidation.isValid) {
      errors.push({ field: 'content_type', message: contentTypeValidation.error!, code: 'INVALID_CONTENT_TYPE' });
    }

    // Content URL validation (optional)
    if (data.content_url) {
      const contentUrlValidation = ValidationUtils.validateUrl(data.content_url);
      if (!contentUrlValidation.isValid) {
        errors.push({ field: 'content_url', message: contentUrlValidation.error!, code: 'INVALID_CONTENT_URL' });
      }
    }

    // Duration minutes validation (optional)
    if (data.duration_minutes !== undefined) {
      const durationValidation = ValidationUtils.validatePositiveInteger(data.duration_minutes, 'Duration minutes');
      if (!durationValidation.isValid) {
        errors.push({ field: 'duration_minutes', message: durationValidation.error!, code: 'INVALID_DURATION' });
      }
    }

    // Sort order validation (optional)
    if (data.sort_order !== undefined) {
      const sortOrderValidation = ValidationUtils.validatePositiveInteger(data.sort_order, 'Sort order');
      if (!sortOrderValidation.isValid) {
        errors.push({ field: 'sort_order', message: sortOrderValidation.error!, code: 'INVALID_SORT_ORDER' });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Login validation schema
   */
  static validateLogin(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Username validation
    if (!data.username || data.username.trim() === '') {
      errors.push({ field: 'username', message: 'Username is required', code: 'REQUIRED_USERNAME' });
    }

    // Password validation
    if (!data.password || data.password.trim() === '') {
      errors.push({ field: 'password', message: 'Password is required', code: 'REQUIRED_PASSWORD' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Password reset validation schema
   */
  static validatePasswordReset(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Email validation
    const emailValidation = ValidationUtils.validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.push({ field: 'email', message: emailValidation.error!, code: 'INVALID_EMAIL' });
    }

    // Password validation
    const passwordValidation = ValidationUtils.validatePassword(data.password);
    if (!passwordValidation.isValid) {
      errors.push({ field: 'password', message: passwordValidation.error!, code: 'INVALID_PASSWORD' });
    }

    // Confirm password validation
    if (data.password !== data.confirmPassword) {
      errors.push({ field: 'confirmPassword', message: 'Passwords do not match', code: 'PASSWORD_MISMATCH' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Settings validation schema
   */
  static validateSettings(data: any): ValidationResult {
    const errors: ValidationError[] = [];

    // Site name validation
    const siteNameValidation = ValidationUtils.validateStringLength(data.siteName, 'Site name', 2, 100);
    if (!siteNameValidation.isValid) {
      errors.push({ field: 'siteName', message: siteNameValidation.error!, code: 'INVALID_SITE_NAME' });
    }

    // Site URL validation
    if (data.siteUrl) {
      const siteUrlValidation = ValidationUtils.validateUrl(data.siteUrl);
      if (!siteUrlValidation.isValid) {
        errors.push({ field: 'siteUrl', message: siteUrlValidation.error!, code: 'INVALID_SITE_URL' });
      }
    }

    // Admin email validation
    if (data.adminEmail) {
      const adminEmailValidation = ValidationUtils.validateEmail(data.adminEmail);
      if (!adminEmailValidation.isValid) {
        errors.push({ field: 'adminEmail', message: adminEmailValidation.error!, code: 'INVALID_ADMIN_EMAIL' });
      }
    }

    // Support email validation
    if (data.supportEmail) {
      const supportEmailValidation = ValidationUtils.validateEmail(data.supportEmail);
      if (!supportEmailValidation.isValid) {
        errors.push({ field: 'supportEmail', message: supportEmailValidation.error!, code: 'INVALID_SUPPORT_EMAIL' });
      }
    }

    // SMTP port validation
    if (data.smtpPort) {
      const smtpPortValidation = ValidationUtils.validatePositiveInteger(data.smtpPort, 'SMTP port');
      if (!smtpPortValidation.isValid) {
        errors.push({ field: 'smtpPort', message: smtpPortValidation.error!, code: 'INVALID_SMTP_PORT' });
      }
      
      const port = typeof data.smtpPort === 'string' ? parseInt(data.smtpPort, 10) : data.smtpPort;
      if (port < 1 || port > 65535) {
        errors.push({ 
          field: 'smtpPort', 
          message: 'SMTP port must be between 1 and 65535', 
          code: 'INVALID_SMTP_PORT' 
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// ============================================================================
// FORM VALIDATION HOOK
// ============================================================================

export interface UseFormValidationOptions {
  schema: (data: any) => ValidationResult;
  onValidationChange?: (isValid: boolean, errors: ValidationError[]) => void;
}

export interface UseFormValidationReturn {
  validate: (data: any) => ValidationResult;
  validateField: (field: string, value: any, allData: any) => FieldValidationResult;
  getFieldError: (field: string, errors: ValidationError[]) => string | undefined;
  clearErrors: () => ValidationError[];
}

export function useFormValidation(options: UseFormValidationOptions): UseFormValidationReturn {
  const validate = (data: any): ValidationResult => {
    const result = options.schema(data);
    options.onValidationChange?.(result.isValid, result.errors);
    return result;
  };

  const validateField = (field: string, value: any, allData: any): FieldValidationResult => {
    const data = { ...allData, [field]: value };
    const result = options.schema(data);
    const fieldError = result.errors.find(error => error.field === field);
    
    return {
      isValid: !fieldError,
      error: fieldError?.message
    };
  };

  const getFieldError = (field: string, errors: ValidationError[]): string | undefined => {
    return errors.find(error => error.field === field)?.message;
  };

  const clearErrors = (): ValidationError[] => {
    return [];
  };

  return {
    validate,
    validateField,
    getFieldError,
    clearErrors
  };
}
