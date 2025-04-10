import React from "react";
import "./style.scss";

const Genres = ({ data }) => {
  let genreArray = Array.isArray(data)
    ? data
    : typeof data === "string"
    ? data.split(",").map((g) => g.trim())
    : [];

  return (
    <div className="genres">
      {genreArray.map((g, i) => {
        const genre = g?.charAt(0).toUpperCase() + g?.slice(1);
        return (
          <div key={i} className="genre">
            {genre}
          </div>
        );
      })}
    </div>
  );
};


export default Genres;
