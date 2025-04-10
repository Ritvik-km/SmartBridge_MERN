import React from "react";
import dayjs from "dayjs";
import { MdModeEditOutline } from "react-icons/md";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const Show = ({ data }) => {
  console.log(data)
  let { movieName, releaseDate, movieId, media } = data;
  const navigate = useNavigate();
  movieName = movieName[0].toUpperCase() + movieName.slice(1);

  return (
    <li onClick={() => navigate(`/showdetails/${movieId}`)} className="show">
      <div>
        <div className="imageContainer">
          <img className="image" src={media} alt={movieName} />
        </div>
        <p className="name">{movieName}</p>
        <p>{dayjs(releaseDate).format("MMM D, YYYY")}</p>
      </div>
    </li>
  );
};

export default Show;
