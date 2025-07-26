const Donghua = require("../models/Donghua");

// Get statistics for the current user
exports.getStats = async (req, res, next) => {
  try {
    const donghuaList = await Donghua.find({ user: req.user.id });

    const stats = {
      total: donghuaList.length,
      completed: donghuaList.filter((d) => d.status === "completed").length,
      watching: donghuaList.filter((d) => d.status === "watching").length,
      planToWatch: donghuaList.filter((d) => d.status === "plan-to-watch")
        .length,
      onHold: donghuaList.filter((d) => d.status === "on-hold").length,
      dropped: donghuaList.filter((d) => d.status === "dropped").length,
      episodesWatched: donghuaList.reduce(
        (sum, d) => sum + (d.watchedEpisodes || 0),
        0
      ),
      genreCounts: donghuaList.reduce((acc, d) => {
        d.genres.forEach((g) => {
          acc[g] = (acc[g] || 0) + 1;
        });
        return acc;
      }, {}),
      ratingCounts: donghuaList.reduce((acc, d) => {
        if (d.rating > 0) acc[d.rating] = (acc[d.rating] || 0) + 1;
        return acc;
      }, {}),
    };

    res.json(stats);
  } catch (err) {
    next(err);
  }
};
