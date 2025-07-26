const Donghua = require("../models/Donghua");

// Get all donghua for user
exports.getAll = async (req, res, next) => {
  try {
    const donghua = await Donghua.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(donghua);
  } catch (err) {
    next(err);
  }
};

// Get single donghua
exports.getOne = async (req, res, next) => {
  try {
    const donghua = await Donghua.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!donghua) return res.status(404).json({ message: "Not found" });
    res.json(donghua);
  } catch (err) {
    next(err);
  }
};

// Add donghua
exports.create = async (req, res, next) => {
  try {
    const donghua = await Donghua.create({ ...req.body, user: req.user.id });
    res.status(201).json(donghua);
  } catch (err) {
    next(err);
  }
};

// Update donghua
exports.update = async (req, res, next) => {
  try {
    const donghua = await Donghua.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!donghua) return res.status(404).json({ message: "Not found" });
    res.json(donghua);
  } catch (err) {
    next(err);
  }
};

// Delete donghua
exports.remove = async (req, res, next) => {
  try {
    const donghua = await Donghua.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!donghua) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    next(err);
  }
};

// Update next episode air date (add 7 days) and increment total episodes
exports.updateNextEpisode = async (req, res, next) => {
  try {
    const donghua = await Donghua.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!donghua) return res.status(404).json({ message: "Not found" });

    if (!donghua.nextEpisodeAirDate) {
      return res.status(400).json({ message: "No next episode air date set" });
    }

    // Increment total episodes (not watched episodes)
    const newTotalEpisodes = (donghua.totalEpisodes || 0) + 1;

    // Add 7 days to the current air date
    const currentAirDate = new Date(donghua.nextEpisodeAirDate);
    const nextAirDate = new Date(
      currentAirDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    // Update the donghua with new air date and total episodes
    donghua.nextEpisodeAirDate = nextAirDate;
    donghua.totalEpisodes = newTotalEpisodes;
    await donghua.save();

    res.json({
      ...donghua.toObject(),
      episodeAired: true,
      newEpisodeNumber: newTotalEpisodes,
      message: `Episode ${newTotalEpisodes} of "${donghua.title}" has been marked as aired! Total episodes: ${newTotalEpisodes}`,
    });
  } catch (err) {
    next(err);
  }
};

// Check and update expired episodes
exports.checkExpiredEpisodes = async (req, res, next) => {
  try {
    const now = new Date();

    // Find all donghua with expired air dates
    const expiredDonghua = await Donghua.find({
      user: req.user.id,
      status: "watching",
      nextEpisodeAirDate: { $lt: now },
    });

    const updatedDonghua = [];

    for (const donghua of expiredDonghua) {
      // Calculate next air date (7 days from the expired date)
      const expiredDate = new Date(donghua.nextEpisodeAirDate);
      const nextAirDate = new Date(
        expiredDate.getTime() + 7 * 24 * 60 * 60 * 1000
      );

      donghua.nextEpisodeAirDate = nextAirDate;
      await donghua.save();

      updatedDonghua.push(donghua);
    }

    res.json({
      message: `Updated ${updatedDonghua.length} expired episodes`,
      updatedDonghua,
    });
  } catch (err) {
    next(err);
  }
};
