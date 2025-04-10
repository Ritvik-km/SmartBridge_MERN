const renderSeats = (seatType, bookedSeats, selectedSeats, handleSeatClick, totalRows, seatsPerRow) => {
    let seatElements = [];
  
    for (let row = 0; row < totalRows; row++) {
      let rowSeats = [];
      for (let col = 1; col <= seatsPerRow; col++) {
        let seatNumber = row * seatsPerRow + col;
        rowSeats.push(
          <li
            className={bookedSeats.includes(String(seatNumber)) ? "disable" : ""}
            style={{
              backgroundColor: selectedSeats.includes(seatNumber) ? "crimson" : "",
            }}
            onClick={() => handleSeatClick(seatNumber)}
            key={seatNumber}
          >
            {seatNumber}
          </li>
        );
      }
      seatElements.push(<ul className="seat-row" key={row}>{rowSeats}</ul>);
    }
  
    return seatElements;
  };
  