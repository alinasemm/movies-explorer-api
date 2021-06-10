const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (imageUrl) => /^https?:\/\/(www.)?[\d\w-._~:/?#[\]@!$&'()*+,;=]+#?/g.test(imageUrl),
      message: 'Некорректная ссылка на изображение',
    },
  },
  trailer: {
    type: String,
    required: true,
    validate: {
      validator: (trailerUrl) => /^https?:\/\/(www.)?[\d\w-._~:/?#[\]@!$&'()*+,;=]+#?/g.test(trailerUrl),
      message: 'Некорректная ссылка на трейлер',
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (thumbnailUrl) => /^https?:\/\/(www.)?[\d\w-._~:/?#[\]@!$&'()*+,;=]+#?/g.test(thumbnailUrl),
      message: 'Некорректная ссылка на миниатюрное изображение постера к фильму',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Movie', movieSchema);
