import { useDonghua } from "../contexts/DonghuaContext";
import { PieChart, BarChart } from "react-chartkick";
import "chartkick/chart.js";

const Stats = () => {
  const { donghuaList } = useDonghua();

  const statusData = donghuaList.reduce((acc, donghua) => {
    acc[donghua.status] = (acc[donghua.status] || 0) + 1;
    return acc;
  }, {});

  const genreData = donghuaList.reduce((acc, donghua) => {
    donghua.genres.forEach((genre) => {
      acc[genre] = (acc[genre] || 0) + 1;
    });
    return acc;
  }, {});

  const ratingData = donghuaList.reduce((acc, donghua) => {
    if (donghua.rating > 0) {
      acc[donghua.rating] = (acc[donghua.rating] || 0) + 1;
    }
    return acc;
  }, {});

  const totalEpisodes = donghuaList.reduce(
    (sum, donghua) => sum + (donghua.watchedEpisodes || 0),
    0
  );

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-2 rounded-xl transition-all duration-500">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Statistics
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Total Donghua
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {donghuaList.length}
              </p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">
                Episodes Watched
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {totalEpisodes}
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 dark:text-purple-200">
                Completed
              </h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statusData["completed"] || 0}
              </p>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Watching
              </h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {statusData["watching"] || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Status Distribution
          </h2>
          <PieChart
            data={Object.entries(statusData).map(([status, count]) => [
              status.charAt(0).toUpperCase() + status.slice(1),
              count,
            ])}
            colors={["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]}
            library={{
              plugins: {
                legend: {
                  labels: {
                    color: "#6B7280",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Genre Distribution
          </h2>
          {Object.keys(genreData).length > 0 ? (
            <BarChart
              data={Object.entries(genreData)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)}
              colors={["#3B82F6"]}
              library={{
                indexAxis: "y",
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#6B7280",
                    },
                    grid: {
                      color: "#E5E7EB",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#6B7280",
                    },
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No genre data available
            </p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Rating Distribution
          </h2>
          {Object.keys(ratingData).length > 0 ? (
            <BarChart
              data={Object.entries(ratingData).sort((a, b) => a[0] - b[0])}
              colors={["#F59E0B"]}
              xtitle="Rating"
              ytitle="Count"
              library={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      color: "#6B7280",
                    },
                    grid: {
                      color: "#E5E7EB",
                    },
                  },
                  y: {
                    ticks: {
                      color: "#6B7280",
                    },
                    grid: {
                      color: "#E5E7EB",
                    },
                  },
                },
              }}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No rating data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
