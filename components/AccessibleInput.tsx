"use client";

import React from "react";

export interface AccessibleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * AccessibleInput Component
 *
 * A fully accessible input component that follows WCAG 2.1 guidelines:
 * - Proper label association
 * - Required field indicators
 * - Error announcements
 * - Helper text support
 * - ARIA attributes
 *
 * @example
 * ```tsx
 * <AccessibleInput
 *   id="email"
 *   label="Email Address"
 *   type="email"
 *   required
 *   error={errors.email}
 *   helperText="We'll never share your email"
 * />
 * ```
 */
export function AccessibleInput({
  id,
  label,
  error,
  helperText,
  required = false,
  className = "",
  ...props
}: AccessibleInputProps) {
  const hasError = !!error;
  const describedBy = [];

  if (helperText) describedBy.push(`${id}-helper`);
  if (error) describedBy.push(`${id}-error`);

  return (
    <div className="flex flex-col gap-1">
      <label
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
        htmlFor={id}
      >
        {label}
        {required && (
          <span aria-label="required" className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <input
        aria-describedby={
          describedBy.length > 0 ? describedBy.join(" ") : undefined
        }
        aria-invalid={hasError}
        aria-required={required}
        className={`
          px-4 py-2 border rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"}
          ${className}
        `}
        id={id}
        required={required}
        {...props}
      />

      {helperText && !error && (
        <span className="text-sm text-gray-500" id={`${id}-helper`}>
          {helperText}
        </span>
      )}

      {error && (
        <span
          aria-live="polite"
          className="text-sm text-red-500"
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default AccessibleInput;
