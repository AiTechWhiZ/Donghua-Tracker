import { Link, useNavigate } from "react-router-dom";
import { useDonghua } from "../contexts/DonghuaContext";
import { useAuth } from "../contexts/AuthContext";
import DonghuaCard from "../components/donghua/DonghuaCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import Button from "../components/common/Button";
import EpisodeCountdown from "../components/donghua/EpisodeCountdown";
import { useState, useMemo } from "react";
import * as donghuaService from "../services/donghua";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { donghuaList, isLoading, refreshDonghua } = useDonghua();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate statistics
  const stats = useMemo(() => {
    const total = donghuaList.length;
    const watching = donghuaList.filter((d) => d.status === "watching").length;
    const completed = donghuaList.filter(
      (d) => d.status === "completed"
    ).length;
    const planToWatch = donghuaList.filter(
      (d) => d.status === "plan-to-watch"
    ).length;
    const onHold = donghuaList.filter((d) => d.status === "on-hold").length;
    const dropped = donghuaList.filter((d) => d.status === "dropped").length;

    const totalEpisodes = donghuaList.reduce(
      (sum, d) => sum + (d.totalEpisodes || 0),
      0
    );
    const watchedEpisodes = donghuaList.reduce(
      (sum, d) => sum + (d.watchedEpisodes || 0),
      0
    );
    const averageRating =
      donghuaList.length > 0
        ? (
            donghuaList.reduce((sum, d) => sum + (d.rating || 0), 0) /
            donghuaList.length
          ).toFixed(1)
        : 0;

    return {
      total,
      watching,
      completed,
      planToWatch,
      onHold,
      dropped,
      totalEpisodes,
      watchedEpisodes,
      averageRating,
      completionRate:
        totalEpisodes > 0
          ? ((watchedEpisodes / totalEpisodes) * 100).toFixed(1)
          : 0,
      unwatchedEpisodes: totalEpisodes - watchedEpisodes,
    };
  }, [donghuaList]);

  // Get top genres
  const topGenres = useMemo(() => {
    const genreCount = {};
    donghuaList.forEach((donghua) => {
      donghua.genres?.forEach((genre) => {
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      });
    });
    return Object.entries(genreCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  }, [donghuaList]);

  // Get upcoming episodes
  const upcomingEpisodes = useMemo(() => {
    return donghuaList
      .filter((d) => d.status === "watching" && d.nextEpisodeAirDate)
      .sort(
        (a, b) =>
          new Date(a.nextEpisodeAirDate) - new Date(b.nextEpisodeAirDate)
      )
      .slice(0, 3);
  }, [donghuaList]);

  const recentlyAdded = [...donghuaList]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const recentlyWatched = [...donghuaList]
    .filter((d) => d.status === "watching" || d.status === "completed")
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 6);

  const highRated = [...donghuaList]
    .filter((d) => d.rating && d.rating >= 8)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const handleAddClick = () => {
    navigate("/donghua/add");
  };

  const handleViewAllClick = () => {
    navigate("/donghua");
  };

  // Handle automatic episode transition when countdown reaches zero
  const handleEpisodeAired = async (donghuaId) => {
    try {
      // Wait for 10 seconds (matching the transition animation)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Automatically update the episode using the service
      const updatedDonghua = await donghuaService.updateNextEpisodeAirDate(
        donghuaId
      );

      // Refresh the donghua list to get updated data
      await refreshDonghua();

      toast.success(
        `🎬 Episode ${updatedDonghua.newEpisodeNumber} automatically marked as aired! Total episodes: ${updatedDonghua.totalEpisodes}`,
        {
          duration: 5000,
          icon: "🎬",
          style: {
            background: "#10B981",
            color: "#fff",
            fontWeight: "bold",
          },
        }
      );
    } catch (err) {
      toast.error(err.message || "Failed to automatically update episode");
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color = "blue" }) => {
    const getColorClasses = (color) => {
      const colorMap = {
        blue: {
          border: "border-blue-500",
          bg: "bg-blue-100 dark:bg-blue-900",
        },
        green: {
          border: "border-green-500",
          bg: "bg-green-100 dark:bg-green-900",
        },
        purple: {
          border: "border-purple-500",
          bg: "bg-purple-100 dark:bg-purple-900",
        },
        yellow: {
          border: "border-yellow-500",
          bg: "bg-yellow-100 dark:bg-yellow-900",
        },
        orange: {
          border: "border-orange-500",
          bg: "bg-orange-100 dark:bg-orange-900",
        },
        red: {
          border: "border-red-500",
          bg: "bg-red-100 dark:bg-red-900",
        },
        indigo: {
          border: "border-indigo-500",
          bg: "bg-indigo-100 dark:bg-indigo-900",
        },
        pink: {
          border: "border-pink-500",
          bg: "bg-pink-100 dark:bg-pink-900",
        },
        teal: {
          border: "border-teal-500",
          bg: "bg-teal-100 dark:bg-teal-900",
        },
        cyan: {
          border: "border-cyan-500",
          bg: "bg-cyan-100 dark:bg-cyan-900",
        },
      };
      return colorMap[color] || colorMap.blue;
    };

    const colorClasses = getColorClasses(color);

    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 ${colorClasses.border}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className={`p-3 rounded-full ${colorClasses.bg}`}>{icon}</div>
        </div>
      </div>
    );
  };

  const ProgressCard = ({
    title,
    current,
    total,
    percentage,
    color = "blue",
  }) => {
    const getColorClass = (color) => {
      const colorMap = {
        blue: "bg-blue-500",
        green: "bg-green-500",
        purple: "bg-purple-500",
        yellow: "bg-yellow-500",
        orange: "bg-orange-500",
        red: "bg-red-500",
        indigo: "bg-indigo-500",
        pink: "bg-pink-500",
        teal: "bg-teal-500",
        cyan: "bg-cyan-500",
      };
      return colorMap[color] || "bg-blue-500";
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {current}/{total}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`${getColorClass(
              color
            )} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {percentage}% complete
        </p>
      </div>
    );
  };

  const QuickActionCard = ({
    title,
    description,
    icon,
    onClick,
    color = "blue",
  }) => {
    const getColorClasses = (color) => {
      const colorMap = {
        blue: {
          border: "border-blue-500",
          bg: "bg-blue-500",
          iconBg: "bg-blue-100 dark:bg-blue-900",
        },
        green: {
          border: "border-green-500",
          bg: "bg-green-500",
          iconBg: "bg-green-100 dark:bg-green-900",
        },
        purple: {
          border: "border-purple-500",
          bg: "bg-purple-500",
          iconBg: "bg-purple-100 dark:bg-purple-900",
        },
        yellow: {
          border: "border-yellow-500",
          bg: "bg-yellow-500",
          iconBg: "bg-yellow-100 dark:bg-yellow-900",
        },
        orange: {
          border: "border-orange-500",
          bg: "bg-orange-500",
          iconBg: "bg-orange-100 dark:bg-orange-900",
        },
        red: {
          border: "border-red-500",
          bg: "bg-red-500",
          iconBg: "bg-red-100 dark:bg-red-900",
        },
        indigo: {
          border: "border-indigo-500",
          bg: "bg-indigo-500",
          iconBg: "bg-indigo-100 dark:bg-indigo-900",
        },
        pink: {
          border: "border-pink-500",
          bg: "bg-pink-500",
          iconBg: "bg-pink-100 dark:bg-pink-900",
        },
        teal: {
          border: "border-teal-500",
          bg: "bg-teal-500",
          iconBg: "bg-teal-100 dark:bg-teal-900",
        },
        cyan: {
          border: "border-cyan-500",
          bg: "bg-cyan-500",
          iconBg: "bg-cyan-100 dark:bg-cyan-900",
        },
      };
      return colorMap[color] || colorMap.blue;
    };

    const colorClasses = getColorClasses(color);

    return (
      <div
        className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 border-l-4 ${colorClasses.border} relative overflow-hidden group`}
        onClick={onClick}
      >
        {/* Sliding background effect */}
        <div
          className={`absolute inset-0 ${colorClasses.bg} transform translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0`}
        ></div>

        <div className="flex items-center space-x-4 relative z-10">
          <div
            className={`p-3 rounded-full ${colorClasses.iconBg} group-hover:bg-white transition-colors duration-300`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300">
              {description}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 min-h-screen p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your donghua journey and discover new favorites
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleAddClick}
            className="relative overflow-hidden px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-mum rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            {/* Sliding background effect */}
            <div className="absolute inset-0 bg-white transform translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0"></div>

            <div className="relative z-10 flex items-center">
              <svg
                className="w-5 h-5 mr-2 group-hover:text-blue-600 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <span className="group-hover:text-blue-600 transition-colors duration-300">
                Add Donghua
              </span>
            </div>
          </button>

          <button
            onClick={handleViewAllClick}
            className="relative overflow-hidden px-6 py-3 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            {/* Sliding background effect */}
            <div className="absolute inset-0 bg-gray-700 dark:bg-gray-300 transform translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0"></div>

            <div className="relative z-10 group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
              View All
            </div>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard
          title="Total Donghua"
          value={stats.total}
          subtitle="in your collection"
          icon={
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          }
          color="blue"
        />
        <StatCard
          title="Currently Watching"
          value={stats.watching}
          subtitle="active series"
          icon={
            <svg
              className="w-6 h-6 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          }
          color="green"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          subtitle="finished series"
          icon={
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="purple"
        />
        <StatCard
          title="Average Rating"
          value={stats.averageRating}
          subtitle="out of 10"
          icon={
            <svg
              className="w-6 h-6 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          }
          color="yellow"
        />
        <StatCard
          title="Unwatched Episodes"
          value={stats.unwatchedEpisodes}
          subtitle="episodes to watch"
          icon={
            <svg
              className="w-6 h-6 text-orange-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
          color="orange"
        />
      </div>

      {/* Progress and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <ProgressCard
            title="Episode Progress"
            current={stats.watchedEpisodes}
            total={stats.totalEpisodes}
            percentage={parseFloat(stats.completionRate)}
            color="blue"
          />

          {/* Episode Management Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Episode Management Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {stats.watchedEpisodes}
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  Watched Episodes
                </div>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalEpisodes}
                </div>
                <div className="text-sm text-blue-600 dark:text-blue-400">
                  Total Episodes
                </div>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.unwatchedEpisodes}
                </div>
                <div className="text-sm text-orange-600 dark:text-orange-400">
                  Unwatched Episodes
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Note:</span> Total episodes are
                automatically updated when new episodes air. Watched episodes
                are manually controlled by you.
              </p>
            </div>
          </div>

          {/* Status Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Status Distribution
            </h3>
            <div className="space-y-3">
              {[
                { status: "Watching", count: stats.watching, color: "green" },
                {
                  status: "Completed",
                  count: stats.completed,
                  color: "purple",
                },
                {
                  status: "Plan to Watch",
                  count: stats.planToWatch,
                  color: "blue",
                },
                { status: "On Hold", count: stats.onHold, color: "yellow" },
                { status: "Dropped", count: stats.dropped, color: "red" },
              ].map(({ status, count, color }) => {
                const getStatusColorClass = (color) => {
                  const colorMap = {
                    green: "bg-green-500",
                    purple: "bg-purple-500",
                    blue: "bg-blue-500",
                    yellow: "bg-yellow-500",
                    red: "bg-red-500",
                  };
                  return colorMap[color] || "bg-blue-500";
                };

                return (
                  <div
                    key={status}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {status}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${getStatusColorClass(
                          color
                        )}`}
                      ></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {count}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h3>
          <div className="space-y-4">
            <QuickActionCard
              title="Add New Donghua"
              description="Add a new series to your collection"
              icon={
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
              onClick={handleAddClick}
              color="blue"
            />
            <QuickActionCard
              title="Browse Collection"
              description="View and manage your donghua"
              icon={
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              }
              onClick={handleViewAllClick}
              color="green"
            />
            <QuickActionCard
              title="View Statistics"
              description="See detailed analytics"
              icon={
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              }
              onClick={() => navigate("/stats")}
              color="purple"
            />
          </div>
        </div>
      </div>

      {/* Upcoming Episodes */}
      {upcomingEpisodes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Upcoming Episodes
          </h3>
          <div className="relative group">
            {/* Scroll Navigation Buttons */}
            {upcomingEpisodes.length > 1 && (
              <>
                <button
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    const container = document.querySelector(
                      ".upcoming-episodes-scroll"
                    );
                    if (container) {
                      container.scrollBy({ left: -340, behavior: "smooth" });
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    const container = document.querySelector(
                      ".upcoming-episodes-scroll"
                    );
                    if (container) {
                      container.scrollBy({ left: 340, behavior: "smooth" });
                    }
                  }}
                >
                  <svg
                    className="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Scroll Container */}
            <div
              className="upcoming-episodes-scroll flex overflow-x-auto gap-4 pb-4 scrollbar-hide scroll-smooth px-2"
              style={{ scrollBehavior: "smooth" }}
            >
              {upcomingEpisodes.map((donghua) => (
                <div
                  key={donghua._id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 min-w-[320px] max-w-[320px] flex-shrink-0 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2 truncate">
                    {donghua.title}
                  </h4>
                  <EpisodeCountdown
                    airDate={donghua.nextEpisodeAirDate}
                    episodeAirDay={donghua.episodeAirDay}
                    nextEpisodeNumber={donghua.totalEpisodes + 1}
                    onEpisodeAired={() => handleEpisodeAired(donghua._id)}
                    donghuaId={donghua._id}
                  />
                </div>
              ))}
            </div>

            {/* Scroll Indicators */}
            {upcomingEpisodes.length > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                {upcomingEpisodes.map((_, index) => (
                  <div
                    key={index}
                    className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-200 hover:bg-gray-400 dark:hover:bg-gray-500 cursor-pointer"
                  />
                ))}
              </div>
            )}

            {/* Scroll Hint */}
            {upcomingEpisodes.length > 1 && (
              <div className="text-center mt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ← Scroll or use arrows to see more upcoming episodes →
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Top Genres */}
      {topGenres.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Top Genres
          </h3>
          <div className="flex flex-wrap gap-3">
            {topGenres.map(({ genre, count }) => (
              <span
                key={genre}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
              >
                {genre}
                <span className="ml-2 bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full text-xs">
                  {count}
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recently Added - Full Width */}
      <section className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Recently Added
          </h2>
          <button
            onClick={handleViewAllClick}
            className="relative overflow-hidden px-4 py-2 bg-transparent border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
          >
            {/* Sliding background effect */}
            <div className="absolute inset-0 bg-gray-700 dark:bg-gray-300 transform translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0"></div>

            <div className="relative z-10 group-hover:text-black dark:group-hover:text-black transition-colors duration-300">
              View All
            </div>
          </button>
        </div>
        {recentlyAdded.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyAdded.map((donghua) => (
              <DonghuaCard
                key={donghua._id}
                donghua={donghua}
                showEpisodeCountdown={false}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
              No donghua added yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 mb-4">
              Add your first donghua to get started!
            </p>
            <button
              onClick={handleAddClick}
              className="relative overflow-hidden px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
            >
              {/* Sliding background effect */}
              <div className="absolute inset-0 bg-white transform translate-x-full transition-transform duration-300 ease-in-out group-hover:translate-x-0"></div>

              <div className="relative z-10 group-hover:text-blue-600 transition-colors duration-300">
                Add Your First Donghua
              </div>
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
