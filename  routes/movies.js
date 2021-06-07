const router = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/', getSavedMovies);

router.post('/', createMovie);

router.delete('/:movieId', deleteMovie);

module.exports = router;
