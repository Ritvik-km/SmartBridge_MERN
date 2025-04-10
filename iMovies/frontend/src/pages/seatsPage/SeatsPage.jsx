import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import Cookies from "js-cookie";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { v4 } from "uuid";
import { useNavigate, useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import { toast, ToastContainer } from "react-toastify";
import Loader from "../../components/loader/Loader";
import "./style.scss";
import Checkout from "../checkoutPage/Checkout";
import { render } from "../../host";
import useSWR from "swr";

const SeatsPage = () => {
  const { showId, theatreName } = useParams();
  const [payment, setPayment] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState({
    balcony: [],
    middle: [],
    lower: [],
  });

  const { resData, loading } = useFetch(
    `/api/theatre/gettheatre/${theatreName}`
  );

  const getSeatsData = async (url) => {
    const { data } = await axios.get(url);
    if (data?.status) {
      return data?.show?.tickets;
    }
    return [];
  };

  const {
    data: seatsData,
    loading: seatsLoading,
    mutate,
  } = useSWR(`${render}/api/shows/getshow/${showId}`, getSeatsData);

  const bookedSeats = {
    balcony: Object.keys(seatsData?.balcony || {}).map(Number),
    middle: Object.keys(seatsData?.middle || {}).map(Number),
    lower: Object.keys(seatsData?.lower || {}).map(Number),
  };

  const updateSelectedSeats = (section, seatNumber) => {
    const isSelected = selectedSeats[section].includes(seatNumber);
    if (isSelected) {
      setSelectedSeats((prev) => ({
        ...prev,
        [section]: prev[section].filter((seat) => seat !== seatNumber),
      }));
    } else if (selectedSeats[section].length < 5) {
      setSelectedSeats((prev) => ({
        ...prev,
        [section]: [...prev[section], seatNumber],
      }));
    }
  };

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
    closeOnClick: true,
  };

  if (resData?.data?.status === false) {
    toast.error(resData?.data?.msg, toastOptions);
  }

  const theatreDetails = resData?.data?.theatre;

  const navigate = useNavigate();

  useEffect(() => {
    const jwtToken = Cookies.get("jwtToken");
    if (!jwtToken) {
      navigate("/login");
    }
  }, []);

  const generateLiTags = (section, totalSeats) => {
    const sectionKey = section.toLowerCase();
    return Array.from({ length: totalSeats }, (_, index) => {
      const seatNum = index + 1;
      return (
        <li
          key={seatNum}
          className={bookedSeats[sectionKey].includes(seatNum) ? "disable" : ""}
          style={{
            backgroundColor: selectedSeats[sectionKey].includes(seatNum)
              ? "crimson"
              : "",
          }}
          onClick={() =>
            !bookedSeats[sectionKey].includes(seatNum) &&
            updateSelectedSeats(sectionKey, seatNum)
          }
        ></li>
      );
    });
  };

  const handleCheckout = async () => {
    try {
      const jwtToken = Cookies.get("jwtToken");
      const { userDetails } = jwtDecode(jwtToken);

      const bookedSeatDetails = {
        balcony: {},
        middle: {},
        lower: {},
      };

      selectedSeats.balcony.forEach((s) => {
        bookedSeatDetails.balcony[s] = { userEmail: userDetails?.email };
      });
      selectedSeats.middle.forEach((s) => {
        bookedSeatDetails.middle[s] = { userEmail: userDetails?.email };
      });
      selectedSeats.lower.forEach((s) => {
        bookedSeatDetails.lower[s] = { userEmail: userDetails?.email };
      });

      bookedSeatDetails.balcony["total"] =
        selectedSeats.balcony.length * theatreDetails?.balconySeatPrice;
      bookedSeatDetails.middle["total"] =
        selectedSeats.middle.length * theatreDetails?.middleSeatPrice;
      bookedSeatDetails.lower["total"] =
        selectedSeats.lower.length * theatreDetails?.lowerSeatPrice;

      const bookingApi = `${render}/api/bookings/addbooking`;
      const { data } = await axios.post(
        bookingApi,
        {
          showId,
          bookingId: v4(),
          ticketsData: bookedSeatDetails,
        },
        {
          headers: {
            "auth-token": jwtToken,
          },
        }
      );

      // Remove totals before updating show tickets
      delete bookedSeatDetails.balcony.total;
      delete bookedSeatDetails.middle.total;
      delete bookedSeatDetails.lower.total;

      const res = await axios.put(
        `${render}/api/shows/updateshowtickets/${showId}`,
        bookedSeatDetails
      );

      if (res?.data.status) {
        mutate();
        setPayment(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (payment) {
    return (
      <Checkout
        selectedSeats={selectedSeats}
        showId={showId}
        theatreName={theatreName}
      />
    );
  }

  return (
    <>
      <Header />
      {!loading && !seatsLoading ? (
        <div className="seatsPageContainer">
          <div className="wrapper">
            <p className="seatType">Balcony Seats</p>
            <ul className="seats">
              {generateLiTags("balcony", theatreDetails?.balconySeats)}
            </ul>

            <p className="seatType">Middle Class Seats</p>
            <ul className="seats">
              {generateLiTags("middle", theatreDetails?.middleSeats)}
            </ul>

            <p className="seatType">Lower Class Seats</p>
            <ul className="seats">
              {generateLiTags("lower", theatreDetails?.lowerSeats)}
            </ul>

            <div className="row">
              <div className="col">
                <p>Balcony Seats Price:</p>
                <span>
                  {selectedSeats.balcony.length *
                    theatreDetails?.balconySeatPrice}{" "}
                  ₹/-
                </span>
              </div>
              <div className="col">
                <p>Middle Seats Price:</p>
                <span>
                  {selectedSeats.middle.length *
                    theatreDetails?.middleSeatPrice}{" "}
                  ₹/-
                </span>
              </div>
              <div className="col">
                <p>Lower Seats Price:</p>
                <span>
                  {selectedSeats.lower.length *
                    theatreDetails?.lowerSeatPrice}{" "}
                  ₹/-
                </span>
              </div>
            </div>

            <button
              className={
                selectedSeats.balcony.length === 0 &&
                selectedSeats.middle.length === 0 &&
                selectedSeats.lower.length === 0
                  ? "disable"
                  : ""
              }
              onClick={handleCheckout}
            >
              Pay{" "}
              {selectedSeats.lower.length * theatreDetails?.lowerSeatPrice +
                selectedSeats.middle.length * theatreDetails?.middleSeatPrice +
                selectedSeats.balcony.length *
                  theatreDetails?.balconySeatPrice}{" "}
              ₹/-
            </button>
          </div>
        </div>
      ) : (
        <div className="loadingContainer">
          <Loader />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default SeatsPage;
