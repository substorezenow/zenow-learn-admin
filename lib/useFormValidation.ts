/**
 * React Form Validation Hook
 * 
 * Provides real-time validation for React forms with TypeScript support using Zod
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import { z, ZodError } from 'zod';

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface FormValidationState {
  errors: ValidationError[];
  isValid: boolean;
  touchedFields: Set<string>;
}

export interface UseFormValidationProps<T extends z.ZodTypeAny> {
  initialData: z.infer<T>;
  validationSchema: T;
}

export interface UseFormValidationReturn<T extends z.ZodTypeAny> {
  // State
  formData: z.infer<T>;
  validationState: FormValidationState;
  
  // Actions
  setFieldValue: (field: string, value: string | number | boolean | string[]) => void;
  setFieldTouched: (field: string) => void;
  validateForm: () => ValidationResult;
  resetForm: () => void;
  clearErrors: () => void;
  getFieldError: (field: string) => string | undefined;
  isFormValid: boolean;
}

export function useFormValidation<T extends z.ZodTypeAny>({
  initialData,
  validationSchema
}: UseFormValidationProps<T>): UseFormValidationReturn<T> {
  
  const initialDataRef = useRef(initialData);
  const validationSchemaRef = useRef(validationSchema);
  const [formData, setFormData] = useState<z.infer<T>>(initialData);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<ValidationError[]>([]);

  // Memoized validation state
  const validationState = useMemo((): FormValidationState => {
    return {
      errors,
      isValid: errors.length === 0,
      touchedFields,
    };
  }, [errors, touchedFields]);

  // Validate entire form
  const validateForm = useCallback((): ValidationResult => {
    try {
      validationSchema.parse(formData);
      setErrors([]);
      return { isValid: true, errors: [] };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        setErrors(errors);
        return { isValid: false, errors };
      }
      console.error("Unexpected validation error type:", error);
      return { isValid: false, errors: [{ field: "general", message: "An unexpected validation error occurred." }] };
    }
  }, [formData, validationSchema]);

  const setFieldValue = useCallback((field: string, value: string | number | boolean | string[]) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [field]: value };
      
      // Clear errors if they exist and form becomes valid
      setErrors((prevErrors) => {
        if (prevErrors.length === 0) return prevErrors;
        
        try {
          validationSchemaRef.current.parse(newData);
          return []; // Clear errors if form becomes valid
        } catch {
          return prevErrors; // Keep existing errors if still invalid
        }
      });
      
      return newData;
    });
  }, []);

  const setFieldTouched = useCallback((field: string) => {
    setTouchedFields((prevTouched) => {
      const newTouched = new Set(prevTouched);
      newTouched.add(field);
      return newTouched;
    });
    // Don't validate on blur - only on submit
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialDataRef.current);
    setErrors([]);
    setTouchedFields(new Set());
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const getFieldError = useCallback((field: string): string | undefined => {
    return errors.find((err) => err.field === field)?.message;
  }, [errors]);

  const isFormValid = useMemo(() => {
    // Only check validity if there are existing errors or if form has been touched
    // This allows the submit button to be clickable initially
    if (errors.length === 0 && touchedFields.size === 0) {
      return true; // Allow submission if no errors and no fields touched
    }
    
    // Check if the form is actually valid by running validation
    try {
      validationSchemaRef.current.parse(formData);
      return true;
    } catch {
      return false;
    }
  }, [formData, errors.length, touchedFields.size]);

  return {
    formData,
    validationState: {
      ...validationState,
      touchedFields,
    },
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    clearErrors,
    getFieldError,
    isFormValid,
  };
}