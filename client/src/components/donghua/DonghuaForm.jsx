import { useState } from "react";
import Button from "../common/Button";
import FormInput from "../common/FormInput";
import FormSelect from "../common/FormSelect";

const DonghuaForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    chineseTitle: "",
    coverImage: "",
    synopsis: "",
    releaseYear: "",
    studio: "",
    genres: [],
    status: "plan-to-watch",
    totalEpisodes: "",
    watchedEpisodes: 0,
    rating: 0,
    notes: "",
    nextEpisodeAirDate: "",
    episodeAirDay: "",
    ...initialData,
  });

  const [errors, setErrors] = useState({});
  const [genreInput, setGenreInput] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);

  const statusOptions = [
    { value: "plan-to-watch", label: "Plan to Watch" },
    { value: "watching", label: "Watching" },
    { value: "completed", label: "Completed" },
    { value: "on-hold", label: "On Hold" },
    { value: "dropped", label: "Dropped" },
  ];

  const genreOptions = [
    { value: "Xianxia", label: "Xianxia" },
    { value: "Wuxia", label: "Wuxia" },
    { value: "Supernatural", label: "Supernatural" },
    { value: "Sci-fi", label: "Sci-fi" },
    { value: "Romance", label: "Romance" },
    { value: "Comedy", label: "Comedy" },
    { value: "Action", label: "Action" },
    { value: "Thriller", label: "Thriller" },
    { value: "Historical", label: "Historical" },
    { value: "Demons", label: "Demons" },
    { value: "Fantasy", label: "Fantasy" },
    { value: "Magic", label: "Magic" },
    { value: "School", label: "School" },
    { value: "Adventure", label: "Adventure" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Auto-calculate episode air day when next episode air date is set
    if (name === "nextEpisodeAirDate" && value) {
      const airDate = new Date(value);
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const dayName = days[airDate.getDay()];
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        episodeAirDay: dayName,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (
      formData.releaseYear &&
      (formData.releaseYear < 1900 || formData.releaseYear > 2100)
    ) {
      newErrors.releaseYear = "Release year must be between 1900 and 2100";
    }

    if (formData.totalEpisodes && formData.totalEpisodes < 1) {
      newErrors.totalEpisodes = "Total episodes must be at least 1";
    }

    if (formData.watchedEpisodes < 0) {
      newErrors.watchedEpisodes = "Watched episodes cannot be negative";
    }

    if (
      formData.totalEpisodes &&
      formData.watchedEpisodes > formData.totalEpisodes
    ) {
      newErrors.watchedEpisodes =
        "Watched episodes cannot exceed total episodes";
    }

    if (formData.rating && (formData.rating < 0 || formData.rating > 10)) {
      newErrors.rating = "Rating must be between 0 and 10";
    }

    // Validate next episode air date
    if (formData.nextEpisodeAirDate) {
      const airDate = new Date(formData.nextEpisodeAirDate);
      const now = new Date();
      if (airDate < now) {
        newErrors.nextEpisodeAirDate =
          "Next episode air date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenreRemove = (genreToRemove) => {
    setFormData({
      ...formData,
      genres: formData.genres.filter((genre) => genre !== genreToRemove),
    });
  };

  const handleGenreInputChange = (e) => {
    const value = e.target.value;
    setGenreInput(value);

    // Filter genre options based on input
    const filteredOptions = genreOptions.filter((option) =>
      option.label.toLowerCase().includes(value.toLowerCase())
    );

    // If there's an exact match, select it
    const exactMatch = filteredOptions.find(
      (option) => option.label.toLowerCase() === value.toLowerCase()
    );

    if (exactMatch) {
      setSelectedGenre(exactMatch.value);
    } else {
      setSelectedGenre("");
    }
  };

  const handleGenreSelect = (genreValue) => {
    if (genreValue && !formData.genres.includes(genreValue)) {
      setFormData({
        ...formData,
        genres: [...formData.genres, genreValue],
      });
    }
    setGenreInput("");
    setSelectedGenre("");
    setIsGenreDropdownOpen(false);
  };

  const handleGenreInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (genreInput.trim()) {
        // If it's a custom genre, add it directly
        if (
          !genreOptions.find((option) => option.value === genreInput.trim())
        ) {
          handleGenreSelect(genreInput.trim());
        } else {
          // If it's a predefined genre, add it
          handleGenreSelect(genreInput.trim());
        }
      }
    } else if (e.key === "Escape") {
      setIsGenreDropdownOpen(false);
    }
  };

  const handleGenreInputFocus = () => {
    setIsGenreDropdownOpen(true);
  };

  const handleGenreInputBlur = () => {
    // Delay hiding to allow for clicks on dropdown items
    setTimeout(() => {
      setIsGenreDropdownOpen(false);
    }, 200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Title (English)"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter the English title"
            required
            error={errors.title}
          />

          <FormInput
            label="Title (Chinese)"
            name="chineseTitle"
            type="text"
            value={formData.chineseTitle}
            onChange={handleChange}
            placeholder="Enter the Chinese title (optional)"
            error={errors.chineseTitle}
          />
        </div>

        <FormInput
          label="Cover Image URL"
          name="coverImage"
          type="text"
          value={formData.coverImage}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
          error={errors.coverImage}
        />

        <FormInput
          label="Synopsis"
          name="synopsis"
          type="textarea"
          value={formData.synopsis}
          onChange={handleChange}
          placeholder="Enter a brief description of the donghua..."
          rows="4"
          error={errors.synopsis}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormInput
            label="Release Year"
            name="releaseYear"
            type="number"
            value={formData.releaseYear}
            onChange={handleChange}
            placeholder="2024"
            min="1900"
            max="2100"
            error={errors.releaseYear}
          />

          <FormInput
            label="Studio"
            name="studio"
            type="text"
            value={formData.studio}
            onChange={handleChange}
            placeholder="Studio name"
            error={errors.studio}
          />

          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            options={statusOptions}
            error={errors.status}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Total Episodes"
            name="totalEpisodes"
            type="number"
            value={formData.totalEpisodes}
            onChange={handleChange}
            placeholder="12"
            min="1"
            error={errors.totalEpisodes}
          />

          <FormInput
            label="Watched Episodes"
            name="watchedEpisodes"
            type="number"
            value={formData.watchedEpisodes}
            onChange={handleChange}
            placeholder="0"
            min="0"
            max={formData.totalEpisodes || ""}
            error={errors.watchedEpisodes}
          />
        </div>

        {/* Next Episode Air Date Section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
            Next Episode Schedule
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput
              label="Next Episode Air Date"
              name="nextEpisodeAirDate"
              type="datetime-local"
              value={formData.nextEpisodeAirDate}
              onChange={handleChange}
              error={errors.nextEpisodeAirDate}
              helpText="Set when the next episode will air. Future episodes will air weekly on the same day."
            />

            {formData.episodeAirDay && (
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Episodes will air on
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {formData.episodeAirDay}s
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Genres
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.genres.map((genre) => (
              <span
                key={genre}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-700"
              >
                {genre}
                <button
                  type="button"
                  onClick={() => handleGenreRemove(genre)}
                  className="ml-2 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Merged Genre Input */}
          <div className="relative">
            <input
              type="text"
              value={genreInput}
              onChange={handleGenreInputChange}
              onKeyDown={handleGenreInputKeyDown}
              onFocus={handleGenreInputFocus}
              onBlur={handleGenreInputBlur}
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-all duration-300"
              placeholder="Type to search genres or add custom genre..."
            />

            {/* Dropdown */}
            {isGenreDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {genreInput.trim() && (
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b border-gray-200 dark:border-gray-600"
                    onClick={() => handleGenreSelect(genreInput.trim())}
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Add "{genreInput.trim()}" (custom)
                    </span>
                  </div>
                )}

                {genreOptions
                  .filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(genreInput.toLowerCase())
                  )
                  .map((option) => (
                    <div
                      key={option.value}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      onClick={() => handleGenreSelect(option.value)}
                    >
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {option.label}
                      </span>
                    </div>
                  ))}

                {genreInput.trim() &&
                  genreOptions.filter((option) =>
                    option.label
                      .toLowerCase()
                      .includes(genreInput.toLowerCase())
                  ).length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                      No matching genres found
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>

        <FormInput
          label="Rating"
          name="rating"
          type="number"
          value={formData.rating}
          onChange={handleChange}
          placeholder="Enter rating (0-10)"
          min="0"
          max="10"
          step="0.1"
          error={errors.rating}
        />

        <FormInput
          label="Notes"
          name="notes"
          type="textarea"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add your thoughts about this donghua..."
          rows="4"
          error={errors.notes}
        />

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="px-8 py-3">
            {initialData._id ? "Update" : "Add"} Donghua
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DonghuaForm;
