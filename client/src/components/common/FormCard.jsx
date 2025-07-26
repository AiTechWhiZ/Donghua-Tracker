const FormCard = ({ children, title, subtitle, className = "" }) => {
  return (
    <div
      className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}
    >
      <div
        className={`max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm ${className}`}
      >
        {(title || subtitle) && (
          <div className="text-center">
            {title && (
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default FormCard;
