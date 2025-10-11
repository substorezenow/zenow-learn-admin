/**
 * Reusable Form Field Components
 *
 * Pre-styled form components with built-in validation support
 */

import React from "react";

// ============================================================================
// BASE INTERFACES
// ============================================================================

export interface BaseFieldProps {
  name: string;
  value: string | number | boolean | string[] | undefined;
  onChange: (value: string | number | boolean | string[]) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  helpText?: string;
  className?: string;
}

// ============================================================================
// INPUT FIELD COMPONENT
// ============================================================================

export interface InputFieldProps extends BaseFieldProps {
  type?: "text" | "email" | "password" | "number" | "url" | "tel";
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  autoComplete?: string;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export function InputField({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  placeholder,
  label,
  helpText,
  type = "text",
  min,
  max,
  step,
  pattern,
  autoComplete,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helpTextClassName = "",
}: InputFieldProps) {
  const showError = touched && error;
  const inputClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
    showError ? "border-red-500" : "border-gray-300"
  } ${inputClassName}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        value={value as string | number}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        pattern={pattern}
        autoComplete={autoComplete}
        spellCheck={false}
        className={inputClasses}
      />

      {showError && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}

      {helpText && !showError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// TEXTAREA FIELD COMPONENT
// ============================================================================

export interface TextareaFieldProps extends BaseFieldProps {
  rows?: number;
  cols?: number;
  maxLength?: number;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export function TextareaField({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  placeholder,
  label,
  helpText,
  rows = 3,
  cols,
  maxLength,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helpTextClassName = "",
}: TextareaFieldProps) {
  const showError = touched && error;
  const textareaClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical ${
    showError ? "border-red-500" : "border-gray-300"
  } ${inputClassName}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        cols={cols}
        maxLength={maxLength}
        spellCheck={false}
        className={textareaClasses}
      />

      {showError && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}

      {helpText && !showError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// SELECT FIELD COMPONENT
// ============================================================================

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps extends BaseFieldProps {
  options: SelectOption[];
  multiple?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export function SelectField({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  placeholder,
  label,
  helpText,
  options,
  multiple = false,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helpTextClassName = "",
}: SelectFieldProps) {
  const showError = touched && error;
  const selectClasses = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
    showError ? "border-red-500" : "border-gray-300"
  } ${inputClassName}`;

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        id={name}
        name={name}
        value={value as string | number}
        onChange={(e) =>
          onChange(
            multiple
              ? (Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                ) as string[])
              : e.target.value
          )
        }
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        multiple={multiple}
        className={selectClasses}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>

      {showError && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}

      {helpText && !showError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// CHECKBOX FIELD COMPONENT
// ============================================================================

export interface CheckboxFieldProps extends BaseFieldProps {
  checked?: boolean;
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export function CheckboxField({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  label,
  helpText,
  checked,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helpTextClassName = "",
}: CheckboxFieldProps) {
  const showError = touched && error;
  const checkboxClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
    showError ? "border-red-500 focus:ring-red-500" : ""
  } ${inputClassName}`;

  return (
    <div className={`space-y-1 ${className}`}>
      <div className="flex items-center space-x-2">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked || (value as boolean) || false}
          onChange={(e) => onChange(e.target.checked)}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          spellCheck={false}
          className={checkboxClasses}
        />

        {label && (
          <label
            htmlFor={name}
            className={`text-sm font-medium text-gray-700 ${labelClassName}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>

      {showError && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}

      {helpText && !showError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// RADIO FIELD COMPONENT
// ============================================================================

export interface RadioOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface RadioFieldProps extends BaseFieldProps {
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  inputClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  helpTextClassName?: string;
}

export function RadioField({
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  disabled,
  label,
  helpText,
  options,
  orientation = "vertical",
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  helpTextClassName = "",
}: RadioFieldProps) {
  const showError = touched && error;
  const radioClasses = `h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 ${
    showError ? "border-red-500 focus:ring-red-500" : ""
  } ${inputClassName}`;

  const containerClasses =
    orientation === "horizontal" ? "flex flex-wrap gap-4" : "space-y-2";

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium text-gray-700 ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className={containerClasses}>
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <input
              id={`${name}-${option.value}`}
              name={name}
              type="radio"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              required={required}
              disabled={disabled || option.disabled}
              className={radioClasses}
            />
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-sm text-gray-700"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {showError && (
        <p className={`text-sm text-red-600 ${errorClassName}`}>{error}</p>
      )}

      {helpText && !showError && (
        <p className={`text-sm text-gray-500 ${helpTextClassName}`}>
          {helpText}
        </p>
      )}
    </div>
  );
}

// ============================================================================
// FORM SUBMIT BUTTON COMPONENT
// ============================================================================

export interface SubmitButtonProps {
  loading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
  onClick?: () => void;
}

export function SubmitButton({
  loading = false,
  disabled = false,
  children,
  className = "",
  loadingText = "Loading...",
  onClick,
}: SubmitButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      onClick={onClick}
      className={`
        w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white
        ${
          isDisabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        }
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          {loadingText}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
