import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Show from "../show/Show";
import "./movieCarousel.scss";

const MovieCarousel = ({ movies }) => {
  return (
    <div className="movieCarousel">
      <h2>Now Showing</h2>
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={4}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          320: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 4 },
        }}
      >
        {movies?.slice(0, 10)?.map((movie) => (
          <SwiperSlide key={movie._id}>
            <Show data={movie} />
          </SwiperSlide>
        ))}
      </Swiper>
      

    </div>
  );
};

export default MovieCarousel;
