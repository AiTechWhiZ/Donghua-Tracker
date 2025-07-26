import { useState, useEffect } from "react";
import toast from "react-hot-toast";

/**
 * EpisodeCountdown Component
 *
 * Features:
 * - Real-time countdown to next episode air date
 * - Automatic episode transition when countdown reaches zero
 * - 10-second loading animation during transition
 * - Manual episode marking option
 * - Visual feedback for episode transitions
 *
 * Props:
 * - airDate: ISO string of next episode air date
 * - episodeAirDay: Day of week episodes air (e.g., "Monday")
 * - nextEpisodeNumber: Episode number that will air next
 * - onEpisodeAired: Callback function when episode automatically transitions
 * - donghuaId: ID of the donghua for API calls
 * - autoTransition: Boolean to enable/disable automatic transitions (default: true)
 *
 * Example Usage:
 * When episode 170 airs on July 27th at 12:53 AM:
 * 1. Countdown shows time until July 27th 12:53 AM
 * 2. When countdown reaches zero, shows 10-second loading animation
 * 3. Automatically updates total episode count and sets next episode (171) for August 3rd at 12:53 AM
 * 4. Shows success notification and resets countdown
 *
 * Note:
 * - This increments the total episode count, not the watched episode count.
 * - Next episode number is calculated as totalEpisodes + 1
 * - Watched episodes are controlled manually by the user.
 */
const EpisodeCountdown = ({
  airDate,
  episodeAirDay,
  nextEpisodeNumber,
  onEpisodeAired,
  donghuaId,
  autoTransition = true,
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);
  const [hasShownExpiredNotification, setHasShownExpiredNotification] =
    useState(false);
  const [previousAirDate, setPreviousAirDate] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionStartTime, setTransitionStartTime] = useState(null);

  useEffect(() => {
    if (!airDate) return;

    // Check if air date has changed (indicating a new episode was aired)
    if (previousAirDate && previousAirDate !== airDate) {
      // Reset expired notification state for new episode
      setHasShownExpiredNotification(false);
      setIsExpired(false);
      setIsTransitioning(false);
      setTransitionStartTime(null);

      // Show success notification for new episode
      toast.success(`🎬 New episode countdown started!`, {
        duration: 4000,
        icon: "🎬",
        style: {
          background: "#10B981",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }

    // Update previous air date
    setPreviousAirDate(airDate);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const airDateTime = new Date(airDate).getTime();
      const difference = airDateTime - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });

        // Start transition process when episode expires
        if (!hasShownExpiredNotification && !isTransitioning) {
          setIsTransitioning(true);
          setTransitionStartTime(Date.now());

          toast.error(`⏰ Episode ${nextEpisodeNumber} should have aired!`, {
            duration: 6000,
            icon: "⏰",
            style: {
              background: "#EF4444",
              color: "#fff",
              fontWeight: "bold",
            },
          });
          setHasShownExpiredNotification(true);

          // Call the onEpisodeAired callback to trigger automatic update only if autoTransition is enabled
          if (onEpisodeAired && autoTransition) {
            onEpisodeAired();
          } else if (!autoTransition) {
            // If auto transition is disabled, just show the expired state
            setIsTransitioning(false);
            setTransitionStartTime(null);
          }
        }
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [
    airDate,
    nextEpisodeNumber,
    hasShownExpiredNotification,
    previousAirDate,
    isTransitioning,
    onEpisodeAired,
  ]);

  // Handle transition animation
  useEffect(() => {
    if (isTransitioning && transitionStartTime) {
      const transitionDuration = 10000; // 10 seconds
      const elapsed = Date.now() - transitionStartTime;

      if (elapsed >= transitionDuration) {
        setIsTransitioning(false);
        setTransitionStartTime(null);
      }
    }
  }, [isTransitioning, transitionStartTime]);

  if (!airDate) {
    return null;
  }

  // Show transition loading animation
  if (isTransitioning) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 dark:border-yellow-400"></div>
          </div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
            Episode {nextEpisodeNumber} has aired! 🎬
          </p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">
            Setting up countdown for next episode...
          </p>
          <div className="mt-3">
            <div className="w-full bg-yellow-200 dark:bg-yellow-700 rounded-full h-2">
              <div
                className="bg-yellow-500 dark:bg-yellow-400 h-2 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.min(
                    100,
                    ((Date.now() - transitionStartTime) / 10000) * 100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <svg
            className="w-5 h-5 text-red-600 dark:text-red-400"
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
          <div>
            <p className="text-sm font-medium text-red-800 dark:text-red-200">
              Episode should have aired
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              Next episode on {episodeAirDay}s
            </p>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num) => num.toString().padStart(2, "0");

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="text-center">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
          Next Episode Airs In
        </p>
        {nextEpisodeNumber && (
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-3">
            Episode {nextEpisodeNumber}
          </p>
        )}
        <div className="flex justify-center space-x-2">
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-lg px-3 py-2">
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(timeLeft.days)}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Days
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-lg px-3 py-2">
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(timeLeft.hours)}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Hours
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-lg px-3 py-2">
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(timeLeft.minutes)}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Minutes
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 dark:bg-blue-800 rounded-lg px-3 py-2">
              <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatNumber(timeLeft.seconds)}
              </span>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              Seconds
            </p>
          </div>
        </div>
        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
          Airs on {episodeAirDay}s at{" "}
          {new Date(airDate).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

export default EpisodeCountdown;
