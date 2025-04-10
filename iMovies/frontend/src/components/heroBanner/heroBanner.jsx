import React from "react";
import "./heroBanner.scss";
import poster from "../../assets/heroBanner.jpg"; // ✅ Use import

const HeroBanner = () => {
  return (
    <div className="heroBanner">
      <img src={poster} alt="Movie Banner" className="bgImage" />
      <div className="heroContent">
        <h1>Book Your Favorite Movie</h1>
        <p>Choose from the latest movies and reserve your seat now.</p>
      </div>
    </div>
  );
};

export default HeroBanner;
