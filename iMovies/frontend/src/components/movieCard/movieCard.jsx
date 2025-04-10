import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./movieCard.scss";
import { ThemeContext } from "../../context/themeContext";

const MovieCard = ({ data }) => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  // Guard clause: Don't render if essential data is missing
  if (!data || !data.media || !data.movieName || !data.movieId) {
    console.warn("Invalid movie data passed to MovieCard:", data);
    return null;
  }

  const handleClick = () => {
    navigate(`/showdetails/${data.movieId}`);
  };

  return (
    <div className={`movieCard ${theme}`} onClick={handleClick}>
      <div className="imageContainer">
        <img src={data.media} alt={data.movieName} />
      </div>
      <div className="info">
        <h4>{data.movieName}</h4>
        <p>{data.description?.slice(0, 80)}...</p>
      </div>
    </div>
  );
};

export default MovieCard;
