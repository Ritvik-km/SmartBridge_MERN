const router = require("express").Router();
const fetchUser = require("../middlewares/fetchUser");
const {
  addMovie,
  getMovies,
  getMovieDetails,
  editMovieDetails,
  getMoviesByGenre,
  deleteMovie,
} = require("../controllers/movieController");
const fetchAdmin = require("../middlewares/fetchAdmin");

router.post("/addmovie", fetchAdmin, addMovie);
router.get("/getmoviedetails/:movieId", getMovieDetails);
router.get("/getmovies", getMovies);
router.put("/editmovie/:movieId", editMovieDetails);
router.get("/genre/:genreName", getMoviesByGenre);
router.delete("/deletemovie/:movieId", deleteMovie);


module.exports = router;
