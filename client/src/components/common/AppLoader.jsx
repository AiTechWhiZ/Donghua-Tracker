import LoadingSpinner from "./LoadingSpinner";

const AppLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <LoadingSpinner className="h-12 w-12 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
          Loading Donghua Tracker...
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Please wait while we set up your experience
        </p>
      </div>
    </div>
  );
};

export default AppLoader; 