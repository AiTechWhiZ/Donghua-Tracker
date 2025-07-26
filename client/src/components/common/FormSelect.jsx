import { useState } from "react";

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  className = "",
  error,
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
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
    appearance-none
    ${error 
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
    ${error 
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
      
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={baseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className={`w-5 h-5 transition-colors duration-200 ${
              isFocused 
                ? "text-blue-500" 
                : isHovered 
                  ? "text-gray-500" 
                  : "text-gray-400"
            }`} 
            fill="currentColor" 
            viewBox="0 0 20 20"
          >
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
};

export default FormSelect; 