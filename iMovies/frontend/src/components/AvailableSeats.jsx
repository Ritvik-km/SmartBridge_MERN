import React, { useState } from "react";
import axios from "axios";

const AvailableSeats = ({ showId }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const fetchSeats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/available-seats/${showId}`);
      if (data.status) {
        setSeats(data.seats);
      } else {
        alert("Failed to fetch seats");
      }
    } catch (error) {
      console.error(error);
      alert("Error fetching seats");
    } finally {
      setLoading(false);
    }
  };

  const handleBuyTickets = () => {
    setShowModal(true);
    fetchSeats();
  };

  return (
    <div>
      <button onClick={handleBuyTickets}>Buy Tickets</button>

      {showModal && (
        <div className="modal">
          <div className="modalContent">
            <h2>Available Seats</h2>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <ul>
                {seats.map((seat) => (
                  <li key={seat.id}>{seat.seatNumber}</li>
                ))}
              </ul>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvailableSeats;