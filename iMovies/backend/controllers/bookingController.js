const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");
const Movie = require("../models/movieModel");

module.exports.addBooking = async (req, res) => {
  try {
    const { bookingId, showId, ticketsData } = req.body;
    console.log(ticketsData);
    const userEmail = req.user.userDetails.email;
    await Booking.create({
      bookingId,
      userEmail,
      showId,
      ticketsData,
    });

    return res.json({ status: true, msg: "Tickets booked successfully:)" });
  } catch (error) {
    console.log(error);
    return res.json({ status: false, msg: "Server issue :(" });
  }
};

module.exports.getBookings = async (req, res) => {
  try {
    const userEmail = req.user.userDetails.email;
    const getBookings = await Booking.find({ userEmail });

    const bookings = await Promise.all(
      getBookings.map(async (b) => {
        const show = await Show.findOne({ showId: b.showId });
        if (!show) {
          console.warn(`No show found for showId: ${b.showId}`);
          return null; // Skip this booking if show is missing
        }

        const movie = await Movie.findOne({ movieId: show.movieId });
        if (!movie) {
          console.warn(`No movie found for movieId: ${show.movieId}`);
          return null; // Skip this booking if movie is missing
        }

        return {
          bookingId: b.bookingId,
          userEmail,
          ticketsData: b.ticketsData,
          theatreName: show.theatreName,
          showdate: show.showdate,
          showtime: show.showtime,
          movieName: movie.movieName,
          media: movie.media,
        };
      })
    );

    // Filter out any null entries due to missing show/movie
    const validBookings = bookings.filter(Boolean);

    return res.status(200).json({ status: true, bookings: validBookings });
  } catch (error) {
    console.error("getBookings error:", error);
    return res.status(500).json({ status: false, msg: "Server issue :(" });
  }
};


module.exports.cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { tickets } = req.body;

    // Get booking and show details
    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({ status: false, msg: "Booking not found" });
    }

    const show = await Show.findOne({ showId: booking.showId });
    if (!show) {
      return res.status(404).json({ status: false, msg: "Show not found" });
    }

    // Remove booked balcony seats
    if (tickets.balcony?.length > 0) {
      tickets.balcony.forEach((s) => {
        if (show.tickets.balcony.hasOwnProperty(s)) {
          delete show.tickets.balcony[s];
        }
      });
    }

    // Remove booked middle seats
    if (tickets.middle?.length > 0) {
      tickets.middle.forEach((s) => {
        if (show.tickets.middle.hasOwnProperty(s)) {
          delete show.tickets.middle[s];
        }
      });
    }

    // Remove booked lower seats
    if (tickets.lower?.length > 0) {
      tickets.lower.forEach((s) => {
        if (show.tickets.lower.hasOwnProperty(s)) {
          delete show.tickets.lower[s];
        }
      });
    }

    // Save the updated tickets
    await Show.updateOne(
      { showId: booking.showId },
      { $set: { tickets: show.tickets } }
    );

    // Delete the booking
    await Booking.deleteOne({ bookingId });

    return res
      .status(200)
      .json({ status: true, msg: "Ticket Cancelled Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, msg: "Server issue :(" });
  }
};
