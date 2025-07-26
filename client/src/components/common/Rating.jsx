import { useState } from "react";

const Rating = ({ value = 0, editable = false, onChange, size = "md" }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-3xl",
  };

  const handleClick = (newValue) => {
    if (editable && onChange) {
      onChange(newValue);
    }
  };

  const handleMouseEnter = (newValue) => {
    if (editable) {
      setHoverValue(newValue);
    }
  };

  const handleMouseLeave = () => {
    if (editable) {
      setHoverValue(0);
    }
  };

  const displayValue = hoverValue || value;

  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`${sizeClasses[size]} ${
            editable ? "cursor-pointer" : "cursor-default"
          }`}
          onClick={() => handleClick(star)}
          onMouseEnter={() => handleMouseEnter(star)}
          onMouseLeave={handleMouseLeave}
          disabled={!editable}
        >
          {star <= displayValue ? (
            <span className="text-yellow-400">★</span>
          ) : (
            <span className="text-gray-300 dark:text-gray-600">★</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default Rating;
