import React, { useEffect, useState } from "react";
import "./style.scss";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import Cookies from "js-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import AdminHeader from "../../components/adminHeader/AdminHeader";
import { render } from "../../host";
import AdminMovies from "../adminMovies/AdminMovies";
import useSWR from "swr";
import Loader from "../../components/loader/Loader";

const toastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  pauseOnHover: true,
  draggable: true,
  theme: "dark",
  closeOnClick: true,
};

const AddMovie = () => {
  const [movieDetails, setMovieDetails] = useState({
    name: "",
    description: "",
    genres: "",
    releaseDate: "",
    runtime: "",
    certification: "",
    media: "",
  });
  const [editMovie, setEditMovie] = useState("");
  const [loadingForm, setLoadingForm] = useState(false);
  const navigate = useNavigate();

  const fetcher = async (url) => {
    try {
      const { data } = await axios.get(url);
      if (data.status) {
        return data.movies;
      } else {
        toast.error(data.msg, toastOptions);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const {
    data: movies,
    loading,
    error,
    mutate,
  } = useSWR(`${render}/api/movie/getmovies`, fetcher);

  useEffect(() => {
    const jwtToken = Cookies.get("adminJwtToken");
    if (!jwtToken) {
      navigate("/admin/login");
    }
  }, []);

  const handleValidation = () => {
    const { name, description, genres, releaseDate, runtime, certification } =
      movieDetails;

    if (name === "") {
      toast.error("Enter name of movie!", toastOptions);
      return false;
    } else if (description === "") {
      toast.error("Enter Description of movie!", toastOptions);
      return false;
    } else if (genres === "") {
      toast.error("Enter genres of movie!", toastOptions);
      return false;
    } else if (releaseDate === "") {
      toast.error("Enter release date of movie!", toastOptions);
      return false;
    } else if (runtime === null) {
      toast.error("Enter runtime of movie!", toastOptions);
      return false;
    } else if (certification === "") {
      toast.error("Enter certification of movie!", toastOptions);
      return false;
    }
    return true;
  };

  const onClickEdit = async () => {
    try {
      setLoadingForm(true);
      const url = `${render}/api/movie/getmoviedetails/${editMovie}`;
      const { data } = await axios.get(url);
      console.log(data);
      if (data.status) {
        const {
          movieName,
          description,
          genres,
          releaseDate,
          runtime,
          certification,
        } = data.movie;
        const editMovieData = {
          name: movieName || "",
          description: description || "",
          genres: genres?.join(", ") || "",
          releaseDate: releaseDate || "",
          runtime: runtime || "",
          certification: certification || "",
          media: data.movie.media || "",
        };
        setMovieDetails(editMovieData);
        setLoadingForm(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (editMovie) {
      onClickEdit();
    } else {
    setMovieDetails({
      name: "",
      description: "",
      genres: "",
      releaseDate: "",
      runtime: "",
      certification: "",
    });
    }
  }, [editMovie]);

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const url = `${render}/api/movie/editmovie/${editMovie}`;
      if (handleValidation()) {
        const { data } = await axios.put(url, {
          ...movieDetails,
          genres: movieDetails.genres.split(",").map((g) => g.trim()),
        });

        if (data.status) {
          toast.success(data.msg, toastOptions);
          mutate();
        } else {
          toast.error(data.msg, toastOptions);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidation()) {
      try {
        const host = `${render}/api/movie/addmovie`;
        const jwtToken = Cookies.get("adminJwtToken");
        const res = await axios.post(
          host,
          {
            movieId: v4(),
          ...movieDetails,
            genres: movieDetails.genres.split(",").map((g) => g.trim()),
          },
          {
          headers: {
            "auth-token": jwtToken, 
          },
          }
        );
        // console.log(res);
  
        const { status, msg } = res.data;
        setMovieDetails({
          name: "",
          description: "",
          genres: "",
          releaseDate: "",
          runtime: "",
          certification: "",
        });
        if (status === true) {
          toast.success(msg, toastOptions);
        } else {
          toast.error(msg, toastOptions);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const handleChange = (e) => {
    const val = e.target.value;
    setMovieDetails({ ...movieDetails, [e.target.name]: val });
  };

  return (
    <>
      <AdminHeader />

      {loadingForm ? (
        <div className="loadingContainer">
          <Loader />
        </div>
      ) : (
        <div className="addMovie">
          <form
            onSubmit={editMovie ? handleEdit : handleSubmit}
            className="showDetailsForm"
          >
            <div className="details">
              <h3>
                {editMovie ? "Edit" : "Add"}{" "}
                <span style={{ color: "crimson" }}>Movie</span>
              </h3>

              <div className="inputContainer">
                <label htmlFor="media">Thumbnail Link</label>
                <input
                  value={movieDetails.media || ""}
                  onChange={handleChange}
                  placeholder="Enter thumbnail link"
                  name="media"
                  type="text"
                  id="media"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="name">Movie</label>
                <input
                  value={movieDetails.name || ""}
                  onChange={handleChange}
                  placeholder="Enter movie name"
                  name="name"
                  type="text"
                  id="name"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="desc">Description</label>
                <input
                  value={movieDetails.description || ""}
                  onChange={handleChange}
                  placeholder="Enter movie description"
                  name="description"
                  id="desc"
                  type="text"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="genre">Genres</label>
                <input
                  value={movieDetails.genres || ""}
                  onChange={handleChange}
                  placeholder="Enter movie genres separated by comma."
                  name="genres"
                  type="text"
                  id="genre"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="releasedate">Release Date</label>
                <input
                  value={movieDetails.releaseDate || ""}
                  onChange={handleChange}
                  name="releaseDate"
                  type="date"
                  id="releasedate"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="time">Runtime</label>
                <input
                  value={movieDetails.runtime || ""}
                  onChange={handleChange}
                  placeholder="Enter runtime in minutes"
                  name="runtime"
                  type="number"
                  id="time"
                />
              </div>

              <div className="inputContainer">
                <label htmlFor="certification">Certification</label>
                <input
                  value={movieDetails.certification || ""}
                  onChange={handleChange}
                  placeholder="Enter movie certification"
                  name="certification"
                  type="text"
                  id="certification"
                />
              </div>
              <button type="submit">{editMovie ? "Save" : "Submit"}</button>
            </div>
          </form>
        </div>
      )}

      {movies?.length > 0 && (
        <>
          <h1
            style={{
              textAlign: "center",
              backgroundColor: "crimson",
              color: "white",
            }}
          >
            Now Screening
          </h1>
          <AdminMovies
            movies={movies}
            loading={loading}
            setEditMovie={setEditMovie}
          />
          </>
      )}
      <ToastContainer />
    </>
  );
};

export default AddMovie;
