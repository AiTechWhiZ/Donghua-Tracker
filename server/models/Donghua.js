const mongoose = require("mongoose");

const donghuaSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    chineseTitle: { type: String },
    coverImage: { type: String },
    releaseYear: { type: Number },
    studio: { type: String },
    genres: [{ type: String }],
    status: {
      type: String,
      enum: ["plan-to-watch", "watching", "completed", "on-hold", "dropped"],
      default: "plan-to-watch",
    },
    totalEpisodes: { type: Number },
    watchedEpisodes: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    notes: { type: String },
    synopsis: { type: String },
    nextEpisodeAirDate: { type: Date },
    episodeAirDay: { type: String }, // Day of the week when episodes air
  },
  { timestamps: true }
);

module.exports = mongoose.model("Donghua", donghuaSchema);
