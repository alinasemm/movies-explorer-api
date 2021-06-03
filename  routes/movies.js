const router = require('express').Router();
const { getSavedMovies, createMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getSavedMovies);

router.post('/movies', createMovie);

router.delete('/movies/movieId', deleteMovie);

module.exports = router;
