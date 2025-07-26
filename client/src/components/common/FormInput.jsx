import { useState } from "react";

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  min,
  max,
  step,
  rows,
  className = "",
  error,
  helpText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const baseClasses = `
    w-full px-4 py-3 
    border-2 rounded-lg 
    transition-all duration-300 ease-in-out
    bg-white dark:bg-gray-800 
    text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    ${
      error
        ? "border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500"
        : isFocused
        ? "border-blue-400 dark:border-blue-500"
        : isHovered
        ? "border-gray-400 dark:border-gray-500"
        : "border-gray-300 dark:border-gray-600"
    }
    ${className}
  `;

  const labelClasses = `
    block text-sm font-semibold mb-2 
    transition-colors duration-200
    ${
      error
        ? "text-red-600 dark:text-red-400"
        : isFocused
        ? "text-blue-600 dark:text-blue-400"
        : "text-gray-700 dark:text-gray-300"
    }
  `;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows || 3}
          className={baseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
      ) : (
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          min={min}
          max={max}
          step={step}
          className={baseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        />
      )}

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormInput;
