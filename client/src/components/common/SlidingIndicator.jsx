import { useState, useEffect, useRef } from "react";

const SlidingIndicator = ({
  items,
  activeIndex,
  orientation = "horizontal",
  className = "",
  indicatorClassName = "",
}) => {
  const [indicatorStyle, setIndicatorStyle] = useState({ opacity: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const itemRefs = useRef({});

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      const activeElement = itemRefs.current[activeIndex];
      const container = activeElement.closest("[data-sliding-container]");

      if (container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        if (orientation === "horizontal") {
          setIndicatorStyle({
            left: `${elementRect.left - containerRect.left}px`,
            width: `${elementRect.width}px`,
            opacity: 1,
            transform: "translateX(0)",
          });
        } else {
          setIndicatorStyle({
            top: `${elementRect.top - containerRect.top}px`,
            height: `${elementRect.height}px`,
            opacity: 1,
            transform: "translateY(0)",
          });
        }

        if (!isInitialized) {
          setTimeout(() => setIsInitialized(true), 100);
        }
      }
    }
  }, [activeIndex, orientation, isInitialized]);

  return (
    <div className={`relative ${className}`} data-sliding-container>
      {/* Sliding Indicator */}
      <div
        className={`absolute bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out gradient-animate ${
          orientation === "horizontal" ? "bottom-0 h-0.5" : "left-0 w-1"
        } ${
          isInitialized
            ? orientation === "horizontal"
              ? "slide-indicator-horizontal"
              : "slide-indicator-vertical"
            : ""
        } ${indicatorClassName}`}
        style={indicatorStyle}
      />

      {/* Navigation Items */}
      <div
        className={`flex ${
          orientation === "horizontal" ? "space-x-1" : "flex-col space-y-1"
        }`}
      >
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) itemRefs.current[index] = el;
            }}
            className={`relative flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 group nav-item-hover ${
              index === activeIndex
                ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            }`}
          >
            {item.icon && (
              <svg
                className={`w-5 h-5 mr-2 transition-all duration-300 ${
                  index === activeIndex
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={item.icon}
                />
              </svg>
            )}
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SlidingIndicator;
