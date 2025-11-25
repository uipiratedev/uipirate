'use client';

import React from 'react';

export interface AccessibleTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

/**
 * AccessibleTextarea Component
 * 
 * A fully accessible textarea component that follows WCAG 2.1 guidelines:
 * - Proper label association
 * - Required field indicators
 * - Error announcements
 * - Helper text support
 * - ARIA attributes
 * 
 * @example
 * ```tsx
 * <AccessibleTextarea
 *   id="message"
 *   label="Your Message"
 *   required
 *   error={errors.message}
 *   helperText="Please provide details"
 *   rows={5}
 * />
 * ```
 */
export function AccessibleTextarea({
  id,
  label,
  error,
  helperText,
  required = false,
  className = '',
  rows = 4,
  ...props
}: AccessibleTextareaProps) {
  const hasError = !!error;
  const describedBy = [];

  if (helperText) describedBy.push(`${id}-helper`);
  if (error) describedBy.push(`${id}-error`);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      <textarea
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
        rows={rows}
        className={`
          px-4 py-2 border rounded-lg resize-vertical
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
          ${className}
        `}
        {...props}
      />

      {helperText && !error && (
        <span id={`${id}-helper`} className="text-sm text-gray-500">
          {helperText}
        </span>
      )}

      {error && (
        <span
          id={`${id}-error`}
          className="text-sm text-red-500"
          role="alert"
          aria-live="polite"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default AccessibleTextarea;
