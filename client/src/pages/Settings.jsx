import { useTheme } from "../contexts/ThemeContext";
import Button from "../components/common/Button";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-2 rounded-xl transition-all duration-500">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Appearance
        </h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Customize how Donghua Tracker looks on your device
            </p>
          </div>
          <Button onClick={toggleTheme} variant="secondary">
            {theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Data Management
        </h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Export Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Download a backup of your donghua data
              </p>
            </div>
            <Button variant="secondary">Export</Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Import Data
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Restore from a previously exported backup
              </p>
            </div>
            <Button variant="secondary">Import</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
