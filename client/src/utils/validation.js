export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateUsername = (username) => {
  return username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username);
};

export const validateDonghuaForm = (formData) => {
  const errors = {};

  if (!formData.title || formData.title.trim() === "") {
    errors.title = "Title is required";
  }

  if (formData.releaseYear && isNaN(formData.releaseYear)) {
    errors.releaseYear = "Year must be a number";
  }

  if (formData.totalEpisodes && isNaN(formData.totalEpisodes)) {
    errors.totalEpisodes = "Total episodes must be a number";
  }

  if (formData.watchedEpisodes && isNaN(formData.watchedEpisodes)) {
    errors.watchedEpisodes = "Watched episodes must be a number";
  }

  if (
    formData.totalEpisodes &&
    formData.watchedEpisodes > formData.totalEpisodes
  ) {
    errors.watchedEpisodes =
      "Watched episodes cannot be greater than total episodes";
  }

  return errors;
};
