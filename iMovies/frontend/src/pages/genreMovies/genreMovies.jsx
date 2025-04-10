import React, { useEffect, useState, useContext } from "react";
import "./genreMovies.scss";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../../components/loader/Loader";
import { render } from "../../host";
import MovieCard from "../../components/movieCard/movieCard";
import { ThemeContext } from "../../context/themeContext";

const GenreMovies = () => {
  const { genreName } = useParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const getGenreMovies = async () => {
    try {
      const { data } = await axios.get(`${render}/api/movie/genre/${genreName}`);
      if (data.status) {
        setMovies(data.movies);
      }
      setLoading(false);
    } catch (err) {
      console.log("Error fetching genre movies:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getGenreMovies();
  }, [genreName]);

  return (
    <div className={theme}>
      <Header />
      <div className="genreMoviesContainer">
        <h2 className="pageTitle">
          {genreName[0].toUpperCase() + genreName.slice(1)} Movies
        </h2>

        {loading ? (
          <div className="loadingContainer">
            <Loader />
          </div>
        ) : movies.length > 0 ? (
          <div className="moviesGrid">
            {movies.map((movie, index) =>
                movie && movie.media && movie.movieName && movie.movieId ? (
                    <MovieCard key={movie._id || index} data={movie} />
                ) : null
            )}

          </div>
        ) : (
          <p className="noMoviesText">No movies found in this genre.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default GenreMovies;
