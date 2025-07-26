import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDonghua } from "../../contexts/DonghuaContext";
import EpisodeTracker from "../../components/donghua/EpisodeTracker";
import EpisodeCountdown from "../../components/donghua/EpisodeCountdown";
import Rating from "../../components/common/Rating";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import toast from "react-hot-toast";
import * as donghuaService from "../../services/donghua";

const DonghuaView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { donghuaList, updateDonghua, deleteDonghua, refreshDonghua } =
    useDonghua();
  const [donghua, setDonghua] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const foundDonghua = donghuaList.find((d) => d._id === id);
    if (foundDonghua) {
      setDonghua(foundDonghua);
    } else {
      navigate("/donghua");
    }
    setIsLoading(false);
  }, [id, donghuaList, navigate]);

  const handleEpisodeUpdate = async (newEpisodeCount) => {
    try {
      const updatedDonghua = await updateDonghua(id, {
        watchedEpisodes: newEpisodeCount,
      });
      setDonghua(updatedDonghua);
      toast.success("Progress updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update progress");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updatedDonghua = await updateDonghua(id, { status: newStatus });
      setDonghua(updatedDonghua);
      toast.success("Status updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const handleRatingChange = async (newRating) => {
    try {
      const updatedDonghua = await updateDonghua(id, { rating: newRating });
      setDonghua(updatedDonghua);
      toast.success("Rating updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update rating");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDonghua(id);
      toast.success("Donghua deleted!");
      navigate("/donghua");
    } catch (err) {
      toast.error(err.message || "Failed to delete donghua");
    }
  };

  const handleMarkEpisodeAsAired = async () => {
    try {
      // Use the service to mark episode as aired (this will increment total episodes)
      const updatedDonghua = await donghuaService.updateNextEpisodeAirDate(id);
      setDonghua(updatedDonghua);

      // Refresh the donghua list to get updated data
      await refreshDonghua();

      toast.success(
        `🎬 Episode ${updatedDonghua.newEpisodeNumber} marked as aired! Total episodes: ${updatedDonghua.totalEpisodes}`,
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
      toast.error(err.message || "Failed to mark episode as aired");
    }
  };

  // Handle automatic episode transition when countdown reaches zero
  const handleEpisodeAired = async () => {
    try {
      // Wait for 10 seconds (matching the transition animation)
      await new Promise((resolve) => setTimeout(resolve, 10000));

      // Automatically update the episode using the service
      const updatedDonghua = await donghuaService.updateNextEpisodeAirDate(id);
      setDonghua(updatedDonghua);

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

  if (isLoading || !donghua) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {donghua.title}
          </h1>
          {donghua.chineseTitle && (
            <h2 className="text-xl text-gray-600 dark:text-gray-300">
              {donghua.chineseTitle}
            </h2>
          )}
        </div>
        <div className="flex space-x-2">
          <Button as={Link} to={`/donghua/${id}/edit`} variant="secondary">
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <img
              className="w-full h-auto"
              src={donghua.coverImage || "/assets/images/default-cover.jpg"}
              alt={donghua.title}
            />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Status
                </h3>
                <select
                  value={donghua.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="plan-to-watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Rating
                </h3>
                <div className="mt-1">
                  <Rating
                    value={donghua.rating}
                    editable
                    onChange={handleRatingChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Progress
                </h3>
                <div className="mt-1">
                  <EpisodeTracker
                    currentEpisode={donghua.watchedEpisodes}
                    totalEpisodes={donghua.totalEpisodes}
                    onUpdate={handleEpisodeUpdate}
                  />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Details
                </h3>
                <div className="mt-1 text-sm text-gray-900 dark:text-white space-y-1">
                  <p>
                    <span className="font-medium">Studio:</span>{" "}
                    {donghua.studio || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Year:</span>{" "}
                    {donghua.releaseYear || "Unknown"}
                  </p>
                  <p>
                    <span className="font-medium">Genres:</span>{" "}
                    {donghua.genres.join(", ") || "None"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Synopsis
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {donghua.synopsis || "No synopsis available."}
            </p>
          </div>

          {/* Episode Countdown Section */}
          {donghua.nextEpisodeAirDate && donghua.status === "watching" && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Next Episode
              </h3>
              <EpisodeCountdown
                airDate={donghua.nextEpisodeAirDate}
                episodeAirDay={donghua.episodeAirDay}
                nextEpisodeNumber={donghua.totalEpisodes + 1}
                onEpisodeAired={handleEpisodeAired}
                donghuaId={donghua._id}
              />
              <div className="mt-4">
                <Button
                  onClick={handleMarkEpisodeAsAired}
                  variant="primary"
                  className="w-full"
                >
                  Mark Episode as Aired
                </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Increments total episode count (watched episodes remain
                  manual)
                </p>
              </div>
            </div>
          )}

          {donghua.notes && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                My Notes
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                {donghua.notes}
              </p>
            </div>
          )}
        </div>
      </div>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Donghua"
      >
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Are you sure you want to delete "{donghua.title}"? This action cannot
          be undone.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DonghuaView;
