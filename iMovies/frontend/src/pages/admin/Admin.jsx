import React, { useEffect, useState, useContext } from "react";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { ToastContainer, toast } from "react-toastify";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiCameraMovie } from "react-icons/bi";
import Loader from "../../components/loader/Loader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { render } from "../../host";
import "./style.scss";
import { ThemeContext } from "../../context/themeContext";

const Admin = () => {
  const navigate = useNavigate();
  const adminToken = Cookies.get("adminJwtToken");
  const { theme } = useContext(ThemeContext);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: theme,
    closeOnClick: true,
  };

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMovie, setExpandedMovie] = useState(null);

  const fetchMovies = async () => {
    try {
      const res = await axios.get(`${render}/api/movie/getmovies`, {
        headers: {
          "auth-token": adminToken,
        },
      });
      if (res.data.status) {
        setMovies(res.data.movies);
      } else {
        toast.error("Failed to fetch movies", toastOptions);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieShows = async (movieId) => {
    try {
      const res = await axios.get(`${render}/api/shows/getmovieshows/${movieId}`);
      console.log("Fetched shows:", res.data.showData);
      return res.data.showData || [];
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const handleDeleteMovie = async (movieId) => {
    try {
      const res = await axios.delete(`${render}/api/movie/deletemovie/${movieId}`);
      if (res.data.status) {
        toast.success(res.data.msg, toastOptions);
        fetchMovies();
      } else {
        toast.error(res.data.msg, toastOptions);
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error", toastOptions);
    }
  };

  const handleDeleteShow = async (movieId, showId) => {
  try {
    const res = await axios.delete(`${render}/api/shows/deleteshow/${movieId}/${showId}`);
    if (res.data.status) {
      toast.success(res.data.msg, toastOptions);
      const updatedShows = await fetchMovieShows(movieId);
      setMovies((prev) =>
        prev.map((m) =>
          m._id === movieId ? { ...m, shows: updatedShows } : m
        )
      );
    } else {
      toast.error(res.data.msg, toastOptions);
    }
  } catch (err) {
    console.error(err);
  }
};


  const toggleShowList = async (mongoId, movieId) => {
    if (expandedMovie === mongoId) {
      setExpandedMovie(null);
      return;
    }
  
    const shows = await fetchMovieShows(movieId);
    setMovies((prev) =>
      prev.map((m) => (m._id === mongoId ? { ...m, shows } : m))
    );
    setExpandedMovie(mongoId);
    return;
  

    // const shows = await fetchMovieShows(movieId);
    // setMovies((prev) =>
    //   prev.map((m) => (m._id === movieId ? { ...m, shows } : m))
    // );
    // setExpandedMovie(movieId);
  };

  useEffect(() => {
    if (!adminToken) {
      navigate("/admin/login");
    } else {
      fetchMovies();
    }
  }, []);

  return (
    <>
      <AdminHeader />
       <div className={`adminContainer ${theme}`}>
        {!loading ? (
          <div className="wrapper">
            <h1>
              Admin <span>Movies</span>
            </h1>
            {movies.length > 0 ? (
              <ul className="adminMovies">
                {movies.map((movie) => (
                  <li key={movie._id}>
                    <div className="movieHeader">
                      <div className="movieInfo">
                        <img src={movie.media} alt={movie.movieName} className="moviePoster" />
                        <div>
                          <h2>{movie.movieName}</h2>
                          <p className="releaseDate">Release Date: {movie.releaseDate}</p>
                        </div>
                      </div>
                      <div className="actions">
                        <button
                          className="edit"
                          onClick={() => navigate(`/admin/editmovie/${movie._id}`)}
                        >
                          <AiOutlineEdit />
                        </button>
                        <button
                          className="delete"
                          onClick={() => handleDeleteMovie(movie._id)}
                        >
                          <AiOutlineDelete />
                        </button>
                        <button
                          className="toggleShows"
                          onClick={() => toggleShowList(movie._id, movie.movieId)}
                        >
                          {expandedMovie === movie._id ? "Hide Shows" : "Show Shows"}
                        </button>
                      </div>
                    </div>

                    {expandedMovie === movie._id && (
                      <ul className="movieShows">
                        {movie.shows && movie.shows.length > 0 ? (
                          movie.shows.map((show) => (
                            <li key={show.showId}>
                              <BiCameraMovie />
                              <div className="details">
                                <p><strong>Theatre:</strong> {show.theatreName}</p>
                                <p><strong>Date:</strong> {show.showdate}</p>
                                <p><strong>Time:</strong> {show.showtime}</p>
                              </div>
                              <button
                                onClick={() =>
                                  handleDeleteShow(movie._id, movie.movieId, show.showId)
                                }
                                className="deleteShow"
                              >
                                <AiOutlineDelete />
                              </button>
                            </li>
                          ))
                        ) : (
                          <p>No shows found</p>
                        )}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="noShowsContainer">
                <h2>No Movies Found</h2>
              </div>
            )}
          </div>
        ) : (
          <div className="loadingContainer">
            <Loader />
          </div>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default Admin;
