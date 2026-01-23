// Input component with error states

import { type InputHTMLAttributes, forwardRef } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className = "", error = false, helperText, type = "text", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full rounded-lg border px-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100";
    const normalClasses =
      "border-gray-300 focus:border-primary-500 focus:ring-primary-500/20";
    const errorClasses = "border-danger focus:border-danger focus:ring-danger/20";

    return (
      <div className="w-full">
        <input
          ref={ref}
          type={type}
          className={`${baseClasses} ${
            error ? errorClasses : normalClasses
          } ${className}`}
          {...props}
        />
        {helperText && (
          <p
            className={`mt-1 text-xs ${
              error ? "text-danger" : "text-gray-500"
            }`}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
