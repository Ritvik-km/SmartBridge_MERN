const express = require("express");
const router = express.Router();
const Seat = require("../models/seatModel");

router.get("/available-seats/:showId", async (req, res) => {
  try {
    const { showId } = req.params;
    const seats = await Seat.find({ showId, isBooked: false });
    res.status(200).json({ status: true, seats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, msg: "Server error" });
  }
});

module.exports = router;