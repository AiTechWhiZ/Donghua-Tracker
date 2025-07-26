import { useState } from "react";
import Button from "../common/Button";

const EpisodeTracker = ({
  currentEpisode,
  totalEpisodes,
  onUpdate,
  className = "",
}) => {
  const [episode, setEpisode] = useState(currentEpisode);

  const handleIncrement = () => {
    if (totalEpisodes && episode >= totalEpisodes) return;
    const newEpisode = episode + 1;
    setEpisode(newEpisode);
    onUpdate(newEpisode);
  };

  const handleDecrement = () => {
    if (episode <= 0) return;
    const newEpisode = episode - 1;
    setEpisode(newEpisode);
    onUpdate(newEpisode);
  };

  const handleChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    const newEpisode = Math.max(
      0,
      totalEpisodes ? Math.min(value, totalEpisodes) : value
    );
    setEpisode(newEpisode);
    onUpdate(newEpisode);
  };

  return (
    <div className={`flex items-center ${className}`}>
      <Button
        size="small"
        onClick={handleDecrement}
        disabled={episode <= 0}
        className="rounded-r-none"
      >
        -
      </Button>
      <div className="px-3 py-1 border-t border-b border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700">
        <input
          type="number"
          min="0"
          max={totalEpisodes || ""}
          value={episode}
          onChange={handleChange}
          className="w-12 text-center bg-transparent focus:outline-none dark:text-white"
        />
        {totalEpisodes && (
          <span className="text-gray-500"> / {totalEpisodes}</span>
        )}
      </div>
      <Button
        size="small"
        onClick={handleIncrement}
        disabled={totalEpisodes && episode >= totalEpisodes}
        className="rounded-l-none"
      >
        +
      </Button>
    </div>
  );
};

export default EpisodeTracker;
