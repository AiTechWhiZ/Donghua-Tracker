import { useState, useEffect } from "react";
import { useDonghua } from "../../contexts/DonghuaContext";
import * as donghuaService from "../../services/donghua";
import toast from "react-hot-toast";

const EpisodeNotification = () => {
  const { donghuaList, updateDonghua } = useDonghua();
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkExpiredEpisodes = async () => {
      if (hasChecked || donghuaList.length === 0) return;

      try {
        const result = await donghuaService.checkAndUpdateExpiredEpisodes();

        if (result.updatedDonghua && result.updatedDonghua.length > 0) {
          // Update the donghua list with the new data
          result.updatedDonghua.forEach(async (updatedDonghua) => {
            await updateDonghua(updatedDonghua._id, updatedDonghua);
          });

          // Show notification for expired episodes
          toast.success(
            `📺 ${result.updatedDonghua.length} episode(s) have been updated!`,
            {
              duration: 6000,
              icon: "🎬",
              style: {
                background: "#F59E0B",
                color: "#fff",
                fontWeight: "bold",
              },
            }
          );

          // Show individual notifications for each updated donghua
          result.updatedDonghua.forEach((donghua) => {
            toast.success(
              `🎉 Episode ${donghua.watchedEpisodes + 1} of "${
                donghua.title
              }" has aired!`,
              {
                duration: 4000,
                icon: "🎬",
                style: {
                  background: "#10B981",
                  color: "#fff",
                  fontWeight: "bold",
                },
              }
            );
          });
        }
      } catch (error) {
        console.error("Error checking expired episodes:", error);
      } finally {
        setHasChecked(true);
      }
    };

    // Check for expired episodes when component mounts
    checkExpiredEpisodes();
  }, [donghuaList, hasChecked, updateDonghua]);

  // Check for episodes that are about to air (within 1 hour)
  useEffect(() => {
    const checkUpcomingEpisodes = () => {
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      donghuaList.forEach((donghua) => {
        if (
          donghua.status === "watching" &&
          donghua.nextEpisodeAirDate &&
          new Date(donghua.nextEpisodeAirDate) <= oneHourFromNow &&
          new Date(donghua.nextEpisodeAirDate) > now
        ) {
          const timeUntilAir = new Date(donghua.nextEpisodeAirDate) - now;
          const minutesUntilAir = Math.floor(timeUntilAir / (1000 * 60));

          if (minutesUntilAir <= 60 && minutesUntilAir > 0) {
            toast.success(
              `⏰ Episode ${donghua.watchedEpisodes + 1} of "${
                donghua.title
              }" airs in ${minutesUntilAir} minutes!`,
              {
                duration: 8000,
                icon: "⏰",
                style: {
                  background: "#3B82F6",
                  color: "#fff",
                  fontWeight: "bold",
                },
              }
            );
          }
        }
      });
    };

    // Check every 5 minutes
    const interval = setInterval(checkUpcomingEpisodes, 5 * 60 * 1000);

    // Also check immediately
    checkUpcomingEpisodes();

    return () => clearInterval(interval);
  }, [donghuaList]);

  return null; // This component doesn't render anything
};

export default EpisodeNotification;
