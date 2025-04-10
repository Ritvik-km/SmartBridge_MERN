const Movie = require("../models/movieModel");
const { v4 } = require("uuid");
const Show = require("../models/showModel");
const Booking = require("../models/bookingModel");
const mongoose = require("mongoose");


module.exports.addMovie = async (req, res, next) => {
  try {
    const {
      name,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
      movieId,
      media,
    } = req.body;

    //check if movie is already added into db
    const lowerCaseName = name.toLowerCase();
    const movie = await Movie.findOne({ movieName: lowerCaseName });

    if (movie)
      return res.json({ status: false, msg: "Movie is already Saved:)" });

    // const genresArray = genres.split(",").map((g) => g.trim().toLowerCase());

    if (!movie) {
      const movieData = {
        movieName: lowerCaseName,
        description,
        genres,
        releaseDate,
        runtime,
        certification,
        shows: [],
        theatres: [],
        movieId,
        media,
      };
      await Movie.create(movieData);

      return res.json({ status: true, msg: "Movie Saved successfully :)" });
    }
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovies = async (req, res, next) => {
  try {
    const { query } = req.query || "";
    const movies = await Movie.find();
    let lowercaseQuery;
    if (query && query.length > 0) {
      lowercaseQuery = query.toLowerCase();
    } else {
      lowercaseQuery = "";
    }
    const filteredMovies = movies.filter((m) =>
      m.movieName.toLowerCase().includes(lowercaseQuery)
    );
    return res.status(200).json({ status: true, movies: filteredMovies });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMovieDetails = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const movie = await Movie.findOne({ movieId });

    return res.json({ status: true, movie });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :)" });
  }
};

module.exports.editMovieDetails = async (req, res) => {
  try {
    const {
      name,
      description,
      genres,
      releaseDate,
      runtime,
      certification,
    } = req.body;

    const { movieId } = req.params;
    const findMovie = await Movie.findOne({ movieId });

    if (!findMovie) {
      return res.status(403).json({ status: false, msg: "Movie not found!" });
    }

    await Movie.updateOne(
      { movieId },
      {
        $set: {
          movieName: name,
          description,
          genres,
          releaseDate,
          runtime,
          certification,
          movieId,
        },
      }
    );

    return res.json({ status: true, msg: "Movie Updated successfully :)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genreName } = req.params;

    const movies = await Movie.find({ genres: { $regex: new RegExp(genreName, "i") } });

    return res.json({ status: true, movies });
  } catch (error) {
    console.error("Error fetching movies by genre:", error);
    return res.status(500).json({ status: false, msg: "Server error" });
  }
};

module.exports.deleteMovie = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Step 1: Find all shows for the movie
    const shows = await Show.find({ movieId });

    // Step 2: Check if any show has active bookings
    const showIds = shows.map((show) => show.showId);
    const existingBookings = await Booking.find({
      showId: { $in: showIds },
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({
        status: false,
        msg: "Cannot delete movie with active bookings for its shows.",
      });
    }

    // Step 3: Delete all related shows
    await Show.deleteMany({ movieId });

    // Step 4: Delete the movie itself
    await Movie.findByIdAndDelete(movieId);

    return res.status(200).json({
      status: true,
      msg: "Movie and its shows deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      status: false,
      msg: "Server error while deleting the movie",
    });
  }
};


