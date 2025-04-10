import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Show from "../../components/show/Show";
import { Link } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import "./style.scss";
import Loader from "../../components/loader/Loader";
import { searchContext } from "../../context/searchContext";
import HeroBanner from "../../components/heroBanner/heroBanner";
import MovieCarousel from "../../components/movieCarousel/movieCarousel";
import GenreCarousel from "../../components/genreCarousel/genreCarousel";


const Home = () => {
  const { query } = useContext(searchContext);
  const { resData, error, loading } = useFetch(`/api/movie/getmovies`, {
    query,
  });

  if (error) {
    alert("Something went wrong!");
  }

  return (
    <>
      <Header />
      <HeroBanner />
      <div className="homeContainer">
        <div className="home">
          {loading ? (
            <div className="loadingContainer">
              <Loader />
            </div>
          ) : (
            <>
              <GenreCarousel />
              <MovieCarousel movies={resData?.data?.movies} />
            </>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
