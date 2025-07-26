import { Link } from "react-router-dom";
import { useDonghua } from "../../contexts/DonghuaContext";
import Rating from "../common/Rating";
import Button from "../common/Button";
import EpisodeCountdown from "./EpisodeCountdown";
import * as donghuaService from "../../services/donghua";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const DonghuaCard = ({ donghua, showEpisodeCountdown = true }) => {
  const { deleteDonghua, updateDonghua, refreshDonghua } = useDonghua();
  const [isUpdating, setIsUpdating] = useState(false);
  const [episodeCount, setEpisodeCount] = useState(donghua.watchedEpisodes);
  const [showEpisodeUpdate, setShowEpisodeUpdate] = useState(false);
  const [showCountdownReset, setShowCountdownReset] = useState(false);
  const [previousAirDate, setPreviousAirDate] = useState(
    donghua.nextEpisodeAirDate
  );
  const [isAutoTransitioning, setIsAutoTransitioning] = useState(false);

  // Update local episode count when donghua data changes
  useEffect(() => {
    if (donghua.watchedEpisodes !== episodeCount) {
      setEpisodeCount(donghua.watchedEpisodes);
      setShowEpisodeUpdate(true);

      // Hide the update indicator after 3 seconds
      setTimeout(() => {
        setShowEpisodeUpdate(false);
      }, 3000);
    }
  }, [donghua.watchedEpisodes, episodeCount]);

  // Check if air date has changed (indicating countdown reset)
  useEffect(() => {
    if (
      previousAirDate &&
      donghua.nextEpisodeAirDate &&
      previousAirDate !== donghua.nextEpisodeAirDate
    ) {
      setShowCountdownReset(true);
      setPreviousAirDate(donghua.nextEpisodeAirDate);

      // Hide the reset indicator after 4 seconds
      setTimeout(() => {
        setShowCountdownReset(false);
      }, 4000);
    }
  }, [donghua.nextEpisodeAirDate, previousAirDate]);

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete "${donghua.title}"?`)) {
      try {
        await deleteDonghua(donghua._id);
      } catch (error) {
        console.error("Error deleting donghua:", error);
      }
    }
  };

  const handleUpdateNextEpisode = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      window.confirm(
        `Mark episode as aired and update next episode date for "${donghua.title}"?`
      )
    ) {
      setIsUpdating(true);
      try {
        const updatedDonghua = await donghuaService.updateNextEpisodeAirDate(
          donghua._id
        );
        await updateDonghua(donghua._id, updatedDonghua);

        // Refresh the donghua list to get updated data
        await refreshDonghua();

        // Show success notification with episode information
        if (updatedDonghua.episodeAired) {
          toast.success(`🎉 ${updatedDonghua.message}`, {
            duration: 5000,
            icon: "🎬",
            style: {
              background: "#10B981",
              color: "#fff",
              fontWeight: "bold",
            },
          });
        }
      } catch (error) {
        console.error("Error updating next episode:", error);
        toast.error("Failed to mark episode as aired");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  // Handle automatic episode transition when countdown reaches zero
  const handleEpisodeAired = async () => {
    if (isAutoTransitioning) return; // Prevent multiple calls

    setIsAutoTransitioning(true);

    try {
      // Wait for 10 seconds (matching the transition animation)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Automatically update the episode
      const updatedDonghua = await donghuaService.updateNextEpisodeAirDate(
        donghua._id
      );
      await updateDonghua(donghua._id, updatedDonghua);

      // Refresh the donghua list to get updated data
      await refreshDonghua();

      // Show success notification
      if (updatedDonghua.episodeAired) {
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
      }
    } catch (error) {
      console.error("Error in automatic episode transition:", error);
      toast.error("Failed to automatically update episode");
    } finally {
      setIsAutoTransitioning(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:ring-2 hover:ring-blue-400 dark:hover:ring-blue-600">
      <Link to={`/donghua/${donghua._id}`}>
        <div className="relative pb-2/3 h-48">
          <img
            className="absolute h-full w-full object-cover"
            src={donghua.coverImage || "/assets/images/default-cover.jpg"}
            alt={donghua.title}
          />
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/donghua/${donghua._id}`}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
            {donghua.title}
          </h3>
          {donghua.chineseTitle && (
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              {donghua.chineseTitle}
            </p>
          )}
          {donghua.synopsis && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
              {donghua.synopsis}
            </p>
          )}
        </Link>
        <div className="flex justify-between items-center mb-2">
          <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded">
            {donghua.status}
          </span>
          <Rating value={donghua.rating} size="sm" />
        </div>
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Episodes:
            </span>
            <span
              className={`font-semibold text-lg transition-all duration-500 ${
                showEpisodeUpdate
                  ? "text-green-600 dark:text-green-400 animate-pulse scale-110"
                  : "text-green-600 dark:text-green-400"
              }`}
            >
              {donghua.watchedEpisodes}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              / {donghua.totalEpisodes || "?"}
            </span>
            {showEpisodeUpdate && (
              <span className="text-xs text-green-600 dark:text-green-400 animate-pulse">
                ✨ Updated!
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {donghua.releaseYear}
          </span>
        </div>

        {/* Episode Countdown */}
        {showEpisodeCountdown &&
          donghua.nextEpisodeAirDate &&
          donghua.status === "watching" && (
            <div className="mb-3">
              {showCountdownReset && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-green-600 dark:text-green-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-xs text-green-700 dark:text-green-300 font-medium">
                      Countdown reset for new episode! 🎬
                    </span>
                  </div>
                </div>
              )}
              {isAutoTransitioning && (
                <div className="mb-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-4 h-4 text-yellow-600 dark:text-yellow-400 animate-spin"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-xs text-yellow-700 dark:text-yellow-300 font-medium">
                      Auto-updating episode... ⏳
                    </span>
                  </div>
                </div>
              )}
              <EpisodeCountdown
                airDate={donghua.nextEpisodeAirDate}
                episodeAirDay={donghua.episodeAirDay}
                nextEpisodeNumber={donghua.totalEpisodes + 1}
                onEpisodeAired={handleEpisodeAired}
                donghuaId={donghua._id}
              />
              <div className="mt-2">
                <Button
                  onClick={handleUpdateNextEpisode}
                  variant="outline"
                  size="small"
                  disabled={isUpdating || isAutoTransitioning}
                  className="w-full"
                >
                  {isUpdating
                    ? "Updating..."
                    : isAutoTransitioning
                    ? "Auto-updating..."
                    : "Mark Episode as Aired"}
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  Increments total episode count
                </p>
              </div>
            </div>
          )}

        <div className="flex justify-between items-center ">
          <Button
            as={Link}
            to={`/donghua/${donghua._id}/edit`}
            variant="outline"
            size="small"
            onClick={(e) => e.stopPropagation()}
            className="text-white hover:text-black "
          >
            Edit
          </Button>
          <Button variant="danger" size="small" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonghuaCard;
