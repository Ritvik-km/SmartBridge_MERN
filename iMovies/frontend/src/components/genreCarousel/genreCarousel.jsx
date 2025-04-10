import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./genreCarousel.scss";

const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Thriller",
  "Horror",
  "Romance",
  "Sci-Fi",
  "Animation",
  "Fantasy",
  "Adventure",
];

const GenreCarousel = () => {
  const navigate = useNavigate();

  const handleClick = (genre) => {
    navigate(`/genre/${genre.toLowerCase()}`);
    // Later: you can fetch movies from backend here
  };

  return (
    <div className="genreCarousel">
      <h2>Explore by Genre</h2>
      <Swiper
        modules={[Navigation]}
        spaceBetween={15}
        slidesPerView={5}
        navigation
        breakpoints={{
          320: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          1024: { slidesPerView: 5 },
        }}
      >
        {genres.map((genre) => (
          <SwiperSlide key={genre} onClick={() => handleClick(genre)}>
            <div className="genreCard">{genre}</div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default GenreCarousel;
